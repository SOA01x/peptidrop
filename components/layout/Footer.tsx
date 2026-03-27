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
                <g fill="#00E5FF">
                  <circle cx="100" cy="12" r="8"/><circle cx="119.6" cy="13.5" r="7.5"/><circle cx="138" cy="18.5" r="7.5"/>
                  <circle cx="154.5" cy="27" r="7"/><circle cx="168.5" cy="38.5" r="7"/><circle cx="179" cy="52.5" r="7"/>
                  <circle cx="186.5" cy="68.5" r="7"/><circle cx="190" cy="86" r="7.5"/><circle cx="189.5" cy="104" r="7.5"/>
                  <circle cx="185" cy="121.5" r="7.5"/><circle cx="177" cy="137.5" r="7.5"/><circle cx="166" cy="151.5" r="7.5"/>
                  <circle cx="152.5" cy="163" r="7.5"/><circle cx="137" cy="171.5" r="7.5"/><circle cx="120" cy="177" r="8"/>
                  <circle cx="100" cy="179" r="8.5"/><circle cx="80" cy="177" r="8"/><circle cx="63" cy="171.5" r="7.5"/>
                  <circle cx="47.5" cy="163" r="7.5"/><circle cx="34" cy="151.5" r="7.5"/><circle cx="23" cy="137.5" r="7.5"/>
                  <circle cx="15" cy="121.5" r="7.5"/><circle cx="10.5" cy="104" r="7.5"/><circle cx="10" cy="86" r="7.5"/>
                  <circle cx="13.5" cy="68.5" r="7"/><circle cx="21" cy="52.5" r="7"/><circle cx="31.5" cy="38.5" r="7"/>
                  <circle cx="45.5" cy="27" r="7"/><circle cx="62" cy="18.5" r="7.5"/><circle cx="80.4" cy="13.5" r="7.5"/>
                </g>
                <circle cx="100" cy="100" r="52" fill="none" stroke="#00E5FF" strokeWidth="12"/>
                <circle cx="100" cy="100" r="6" fill="#00E5FF"/>
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
