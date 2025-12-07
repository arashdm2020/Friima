'use client';

import { useState } from 'react';
import { Search, Filter, Star, Award, Code, Palette, Shield } from 'lucide-react';

const freelancers = [
  {
    id: 1,
    name: 'Alex Chen',
    wallet: '0x742d...A4B2',
    title: 'Senior Blockchain Developer',
    bio: 'Full-stack blockchain developer with 5+ years experience in Solidity, DeFi protocols, and Web3 applications.',
    hourlyRate: '$80-120/hr',
    rating: 4.9,
    jobsCompleted: 47,
    skills: ['Solidity', 'Smart Contracts', 'Web3.js', 'React', 'Node.js', 'DeFi'],
    verified: true,
    availability: 'Available Now',
    nfts: 12,
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    wallet: '0x8F3c...B1D8',
    title: 'Smart Contract Auditor',
    bio: 'Security expert specializing in smart contract audits and vulnerability assessments for DeFi protocols.',
    hourlyRate: '$100-150/hr',
    rating: 5.0,
    jobsCompleted: 34,
    skills: ['Security Auditing', 'Solidity', 'DeFi', 'Penetration Testing'],
    verified: true,
    availability: 'Available in 2 weeks',
    nfts: 8,
  },
  {
    id: 3,
    name: 'David Kumar',
    wallet: '0x1A2B...C3D4',
    title: 'Web3 Frontend Developer',
    bio: 'Creative frontend developer building beautiful and intuitive Web3 user interfaces with modern frameworks.',
    hourlyRate: '$60-90/hr',
    rating: 4.8,
    jobsCompleted: 56,
    skills: ['React', 'TypeScript', 'Ethers.js', 'TailwindCSS', 'UI/UX'],
    verified: true,
    availability: 'Available Now',
    nfts: 15,
  },
  {
    id: 4,
    name: 'Maria Garcia',
    wallet: '0x9E2F...D7A3',
    title: 'NFT Platform Developer',
    bio: 'Specialized in building NFT marketplaces, minting platforms, and generative art projects.',
    hourlyRate: '$70-100/hr',
    rating: 4.7,
    jobsCompleted: 28,
    skills: ['Solidity', 'IPFS', 'NFT', 'React', 'Smart Contracts'],
    verified: false,
    availability: 'Available Now',
    nfts: 22,
  },
];

export default function FindTalentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Top Web3 Talent</h1>
          <p className="text-xl text-purple-100 mb-8">Hire verified blockchain developers and experts worldwide</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for skills, expertise, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Search Talent
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>Any Rate</option>
                    <option>$0-50/hr</option>
                    <option>$50-100/hr</option>
                    <option>$100-150/hr</option>
                    <option>$150+/hr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>All Levels</option>
                    <option>Entry Level</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>All</option>
                    <option>Available Now</option>
                    <option>Available in 1 week</option>
                    <option>Available in 2 weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900">
                    <option>All Freelancers</option>
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
            <span className="font-semibold text-gray-900">{freelancers.length} freelancers</span> available
          </p>
          <select className="border border-gray-300 rounded-lg px-4 py-2">
            <option>Best Match</option>
            <option>Highest Rating</option>
            <option>Most Jobs Completed</option>
            <option>Lowest Rate</option>
          </select>
        </div>

        {/* Freelancer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {freelancer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{freelancer.name}</h3>
                    {freelancer.verified && (
                      <Award className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-primary-600 font-medium mb-1">{freelancer.title}</p>
                  <p className="text-sm text-gray-500 font-mono">{freelancer.wallet}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{freelancer.bio}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-gray-900">{freelancer.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{freelancer.jobsCompleted} jobs completed</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Award className="h-4 w-4 text-primary-600" />
                    <span className="font-bold text-gray-900">{freelancer.nfts}</span>
                  </div>
                  <p className="text-sm text-gray-600">Proof of Work NFTs</p>
                </div>
              </div>

              {/* Rate & Availability */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{freelancer.hourlyRate}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    freelancer.availability === 'Available Now'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {freelancer.availability}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Hire Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Load More Freelancers
          </button>
        </div>
      </div>
    </div>
  );
}
