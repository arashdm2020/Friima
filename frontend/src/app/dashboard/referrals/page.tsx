'use client';

import { useState } from 'react';
import { Copy, Users, DollarSign, TrendingUp, Share2, CheckCircle } from 'lucide-react';

const referrals = [
  {
    id: 1,
    wallet: '0x742d...A4B2',
    joinedDate: '2024-11-15',
    status: 'active' as const,
    earned: '$45',
    projects: 3,
  },
  {
    id: 2,
    wallet: '0x8F3c...B1D8',
    joinedDate: '2024-11-20',
    status: 'active' as const,
    earned: '$32',
    projects: 2,
  },
  {
    id: 3,
    wallet: '0x1A2B...C3D4',
    joinedDate: '2024-11-28',
    status: 'pending' as const,
    earned: '$0',
    projects: 0,
  },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'FARI-A7X9B2';
  const referralLink = `https://fariima.io/signup?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarned = referrals.reduce((sum, ref) => {
    const amount = parseFloat(ref.earned.replace('$', ''));
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">Earn rewards by inviting others to FARIIMA</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Referrals</div>
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{referrals.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Active Referrals</div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {referrals.filter(r => r.status === 'active').length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Earned</div>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${totalEarned}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Pending Rewards</div>
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">$15</div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Share Your Referral Link</h2>
            </div>
            <p className="text-primary-100 mb-6">
              Invite friends and earn 10% of their platform fees for the first year. They get 5% discount too!
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-primary-100 mb-2">Your Referral Code</label>
                  <div className="font-mono text-2xl font-bold">{referralCode}</div>
                </div>
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Copy className="h-5 w-5" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                Share on Twitter
              </button>
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                Share on Telegram
              </button>
              <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                Share on Discord
              </button>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-gray-600">
                Send your unique referral link to friends and on social media
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">They Sign Up</h3>
              <p className="text-gray-600">
                Your referral creates an account and completes their first project
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You Earn</h3>
              <p className="text-gray-600">
                Get 10% of their platform fees for 12 months automatically
              </p>
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Referrals</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">{referral.wallet}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(referral.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {referral.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {referral.earned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {referrals.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No referrals yet</p>
              <p className="text-sm text-gray-500">Start sharing your link to earn rewards!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
