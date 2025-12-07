'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Clock, MapPin, Star, Award, MessageCircle, FileText, Send } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [proposalText, setProposalText] = useState('');
  const [proposalBudget, setProposalBudget] = useState('');
  const [proposalDuration, setProposalDuration] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);

  // Mock data - باید از API بیاد
  const job = {
    id: params.id,
    title: 'NFT Marketplace Development',
    description: 'Build a full-featured NFT marketplace on Polygon with minting, trading, and auction functionality.',
    longDescription: `We are looking for an experienced blockchain developer to build a comprehensive NFT marketplace on the Polygon network. 

Key Requirements:
- Smart contract development for NFT minting, trading, and auctions
- Integration with IPFS for decentralized metadata storage
- React-based frontend with Web3 wallet integration
- Backend API for indexing and caching blockchain data
- Admin panel for platform management

The ideal candidate should have:
- 2+ years of Solidity development experience
- Strong understanding of ERC-721 and ERC-1155 standards
- Experience with OpenZeppelin contracts
- Familiarity with Polygon/MATIC network
- Portfolio of previous NFT/DeFi projects

This is a great opportunity to work on a high-impact project in the Web3 space.`,
    budget: '$5,000 - $10,000',
    duration: '2-3 months',
    skills: ['Solidity', 'React', 'Web3.js', 'IPFS', 'Node.js'],
    clientName: 'CryptoArt Studio',
    clientRating: 4.9,
    clientJobs: 12,
    verified: true,
    posted: '2 hours ago',
    proposals: 8,
    category: 'Blockchain Development',
    experienceLevel: 'Expert',
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    // ارسال proposal به API
    console.log('Submitting proposal:', { proposalText, proposalBudget, proposalDuration });
    alert('Proposal submitted successfully!');
    router.push('/dashboard/my-freelance-jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <Link
          href="/find-work"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  {job.verified && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Verified Client
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Posted {job.posted}</span>
                  <span>•</span>
                  <span>{job.proposals} proposals</span>
                  <span>•</span>
                  <span className="text-primary-600 font-medium">{job.category}</span>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Budget</span>
                  </div>
                  <div className="font-bold text-gray-900">{job.budget}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <div className="font-bold text-gray-900">{job.duration}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <div className="font-bold text-gray-900">Remote</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Level</span>
                  </div>
                  <div className="font-bold text-gray-900">{job.experienceLevel}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{job.longDescription}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proposal Form */}
              {showProposalForm && (
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Your Proposal</h2>
                  <form onSubmit={handleSubmitProposal} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter *
                      </label>
                      <textarea
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        rows={8}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Explain why you're the best fit for this project..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Bid *
                        </label>
                        <input
                          type="text"
                          value={proposalBudget}
                          onChange={(e) => setProposalBudget(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="$5,000"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Time *
                        </label>
                        <input
                          type="text"
                          value={proposalDuration}
                          onChange={(e) => setProposalDuration(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="2 months"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        <Send className="inline h-5 w-5 mr-2" />
                        Submit Proposal
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProposalForm(false)}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setShowProposalForm(!showProposalForm)}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors mb-3"
              >
                {showProposalForm ? 'Hide Form' : 'Submit Proposal'}
              </button>
              <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Save for Later
              </button>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Client</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {job.clientName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{job.clientName}</div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{job.clientRating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jobs Posted</span>
                  <span className="font-semibold text-gray-900">{job.clientJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hire Rate</span>
                  <span className="font-semibold text-gray-900">75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">Jan 2024</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact Client
              </button>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Tips for Success</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Personalize your proposal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Showcase relevant portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Be realistic with timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Ask clarifying questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
