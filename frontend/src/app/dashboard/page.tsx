'use client';

import { useAccount } from 'wagmi';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="container py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">
            Please connect your wallet to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Active Projects',
      value: '3',
      icon: Briefcase,
      change: '+2 this week',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Earned',
      value: '$12,450',
      icon: DollarSign,
      change: '+$2,300 this month',
      changeType: 'positive' as const,
    },
    {
      name: 'Completed Jobs',
      value: '28',
      icon: CheckCircle,
      change: '100% success rate',
      changeType: 'positive' as const,
    },
    {
      name: 'Profile Views',
      value: '1,247',
      icon: Eye,
      change: '+15% this week',
      changeType: 'positive' as const,
    },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Smart Contract Development',
      client: '0x742d...A4B2',
      amount: '$3,500',
      status: 'in_progress' as const,
      deadline: '2024-12-15',
    },
    {
      id: 2,
      title: 'NFT Marketplace Frontend',
      client: '0x8F3c...B1D8',
      amount: '$5,200',
      status: 'in_progress' as const,
      deadline: '2024-12-20',
    },
    {
      id: 3,
      title: 'DeFi Protocol Audit',
      client: '0x1A2B...C3D4',
      amount: '$8,000',
      status: 'pending_approval' as const,
      deadline: '2024-12-10',
    },
  ];

  const statusColors = {
    in_progress: 'bg-blue-100 text-blue-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    disputed: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    in_progress: 'In Progress',
    pending_approval: 'Pending Approval',
    completed: 'Completed',
    disputed: 'Disputed',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-primary-100 p-3">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              <Link
                href="/dashboard/my-freelance-jobs"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProjects.map((project) => (
              <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Client: {project.client}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-900">
                      {project.amount}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                      {statusLabels[project.status]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/browse-freelance" className="card-hover text-center p-8 group">
            <div className="rounded-full bg-primary-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <Briefcase className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Jobs</h3>
            <p className="text-sm text-gray-600">Find new projects to work on</p>
          </Link>

          <Link href="/dashboard/wallets" className="card-hover text-center p-8 group">
            <div className="rounded-full bg-green-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Wallets</h3>
            <p className="text-sm text-gray-600">View balances and transactions</p>
          </Link>

          <Link href="/dashboard/settings" className="card-hover text-center p-8 group">
            <div className="rounded-full bg-purple-100 p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Profile</h3>
            <p className="text-sm text-gray-600">Update skills and portfolio</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
