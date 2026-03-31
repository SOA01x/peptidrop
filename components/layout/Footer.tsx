// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-surface-border/50 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" aria-label="Peptidrop logo">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#e8c547" strokeWidth="4" strokeDasharray="8 8" />
                <circle cx="100" cy="100" r="58" fill="none" stroke="#e8c547" strokeWidth="10" />
                <circle cx="100" cy="100" r="12" fill="#e8c547" />
              </svg>
              <span className="font-display font-bold text-lg">Peptidrop</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-3">
              The leading AI-powered peptide research and intelligence platform. Explore 345+ peptides, generate personalized protocols, and map synergies with clinical-grade AI analysis.
            </p>
            <p className="text-text-muted text-xs">
              Made by <span className="text-text-secondary">Usensium Inc.</span>
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Platform</h4>
            <nav aria-label="Platform links">
              <div className="space-y-3">
                <Link href="/peptides" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Peptide Database</Link>
                <Link href="/generator" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">AI Protocol Generator</Link>
                <Link href="/dashboard" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Dashboard</Link>
                <Link href="/pricing" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Pricing</Link>
                <Link href="/blog" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Read This (Blog)</Link>
              </div>
            </nav>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Legal</h4>
            <nav aria-label="Legal links">
              <div className="space-y-3">
                <Link href="/terms" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Privacy Policy</Link>
                <Link href="/docs" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Documentation</Link>
              </div>
            </nav>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Support</h4>
            <nav aria-label="Support links">
              <div className="space-y-3">
                <Link href="/contact" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Contact</Link>
                <Link href="/disclaimer" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Disclaimer</Link>
              </div>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted text-center sm:text-left">
            © 2026 Peptidrop by Usensium Inc. All rights reserved. For educational and research purposes only.
          </p>
          <p className="text-xs text-text-muted text-center sm:text-right">
            Not medical advice. Consult a healthcare professional before starting any peptide protocol.
          </p>
        </div>
      </div>
    </footer>
  )
}
