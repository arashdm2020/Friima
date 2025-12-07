# FARIIMA Smart Contract Architecture

## Contract Overview

FARIIMA platform consists of four core smart contracts deployed on Polygon:

1. **FARIToken.sol** - ERC-20 governance token
2. **Escrow.sol** - Trustless payment escrow system
3. **FARIIMADao.sol** - Decentralized governance and dispute resolution
4. **ProofOfWorkNFT.sol** - ERC-721 completion certificates

## Contract Interactions

```
┌─────────────────┐
│   FARIToken     │
│    (ERC-20)     │
└────────┬────────┘
         │
         │ staking/voting
         │
         ▼
┌─────────────────┐         ┌──────────────────┐
│  FARIIMADao     │◄────────│   Escrow         │
│  (Governance)   │  calls  │   (Payments)     │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │ dispute                   │ completion
         │ resolution                │ verified
         │                           │
         ▼                           ▼
┌─────────────────────────────────────────────┐
│           ProofOfWorkNFT                    │
│           (ERC-721)                         │
└─────────────────────────────────────────────┘
```

## Escrow Contract Details

### State Machine

```
Project States:
┌─────────┐
│ Created │
└────┬────┘
     │ deposit()
     ▼
┌─────────┐
│ Funded  │
└────┬────┘
     │
     ├─── releaseByClient() ──► [Completed] ──► mint NFT
     │
     └─── initiateDispute() ──► [Disputed] ──► DAO voting
                                      │
                                      └──► finalizeDispute() ──► [Resolved]
```

### Key Functions

```solidity
// Client deposits funds
function deposit(
    uint256 projectId,
    address freelancer,
    uint256 amount,
    address token  // USDC or USDT
) external;

// Client releases payment on satisfaction
function releaseByClient(uint256 projectId) external;

// Either party can dispute
function initiateDispute(
    uint256 projectId,
    string calldata evidenceHash  // IPFS hash
) external;

// DAO finalizes dispute outcome
function finalizeDispute(
    uint256 projectId,
    uint8 freelancerPercentage  // 0-100
) external onlyDAO;

// Auto-calculation of 5% fee
function _calculateFee(uint256 amount) internal pure returns (uint256);
```

### Fee Distribution Logic

```solidity
// Hardcoded in contract
uint256 public constant PLATFORM_FEE_BPS = 500;  // 5% in basis points
address public immutable daoTreasury;

function releaseByClient(uint256 projectId) external {
    Project storage project = projects[projectId];
    require(msg.sender == project.client, "Only client");
    require(project.state == State.Funded, "Invalid state");
    
    uint256 totalAmount = project.amount;
    uint256 fee = (totalAmount * PLATFORM_FEE_BPS) / 10000;  // 5%
    uint256 freelancerPayment = totalAmount - fee;
    
    // Transfer to freelancer
    IERC20(project.token).transfer(project.freelancer, freelancerPayment);
    
    // Transfer fee to DAO treasury
    IERC20(project.token).transfer(daoTreasury, fee);
    
    project.state = State.Completed;
    
    // Mint NFT certificate
    proofOfWorkNFT.mint(project.freelancer, projectId, totalAmount);
    
    emit ProjectCompleted(projectId, freelancerPayment, fee);
}
```

## DAO Contract Details

### Dispute Resolution

```solidity
struct Dispute {
    uint256 projectId;
    address initiator;
    string evidenceHash;
    uint256 votingDeadline;
    uint256 votesForFreelancer;
    uint256 votesForClient;
    mapping(address => bool) hasVoted;
    bool finalized;
}

// Juror voting (FARI stakers only)
function voteOnDispute(
    uint256 disputeId,
    bool voteForFreelancer  // true = freelancer, false = client
) external {
    require(fariToken.getStakedAmount(msg.sender) >= MIN_JUROR_STAKE, "Insufficient stake");
    require(!disputes[disputeId].hasVoted[msg.sender], "Already voted");
    require(block.timestamp < disputes[disputeId].votingDeadline, "Voting ended");
    
    uint256 votingPower = fariToken.getStakedAmount(msg.sender);
    
    if (voteForFreelancer) {
        disputes[disputeId].votesForFreelancer += votingPower;
    } else {
        disputes[disputeId].votesForClient += votingPower;
    }
    
    disputes[disputeId].hasVoted[msg.sender] = true;
    
    emit VoteCast(disputeId, msg.sender, voteForFreelancer, votingPower);
}

// Finalize dispute after voting period
function finalizeDispute(uint256 disputeId) external {
    Dispute storage dispute = disputes[disputeId];
    require(block.timestamp >= dispute.votingDeadline, "Voting ongoing");
    require(!dispute.finalized, "Already finalized");
    
    uint256 totalVotes = dispute.votesForFreelancer + dispute.votesForClient;
    uint8 freelancerPercentage = uint8((dispute.votesForFreelancer * 100) / totalVotes);
    
    // Instruct Escrow to split funds
    escrow.finalizeDispute(dispute.projectId, freelancerPercentage);
    
    dispute.finalized = true;
    
    emit DisputeFinalized(disputeId, freelancerPercentage);
}
```

### Governance Proposals

```solidity
enum ProposalType {
    FeeChange,
    TreasurySpend,
    ContractUpgrade,
    ParameterChange
}

struct Proposal {
    ProposalType proposalType;
    string description;
    bytes callData;
    uint256 votingDeadline;
    uint256 votesFor;
    uint256 votesAgainst;
    bool executed;
}

function createProposal(
    ProposalType proposalType,
    string calldata description,
    bytes calldata callData
) external {
    require(fariToken.getStakedAmount(msg.sender) >= MIN_PROPOSAL_STAKE, "Insufficient stake");
    
    // Burn 100 FARI as spam prevention
    fariToken.burnFrom(msg.sender, 100 * 1e18);
    
    // ... create proposal
}
```

## ProofOfWorkNFT Contract

### NFT Metadata Structure

```solidity
struct ProjectMetadata {
    uint256 projectId;
    string projectTitle;
    uint256 amount;
    address client;
    address freelancer;
    uint256 completionDate;
    string category;
}

function mint(
    address freelancer,
    uint256 projectId,
    uint256 amount
) external onlyEscrow returns (uint256) {
    uint256 tokenId = _nextTokenId++;
    
    _safeMint(freelancer, tokenId);
    
    projectMetadata[tokenId] = ProjectMetadata({
        projectId: projectId,
        projectTitle: getProjectTitle(projectId),
        amount: amount,
        client: msg.sender,
        freelancer: freelancer,
        completionDate: block.timestamp,
        category: getProjectCategory(projectId)
    });
    
    emit NFTMinted(tokenId, freelancer, projectId, amount);
    
    return tokenId;
}

// NFTs are non-transferable (Soulbound)
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
) internal override {
    require(from == address(0), "Token is non-transferable");
    super._beforeTokenTransfer(from, to, tokenId);
}
```

### On-Chain SVG Generation

```solidity
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    ProjectMetadata memory metadata = projectMetadata[tokenId];
    
    string memory svg = generateSVG(metadata);
    
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "FARIIMA Proof of Work #',
                    Strings.toString(tokenId),
                    '", "description": "Verified completion certificate", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(svg)),
                    '"}'
                )
            )
        )
    );
    
    return string(abi.encodePacked("data:application/json;base64,", json));
}
```

## FARI Token Contract

### Staking Mechanism

```solidity
mapping(address => uint256) public stakedBalance;
mapping(address => uint256) public stakeTimestamp;

function stake(uint256 amount) external {
    require(amount > 0, "Cannot stake 0");
    
    _transfer(msg.sender, address(this), amount);
    
    stakedBalance[msg.sender] += amount;
    if (stakeTimestamp[msg.sender] == 0) {
        stakeTimestamp[msg.sender] = block.timestamp;
    }
    
    emit Staked(msg.sender, amount);
}

function unstake(uint256 amount) external {
    require(stakedBalance[msg.sender] >= amount, "Insufficient staked");
    require(block.timestamp >= stakeTimestamp[msg.sender] + UNSTAKE_COOLDOWN, "Cooldown active");
    
    stakedBalance[msg.sender] -= amount;
    _transfer(address(this), msg.sender, amount);
    
    emit Unstaked(msg.sender, amount);
}

// Voting power with time multiplier
function getVotingPower(address account) external view returns (uint256) {
    uint256 staked = stakedBalance[account];
    uint256 timeStaked = block.timestamp - stakeTimestamp[account];
    
    uint256 multiplier = 100;  // 1.0x
    if (timeStaked >= 365 days) multiplier = 200;  // 2.0x
    else if (timeStaked >= 180 days) multiplier = 150;  // 1.5x
    else if (timeStaked >= 90 days) multiplier = 120;  // 1.2x
    
    return (staked * multiplier) / 100;
}
```

## Security Features

### Access Control

```solidity
// OpenZeppelin AccessControl
bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
bytes32 public constant ESCROW_ROLE = keccak256("ESCROW_ROLE");

modifier onlyDAO() {
    require(hasRole(DAO_ROLE, msg.sender), "Not DAO");
    _;
}
```

### Reentrancy Protection

```solidity
// OpenZeppelin ReentrancyGuard
function releaseByClient(uint256 projectId) external nonReentrant {
    // ... safe external calls
}
```

### Emergency Pause

```solidity
// OpenZeppelin Pausable
function deposit(...) external whenNotPaused {
    // ... normal logic
}

function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
}
```

## Upgrade Strategy

### UUPS Proxy Pattern

```solidity
// Escrow implementation
contract Escrow is UUPSUpgradeable, OwnableUpgradeable {
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
```

**Upgrade Process**:
1. DAO votes on upgrade proposal (75% threshold)
2. Timelock delay (48 hours)
3. Multi-sig executes upgrade
4. Events emitted for transparency

## Gas Optimization Techniques

1. **Packed Storage**: Use `uint96` for amounts where possible
2. **Unchecked Math**: Use `unchecked {}` for safe arithmetic
3. **Calldata vs Memory**: Use `calldata` for external functions
4. **Events over Storage**: Emit events instead of storing rarely-used data
5. **Batch Operations**: Allow batch deposits/releases

## Testing Requirements

### Unit Tests
- ✅ Escrow deposit/release flows
- ✅ Fee calculation accuracy
- ✅ Dispute resolution voting
- ✅ NFT minting and metadata
- ✅ Staking/unstaking mechanics

### Integration Tests
- ✅ End-to-end project lifecycle
- ✅ Multi-party dispute scenarios
- ✅ DAO proposal execution
- ✅ Upgrade scenarios

### Fuzzing Tests
- ✅ Fee calculation edge cases
- ✅ Voting power calculations
- ✅ Reentrancy attempts

## Deployment Scripts

```javascript
// deploy.js
async function main() {
    // 1. Deploy FARI token
    const FARIToken = await ethers.getContractFactory("FARIToken");
    const fariToken = await upgrades.deployProxy(FARIToken, []);
    
    // 2. Deploy DAO
    const DAO = await ethers.getContractFactory("FARIIMADao");
    const dao = await upgrades.deployProxy(DAO, [fariToken.address]);
    
    // 3. Deploy NFT
    const NFT = await ethers.getContractFactory("ProofOfWorkNFT");
    const nft = await NFT.deploy();
    
    // 4. Deploy Escrow
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await upgrades.deployProxy(Escrow, [
        dao.address,
        nft.address,
        daoTreasury
    ]);
    
    // 5. Setup permissions
    await nft.grantRole(MINTER_ROLE, escrow.address);
    await escrow.grantRole(DAO_ROLE, dao.address);
    
    console.log("Deployment complete!");
}
```

## Contract Addresses (Mainnet - TBD)

```
Network: Polygon Mainnet (Chain ID: 137)

FARIToken: 0x...
FARIIMADao: 0x...
Escrow: 0x...
ProofOfWorkNFT: 0x...

DAO Treasury: 0x... (Gnosis Safe Multi-sig)
```

## Audit Checklist

- [ ] Reentrancy vulnerabilities
- [ ] Integer overflow/underflow
- [ ] Access control issues
- [ ] Front-running risks
- [ ] Gas griefing attacks
- [ ] Centralization risks
- [ ] Upgrade mechanism security
- [ ] Economic attack vectors
