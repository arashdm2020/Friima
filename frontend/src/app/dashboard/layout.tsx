'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Clock,
  FolderKanban,
  Settings,
  Wallet,
  Crown,
  Users,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Browse Freelance Jobs', href: '/dashboard/browse-freelance', icon: Briefcase },
  { name: 'Browse Full-time Jobs', href: '/dashboard/browse-fulltime', icon: Clock },
  { name: 'My Gigs', href: '/dashboard/my-gigs', icon: FolderKanban },
  { name: 'My Freelance Jobs', href: '/dashboard/my-freelance-jobs', icon: Briefcase },
  { name: 'My Full-time Jobs', href: '/dashboard/my-fulltime-jobs', icon: Clock },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Wallets', href: '/dashboard/wallets', icon: Wallet },
  { name: 'Premium', href: '/dashboard/premium', icon: Crown },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-primary-600">
              FARIIMA
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-1">Boost Your Profile</h3>
              <p className="text-sm text-primary-100 mb-3">
                Stake FARI tokens to increase visibility
              </p>
              <Link
                href="/dashboard/premium"
                className="block w-full text-center bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="text-xl font-bold text-primary-600">
              FARIIMA
            </Link>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
