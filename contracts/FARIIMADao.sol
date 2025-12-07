// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IFARIToken {
    function getVotingPower(address account) external view returns (uint256);
    function getStakedAmount(address account) external view returns (uint256);
    function burnFrom(address from, uint256 amount) external;
    function mint(address to, uint256 amount) external;
}

/**
 * @title FARIIMADao
 * @notice Decentralized governance and dispute resolution for FARIIMA
 * @dev Handles voting, proposals, and juror-based dispute resolution
 */
contract FARIIMADao is
    ReentrancyGuardUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    // ============ Constants ============

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    uint256 public constant MIN_JUROR_STAKE = 5_000 * 1e18; // 5,000 FARI
    uint256 public constant MIN_PROPOSAL_STAKE = 10_000 * 1e18; // 10,000 FARI
    uint256 public constant PROPOSAL_BURN_AMOUNT = 100 * 1e18; // 100 FARI
    uint256 public constant DISPUTE_VOTING_DURATION = 72 hours;
    uint256 public constant PROPOSAL_VOTING_DURATION = 7 days;
    uint256 public constant BASE_JUROR_REWARD = 50 * 1e18; // 50 FARI base

    // ============ Enums ============

    enum ProposalType {
        FeeChange,
        TreasurySpend,
        ContractUpgrade,
        ParameterChange
    }

    enum ProposalState {
        Active,
        Succeeded,
        Defeated,
        Executed,
        Cancelled
    }

    // ============ Structs ============

    struct Dispute {
        uint256 id;
        uint256 projectId;
        address initiator;
        string evidenceHash; // IPFS hash
        uint256 votingDeadline;
        uint256 votesForFreelancer;
        uint256 votesForClient;
        uint256 totalVoters;
        bool finalized;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = freelancer, false = client
    }

    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        bytes callData;
        uint256 votingDeadline;
        uint256 votesFor;
        uint256 votesAgainst;
        ProposalState state;
        mapping(address => bool) hasVoted;
    }

    // ============ State Variables ============

    IFARIToken public fariToken;
    
    uint256 private _nextDisputeId;
    uint256 private _nextProposalId;

    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => Proposal) public proposals;
    
    // Quorum requirements (in basis points)
    mapping(ProposalType => uint256) public quorumBps;
    mapping(ProposalType => uint256) public approvalThresholdBps;

    // Juror performance tracking
    mapping(address => uint256) public jurorParticipation;
    mapping(address => uint256) public jurorRewardsEarned;

    // ============ Events ============

    event DisputeCreated(
        uint256 indexed disputeId,
        uint256 indexed projectId,
        address indexed initiator,
        string evidenceHash
    );

    event DisputeVoted(
        uint256 indexed disputeId,
        address indexed juror,
        bool voteForFreelancer,
        uint256 votingPower
    );

    event DisputeFinalized(
        uint256 indexed disputeId,
        uint8 freelancerPercentage,
        uint256 totalVoters
    );

    event JurorRewarded(address indexed juror, uint256 amount);

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title
    );

    event ProposalVoted(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votingPower
    );

    event ProposalExecuted(uint256 indexed proposalId);

    // ============ Errors ============

    error InsufficientStake();
    error AlreadyVoted();
    error VotingEnded();
    error VotingOngoing();
    error AlreadyFinalized();
    error InvalidProposal();
    error ProposalNotSucceeded();

    // ============ Initializer ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _fariToken) public initializer {
        __ReentrancyGuard_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        fariToken = IFARIToken(_fariToken);

        _nextDisputeId = 1;
        _nextProposalId = 1;

        // Set default quorum and approval thresholds
        quorumBps[ProposalType.FeeChange] = 1500; // 15%
        quorumBps[ProposalType.TreasurySpend] = 2000; // 20%
        quorumBps[ProposalType.ContractUpgrade] = 3000; // 30%
        quorumBps[ProposalType.ParameterChange] = 500; // 5%

        approvalThresholdBps[ProposalType.FeeChange] = 6600; // 66%
        approvalThresholdBps[ProposalType.TreasurySpend] = 6600; // 66%
        approvalThresholdBps[ProposalType.ContractUpgrade] = 7500; // 75%
        approvalThresholdBps[ProposalType.ParameterChange] = 5100; // 51%
    }

    // ============ Dispute Functions ============

    /**
     * @notice Initiate a dispute for a project
     * @param projectId The project ID
     * @param initiator Who started the dispute
     * @param evidenceHash IPFS hash of evidence
     * @return disputeId The created dispute ID
     */
    function initiateDispute(
        uint256 projectId,
        address initiator,
        string calldata evidenceHash
    ) external returns (uint256) {
        // Only escrow contract can call this
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Only authorized"
        );

        uint256 disputeId = _nextDisputeId++;

        Dispute storage dispute = disputes[disputeId];
        dispute.id = disputeId;
        dispute.projectId = projectId;
        dispute.initiator = initiator;
        dispute.evidenceHash = evidenceHash;
        dispute.votingDeadline = block.timestamp + DISPUTE_VOTING_DURATION;
        dispute.finalized = false;

        emit DisputeCreated(disputeId, projectId, initiator, evidenceHash);

        return disputeId;
    }

    /**
     * @notice Vote on a dispute (jurors only)
     * @param disputeId The dispute ID
     * @param voteForFreelancer True = freelancer wins, False = client wins
     */
    function voteOnDispute(uint256 disputeId, bool voteForFreelancer) external {
        Dispute storage dispute = disputes[disputeId];

        if (fariToken.getStakedAmount(msg.sender) < MIN_JUROR_STAKE) {
            revert InsufficientStake();
        }
        if (dispute.hasVoted[msg.sender]) revert AlreadyVoted();
        if (block.timestamp >= dispute.votingDeadline) revert VotingEnded();

        uint256 votingPower = fariToken.getVotingPower(msg.sender);

        if (voteForFreelancer) {
            dispute.votesForFreelancer += votingPower;
        } else {
            dispute.votesForClient += votingPower;
        }

        dispute.hasVoted[msg.sender] = true;
        dispute.voteChoice[msg.sender] = voteForFreelancer;
        dispute.totalVoters++;

        // Track juror participation
        jurorParticipation[msg.sender]++;

        emit DisputeVoted(disputeId, msg.sender, voteForFreelancer, votingPower);
    }

    /**
     * @notice Finalize dispute and calculate outcome
     * @param disputeId The dispute ID
     * @return freelancerPercentage Percentage awarded to freelancer (0-100)
     */
    function finalizeDispute(uint256 disputeId) 
        external 
        nonReentrant 
        returns (uint8 freelancerPercentage) 
    {
        Dispute storage dispute = disputes[disputeId];

        if (block.timestamp < dispute.votingDeadline) revert VotingOngoing();
        if (dispute.finalized) revert AlreadyFinalized();

        uint256 totalVotes = dispute.votesForFreelancer + dispute.votesForClient;
        
        if (totalVotes == 0) {
            // No votes = 50/50 split
            freelancerPercentage = 50;
        } else {
            freelancerPercentage = uint8((dispute.votesForFreelancer * 100) / totalVotes);
        }

        dispute.finalized = true;

        // Reward participating jurors
        _rewardJurors(disputeId);

        emit DisputeFinalized(disputeId, freelancerPercentage, dispute.totalVoters);

        return freelancerPercentage;
    }

    /**
     * @notice Reward jurors who participated in dispute resolution
     * @param disputeId The dispute ID
     */
    function _rewardJurors(uint256 disputeId) internal {
        Dispute storage dispute = disputes[disputeId];
        
        if (dispute.totalVoters == 0) return;

        // Calculate reward per juror (scales with project value)
        uint256 rewardPerJuror = BASE_JUROR_REWARD;

        // Note: In production, reward amount could scale based on project value
        // For now, using base reward for all jurors

        // This would need to iterate through voters - simplified for gas efficiency
        // In production, use a claim-based system or off-chain calculation
    }

    /**
     * @notice Claim juror rewards for participating in disputes
     */
    function claimJurorRewards(uint256[] calldata disputeIds) external nonReentrant {
        uint256 totalReward = 0;

        for (uint256 i = 0; i < disputeIds.length; i++) {
            Dispute storage dispute = disputes[disputeIds[i]];
            
            if (!dispute.finalized) continue;
            if (!dispute.hasVoted[msg.sender]) continue;

            // Calculate reward (simplified - in production, track claimed status)
            uint256 reward = BASE_JUROR_REWARD;
            totalReward += reward;
        }

        if (totalReward > 0) {
            jurorRewardsEarned[msg.sender] += totalReward;
            fariToken.mint(msg.sender, totalReward);
            emit JurorRewarded(msg.sender, totalReward);
        }
    }

    // ============ Governance Proposal Functions ============

    /**
     * @notice Create a governance proposal
     * @param proposalType Type of proposal
     * @param title Proposal title
     * @param description Detailed description
     * @param callData Encoded function call (if applicable)
     */
    function createProposal(
        ProposalType proposalType,
        string calldata title,
        string calldata description,
        bytes calldata callData
    ) external returns (uint256) {
        if (fariToken.getStakedAmount(msg.sender) < MIN_PROPOSAL_STAKE) {
            revert InsufficientStake();
        }

        // Burn FARI to prevent spam
        fariToken.burnFrom(msg.sender, PROPOSAL_BURN_AMOUNT);

        uint256 proposalId = _nextProposalId++;

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.proposalType = proposalType;
        proposal.title = title;
        proposal.description = description;
        proposal.callData = callData;
        proposal.votingDeadline = block.timestamp + PROPOSAL_VOTING_DURATION;
        proposal.state = ProposalState.Active;

        emit ProposalCreated(proposalId, msg.sender, proposalType, title);

        return proposalId;
    }

    /**
     * @notice Vote on a governance proposal
     * @param proposalId The proposal ID
     * @param support True = for, False = against
     */
    function voteOnProposal(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];

        if (proposal.state != ProposalState.Active) revert InvalidProposal();
        if (proposal.hasVoted[msg.sender]) revert AlreadyVoted();
        if (block.timestamp >= proposal.votingDeadline) revert VotingEnded();

        uint256 votingPower = fariToken.getVotingPower(msg.sender);

        if (support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }

        proposal.hasVoted[msg.sender] = true;

        emit ProposalVoted(proposalId, msg.sender, support, votingPower);
    }

    /**
     * @notice Execute a successful proposal
     * @param proposalId The proposal ID
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];

        if (block.timestamp < proposal.votingDeadline) revert VotingOngoing();
        if (proposal.state != ProposalState.Active) revert InvalidProposal();

        // Check if proposal succeeded
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 quorum = quorumBps[proposal.proposalType];
        uint256 threshold = approvalThresholdBps[proposal.proposalType];

        // Simplified quorum check (would need total staked in production)
        bool quorumReached = totalVotes > 0; // Placeholder
        bool approved = (proposal.votesFor * 10000) / totalVotes >= threshold;

        if (!quorumReached || !approved) {
            proposal.state = ProposalState.Defeated;
            return;
        }

        proposal.state = ProposalState.Succeeded;

        // Execute calldata if present
        if (proposal.callData.length > 0) {
            (bool success, ) = address(this).call(proposal.callData);
            require(success, "Execution failed");
        }

        proposal.state = ProposalState.Executed;

        emit ProposalExecuted(proposalId);
    }

    // ============ View Functions ============

    function getDisputeVotes(uint256 disputeId) 
        external 
        view 
        returns (uint256 forFreelancer, uint256 forClient, uint256 totalVoters) 
    {
        Dispute storage dispute = disputes[disputeId];
        return (dispute.votesForFreelancer, dispute.votesForClient, dispute.totalVoters);
    }

    function getProposalVotes(uint256 proposalId)
        external
        view
        returns (uint256 votesFor, uint256 votesAgainst, ProposalState state)
    {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.votesFor, proposal.votesAgainst, proposal.state);
    }

    function hasVotedOnDispute(uint256 disputeId, address voter) 
        external 
        view 
        returns (bool) 
    {
        return disputes[disputeId].hasVoted[voter];
    }

    function hasVotedOnProposal(uint256 proposalId, address voter)
        external
        view
        returns (bool)
    {
        return proposals[proposalId].hasVoted[voter];
    }

    // ============ Admin Functions ============

    function updateQuorum(ProposalType proposalType, uint256 newQuorumBps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(newQuorumBps <= 10000, "Invalid BPS");
        quorumBps[proposalType] = newQuorumBps;
    }

    function updateApprovalThreshold(ProposalType proposalType, uint256 newThresholdBps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(newThresholdBps <= 10000, "Invalid BPS");
        approvalThresholdBps[proposalType] = newThresholdBps;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // ============ Gap for Upgrades ============

    uint256[50] private __gap;
}
