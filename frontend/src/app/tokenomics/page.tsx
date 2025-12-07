'use client';

import { Coins, TrendingUp, Users, Lock, Vote, Flame } from 'lucide-react';

const allocation = [
  { category: 'Community Rewards', percentage: 30, color: 'bg-blue-500', description: 'Staking rewards, juror rewards, and community incentives' },
  { category: 'Team & Advisors', percentage: 20, color: 'bg-purple-500', description: '4-year vesting with 1-year cliff' },
  { category: 'Ecosystem Development', percentage: 25, color: 'bg-green-500', description: 'Grants, partnerships, and platform growth' },
  { category: 'Public Sale', percentage: 15, color: 'bg-yellow-500', description: 'Fair launch distribution' },
  { category: 'Treasury', percentage: 10, color: 'bg-red-500', description: 'DAO-controlled treasury for operations' },
];

const utilities = [
  {
    icon: Vote,
    title: 'Governance Voting',
    description: 'Vote on platform decisions, fee changes, and protocol upgrades',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Lock,
    title: 'Staking & Benefits',
    description: 'Stake FARI to unlock premium features, fee discounts, and priority support',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Users,
    title: 'Juror Rewards',
    description: 'Earn rewards by participating in dispute resolution as a juror',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: TrendingUp,
    title: 'Fee Discounts',
    description: 'Reduce platform fees from 5% to as low as 2.5% for premium tiers',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
];

export default function TokenomicsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="container text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Coins className="h-16 w-16" />
            <h1 className="text-5xl md:text-6xl font-bold">$FARI Token</h1>
          </div>
          <p className="text-2xl text-primary-100 mb-4">The Governance & Utility Token of FARIIMA</p>
          <p className="text-lg text-primary-200 max-w-3xl mx-auto">
            $FARI powers the FARIIMA ecosystem, enabling decentralized governance, staking rewards, 
            and premium platform benefits.
          </p>
        </div>
      </div>

      {/* Token Stats */}
      <div className="container -mt-16 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Total Supply</p>
            <p className="text-3xl font-bold text-gray-900">1B FARI</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Circulating Supply</p>
            <p className="text-3xl font-bold text-gray-900">250M FARI</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Current Price</p>
            <p className="text-3xl font-bold text-green-600">$0.42</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Market Cap</p>
            <p className="text-3xl font-bold text-gray-900">$105M</p>
          </div>
        </div>
      </div>

      {/* Token Allocation */}
      <div className="container mb-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Token Allocation</h2>
          
          {/* Pie Chart Representation */}
          <div className="mb-8">
            <div className="flex h-12 rounded-lg overflow-hidden mb-4">
              {allocation.map((item) => (
                <div
                  key={item.category}
                  className={item.color}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.category}: ${item.percentage}%`}
                />
              ))}
            </div>
          </div>

          {/* Allocation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allocation.map((item) => (
              <div key={item.category} className="flex items-start gap-4">
                <div className={`w-4 h-4 ${item.color} rounded mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{item.category}</h3>
                    <span className="text-xl font-bold text-primary-600">{item.percentage}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Utility */}
      <div className="container mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Token Utility</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            $FARI is not just a governance token—it unlocks powerful features across the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {utilities.map((utility) => (
            <div key={utility.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${utility.bg} rounded-lg flex items-center justify-center mb-4`}>
                <utility.icon className={`h-6 w-6 ${utility.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{utility.title}</h3>
              <p className="text-gray-600">{utility.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Staking Tiers */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Staking Tiers & Benefits</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Stake $FARI to unlock premium benefits and reduce platform fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Bronze', stake: '1,000 FARI', fee: '4.5%', color: 'from-orange-400 to-orange-600' },
              { name: 'Silver', stake: '5,000 FARI', fee: '4.0%', color: 'from-gray-300 to-gray-500' },
              { name: 'Gold', stake: '20,000 FARI', fee: '3.0%', color: 'from-yellow-400 to-yellow-600' },
              { name: 'Platinum', stake: '100,000 FARI', fee: '2.5%', color: 'from-purple-400 to-purple-600' },
            ].map((tier) => (
              <div key={tier.name} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className={`h-2 w-full bg-gradient-to-r ${tier.color} rounded-full mb-4`} />
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">Stake {tier.stake}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between py-2 border-t border-gray-700">
                    <span className="text-gray-400">Platform Fee</span>
                    <span className="font-bold text-green-400">{tier.fee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Burns */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Flame className="h-12 w-12" />
            <div>
              <h2 className="text-3xl font-bold">Deflationary Mechanism</h2>
              <p className="text-red-100">Regular token burns to increase scarcity</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <p className="text-red-100 mb-2">Platform Fees Burned</p>
              <p className="text-3xl font-bold">20%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <p className="text-red-100 mb-2">Total Burned</p>
              <p className="text-3xl font-bold">5.2M FARI</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <p className="text-red-100 mb-2">Next Burn</p>
              <p className="text-3xl font-bold">7 Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8">Buy $FARI tokens and start participating in governance</p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Buy FARI
            </button>
            <button className="px-8 py-3 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors border border-primary-500">
              Stake FARI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
