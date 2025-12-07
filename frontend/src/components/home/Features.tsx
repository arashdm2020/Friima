import {
  Shield,
  Coins,
  FileCheck,
  Vote,
  Lock,
  Sparkles,
  Award,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    name: 'Trustless Escrow',
    description:
      'Smart contracts automatically hold and release payments based on project completion. No centralized authority controls your funds.',
    icon: Lock,
  },
  {
    name: 'Proof of Work NFTs',
    description:
      'Every completed project mints a soulbound NFT certificate. Build an immutable, verifiable portfolio on-chain.',
    icon: Award,
  },
  {
    name: 'DAO Dispute Resolution',
    description:
      'Staked FARI token holders act as jurors for disputes. Transparent, community-driven justice with cryptographic evidence.',
    icon: Vote,
  },
  {
    name: '5% Platform Fee',
    description:
      'Only 5% fee on successful projects, automatically deducted via smart contract. Half the cost of traditional platforms.',
    icon: Coins,
  },
  {
    name: 'Staking for Visibility',
    description:
      'Stake FARI tokens to boost your profile ranking. Merit-based visibility system rewards serious professionals.',
    icon: Sparkles,
  },
  {
    name: 'Verified Skills',
    description:
      'Complete on-platform skill tests with anti-cheating AI. Display verified competencies, not self-reported tags.',
    icon: FileCheck,
  },
  {
    name: 'Polygon Network',
    description:
      'Built on Polygon for lightning-fast transactions and near-zero gas fees. Eco-friendly and scalable.',
    icon: Shield,
  },
  {
    name: 'FARIIMA Connect',
    description:
      'Integrated WebRTC calls with evidence recording. All communication timestamped and available for dispute resolution.',
    icon: Smartphone,
  },
];

export function Features() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for the Web3 Era
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            FARIIMA combines the best of blockchain technology with a superior freelance experience.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex items-center gap-x-3 mb-4">
                  <div className="rounded-lg bg-primary-600 p-2">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold leading-7 text-gray-900">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
