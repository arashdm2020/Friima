'use client';

import { Clock, MapPin, DollarSign, Briefcase } from 'lucide-react';

const applications = [
  {
    id: 1,
    title: 'Senior Blockchain Developer',
    company: 'DeFi Protocol Inc.',
    companyWallet: '0x742d...A4B2',
    salary: '$120k - $180k/year',
    location: 'Remote',
    appliedDate: '2024-12-01',
    status: 'under_review' as const,
    stage: 'Technical Interview',
  },
  {
    id: 2,
    title: 'Lead Frontend Engineer (Web3)',
    company: 'NFT Marketplace',
    companyWallet: '0x8F3c...B1D8',
    salary: '$100k - $150k/year',
    location: 'Remote',
    appliedDate: '2024-11-28',
    status: 'shortlisted' as const,
    stage: 'Final Round',
  },
  {
    id: 3,
    title: 'Smart Contract Auditor',
    company: 'Security DAO',
    companyWallet: '0x1A2B...C3D4',
    salary: '$130k - $200k/year',
    location: 'Remote',
    appliedDate: '2024-11-25',
    status: 'rejected' as const,
    stage: 'Initial Screening',
  },
  {
    id: 4,
    title: 'Web3 Product Manager',
    company: 'Crypto Startup',
    companyWallet: '0x9E2F...D7A3',
    salary: '$110k - $160k/year',
    location: 'Hybrid (San Francisco)',
    appliedDate: '2024-11-20',
    status: 'applied' as const,
    stage: 'Application Submitted',
  },
];

const statusColors = {
  applied: 'bg-gray-100 text-gray-700',
  under_review: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels = {
  applied: 'Applied',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  rejected: 'Not Selected',
};

export default function MyFulltimeJobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Full-time Job Applications</h1>
          <p className="text-gray-600">Track your permanent position applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Applications</div>
            <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Under Review</div>
            <div className="text-3xl font-bold text-blue-600">
              {applications.filter(a => a.status === 'under_review').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Shortlisted</div>
            <div className="text-3xl font-bold text-green-600">
              {applications.filter(a => a.status === 'shortlisted').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Response Rate</div>
            <div className="text-3xl font-bold text-gray-900">75%</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Applications</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {applications.map((app) => (
              <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{app.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <span className="font-medium text-gray-900">{app.company}</span>
                      <span>•</span>
                      <span className="text-sm font-mono">{app.companyWallet}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-gray-900">{app.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {app.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Current Stage:</span>
                      <span className="text-sm font-medium text-gray-900">{app.stage}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-2 flex-1 rounded-full ${
                    app.status !== 'rejected' ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                  <div className={`h-2 flex-1 rounded-full ${
                    app.status === 'under_review' || app.status === 'shortlisted' ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                  <div className={`h-2 flex-1 rounded-full ${
                    app.status === 'shortlisted' ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                  {app.status !== 'rejected' && (
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Application Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Customize your profile for each application to highlight relevant skills</li>
            <li>• Showcase your Proof of Work NFTs to demonstrate experience</li>
            <li>• Stake FARI tokens to increase your visibility to employers</li>
            <li>• Follow up with companies after 1-2 weeks if you haven't heard back</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
