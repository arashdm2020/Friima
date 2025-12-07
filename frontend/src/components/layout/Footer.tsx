import Link from 'next/link';
import { Github, Twitter, MessageCircle, Coins } from 'lucide-react';

const navigation = {
  platform: [
    { name: 'Find Work', href: '/find-work' },
    { name: 'Find Talent', href: '/find-talent' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
  ],
  governance: [
    { name: 'Tokenomics', href: '/tokenomics' },
    { name: 'DAO Voting', href: '/dao' },
    { name: 'Disputes', href: '/dao/disputes' },
    { name: 'Proposals', href: '/dao/proposals' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Smart Contracts', href: '/contracts' },
    { name: 'Security', href: '/security' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],
};

const social = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/fariima',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/fariima',
    icon: Github,
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/fariima',
    icon: MessageCircle,
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold gradient-text">FARIIMA</span>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              The future of freelancing. Decentralized, transparent, and fair.
            </p>
            <div className="flex space-x-6">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Platform</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.platform.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Governance</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.governance.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} FARIIMA. Decentralized and open-source. Built on Polygon.
          </p>
        </div>
      </div>
    </footer>
  );
}
