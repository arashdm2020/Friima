# FARIIMA Platform Architecture

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                     (Next.js + React)                        │
├─────────────────────────────────────────────────────────────┤
│  Public Pages  │  Freelancer Dashboard  │  Client Dashboard │
│  - Homepage    │  - Profile             │  - Job Posting    │
│  - Tokenomics  │  - Wallet/Escrow       │  - Search         │
│  - DAO Hub     │  - NFT Gallery         │  - Messaging      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Web3 Integration Layer
                           │ (ethers.js, wagmi)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Polygon Blockchain                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Escrow     │  │     DAO      │  │  ProofOfWork │     │
│  │  Contract    │  │  Governance  │  │     NFT      │     │
│  │              │  │   Contract   │  │  (ERC-721)   │     │
│  │ - deposit()  │  │              │  │              │     │
│  │ - release()  │  │ - vote()     │  │ - mint()     │     │
│  │ - dispute()  │  │ - execute()  │  │ - metadata   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                           │
│  │ FARI Token   │                                           │
│  │  (ERC-20)    │                                           │
│  │              │                                           │
│  │ - stake()    │                                           │
│  │ - unstake()  │                                           │
│  │ - transfer() │                                           │
│  └──────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Off-Chain Layer
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Communication System                        │
│                    (FARIIMA Connect)                         │
├─────────────────────────────────────────────────────────────┤
│  - WebRTC Audio/Video Calls                                 │
│  - Encrypted Chat                                            │
│  - Evidence Recording & Timestamping                         │
│  - IPFS Storage for Dispute Evidence                         │
└─────────────────────────────────────────────────────────────┘
```

## Transaction Flow Diagrams

### 1. Project Creation & Escrow Deposit Flow

```
Client                    Frontend              Escrow Contract         Freelancer
  │                          │                         │                    │
  │─── Create Job ──────────>│                         │                    │
  │                          │                         │                    │
  │<── Job Details Form ─────│                         │                    │
  │                          │                         │                    │
  │─── Submit + Approve ────>│──── deposit() ─────────>│                    │
  │    USDC/USDT             │     (project_id,        │                    │
  │                          │      amount,            │                    │
  │                          │      freelancer_addr)   │                    │
  │                          │                         │                    │
  │                          │<──── Event Emitted ─────│                    │
  │                          │      (EscrowCreated)    │                    │
  │                          │                         │                    │
  │                          │───── Notify ───────────────────────────────>│
  │                          │      Freelancer         │                    │
  │                          │                         │                    │
```

### 2. Successful Project Completion Flow

```
Freelancer              Frontend              Escrow Contract         Client
  │                       │                         │                   │
  │─── Submit Work ──────>│                         │                   │
  │                       │                         │                   │
  │                       │───── Notify ───────────────────────────────>│
  │                       │                         │                   │
  │                       │<──── Approve Release ───────────────────────│
  │                       │                         │                   │
  │                       │─── releaseByClient() ──>│                   │
  │                       │    (project_id)         │                   │
  │                       │                         │                   │
  │                       │                         │── Calculate Fee ──│
  │                       │                         │   (5% to DAO)     │
  │                       │                         │   (95% to FL)     │
  │                       │                         │                   │
  │<───── Transfer 95% ───────────────────────────│                   │
  │       USDC/USDT       │                         │                   │
  │                       │                         │                   │
  │                       │         Transfer 5% ────>│                   │
  │                       │         to DAO Treasury  │                   │
  │                       │                         │                   │
  │                       │<──── Mint NFT ──────────│                   │
  │                       │      Proof of Work      │                   │
  │                       │                         │                   │
```

### 3. Dispute Resolution Flow

```
Client/Freelancer      Frontend           Escrow Contract       DAO Contract
      │                   │                      │                    │
      │─── Initiate ─────>│                      │                    │
      │    Dispute        │                      │                    │
      │    + Evidence     │                      │                    │
      │                   │                      │                    │
      │                   │─ initiateDispute() ─>│                    │
      │                   │   (project_id,       │                    │
      │                   │    evidence_hash)    │                    │
      │                   │                      │                    │
      │                   │                      │─── Create Vote ───>│
      │                   │                      │    Proposal        │
      │                   │                      │                    │
      │                   │                      │<─── Jurors Vote ───│
      │                   │                      │    (FARI stakers)  │
      │                   │                      │                    │
      │                   │                      │                    │
      │                   │                      │<─── finalizeVote ──│
      │                   │                      │    (decision %)    │
      │                   │                      │                    │
      │                   │<─ finalizeDispute() ─│                    │
      │                   │   Split funds based  │                    │
      │                   │   on vote outcome    │                    │
      │                   │                      │                    │
```

## Data Flow Architecture

### On-Chain Data
- **Project States**: Created, Active, Completed, Disputed, Resolved
- **Escrow Balances**: Per-project USDC/USDT holdings
- **NFT Metadata**: Project completion certificates
- **Voting Records**: All DAO decisions permanently recorded

### Off-Chain Data (IPFS + Local DB)
- **User Profiles**: Extended profile information
- **Chat Logs**: Encrypted communication history
- **Evidence Files**: Dispute-related recordings and documents
- **Skill Test Results**: Verified skill assessment scores

## Security Architecture

### Smart Contract Security
1. **Access Control**: Role-based permissions (Client, Freelancer, DAO)
2. **Reentrancy Protection**: OpenZeppelin ReentrancyGuard
3. **Pausable**: Emergency pause mechanism for DAO
4. **Upgradeable**: UUPS proxy pattern for future improvements

### Frontend Security
1. **Wallet Verification**: Signature-based authentication
2. **Transaction Simulation**: Pre-flight checks before execution
3. **Rate Limiting**: API and transaction throttling
4. **XSS Protection**: Content Security Policy headers

## Scalability Considerations

### Layer 2 Benefits (Polygon)
- **Transaction Throughput**: 7,000+ TPS
- **Gas Fees**: $0.01-0.001 per transaction
- **Finality**: 2-3 second block times

### Future Scaling Options
1. **Polygon zkEVM**: Zero-knowledge rollups for enhanced privacy
2. **State Channels**: Off-chain payment channels for microtasks
3. **IPFS Clustering**: Distributed evidence storage
4. **GraphQL Indexer**: Fast on-chain data queries (The Graph)

## Integration Points

### Web3 Wallet Integration
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet

### Payment Integration
- USDC (Circle)
- USDT (Tether)
- Future: DAI, native MATIC

### External Services
- **IPFS**: Pinata or Web3.Storage for file storage
- **The Graph**: Blockchain data indexing
- **Chainlink**: Price feeds (if multi-currency)
- **WebRTC**: SimpleWebRTC or Agora.io for calls

## Deployment Strategy

### Testnet Deployment (Polygon Mumbai)
1. Deploy core contracts
2. Verify on PolygonScan
3. Integration testing
4. Security audit

### Mainnet Deployment (Polygon)
1. Final security audit
2. Multi-sig deployment wallet
3. Contract verification
4. Gradual rollout with limits

## Monitoring & Analytics

### On-Chain Metrics
- Total Value Locked (TVL)
- Number of active projects
- Dispute rate
- Average project completion time

### Platform Metrics
- Active freelancers
- Active clients
- $FARI staking participation
- DAO voting participation rate
