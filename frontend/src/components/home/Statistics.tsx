'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Award, Users } from 'lucide-react';
import { api } from '@/lib/api';

interface PlatformStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_users: number;
  total_freelancers: number;
  total_clients: number;
  total_value_locked: number;
  dispute_rate: number;
}

export function Statistics() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getPlatformStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  if (loading) {
    return (
      <div className="bg-white py-16 sm:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-hover animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayStats = [
    {
      name: 'Total Value Locked',
      value: stats ? formatCurrency(stats.total_value_locked) : '$0',
      icon: DollarSign,
      color: 'primary',
    },
    {
      name: 'Active Users',
      value: stats ? formatNumber(stats.total_users) : '0',
      icon: Users,
      color: 'secondary',
    },
    {
      name: 'Projects Completed',
      value: stats ? formatNumber(stats.completed_projects) : '0',
      icon: Award,
      color: 'accent',
    },
    {
      name: 'Success Rate',
      value: stats ? `${(100 - stats.dispute_rate).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'success',
    },
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Platform Statistics
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real-time metrics from the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((stat) => (
            <div key={stat.name} className="card-hover">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-600 mb-2">
                    {stat.name}
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </dd>
                </div>
                <div className={`rounded-full bg-${stat.color}-100 p-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {stats && stats.active_projects > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-primary-600">{stats.active_projects}</span> active projects •{' '}
              <span className="font-semibold text-secondary-600">{stats.total_freelancers}</span> freelancers •{' '}
              <span className="font-semibold text-accent-600">{stats.total_clients}</span> clients
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
