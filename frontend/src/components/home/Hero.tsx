'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="container py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-primary-700">
            <Zap className="mr-2 h-4 w-4" />
            Only 5% Platform Fee • Powered by Polygon
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            The Future of{' '}
            <span className="gradient-text">Freelancing</span>
            {' '}is Here
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            FARIIMA is the first truly decentralized freelance marketplace. 
            Trustless escrow, transparent disputes, and 5% fees. 
            No middlemen, just pure peer-to-peer collaboration on the blockchain.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/find-work"
              className="wallet-connect-btn"
            >
              Find Work
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
            <Link
              href="/find-talent"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
            >
              Hire Talent <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-3 mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trustless Escrow</h3>
              <p className="mt-2 text-sm text-gray-600">
                Smart contracts hold funds securely until work is delivered
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-3 mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">DAO Governance</h3>
              <p className="mt-2 text-sm text-gray-600">
                Community-driven dispute resolution and platform decisions
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-3 mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">5% Fee Only</h3>
              <p className="mt-2 text-sm text-gray-600">
                Half the cost of traditional platforms, transparent on-chain
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-accent-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}
