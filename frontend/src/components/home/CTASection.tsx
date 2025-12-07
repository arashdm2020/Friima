import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';

export function CTASection() {
  return (
    <div className="bg-primary-600">
      <div className="container py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to join the revolution?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
            Start freelancing or hiring on the world's first truly decentralized marketplace. 
            Connect your wallet and get started in minutes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
            <Link
              href="/docs"
              className="text-sm font-semibold leading-6 text-white hover:text-primary-100 transition-colors"
            >
              Read Docs <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-x-8 text-sm text-primary-100">
            <div className="flex items-center gap-x-2">
              <Github className="h-5 w-5" />
              <a
                href="https://github.com/fariima"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Open Source
              </a>
            </div>
            <div className="h-4 w-px bg-primary-400" />
            <div>Audited by CertiK</div>
            <div className="h-4 w-px bg-primary-400" />
            <div>MIT License</div>
          </div>
        </div>
      </div>
    </div>
  );
}
