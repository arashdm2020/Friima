'use client';

import { Crown, Check, Zap, TrendingUp, Award, Shield } from 'lucide-react';

const tiers = [
  {
    name: 'Bronze',
    stake: '100 FARI',
    price: '~$50',
    boost: '1.2x',
    features: [
      'Profile visibility boost',
      'Priority in search results',
      'Basic analytics dashboard',
      'Bronze badge on profile',
    ],
    color: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
  {
    name: 'Silver',
    stake: '1,000 FARI',
    price: '~$500',
    boost: '1.5x',
    popular: true,
    features: [
      'All Bronze features',
      'Featured in category',
      'Advanced analytics',
      'Silver badge on profile',
      'Priority support',
    ],
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
  },
  {
    name: 'Gold',
    stake: '5,000 FARI',
    price: '~$2,500',
    boost: '2x',
    features: [
      'All Silver features',
      'Homepage spotlight',
      'Premium analytics suite',
      'Gold badge on profile',
      'Dedicated account manager',
      '10% platform fee discount',
    ],
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
  },
  {
    name: 'Platinum',
    stake: '20,000+ FARI',
    price: '~$10,000+',
    boost: '3x',
    features: [
      'All Gold features',
      'Always featured on homepage',
      'Custom analytics & reports',
      'Platinum verified badge',
      'VIP support line',
      '30% platform fee discount',
      'Early access to new features',
    ],
    color: 'from-purple-600 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: 'Increased Visibility',
    description: 'Higher ranking in search results means more client views and project invitations',
  },
  {
    icon: Award,
    title: 'Verified Badge',
    description: 'Show clients you\'re serious with a premium verification badge on your profile',
  },
  {
    icon: Zap,
    title: 'Priority Features',
    description: 'Get featured on homepage and category pages for maximum exposure',
  },
  {
    icon: Shield,
    title: 'Fee Discounts',
    description: 'Higher tiers get up to 30% discount on platform fees for all projects',
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4">
            <Crown className="h-5 w-5" />
            <span className="font-medium">Premium Membership</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Boost Your Visibility with FARI Staking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stake FARI tokens to increase your profile ranking, get featured placement, and access premium features
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="rounded-full bg-primary-100 p-3 w-12 h-12 mb-4">
                <benefit.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg shadow-sm border-2 ${
                tier.popular ? 'border-primary-500 relative' : tier.borderColor
              } overflow-hidden`}
            >
              {tier.popular && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <div className={`rounded-full bg-gradient-to-r ${tier.color} p-3 w-12 h-12 mb-4 flex items-center justify-center`}>
                  <Crown className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">{tier.stake}</div>
                  <div className="text-sm text-gray-600">{tier.price}</div>
                </div>

                <div className={`${tier.bgColor} ${tier.textColor} rounded-lg px-4 py-2 text-center mb-6`}>
                  <div className="text-2xl font-bold">{tier.boost}</div>
                  <div className="text-sm">Visibility Boost</div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    tier.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Stake {tier.stake}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Staking Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-primary-600 text-4xl font-bold mb-2">01</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Tier</h3>
              <p className="text-gray-600">
                Select the staking tier that fits your goals and budget
              </p>
            </div>
            
            <div>
              <div className="text-primary-600 text-4xl font-bold mb-2">02</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stake FARI Tokens</h3>
              <p className="text-gray-600">
                Lock your FARI tokens in the staking contract via smart contract
              </p>
            </div>
            
            <div>
              <div className="text-primary-600 text-4xl font-bold mb-2">03</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoy Benefits</h3>
              <p className="text-gray-600">
                Get instant visibility boost and access to premium features
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Staked tokens can be unstaked anytime with a 7-day cooldown period. Your benefits remain active during the cooldown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
