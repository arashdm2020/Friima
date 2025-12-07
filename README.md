# FARIIMA - Freelance Advanced, Resilient, Innovative Marketplace

## 🌐 Overview
FARIIMA is a next-generation Web3-native decentralized freelance platform built on Polygon, designed to provide trustless transactions, maximum transparency, and a competitive 5% fixed fee model.

## 🏗️ Architecture

### Core Components
1. **Smart Contracts (Polygon Network)**
   - Trustless Escrow System
   - DAO Governance
   - Proof of Work NFT Credentials (ERC-721)

2. **Frontend (Next.js + React)**
   - Public informational pages
   - Freelancer dashboard
   - Client dashboard
   - Dispute resolution interface

3. **Web3 Integration**
   - Wallet connectivity (MetaMask, WalletConnect)
   - On-chain transaction management
   - Real-time blockchain data

## 💰 Tokenomics

### $FARI Token Utility
- **Governance**: Voting rights in DAO
- **Staking**: Enhanced visibility for freelancers
- **Rewards**: Incentivize jurors and high performers

### Key Metrics
- **Platform Fee**: 5% (vs. competitors' 10-20%)
- **Network**: Polygon (low gas fees)
- **Stablecoins**: USDC/USDT payments

## 📁 Project Structure

```
frima/
├── contracts/              # Solidity smart contracts
│   ├── Escrow.sol
│   ├── FARIToken.sol
│   ├── DAO.sol
│   └── ProofOfWorkNFT.sol
├── frontend/              # Next.js application
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── docs/                  # Documentation
│   ├── architecture/
│   ├── tokenomics/
│   └── wireframes/
└── scripts/               # Deployment scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Polygon Mumbai testnet MATIC (for testing)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Deploy contracts (testnet)
npm run deploy:testnet

# Deploy contracts (mainnet)
npm run deploy:mainnet
```

## 🔐 Security Features

- Non-custodial escrow
- Multi-signature DAO voting
- Cryptographic evidence timestamping
- Anti-cheating AI for skill verification

## 📊 Key Differentiators

1. **Transparent Dispute Resolution**: Live feed of disputes and juror decisions
2. **Verifiable Skills**: On-chain skill certificates, not self-reported tags
3. **Proof of Work NFTs**: Immutable project completion records
4. **Staking-Based Ranking**: Merit-based visibility system

## 🛠️ Tech Stack

- **Blockchain**: Polygon (EVM)
- **Smart Contracts**: Solidity ^0.8.20
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Web3**: ethers.js, wagmi, viem
- **Communication**: WebRTC for P2P calls

## 📖 Documentation

- [Architecture Overview](./docs/architecture/ARCHITECTURE.md)
- [Smart Contract Design](./docs/architecture/SMART_CONTRACTS.md)
- [Tokenomics Model](./docs/tokenomics/TOKENOMICS.md)
- [API Reference](./docs/API.md)

## 🤝 Contributing

This is a decentralized platform governed by $FARI token holders. Join our DAO to participate in platform decisions.

## 📄 License

MIT License - See LICENSE file for details
