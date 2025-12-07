export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using FARIIMA platform, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use FARIIMA platform for personal, non-commercial 
            transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect intellectual property rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Freelancer Terms</h2>
          <p className="text-gray-700 mb-4">
            Freelancers agree to deliver work as specified in project agreements and maintain 
            professional standards throughout engagements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Client Terms</h2>
          <p className="text-gray-700 mb-4">
            Clients agree to provide clear project requirements and release payments upon 
            satisfactory completion of agreed deliverables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Payment & Escrow</h2>
          <p className="text-gray-700 mb-4">
            All payments are processed through blockchain smart contracts. Funds are held in 
            escrow until project completion and mutual agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Dispute Resolution</h2>
          <p className="text-gray-700 mb-4">
            Disputes are resolved through our DAO voting mechanism. Community members vote to 
            determine fair outcomes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All intellectual property created through the platform belongs to the client upon 
            full payment, unless otherwise specified in the project agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            FARIIMA is not liable for any indirect, incidental, special, or consequential damages 
            arising from your use of the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Continued use of the platform 
            constitutes acceptance of modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
          <p className="text-gray-700 mb-4">
            For questions about these Terms, please contact us through our support channels.
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
