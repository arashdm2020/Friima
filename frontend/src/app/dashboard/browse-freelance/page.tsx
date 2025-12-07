'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Star } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Smart Contract Development for DeFi Protocol',
    description: 'Looking for an experienced Solidity developer to build and audit smart contracts for a new DeFi lending protocol on Polygon.',
    budget: '$5,000 - $8,000',
    budgetType: 'Fixed Price',
    client: '0x742d...A4B2',
    clientRating: 4.8,
    clientJobs: 12,
    location: 'Remote',
    posted: '2 hours ago',
    proposals: 8,
    skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Web3.js'],
    verified: true,
  },
  {
    id: 2,
    title: 'NFT Marketplace Frontend Development',
    description: 'Need a React/Next.js developer to build a modern NFT marketplace interface with wallet integration and IPFS support.',
    budget: '$3,500 - $5,000',
    budgetType: 'Fixed Price',
    client: '0x8F3c...B1D8',
    clientRating: 4.9,
    clientJobs: 28,
    location: 'Remote',
    posted: '5 hours ago',
    proposals: 15,
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Web3'],
    verified: true,
  },
  {
    id: 3,
    title: 'Web3 Game Backend Architecture',
    description: 'Build scalable backend infrastructure for a blockchain-based gaming platform with NFT integration.',
    budget: '$8,000 - $12,000',
    budgetType: 'Fixed Price',
    client: '0x1A2B...C3D4',
    clientRating: 4.7,
    clientJobs: 5,
    location: 'Remote',
    posted: '1 day ago',
    proposals: 23,
    skills: ['Node.js', 'PostgreSQL', 'Web3', 'Smart Contracts'],
    verified: false,
  },
  {
    id: 4,
    title: 'DAO Governance Dashboard',
    description: 'Create a comprehensive dashboard for DAO members to view proposals, vote, and track treasury metrics.',
    budget: '$4,000 - $6,000',
    budgetType: 'Fixed Price',
    client: '0x9E2F...D7A3',
    clientRating: 5.0,
    clientJobs: 45,
    location: 'Remote',
    posted: '2 days ago',
    proposals: 12,
    skills: ['React', 'Web3', 'Chart.js', 'Ethers.js'],
    verified: true,
  },
];

export default function BrowseFreelancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Freelance Jobs</h1>
          <p className="text-gray-600">Find your next Web3 project</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>Any Budget</option>
                  <option>$0 - $1,000</option>
                  <option>$1,000 - $5,000</option>
                  <option>$5,000 - $10,000</option>
                  <option>$10,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>All Types</option>
                  <option>Fixed Price</option>
                  <option>Hourly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Rating
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>Any Rating</option>
                  <option>4.5+ Stars</option>
                  <option>4.0+ Stars</option>
                  <option>3.5+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{jobs.length} jobs</span> found
          </p>
        </div>

        {/* Job listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Job details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-gray-900">{job.budget}</span>
                      <span className="text-gray-500">· {job.budgetType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </div>
                    <div className="text-gray-500">
                      {job.proposals} proposals
                    </div>
                  </div>
                </div>
              </div>

              {/* Client info and action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{job.client}</span>
                      {job.verified && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{job.clientRating}</span>
                      </div>
                      <span>{job.clientJobs} jobs posted</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
