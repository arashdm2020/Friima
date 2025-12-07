# FARIIMA Implementation Guide

## 🎯 Project Overview

FARIIMA is a comprehensive Web3 freelance marketplace built on Polygon with the following core components:

### Smart Contracts (Solidity)
- **Escrow.sol** - Trustless payment system with 5% fee
- **FARIToken.sol** - ERC-20 governance token with staking
- **FARIIMADao.sol** - Dispute resolution and governance
- **ProofOfWorkNFT.sol** - Soulbound completion certificates

### Frontend (Next.js 14 + TypeScript)
- Modern React with App Router
- RainbowKit for wallet connection
- TailwindCSS + shadcn/ui for design
- Web3 integration via wagmi/viem

### Tokenomics
- **Total Supply**: 1 Billion FARI
- **Platform Fee**: 5% (vs 10-20% on competitors)
- **Utility**: Governance, Staking, Visibility Boost

## 📋 Prerequisites

### Development Environment
```bash
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Git
```

### Required Accounts
- Polygon Mumbai testnet MATIC (for testing)
- Pinata account (IPFS storage)
- WalletConnect Project ID
- PolygonScan API key (contract verification)

## 🚀 Getting Started

### 1. Clone and Setup

```bash
cd /home/arash/frima

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Contracts (.env)
```bash
cd /home/arash/frima/contracts
cp .env.example .env

# Edit .env with your values:
# - PRIVATE_KEY (deployment wallet)
# - POLYGONSCAN_API_KEY
# - DAO_TREASURY (multi-sig address)
```

#### Frontend (.env.local)
```bash
cd /home/arash/frima/frontend
cp .env.example .env.local

# Edit .env.local with:
# - Contract addresses (after deployment)
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - Pinata API keys
```

### 3. Deploy Smart Contracts

#### Testnet (Mumbai)
```bash
cd /home/arash/frima/contracts

# Compile contracts
npx hardhat compile

# Deploy to Mumbai
npm run deploy:testnet

# Save the output addresses!
```

#### Mainnet (Polygon)
```bash
# After thorough testing and audit
npm run deploy:mainnet

# Verify on PolygonScan
npx hardhat verify --network polygon <CONTRACT_ADDRESS>
```

### 4. Update Frontend Config

```bash
cd /home/arash/frima/frontend

# Create lib/contracts.ts with deployed addresses
```

Create `/home/arash/frima/frontend/src/lib/contracts.ts`:
```typescript
export const contracts = {
  fariToken: '0x...', // From deployment
  dao: '0x...',
  escrow: '0x...',
  nft: '0x...',
} as const;

export const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // Polygon
export const USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; // Polygon
```

### 5. Run Frontend

```bash
cd /home/arash/frima/frontend

# Development
npm run dev

# Production build
npm run build
npm start
```

Access at: `http://localhost:3000`

## 🏗️ Project Structure

```
frima/
├── contracts/                 # Solidity smart contracts
│   ├── Escrow.sol
│   ├── FARIToken.sol
│   ├── FARIIMADao.sol
│   ├── ProofOfWorkNFT.sol
│   ├── scripts/deploy.js
│   ├── hardhat.config.js
│   └── package.json
│
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── dashboard/    # User dashboard
│   │   │   ├── find-work/
│   │   │   ├── find-talent/
│   │   │   ├── tokenomics/
│   │   │   └── dao/
│   │   ├── components/
│   │   │   ├── layout/       # Header, Footer
│   │   │   ├── home/         # Hero, Features, etc
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   └── ui/           # Reusable UI
│   │   ├── lib/
│   │   │   ├── contracts.ts  # Contract ABIs & addresses
│   │   │   ├── web3.ts       # Web3 utilities
│   │   │   └── ipfs.ts       # IPFS integration
│   │   └── hooks/
│   │       ├── useEscrow.ts
│   │       ├── useFARI.ts
│   │       └── useDAO.ts
│   └── package.json
│
└── docs/                      # Documentation
    ├── architecture/
    │   ├── ARCHITECTURE.md
    │   └── SMART_CONTRACTS.md
    └── tokenomics/
        └── TOKENOMICS.md
```

## 🔧 Development Workflow

### Smart Contract Development

1. **Write Contract**
```bash
cd /home/arash/frima/contracts
# Edit contracts/*.sol
```

2. **Compile**
```bash
npx hardhat compile
```

3. **Test**
```bash
npx hardhat test
npx hardhat coverage
```

4. **Deploy to Local Network**
```bash
npx hardhat node  # Terminal 1
npx hardhat run scripts/deploy.js --network localhost  # Terminal 2
```

### Frontend Development

1. **Create Component**
```bash
cd /home/arash/frima/frontend/src/components
# Create new component file
```

2. **Use Web3 Hook**
```typescript
import { useContractRead } from 'wagmi';
import { contracts } from '@/lib/contracts';

const { data } = useContractRead({
  address: contracts.escrow,
  abi: EscrowABI,
  functionName: 'getProject',
  args: [projectId],
});
```

3. **Hot Reload**
```bash
npm run dev
# Changes auto-refresh at localhost:3000
```

## 📝 Key Implementation Tasks

### Phase 1: Core Infrastructure ✅
- [x] Smart contract architecture
- [x] Escrow with 5% fee logic
- [x] FARI token with staking
- [x] DAO dispute resolution
- [x] Proof of Work NFT
- [x] Frontend scaffold
- [x] Web3 wallet integration

### Phase 2: User Dashboards (Next Steps)
- [ ] Freelancer profile page
- [ ] Client dashboard
- [ ] Project creation flow
- [ ] Escrow deposit UI
- [ ] Work submission interface
- [ ] Payment release UI

### Phase 3: DAO & Governance
- [ ] Dispute submission page
- [ ] Juror voting interface
- [ ] Evidence upload (IPFS)
- [ ] Proposal creation
- [ ] Voting dashboard
- [ ] Treasury management

### Phase 4: Advanced Features
- [ ] FARIIMA Connect (WebRTC)
- [ ] Skill verification tests
- [ ] NFT gallery display
- [ ] Staking dashboard
- [ ] Analytics/charts
- [ ] Notification system

### Phase 5: Polish & Launch
- [ ] Security audit
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Documentation
- [ ] Marketing website
- [ ] Mainnet deployment

## 🧪 Testing

### Smart Contracts
```bash
cd /home/arash/frima/contracts

# Run all tests
npx hardhat test

# Gas report
REPORT_GAS=true npx hardhat test

# Coverage
npx hardhat coverage
```

### Frontend
```bash
cd /home/arash/frima/frontend

# Type check
npm run type-check

# Lint
npm run lint

# Build test
npm run build
```

## 🔐 Security Checklist

### Smart Contracts
- [ ] ReentrancyGuard on all state-changing functions
- [ ] Access control (OpenZeppelin AccessControl)
- [ ] Pausable mechanism for emergencies
- [ ] Integer overflow protection (Solidity 0.8+)
- [ ] External audit by CertiK/OpenZeppelin
- [ ] Timelock on critical operations

### Frontend
- [ ] Never expose private keys
- [ ] Validate all user inputs
- [ ] Use HTTPS in production
- [ ] Content Security Policy headers
- [ ] Rate limiting on API calls
- [ ] Signature verification for auth

## 📊 Monitoring & Analytics

### On-Chain Metrics to Track
- Total Value Locked (TVL)
- Number of active projects
- Dispute resolution rate
- FARI staking participation
- Average project completion time
- Platform fee revenue

### Tools
- **The Graph**: Index blockchain data
- **Dune Analytics**: Custom dashboards
- **Tenderly**: Transaction monitoring
- **OpenZeppelin Defender**: Security monitoring

## 🚢 Deployment Checklist

### Pre-Mainnet
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Bug bounty program live
- [ ] Testnet deployment stable
- [ ] Documentation complete
- [ ] Legal review done

### Mainnet Launch
- [ ] Deploy contracts with multi-sig
- [ ] Verify on PolygonScan
- [ ] Add liquidity to DEX
- [ ] Initialize DAO treasury
- [ ] Deploy frontend to production
- [ ] Set up monitoring
- [ ] Announce launch

## 🆘 Troubleshooting

### Contract Deployment Fails
```bash
# Check gas price
# Ensure wallet has MATIC
# Verify RPC endpoint is working
```

### Frontend Can't Connect to Wallet
```bash
# Check NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# Ensure correct network (Polygon/Mumbai)
# Clear browser cache
```

### Transaction Reverts
```bash
# Check contract state
# Verify function parameters
# Ensure sufficient token approval
# Check gas limit
```

## 📚 Additional Resources

### Documentation
- [Polygon Docs](https://docs.polygon.technology/)
- [Hardhat Guide](https://hardhat.org/docs)
- [wagmi Docs](https://wagmi.sh/)
- [Next.js Docs](https://nextjs.org/docs)

### Community
- Discord: (to be created)
- Telegram: (to be created)
- Twitter: @fariima

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit PR with description

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for the decentralized future**
