// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-surface-border/50 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 64 64" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" aria-label="Peptidrop logo">
                <defs>
                  <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF"/><stop offset="100%" stopColor="#7A5CFF"/>
                  </linearGradient>
                </defs>
                <path d="M32 4 C32 4, 8 30, 8 42 C8 55.2 18.8 62 32 62 C45.2 62 56 55.2 56 42 C56 30 32 4 32 4Z" fill="url(#fg)" opacity="0.9"/>
                <path d="M32 8 C32 8, 12 31, 12 42 C12 53 20.9 58 32 58 C43.1 58 52 53 52 42 C52 31 32 8 32 8Z" fill="#0A0A0F"/>
                <text x="25" y="49" fontFamily="Arial" fontWeight="800" fontSize="30" fill="#00E5FF">P</text>
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
