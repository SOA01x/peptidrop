// app/docs/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">Documentation</h1>
        <p className="text-text-secondary mb-10 text-sm sm:text-base">
          Everything you need to know about Peptidrop — how it works, important disclaimers, and legal information.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link href="/disclaimer" className="glass-panel p-5 card-hover group text-center">
            <span className="text-2xl block mb-2">⚠️</span>
            <h3 className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Disclaimer</h3>
            <p className="text-xs text-text-muted mt-1">Educational purpose statement</p>
          </Link>
          <Link href="/terms" className="glass-panel p-5 card-hover group text-center">
            <span className="text-2xl block mb-2">📋</span>
            <h3 className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Terms of Service</h3>
            <p className="text-xs text-text-muted mt-1">Platform usage terms</p>
          </Link>
          <Link href="/privacy" className="glass-panel p-5 card-hover group text-center">
            <span className="text-2xl block mb-2">🔒</span>
            <h3 className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Privacy Policy</h3>
            <p className="text-xs text-text-muted mt-1">How we handle your data</p>
          </Link>
        </div>

        {/* Important Disclaimer Banner */}
        <div className="glass-panel p-6 sm:p-8 border-accent-amber/30 mb-10">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h2 className="font-display font-bold text-lg text-accent-amber mb-2">Important: Educational Use Only</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Peptidrop is an AI-powered educational platform. All information — including peptide data, protocol suggestions,
                dosing references, and AI-generated content — is provided strictly for educational and research purposes.
                Nothing on this platform constitutes medical advice, diagnosis, or treatment recommendations.
                Always consult a qualified healthcare professional before making any health-related decisions.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-accent-cyan mb-6">How Peptidrop Works</h2>

          <div className="space-y-6">
            <div className="glass-panel p-5 sm:p-6">
              <h3 className="font-display font-semibold text-base mb-2">Peptide Explorer</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our database contains 345+ peptides with detailed information on mechanisms of action, target receptors,
                pathways, effects, half-life, risk profiles, and evidence levels. All data is sourced from published research
                literature. You can filter by category, risk level, and search for specific compounds. The explorer is free
                for all users.
              </p>
            </div>

            <div className="glass-panel p-5 sm:p-6">
              <h3 className="font-display font-semibold text-base mb-2">AI Protocol Generator</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our AI engine (powered by Claude) cross-references the entire peptide database against your input parameters
                (goal, age, gender, experience level, risk tolerance, and optional health data) to generate personalized protocol
                suggestions. The AI considers synergistic interactions, contraindications, timeline optimization, and risk profiling.
                This feature requires a Pro subscription.
              </p>
            </div>

            <div className="glass-panel p-5 sm:p-6">
              <h3 className="font-display font-semibold text-base mb-2">Stack Builder Pro</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                An interactive visual tool where you can drag and drop peptides onto a canvas to build custom stacks.
                The system calculates real-time synergy scores, detects conflicts and redundancies, and provides a
                risk assessment. Connections between nodes show synergistic or conflicting relationships. Pro feature.
              </p>
            </div>

            <div className="glass-panel p-5 sm:p-6">
              <h3 className="font-display font-semibold text-base mb-2">Clinical Reports</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Professional PDF exports that present your protocol in a clinical format suitable for sharing with
                healthcare practitioners. Reports include full mechanism breakdowns, weekly timelines, risk discussions,
                alternative stacks, and monitoring recommendations. Available as one-time purchases ($19-29 per report).
              </p>
            </div>
          </div>
        </section>

        {/* AI Limitations */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-accent-cyan mb-6">AI Limitations & Accuracy</h2>
          <div className="glass-panel p-5 sm:p-6">
            <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
              <p>
                Our AI protocol generator produces algorithmic outputs based on its training data and the peptide database.
                While the system is designed to provide well-reasoned suggestions, it has important limitations:
              </p>
              <p>
                <strong className="text-text-primary">The AI does not know your full medical history.</strong> It operates only on the parameters you provide.
                It cannot account for medications you're taking, pre-existing conditions, allergies, genetic factors, or
                other critical health variables.
              </p>
              <p>
                <strong className="text-text-primary">AI outputs may contain errors.</strong> The system may occasionally suggest combinations that
                are suboptimal, provide inaccurate mechanism descriptions, or miss important contraindications.
                Always verify AI-generated content with qualified sources.
              </p>
              <p>
                <strong className="text-text-primary">Research is evolving.</strong> Peptide science is an active research area. New findings may
                contradict previously accepted information. Our database is regularly updated but may not reflect
                the very latest research.
              </p>
            </div>
          </div>
        </section>

        {/* Payment & Billing */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-accent-cyan mb-6">Payments & Billing</h2>
          <div className="glass-panel p-5 sm:p-6">
            <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
              <p>
                Peptidrop uses <strong className="text-text-primary">NOWPayments</strong> for cryptocurrency payment processing.
                We accept USDC, USDT, BTC, ETH, SOL, and 300+ other cryptocurrencies.
              </p>
              <p>
                <strong className="text-text-primary">Researcher subscription ($19/month):</strong> Unlocks the AI protocol generator,
                save and revisit protocols, progress tracking, and progress journal. Access activates immediately upon confirmed payment.
              </p>
              <p>
                <strong className="text-text-primary">Pro subscription ($49/month):</strong> Everything in Researcher plus clinical-grade PDF reports (unlimited),
                Stack Builder Pro, AI coaching, advanced synergy analysis, risk simulation engine, and priority support.
              </p>
              <p>
                For billing issues, contact <a href="mailto:usensium@gmail.com" className="text-accent-cyan hover:underline">usensium@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="glass-panel p-5 sm:p-6 text-center">
            <p className="text-text-secondary text-sm mb-3">Have questions not covered here?</p>
            <Link href="/contact" className="btn-primary text-sm !py-2.5 inline-flex">Contact Us</Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
