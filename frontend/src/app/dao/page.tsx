'use client';

import { useState } from 'react';
import { Vote, Users, Shield, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const proposals = [
  {
    id: 1,
    title: 'Reduce Platform Fee to 4%',
    description: 'Proposal to reduce the platform fee from 5% to 4% to increase competitiveness.',
    status: 'Active',
    votesFor: 8500000,
    votesAgainst: 2300000,
    totalVotes: 10800000,
    quorum: 15000000,
    timeLeft: '3 days',
    proposer: '0x742d...A4B2',
  },
  {
    id: 2,
    title: 'Add Support for Arbitrum Chain',
    description: 'Deploy FARIIMA contracts on Arbitrum to reduce gas fees and improve user experience.',
    status: 'Active',
    votesFor: 12400000,
    votesAgainst: 1800000,
    totalVotes: 14200000,
    quorum: 15000000,
    timeLeft: '5 days',
    proposer: '0x8F3c...B1D8',
  },
  {
    id: 3,
    title: 'Increase Juror Rewards by 25%',
    description: 'Increase dispute resolution juror rewards to incentivize more participation.',
    status: 'Passed',
    votesFor: 18500000,
    votesAgainst: 3200000,
    totalVotes: 21700000,
    quorum: 15000000,
    timeLeft: 'Ended',
    proposer: '0x1A2B...C3D4',
  },
];

const disputes = [
  {
    id: 1,
    title: 'Project Milestone Dispute #4521',
    description: 'Client claims milestone was not completed as agreed. Freelancer claims work was delivered on time.',
    status: 'Voting',
    amount: '$2,500',
    jurors: 5,
    votesFor: 3,
    votesAgainst: 2,
    timeLeft: '2 days',
  },
  {
    id: 2,
    title: 'Quality Dispute #4518',
    description: 'Client alleges delivered work does not meet quality standards specified in contract.',
    status: 'Voting',
    amount: '$5,000',
    jurors: 7,
    votesFor: 4,
    votesAgainst: 3,
    timeLeft: '4 days',
  },
  {
    id: 3,
    title: 'Payment Dispute #4512',
    description: 'Freelancer claims additional work was requested outside of original scope.',
    status: 'Resolved',
    amount: '$1,800',
    jurors: 5,
    votesFor: 5,
    votesAgainst: 0,
    timeLeft: 'Completed',
  },
];

export default function DAOPage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'disputes'>('proposals');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 text-white py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">FARIIMA DAO</h1>
            <p className="text-2xl text-purple-100 mb-4">Decentralized Autonomous Organization</p>
            <p className="text-lg text-purple-200 max-w-3xl mx-auto">
              Community-driven governance and dispute resolution powered by $FARI token holders
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">2,847</p>
              <p className="text-purple-100">Active Voters</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Vote className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">47</p>
              <p className="text-purple-100">Total Proposals</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">156</p>
              <p className="text-purple-100">Disputes Resolved</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">$2.4M</p>
              <p className="text-purple-100">Treasury Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'proposals'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Governance Proposals
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'disputes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Dispute Resolution
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {activeTab === 'proposals' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Governance Proposals</h2>
                <p className="text-gray-600">Vote on platform changes and improvements</p>
              </div>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Create Proposal
              </button>
            </div>

            {/* Proposals List */}
            <div className="space-y-6">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{proposal.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          proposal.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : proposal.status === 'Passed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{proposal.description}</p>
                      <p className="text-sm text-gray-500">
                        Proposed by <span className="font-mono font-medium">{proposal.proposer}</span>
                      </p>
                    </div>
                    {proposal.status === 'Active' && (
                      <div className="text-right">
                        <Clock className="h-5 w-5 text-gray-400 inline mr-2" />
                        <span className="text-sm font-medium text-gray-600">{proposal.timeLeft} left</span>
                      </div>
                    )}
                  </div>

                  {/* Voting Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Voting Progress</span>
                      <span className="text-gray-900 font-medium">
                        {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(proposal.votesFor / proposal.quorum) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-900 font-medium">
                          For: {proposal.votesFor.toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          ({((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-gray-900 font-medium">
                          Against: {proposal.votesAgainst.toLocaleString()}
                        </span>
                        <span className="text-gray-500">
                          ({((proposal.votesAgainst / proposal.totalVotes) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {proposal.status === 'Active' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Vote For
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                        Vote Against
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dispute Resolution</h2>
                <p className="text-gray-600">Fair and transparent dispute resolution by community jurors</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Available to Join as Juror</p>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Become a Juror
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How Dispute Resolution Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                  <h4 className="font-bold text-gray-900 mb-2">Dispute Raised</h4>
                  <p className="text-sm text-gray-600">Either party can raise a dispute if they believe the contract terms were not met</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                  <h4 className="font-bold text-gray-900 mb-2">Jurors Vote</h4>
                  <p className="text-sm text-gray-600">Random FARI stakers are selected as jurors to review evidence and vote</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                  <h4 className="font-bold text-gray-900 mb-2">Resolution</h4>
                  <p className="text-sm text-gray-600">Majority vote determines outcome. Funds are released accordingly</p>
                </div>
              </div>
            </div>

            {/* Disputes List */}
            <div className="space-y-6">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{dispute.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          dispute.status === 'Voting'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {dispute.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{dispute.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Escrow Amount</p>
                      <p className="text-2xl font-bold text-gray-900">{dispute.amount}</p>
                    </div>
                  </div>

                  {/* Juror Votes */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {dispute.jurors} Jurors Selected
                      </span>
                      {dispute.status === 'Voting' && (
                        <span className="text-sm text-gray-600">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {dispute.timeLeft} left
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-green-600 font-medium">For Freelancer</span>
                          <span className="text-gray-900 font-bold">{dispute.votesFor}/{dispute.jurors}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(dispute.votesFor / dispute.jurors) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-red-600 font-medium">For Client</span>
                          <span className="text-gray-900 font-bold">{dispute.votesAgainst}/{dispute.jurors}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${(dispute.votesAgainst / dispute.jurors) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      View Evidence
                    </button>
                    {dispute.status === 'Voting' && (
                      <>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                          Vote for Freelancer
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                          Vote for Client
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
