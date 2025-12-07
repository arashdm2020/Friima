'use client';

import { useState } from 'react';
import { Plus, Edit, Eye, Trash2, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';

const gigs = [
  {
    id: 1,
    title: 'Smart Contract Security Audit',
    description: 'Professional security audit for Solidity smart contracts with detailed report',
    price: '$500 - $2,000',
    deliveryTime: '5-7 days',
    active: true,
    views: 1247,
    orders: 23,
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 2,
    title: 'NFT Smart Contract Development',
    description: 'Build custom ERC-721 or ERC-1155 NFT contracts with advanced features',
    price: '$800 - $3,000',
    deliveryTime: '7-10 days',
    active: true,
    views: 892,
    orders: 15,
    rating: 5.0,
    reviews: 12,
  },
  {
    id: 3,
    title: 'DeFi Protocol Development',
    description: 'Create lending, staking, or DEX protocols on Ethereum or Polygon',
    price: '$3,000 - $10,000',
    deliveryTime: '14-21 days',
    active: false,
    views: 645,
    orders: 8,
    rating: 4.8,
    reviews: 7,
  },
];

export default function MyGigsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'draft'>('active');

  const activeGigs = gigs.filter(g => g.active);
  const draftGigs = gigs.filter(g => !g.active);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
            <p className="text-gray-600">Manage your service offerings</p>
          </div>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Gig
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Gigs</div>
            <div className="text-3xl font-bold text-gray-900">{gigs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Orders</div>
            <div className="text-3xl font-bold text-gray-900">
              {gigs.reduce((sum, g) => sum + g.orders, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Views</div>
            <div className="text-3xl font-bold text-gray-900">
              {gigs.reduce((sum, g) => sum + g.views, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Avg. Rating</div>
            <div className="text-3xl font-bold text-gray-900">
              {(gigs.reduce((sum, g) => sum + g.rating, 0) / gigs.length).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active ({activeGigs.length})
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'draft'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Drafts ({draftGigs.length})
              </button>
            </div>
          </div>

          {/* Gig list */}
          <div className="divide-y divide-gray-200">
            {(activeTab === 'active' ? activeGigs : draftGigs).map((gig) => (
              <div key={gig.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
                      {gig.active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{gig.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-gray-900">{gig.price}</span>
                      </div>
                      <div>Delivery: {gig.deliveryTime}</div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {gig.views} views
                      </div>
                      <div>{gig.orders} orders</div>
                      <div>⭐ {gig.rating} ({gig.reviews} reviews)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      {gig.active ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'active' ? activeGigs : draftGigs).length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-600 mb-4">
                  {activeTab === 'active' 
                    ? 'No active gigs yet. Create your first gig to start getting orders!'
                    : 'No draft gigs. Start creating a new gig!'
                  }
                </p>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Gig
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
