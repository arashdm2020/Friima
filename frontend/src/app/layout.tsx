import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FARIIMA - Decentralized Freelance Marketplace',
  description: 'Web3-native freelance platform with 5% fees, trustless escrow, and DAO governance',
  keywords: ['freelance', 'web3', 'blockchain', 'polygon', 'decentralized'],
  authors: [{ name: 'FARIIMA Team' }],
  openGraph: {
    title: 'FARIIMA - Decentralized Freelance Marketplace',
    description: 'The future of freelancing on blockchain',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
