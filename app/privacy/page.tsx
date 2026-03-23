// app/privacy/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-10">Last updated: March 23, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">1. Information We Collect</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              We collect information you provide directly when creating an account (email address, password), using our services (protocol inputs such as age, gender, goals, experience level), and making payments (transaction data processed by third-party payment providers).
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              We automatically collect usage data including pages visited, features used, device and browser information, and IP address for analytics and security purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">2. How We Use Your Information</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We use your information to provide and improve our services, generate personalized AI protocols based on your inputs, process payments, communicate with you about your account and updates, ensure platform security, and comply with legal obligations. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">3. AI-Generated Protocol Data</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Inputs you provide to our AI protocol generator (goals, age, gender, experience level, optional health data) are used solely to generate your requested protocol. This data is processed by our AI provider (Anthropic) and is subject to their data processing terms. We store your protocol history to provide access to past results. You may request deletion of your protocol history at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">4. Data Storage & Security</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your data is stored securely using Supabase infrastructure with encryption at rest and in transit. We implement industry-standard security measures including row-level security policies, encrypted connections, and secure authentication flows. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">5. Third-Party Services</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We use the following third-party services: Supabase (database and authentication), Anthropic (AI protocol generation), Coinbase Commerce / payment processors (payment processing), and Vercel (hosting). Each of these services has their own privacy policies governing the data they process.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">6. Your Rights</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You have the right to access your personal data, correct inaccurate data, request deletion of your data, export your data in a portable format, and withdraw consent for data processing. To exercise any of these rights, contact us at privacy@peptidrop.me.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">7. Cookies</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We use essential cookies for authentication and session management. We do not use advertising or tracking cookies. Analytics cookies may be used to understand platform usage patterns and are anonymized.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">8. Data Retention</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We retain your account data for as long as your account is active. Protocol history is retained until you request deletion. Payment records are retained as required by applicable tax and financial regulations. Upon account deletion, personal data is removed within 30 days, except where retention is legally required.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-accent-cyan mb-3">9. Contact</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For questions about this Privacy Policy or your personal data, contact us at privacy@peptidrop.me.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
