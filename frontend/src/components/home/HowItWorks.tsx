import { Wallet, Search, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    name: 'Connect Wallet',
    description: 'Connect your MetaMask or WalletConnect compatible wallet to get started on Polygon.',
    icon: Wallet,
    step: '01',
  },
  {
    name: 'Find Work or Talent',
    description: 'Browse verified freelancers or available projects. Filter by skills, ratings, and staked FARI.',
    icon: Search,
    step: '02',
  },
  {
    name: 'Create & Fund Project',
    description: 'Client deposits USDC/USDT into escrow smart contract. Funds are locked until completion.',
    icon: FileText,
    step: '03',
  },
  {
    name: 'Deliver & Release',
    description: 'Freelancer delivers work. Client approves and funds auto-release with 5% fee to DAO treasury.',
    icon: CheckCircle,
    step: '04',
  },
];

export function HowItWorks() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How FARIIMA Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Four simple steps to start working on the decentralized web
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {steps.map((step, idx) => (
              <div key={step.name} className="relative">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                      <step.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="text-sm font-semibold text-primary-600 mb-2">
                      STEP {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.name}
                    </h3>
                    <p className="text-base text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && idx % 2 === 0 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
