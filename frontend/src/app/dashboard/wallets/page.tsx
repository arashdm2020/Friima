'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Copy,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Coins,
  Plus
} from 'lucide-react';

export default function WalletsPage() {
  const { user, isAuthenticated } = useAuth();
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);

  useEffect(() => {
    if (user?.wallet_address) {
      setWalletAddress(user.wallet_address);
    }
  }, [user]);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectWallet = async () => {
    // اتصال wallet با MetaMask/WalletConnect
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setWalletAddress(address);
        // ذخیره address در profile کاربر
        // await api.updateProfile({ wallet_address: address });
        setShowConnectWallet(false);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const wallets = [
    {
      name: 'MATIC',
      symbol: 'MATIC',
      balance: '0',
      usdValue: '$0.00',
      change: '+0.00%',
      icon: '◈',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      balance: '0',
      usdValue: '$0.00',
      change: '0.00%',
      icon: '$',
    },
    {
      name: 'USDT',
      symbol: 'USDT',
      balance: '0',
      usdValue: '$0.00',
      change: '0.00%',
      icon: '₮',
    },
    {
      name: 'FARI Token',
      symbol: 'FARI',
      balance: '0',
      usdValue: '$0.00',
      change: '+0.00%',
      icon: '🔷',
    },
  ];

  const transactions = [
    {
      id: 1,
      type: 'received' as const,
      amount: '+2,500 USDC',
      from: '0x742d...A4B2',
      description: 'Payment for Smart Contract Development',
      date: '2024-12-05',
      status: 'completed' as const,
      hash: '0x123...abc',
    },
    {
      id: 2,
      type: 'sent' as const,
      amount: '-500 FARI',
      to: 'Staking Contract',
      description: 'Stake FARI for visibility boost',
      date: '2024-12-04',
      status: 'completed' as const,
      hash: '0x456...def',
    },
    {
      id: 3,
      type: 'received' as const,
      amount: '+3,800 USDT',
      from: '0x8F3c...B1D8',
      description: 'Payment for NFT Marketplace Frontend',
      date: '2024-12-03',
      status: 'completed' as const,
      hash: '0x789...ghi',
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="container py-24">
        <div className="max-w-md mx-auto text-center">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">
            Please login to view your wallet and transactions
          </p>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="container py-24">
        <div className="max-w-md mx-auto text-center">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">
            Connect your crypto wallet to manage your funds and transactions
          </p>
          <button 
            onClick={handleConnectWallet}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallets</h1>
          <p className="text-gray-600">Manage your crypto assets and transactions</p>
        </div>

        {/* Wallet Address Card */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Wallet Address</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={copyAddress}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={`https://polygonscan.com/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="font-mono text-xl mb-2 break-all">{walletAddress}</div>
          {copied && (
            <p className="text-sm text-primary-100">Address copied to clipboard!</p>
          )}
        </div>

        {/* Balances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {wallets.map((wallet) => (
            <div key={wallet.symbol} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{wallet.icon}</div>
                <span className={`text-sm font-medium ${
                  wallet.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {wallet.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{wallet.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {parseFloat(wallet.balance).toFixed(4)} {wallet.symbol}
              </p>
              <p className="text-sm text-gray-600">{wallet.usdValue}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Deposit</h3>
                <p className="text-sm text-gray-600">Add funds to wallet</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                <ArrowUpRight className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Withdraw</h3>
                <p className="text-sm text-gray-600">Transfer to external wallet</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                <Coins className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Stake FARI</h3>
                <p className="text-sm text-gray-600">Boost your visibility</p>
              </div>
            </div>
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </h2>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <div key={tx.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'received' 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}>
                      {tx.type === 'received' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tx.description}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{tx.type === 'received' ? 'From:' : 'To:'} {tx.from || tx.to}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      tx.type === 'received' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.amount}
                    </p>
                    <a
                      href={`https://polygonscan.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
