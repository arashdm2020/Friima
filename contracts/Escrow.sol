// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IProofOfWorkNFT {
    function mint(
        address freelancer,
        uint256 projectId,
        uint256 amount,
        address client,
        string calldata projectTitle
    ) external returns (uint256);
}

interface IFARIIMADao {
    function initiateDispute(
        uint256 projectId,
        address initiator,
        string calldata evidenceHash
    ) external returns (uint256 disputeId);
}

/**
 * @title Escrow
 * @notice Trustless escrow system for FARIIMA freelance marketplace
 * @dev Manages project payments with 5% platform fee
 */
contract Escrow is 
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Constants ============

    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    uint256 public constant PLATFORM_FEE_BPS = 500; // 5% in basis points (500/10000)
    uint256 public constant DISPUTE_DURATION = 7 days;

    // ============ Enums ============

    enum State {
        None,
        Created,
        Funded,
        Completed,
        Disputed,
        Resolved,
        Cancelled
    }

    // ============ Structs ============

    struct Project {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        address token; // USDC or USDT address
        State state;
        uint256 createdAt;
        uint256 fundedAt;
        string projectTitle;
        string category;
        uint256 disputeId; // 0 if no dispute
    }

    struct Milestone {
        uint256 projectId;
        uint256 amount;
        string description;
        bool released;
    }

    // ============ State Variables ============

    address public daoTreasury;
    IProofOfWorkNFT public proofOfWorkNFT;
    IFARIIMADao public dao;

    uint256 private _nextProjectId;
    
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone[]) public projectMilestones;
    mapping(address => uint256[]) public clientProjects;
    mapping(address => uint256[]) public freelancerProjects;
    
    // Supported stablecoins
    mapping(address => bool) public supportedTokens;

    // ============ Events ============

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed client,
        address indexed freelancer,
        uint256 amount,
        address token
    );

    event ProjectFunded(uint256 indexed projectId, uint256 amount);
    
    event ProjectCompleted(
        uint256 indexed projectId,
        uint256 freelancerPayment,
        uint256 platformFee,
        uint256 nftTokenId
    );

    event DisputeInitiated(
        uint256 indexed projectId,
        uint256 indexed disputeId,
        address initiator,
        string evidenceHash
    );

    event DisputeResolved(
        uint256 indexed projectId,
        uint8 freelancerPercentage,
        uint256 freelancerAmount,
        uint256 clientRefund
    );

    event MilestoneReleased(
        uint256 indexed projectId,
        uint256 milestoneIndex,
        uint256 amount
    );

    event ProjectCancelled(uint256 indexed projectId, uint256 refundAmount);

    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    // ============ Errors ============

    error InvalidState();
    error Unauthorized();
    error InvalidAmount();
    error UnsupportedToken();
    error ProjectNotFound();
    error DisputeActive();

    // ============ Modifiers ============

    modifier onlyProjectParty(uint256 projectId) {
        Project storage project = projects[projectId];
        if (msg.sender != project.client && msg.sender != project.freelancer) {
            revert Unauthorized();
        }
        _;
    }

    modifier onlyClient(uint256 projectId) {
        if (msg.sender != projects[projectId].client) {
            revert Unauthorized();
        }
        _;
    }

    modifier inState(uint256 projectId, State requiredState) {
        if (projects[projectId].state != requiredState) {
            revert InvalidState();
        }
        _;
    }

    // ============ Initializer ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _dao,
        address _nft,
        address _treasury
    ) public initializer {
        __ReentrancyGuard_init();
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DAO_ROLE, _dao);
        _grantRole(UPGRADER_ROLE, msg.sender);

        dao = IFARIIMADao(_dao);
        proofOfWorkNFT = IProofOfWorkNFT(_nft);
        daoTreasury = _treasury;

        _nextProjectId = 1;
    }

    // ============ External Functions ============

    /**
     * @notice Create a new project
     * @param freelancer Address of the freelancer
     * @param amount Total project amount
     * @param token Payment token address (USDC/USDT)
     * @param projectTitle Title of the project
     * @param category Project category
     */
    function createProject(
        address freelancer,
        uint256 amount,
        address token,
        string calldata projectTitle,
        string calldata category
    ) external whenNotPaused returns (uint256) {
        if (amount == 0) revert InvalidAmount();
        if (!supportedTokens[token]) revert UnsupportedToken();
        if (freelancer == address(0) || freelancer == msg.sender) revert Unauthorized();

        uint256 projectId = _nextProjectId++;

        projects[projectId] = Project({
            id: projectId,
            client: msg.sender,
            freelancer: freelancer,
            amount: amount,
            token: token,
            state: State.Created,
            createdAt: block.timestamp,
            fundedAt: 0,
            projectTitle: projectTitle,
            category: category,
            disputeId: 0
        });

        clientProjects[msg.sender].push(projectId);
        freelancerProjects[freelancer].push(projectId);

        emit ProjectCreated(projectId, msg.sender, freelancer, amount, token);

        return projectId;
    }

    /**
     * @notice Client deposits funds into escrow
     * @param projectId The project ID
     */
    function deposit(uint256 projectId) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyClient(projectId)
        inState(projectId, State.Created)
    {
        Project storage project = projects[projectId];

        IERC20(project.token).safeTransferFrom(
            msg.sender,
            address(this),
            project.amount
        );

        project.state = State.Funded;
        project.fundedAt = block.timestamp;

        emit ProjectFunded(projectId, project.amount);
    }

    /**
     * @notice Client releases payment to freelancer upon satisfaction
     * @param projectId The project ID
     */
    function releaseByClient(uint256 projectId)
        external
        nonReentrant
        whenNotPaused
        onlyClient(projectId)
        inState(projectId, State.Funded)
    {
        Project storage project = projects[projectId];

        uint256 totalAmount = project.amount;
        uint256 platformFee = _calculateFee(totalAmount);
        uint256 freelancerPayment = totalAmount - platformFee;

        // Transfer to freelancer (95%)
        IERC20(project.token).safeTransfer(project.freelancer, freelancerPayment);

        // Transfer fee to DAO treasury (5%)
        IERC20(project.token).safeTransfer(daoTreasury, platformFee);

        project.state = State.Completed;

        // Mint Proof of Work NFT
        uint256 nftTokenId = proofOfWorkNFT.mint(
            project.freelancer,
            projectId,
            totalAmount,
            project.client,
            project.projectTitle
        );

        emit ProjectCompleted(projectId, freelancerPayment, platformFee, nftTokenId);
    }

    /**
     * @notice Either party can initiate a dispute
     * @param projectId The project ID
     * @param evidenceHash IPFS hash of evidence
     */
    function initiateDispute(uint256 projectId, string calldata evidenceHash)
        external
        whenNotPaused
        onlyProjectParty(projectId)
        inState(projectId, State.Funded)
        returns (uint256)
    {
        Project storage project = projects[projectId];

        uint256 disputeId = dao.initiateDispute(projectId, msg.sender, evidenceHash);

        project.state = State.Disputed;
        project.disputeId = disputeId;

        emit DisputeInitiated(projectId, disputeId, msg.sender, evidenceHash);

        return disputeId;
    }

    /**
     * @notice DAO finalizes dispute and splits funds
     * @param projectId The project ID
     * @param freelancerPercentage Percentage to freelancer (0-100)
     */
    function finalizeDispute(uint256 projectId, uint8 freelancerPercentage)
        external
        nonReentrant
        onlyRole(DAO_ROLE)
        inState(projectId, State.Disputed)
    {
        require(freelancerPercentage <= 100, "Invalid percentage");

        Project storage project = projects[projectId];

        uint256 totalAmount = project.amount;
        
        // Calculate split (no platform fee on disputed projects - DAO decides)
        uint256 freelancerAmount = (totalAmount * freelancerPercentage) / 100;
        uint256 clientRefund = totalAmount - freelancerAmount;

        if (freelancerAmount > 0) {
            IERC20(project.token).safeTransfer(project.freelancer, freelancerAmount);
        }

        if (clientRefund > 0) {
            IERC20(project.token).safeTransfer(project.client, clientRefund);
        }

        project.state = State.Resolved;

        emit DisputeResolved(projectId, freelancerPercentage, freelancerAmount, clientRefund);
    }

    /**
     * @notice Cancel project before funding (client only)
     * @param projectId The project ID
     */
    function cancelProject(uint256 projectId)
        external
        onlyClient(projectId)
        inState(projectId, State.Created)
    {
        Project storage project = projects[projectId];
        project.state = State.Cancelled;

        emit ProjectCancelled(projectId, 0);
    }

    /**
     * @notice Cancel and refund (requires both parties' agreement or timeout)
     * @param projectId The project ID
     */
    function cancelWithRefund(uint256 projectId)
        external
        nonReentrant
        onlyClient(projectId)
    {
        Project storage project = projects[projectId];
        
        require(
            project.state == State.Funded,
            "Must be funded"
        );

        // Only allow if project is very old (30 days) or both parties agree
        require(
            block.timestamp >= project.fundedAt + 30 days,
            "Cannot cancel yet"
        );

        uint256 refundAmount = project.amount;

        IERC20(project.token).safeTransfer(project.client, refundAmount);

        project.state = State.Cancelled;

        emit ProjectCancelled(projectId, refundAmount);
    }

    // ============ Admin Functions ============

    function addSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[token] = true;
    }

    function removeSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[token] = false;
    }

    function updateTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid address");
        address oldTreasury = daoTreasury;
        daoTreasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ============ View Functions ============

    function getProject(uint256 projectId) external view returns (Project memory) {
        return projects[projectId];
    }

    function getClientProjects(address client) external view returns (uint256[] memory) {
        return clientProjects[client];
    }

    function getFreelancerProjects(address freelancer) external view returns (uint256[] memory) {
        return freelancerProjects[freelancer];
    }

    // ============ Internal Functions ============

    function _calculateFee(uint256 amount) internal pure returns (uint256) {
        return (amount * PLATFORM_FEE_BPS) / 10000;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // ============ Gap for Upgrades ============

    uint256[50] private __gap;
}
