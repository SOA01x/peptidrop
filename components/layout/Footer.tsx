// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-surface-border/50 bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan to-accent-violet rounded-lg" />
                <div className="absolute inset-[2px] bg-surface rounded-[6px] flex items-center justify-center">
                  <span className="text-accent-cyan font-display font-bold text-sm">P</span>
                </div>
              </div>
              <span className="font-display font-bold text-lg">Peptidrop</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              AI-powered peptide intelligence platform for research and education.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Platform</h4>
            <div className="space-y-3">
              <Link href="/peptides" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Peptide Explorer</Link>
              <Link href="/generator" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">AI Generator</Link>
              <Link href="/dashboard" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Legal</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Terms of Service</Link>
              <Link href="#" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Privacy Policy</Link>
              <Link href="#" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Disclaimer</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Support</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Documentation</Link>
              <Link href="#" className="block text-sm text-text-muted hover:text-accent-cyan transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            © 2026 Peptidrop. All rights reserved. For educational and research purposes only.
          </p>
          <p className="text-xs text-text-muted">
            Not medical advice. Consult a healthcare professional.
          </p>
        </div>
      </div>
    </footer>
  )
}
