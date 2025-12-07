# FARIIMA Tokenomics - $FARI Token

## Token Overview

**Token Name**: FARIIMA Token  
**Symbol**: $FARI  
**Standard**: ERC-20  
**Network**: Polygon  
**Total Supply**: 1,000,000,000 FARI (1 Billion)  
**Decimals**: 18  

## Token Allocation

| Category | Allocation | Amount (FARI) | Vesting Schedule |
|----------|-----------|---------------|------------------|
| **Community Rewards** | 35% | 350,000,000 | Released over 5 years via staking and incentives |
| **DAO Treasury** | 25% | 250,000,000 | Locked, released via DAO governance votes |
| **Initial Liquidity** | 15% | 150,000,000 | Immediate unlock for DEX pairs |
| **Team & Advisors** | 15% | 150,000,000 | 1-year cliff, then 3-year linear vesting |
| **Early Supporters** | 7% | 70,000,000 | 6-month cliff, then 2-year linear vesting |
| **Platform Development** | 3% | 30,000,000 | Locked for 1 year, then released quarterly |

**Total**: 100% | 1,000,000,000 FARI

## Token Utility

### 1. Governance Rights
- **DAO Voting**: 1 FARI staked = 1 vote
- **Proposal Creation**: Minimum 10,000 FARI staked required
- **Vote on**:
  - Dispute resolutions
  - Platform fee adjustments
  - Feature prioritization
  - Treasury fund allocation
  - Smart contract upgrades

### 2. Staking for Visibility
**Freelancer Ranking Algorithm**:
```
Ranking Score = (Skill_Score × 0.4) + (FARI_Staked × 0.3) + (Reputation × 0.3)

Where:
- Skill_Score: Verified test results (0-100)
- FARI_Staked: Normalized staking amount
- Reputation: NFT count + completion rate + client ratings
```

**Staking Tiers**:
| Tier | FARI Staked | Visibility Boost | Benefits |
|------|-------------|------------------|----------|
| Bronze | 100 - 999 | 1.2x | Basic visibility boost |
| Silver | 1,000 - 4,999 | 1.5x | Featured in category pages |
| Gold | 5,000 - 19,999 | 2.0x | Homepage featured spot rotation |
| Platinum | 20,000+ | 3.0x | Priority listing + verified badge |

### 3. Juror Rewards (Dispute Resolution)
- **Eligibility**: Minimum 5,000 FARI staked
- **Random Selection**: Cryptographically selected from eligible pool
- **Reward per Dispute**: 50-500 FARI (based on project value)
- **Slashing**: -10% stake if proven to vote maliciously

**Juror Selection Process**:
```
1. Dispute initiated
2. Random selection of 7 jurors (Chainlink VRF)
3. 72-hour voting period
4. Majority decision (4/7) wins
5. Rewards distributed to participating jurors
6. Minority voters (if proven good faith) still rewarded 50%
```

### 4. Transaction Fee Discounts
| FARI Holdings | Platform Fee Discount |
|---------------|----------------------|
| 0 | 5.0% (standard) |
| 1,000+ | 4.5% |
| 5,000+ | 4.0% |
| 20,000+ | 3.5% |

*Note: Discount requires FARI to be staked*

## Emission Schedule

### Year 1-2: Bootstrap Phase
- **Community Rewards**: 100M FARI/year
- **Focus**: Onboard early freelancers and clients
- **Incentives**:
  - 500 FARI bonus for first completed project
  - 200 FARI for verified skill test completion
  - 1000 FARI for top 10 freelancers monthly

### Year 3-4: Growth Phase
- **Community Rewards**: 75M FARI/year
- **Focus**: Sustain growth and quality
- **Incentives**:
  - Reduced new user bonuses
  - Increased juror rewards
  - Liquidity mining programs

### Year 5+: Maturity Phase
- **Community Rewards**: 50M FARI/year (adjustable by DAO)
- **Focus**: Long-term sustainability
- **Incentives**: DAO-governed allocation

## Staking Mechanics

### Staking Contract Features
```solidity
function stake(uint256 amount) external;
function unstake(uint256 amount) external;
function claimRewards() external;

// Unstaking has 7-day cooldown period
// Rewards auto-compound if not claimed
```

### Staking APY (Projected)
| Total Staked % | Estimated APY |
|----------------|---------------|
| 10-20% | 45-60% |
| 20-40% | 30-45% |
| 40-60% | 15-30% |
| 60%+ | 8-15% |

*APY decreases as more tokens are staked to maintain sustainability*

## Token Burn Mechanisms

### Deflationary Pressure
1. **Dispute Resolution Fee Burn**: 10% of dispute resolution fees burned
2. **Platform Upgrade Votes**: 100 FARI burned per proposal submission (spam prevention)
3. **Quarterly Burns**: DAO votes on burning up to 10% of treasury annually

**Maximum Burn Cap**: 300M FARI (30% of total supply) over platform lifetime

## Initial Distribution & Launch

### Phase 1: Pre-Launch (Month 0)
- Team tokens locked in vesting contract
- DAO treasury multisig setup
- Community allocation contract deployed

### Phase 2: TGE (Token Generation Event)
- **DEX Launch**: Uniswap V3 on Polygon
- **Initial Liquidity**: 150M FARI paired with $500K USDC
- **Initial Price Target**: $0.0033/FARI (fully diluted $3.3M)

### Phase 3: Liquidity Mining (Month 1-6)
- **FARI-USDC LP Rewards**: 20M FARI
- **FARI-MATIC LP Rewards**: 10M FARI

## Governance Model

### Voting Power Calculation
```
Voting Power = Staked_FARI × Time_Multiplier

Time_Multiplier:
- 0-3 months staked: 1.0x
- 3-6 months staked: 1.2x
- 6-12 months staked: 1.5x
- 12+ months staked: 2.0x
```

### Proposal Types & Quorum Requirements
| Proposal Type | Quorum Required | Pass Threshold |
|---------------|----------------|----------------|
| Minor Platform Updates | 5% of staked tokens | 51% |
| Fee Structure Changes | 15% of staked tokens | 66% |
| Treasury Allocation | 20% of staked tokens | 66% |
| Smart Contract Upgrades | 30% of staked tokens | 75% |

## Economic Security Model

### Platform Revenue (5% Fee Model)
```
Example Monthly Revenue at Scale:
- $10M in project volume
- 5% platform fee = $500K revenue
- Distribution:
  - 60% ($300K): DAO Treasury (converted to FARI buy-back)
  - 25% ($125K): Operations & Development
  - 15% ($75K): Juror rewards pool
```

### FARI Buy-Back Program
- **Frequency**: Monthly
- **Source**: 60% of platform fees
- **Mechanism**: TWAP buy orders on DEX
- **Destination**: 50% burned, 50% to DAO treasury

## Risk Mitigation

### Token Price Stability Mechanisms
1. **Vesting Schedules**: Prevent sudden supply shocks
2. **Staking Incentives**: Lock up circulating supply
3. **Burn Mechanisms**: Reduce total supply over time
4. **Liquidity Depth**: Maintain deep DEX pools

### Sybil Attack Prevention
- **Minimum Stake**: 100 FARI for basic features
- **Identity Verification**: Optional KYC for higher tiers (privacy-preserving)
- **Behavior Analysis**: ML models detect fake accounts

## Comparison to Competitors

| Platform | Fee | Governance | Staking | Dispute Resolution |
|----------|-----|-----------|---------|-------------------|
| **FARIIMA** | **5%** | **DAO (FARI)** | **Yes** | **Decentralized Jury** |
| Upwork | 10-20% | Centralized | No | Centralized Support |
| LaborX | 10% | No | No | Centralized Arbitration |
| Freelancer.com | 10% + fees | Centralized | No | Centralized Support |
| Braintrust | 10% | DAO | Limited | Community-based |

## Long-Term Vision (5-10 Years)

### Target Metrics
- **Total Value Locked**: $500M+
- **Active Freelancers**: 100,000+
- **FARI Market Cap**: $50M-500M
- **Platform Monthly Volume**: $50M+

### Sustainability Factors
1. **Real Utility**: Every token has clear use case
2. **Fee Generation**: Platform generates real revenue
3. **Deflationary Pressure**: Burn mechanisms reduce supply
4. **Community Ownership**: DAO controls treasury and direction

---

## Token Launch Checklist

- [ ] Smart contract security audit (CertiK/OpenZeppelin)
- [ ] Tokenomics peer review
- [ ] Legal opinion (securities compliance)
- [ ] DEX liquidity provision
- [ ] CEX listing applications (Gate.io, MEXC)
- [ ] Community education campaign
- [ ] Staking contract deployment
- [ ] Vesting contract deployment
- [ ] Multi-sig treasury setup
