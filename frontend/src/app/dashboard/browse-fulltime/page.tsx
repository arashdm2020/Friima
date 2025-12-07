'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Star, Briefcase } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Blockchain Developer',
    company: 'DeFi Protocol Inc.',
    companyWallet: '0x742d...A4B2',
    description: 'Looking for experienced blockchain developer to lead smart contract development for our DeFi lending platform.',
    salary: '$120k - $180k/year',
    location: 'Remote',
    type: 'Full-time',
    posted: '3 days ago',
    applicants: 45,
    verified: true,
    skills: ['Solidity', 'Web3', 'DeFi', 'Smart Contracts', 'Node.js'],
  },
  {
    id: 2,
    title: 'Lead Frontend Engineer (Web3)',
    company: 'NFT Marketplace',
    companyWallet: '0x8F3c...B1D8',
    description: 'Join our team to build the next generation NFT marketplace with cutting-edge Web3 technology.',
    salary: '$100k - $150k/year',
    location: 'Remote',
    type: 'Full-time',
    posted: '1 week ago',
    applicants: 67,
    verified: true,
    skills: ['React', 'TypeScript', 'Web3.js', 'Ethers.js', 'TailwindCSS'],
  },
  {
    id: 3,
    title: 'Smart Contract Auditor',
    company: 'Security DAO',
    companyWallet: '0x1A2B...C3D4',
    description: 'Full-time security auditor position focusing on Solidity smart contract security reviews.',
    salary: '$130k - $200k/year',
    location: 'Remote',
    type: 'Full-time',
    posted: '2 weeks ago',
    applicants: 28,
    verified: true,
    skills: ['Solidity', 'Security', 'Auditing', 'Blockchain'],
  },
  {
    id: 4,
    title: 'Web3 Product Manager',
    company: 'Crypto Startup',
    companyWallet: '0x9E2F...D7A3',
    description: 'Lead product strategy for our Web3 gaming platform. Experience with blockchain gaming required.',
    salary: '$110k - $160k/year',
    location: 'Hybrid (San Francisco)',
    type: 'Full-time',
    posted: '1 month ago',
    applicants: 89,
    verified: false,
    skills: ['Product Management', 'Web3', 'Gaming', 'Agile'],
  },
];

export default function BrowseFulltimePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Full-time Jobs</h1>
          <p className="text-gray-600">Find your next permanent Web3 position</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs, companies, or keywords..."
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
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>Any Salary</option>
                  <option>$50k - $100k</option>
                  <option>$100k - $150k</option>
                  <option>$150k - $200k</option>
                  <option>$200k+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>All Locations</option>
                  <option>Remote Only</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>All Levels</option>
                  <option>Entry Level</option>
                  <option>Mid Level</option>
                  <option>Senior Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>All Types</option>
                  <option>Verified Only</option>
                  <option>Startup</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{jobs.length} positions</span> available
          </p>
        </div>

        {/* Job listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600 cursor-pointer">
                      {job.title}
                    </h2>
                    {job.verified && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        Verified Company
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <span className="font-medium text-gray-900">{job.company}</span>
                    <span>•</span>
                    <span className="text-sm font-mono">{job.companyWallet}</span>
                  </div>

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
                      <span className="font-medium text-gray-900">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </div>
                    <div className="text-gray-500">
                      {job.applicants} applicants
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
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
