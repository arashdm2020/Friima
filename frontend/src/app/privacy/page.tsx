export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Account information (email, username, password)</li>
            <li>Profile information (name, bio, skills, portfolio)</li>
            <li>Wallet addresses (for blockchain transactions)</li>
            <li>Project and proposal data</li>
            <li>Communication data (messages, chat history)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Blockchain Transparency</h2>
          <p className="text-gray-700 mb-4">
            Please note that transactions on the blockchain are public and immutable. While we 
            don't display wallet addresses publicly on our platform, blockchain transactions are 
            visible to anyone with blockchain explorer access.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share your information only in the 
            following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>With your consent</li>
            <li>With service providers who assist in platform operations</li>
            <li>To comply with legal obligations</li>
            <li>To protect rights, property, or safety</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your 
            personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Password hashing and secure authentication</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to collect information about your 
            browsing activities. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your information for as long as necessary to provide our services and 
            comply with legal obligations. Blockchain data is permanent and cannot be deleted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            Our platform integrates with third-party services including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Blockchain networks (Polygon)</li>
            <li>IPFS for decentralized storage</li>
            <li>LinkedIn for authentication</li>
            <li>WalletConnect for wallet integration</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Your information may be transferred to and processed in countries other than your 
            country of residence. We ensure appropriate safeguards are in place.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our services are not directed to individuals under 18. We do not knowingly collect 
            personal information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy, please contact us through our 
            support channels.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t">
        <p className="text-sm text-gray-500">
          Last updated: December 7, 2025
        </p>
      </div>
    </div>
  );
}
