'use client';

import { MessageCircle, Book, HelpCircle, Mail, Send } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I connect my wallet?',
        a: 'Click the "Connect Wallet" button in the header and select your preferred wallet (MetaMask, WalletConnect, etc.). Make sure you\'re on the Polygon network.',
      },
      {
        q: 'What are the platform fees?',
        a: 'FARIIMA charges a flat 5% fee on completed projects, which is automatically deducted when funds are released from escrow. This is significantly lower than traditional platforms.',
      },
    ],
  },
  {
    category: 'Projects & Payments',
    questions: [
      {
        q: 'How does the escrow system work?',
        a: 'Clients deposit funds into a smart contract escrow. Funds are held securely on-chain until project completion. When you deliver work and the client approves, funds are automatically released to your wallet minus the 5% platform fee.',
      },
      {
        q: 'What happens if there\'s a dispute?',
        a: 'Either party can initiate a dispute. FARI token stakers vote as jurors to resolve the dispute based on submitted evidence. The majority vote determines fund distribution.',
      },
    ],
  },
  {
    category: 'FARI Token & Staking',
    questions: [
      {
        q: 'How do I stake FARI tokens?',
        a: 'Go to the Premium page and select a staking tier (Bronze, Silver, Gold, or Platinum). Connect your wallet and approve the transaction to stake your FARI tokens.',
      },
      {
        q: 'Can I unstake my FARI tokens?',
        a: 'Yes, you can unstake anytime. There\'s a 7-day cooldown period before tokens are returned to your wallet. Your benefits remain active during the cooldown.',
      },
    ],
  },
];

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help with FARIIMA platform</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <a
            href="#faq"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="rounded-full bg-primary-100 p-3 w-12 h-12 mb-4 group-hover:bg-primary-200 transition-colors">
              <HelpCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">FAQs</h3>
            <p className="text-sm text-gray-600">Find answers to common questions</p>
          </a>

          <a
            href="https://docs.fariima.io"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mb-4 group-hover:bg-blue-200 transition-colors">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Read our comprehensive guides</p>
          </a>

          <a
            href="https://discord.gg/fariima"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="rounded-full bg-purple-100 p-3 w-12 h-12 mb-4 group-hover:bg-purple-200 transition-colors">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-sm text-gray-600">Join our Discord server</p>
          </a>

          <a
            href="mailto:support@fariima.io"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="rounded-full bg-green-100 p-3 w-12 h-12 mb-4 group-hover:bg-green-200 transition-colors">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">Contact us directly</p>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <div id="faq" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                {faqs.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setActiveCategory(category.category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeCategory === category.category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {faqs
                  .find((cat) => cat.category === activeCategory)
                  ?.questions.map((faq, idx) => (
                    <div key={idx} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Send us a message and we'll get back to you soon.
              </p>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="What do you need help with?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Response Time:</strong> Usually within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-primary-100 mb-6">
              Connect with other freelancers and clients. Get help, share tips, and stay updated on platform news.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://discord.gg/fariima"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Join Discord
              </a>
              <a
                href="https://t.me/fariima"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Join Telegram
              </a>
              <a
                href="https://twitter.com/fariima"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Follow on Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
