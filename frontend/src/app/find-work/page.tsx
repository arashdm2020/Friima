'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Star, Award } from 'lucide-react';
import Link from 'next/link';

const jobs = [
  {
    id: 1,
    title: 'NFT Marketplace Development',
    description: 'Build a full-featured NFT marketplace on Polygon with minting, trading, and auction functionality.',
    budget: '$5,000 - $10,000',
    duration: '2-3 months',
    skills: ['Solidity', 'React', 'Web3.js', 'IPFS', 'Node.js'],
    clientName: 'CryptoArt Studio',
    clientWallet: '0x742d...A4B2',
    clientRating: 4.9,
    clientJobs: 12,
    verified: true,
    posted: '2 hours ago',
    proposals: 8,
  },
  {
    id: 2,
    title: 'Smart Contract Security Audit',
    description: 'Need experienced auditor to review DeFi lending protocol contracts for vulnerabilities.',
    budget: '$3,000 - $5,000',
    duration: '2-4 weeks',
    skills: ['Solidity', 'Security', 'DeFi', 'Smart Contract Auditing'],
    clientName: 'DeFi Protocol',
    clientWallet: '0x8F3c...B1D8',
    clientRating: 5.0,
    clientJobs: 23,
    verified: true,
    posted: '5 hours ago',
    proposals: 15,
  },
  {
    id: 3,
    title: 'Web3 Frontend Integration',
    description: 'Integrate wallet connection and smart contract interactions into existing React application.',
    budget: '$2,000 - $4,000',
    duration: '3-6 weeks',
    skills: ['React', 'TypeScript', 'Ethers.js', 'Web3', 'TailwindCSS'],
    clientName: 'Blockchain Startup',
    clientWallet: '0x1A2B...C3D4',
    clientRating: 4.7,
    clientJobs: 8,
    verified: false,
    posted: '1 day ago',
    proposals: 12,
  },
  {
    id: 4,
    title: 'DAO Governance Token Development',
    description: 'Create ERC-20 governance token with voting mechanisms and time-weighted voting power.',
    budget: '$4,000 - $7,000',
    duration: '1-2 months',
    skills: ['Solidity', 'Governance', 'Smart Contracts', 'Hardhat'],
    clientName: 'DAO Community',
    clientWallet: '0x9E2F...D7A3',
    clientRating: 4.8,
    clientJobs: 5,
    verified: true,
    posted: '3 days ago',
    proposals: 20,
  },
  {
    id: 5,
    title: 'IPFS File Storage Integration',
    description: 'Implement decentralized file storage using IPFS for NFT metadata and project documents.',
    budget: '$1,500 - $3,000',
    duration: '2-4 weeks',
    skills: ['IPFS', 'JavaScript', 'Node.js', 'Web3 Storage'],
    clientName: 'NFT Platform',
    clientWallet: '0x5C8D...E2F9',
    clientRating: 4.6,
    clientJobs: 15,
    verified: true,
    posted: '1 week ago',
    proposals: 6,
  },
];

export default function FindWorkPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Next Web3 Project</h1>
          <p className="text-xl text-primary-100 mb-8">Browse decentralized freelance opportunities on the blockchain</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Search Jobs
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>Any Budget</option>
                    <option>$0 - $1,000</option>
                    <option>$1,000 - $3,000</option>
                    <option>$3,000 - $5,000</option>
                    <option>$5,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Length</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>Any Duration</option>
                    <option>Less than 1 month</option>
                    <option>1-3 months</option>
                    <option>3-6 months</option>
                    <option>6+ months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>All Levels</option>
                    <option>Entry Level</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>All Clients</option>
                    <option>Verified Only</option>
                    <option>High Rating</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{jobs.length} jobs</span> available
          </p>
          <select className="border border-gray-300 rounded-lg px-4 py-2">
            <option>Most Recent</option>
            <option>Highest Budget</option>
            <option>Most Proposals</option>
            <option>Client Rating</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 hover:text-primary-600 cursor-pointer">
                      {job.title}
                    </h2>
                    {job.verified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Verified Client
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{job.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-gray-900">{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Remote
                    </div>
                    <div className="text-gray-500">
                      {job.proposals} proposals
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {job.clientName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{job.clientName}</div>
                        <div className="text-xs text-gray-500 font-mono">{job.clientWallet}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{job.clientRating}</span>
                      <span className="text-sm text-gray-500">({job.clientJobs} jobs)</span>
                    </div>
                    <div className="text-sm text-gray-500 ml-auto">
                      Posted {job.posted}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Submit Proposal
                </Link>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
