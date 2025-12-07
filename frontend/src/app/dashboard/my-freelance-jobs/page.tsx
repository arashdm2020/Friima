'use client';

import { useState } from 'react';
import { Clock, DollarSign, MessageCircle, Upload, CheckCircle } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Smart Contract Development',
    client: '0x742d...A4B2',
    amount: '$3,500',
    status: 'in_progress' as const,
    progress: 65,
    deadline: '2024-12-15',
    description: 'Build and deploy escrow smart contract on Polygon',
    milestones: [
      { name: 'Contract Design', completed: true },
      { name: 'Development', completed: true },
      { name: 'Testing', completed: false },
      { name: 'Deployment', completed: false },
    ],
  },
  {
    id: 2,
    title: 'NFT Marketplace Frontend',
    client: '0x8F3c...B1D8',
    amount: '$5,200',
    status: 'in_progress' as const,
    progress: 40,
    deadline: '2024-12-20',
    description: 'Build responsive NFT marketplace UI with Web3 integration',
    milestones: [
      { name: 'UI Design Review', completed: true },
      { name: 'Component Development', completed: false },
      { name: 'Web3 Integration', completed: false },
      { name: 'Testing', completed: false },
    ],
  },
  {
    id: 3,
    title: 'DeFi Protocol Audit',
    client: '0x1A2B...C3D4',
    amount: '$8,000',
    status: 'pending_approval' as const,
    progress: 100,
    deadline: '2024-12-10',
    description: 'Security audit for lending protocol smart contracts',
    milestones: [
      { name: 'Contract Analysis', completed: true },
      { name: 'Vulnerability Testing', completed: true },
      { name: 'Report Generation', completed: true },
      { name: 'Final Review', completed: true },
    ],
  },
  {
    id: 4,
    title: 'Token Economics Consultation',
    client: '0x9E2F...D7A3',
    amount: '$2,800',
    status: 'completed' as const,
    progress: 100,
    deadline: '2024-11-30',
    description: 'Design tokenomics model for new DeFi protocol',
    milestones: [
      { name: 'Research', completed: true },
      { name: 'Model Design', completed: true },
      { name: 'Documentation', completed: true },
      { name: 'Presentation', completed: true },
    ],
  },
];

export default function MyFreelanceJobsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');

  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const pendingProjects = projects.filter(p => p.status === 'pending_approval');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const getTabProjects = () => {
    switch (activeTab) {
      case 'active':
        return activeProjects;
      case 'pending':
        return pendingProjects;
      case 'completed':
        return completedProjects;
      default:
        return [];
    }
  };

  const statusColors = {
    in_progress: 'bg-blue-100 text-blue-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  };

  const statusLabels = {
    in_progress: 'In Progress',
    pending_approval: 'Pending Approval',
    completed: 'Completed',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Freelance Jobs</h1>
          <p className="text-gray-600">Track and manage your ongoing projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Active Projects</div>
            <div className="text-3xl font-bold text-gray-900">{activeProjects.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Pending Approval</div>
            <div className="text-3xl font-bold text-gray-900">{pendingProjects.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-gray-900">{completedProjects.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Earned</div>
            <div className="text-3xl font-bold text-gray-900">$19,500</div>
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
                Active ({activeProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Approval ({pendingProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Completed ({completedProjects.length})
              </button>
            </div>
          </div>

          {/* Project list */}
          <div className="divide-y divide-gray-200">
            {getTabProjects().map((project) => (
              <div key={project.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div>Client: <span className="font-mono">{project.client}</span></div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold text-gray-900">{project.amount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Progress */}
                    {project.status === 'in_progress' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Progress</span>
                          <span className="text-gray-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {project.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            milestone.completed ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          {milestone.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-xs ${milestone.completed ? 'text-green-700' : 'text-gray-600'}`}>
                            {milestone.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message Client
                  </button>
                  {project.status === 'in_progress' && (
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Submit Work
                    </button>
                  )}
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {getTabProjects().length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-600">
                  No {activeTab} projects at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
