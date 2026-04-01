// app/contact/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">Contact</h1>
        <p className="text-text-secondary mb-10 text-sm sm:text-base">
          Questions, feedback, or partnership inquiries - we'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Info */}
          <div className="glass-panel p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg viewBox="0 0 200 200" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#e8c547" strokeWidth="4" strokeDasharray="8 8" />
                <circle cx="100" cy="100" r="58" fill="none" stroke="#e8c547" strokeWidth="10" />
                <circle cx="100" cy="100" r="12" fill="#e8c547" />
              </svg>
              <div>
                <h2 className="font-display font-bold text-lg">Peptidrop</h2>
                <p className="text-text-muted text-xs">AI Peptide Intelligence Platform</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider mb-1">Made by</p>
                <p className="text-text-primary font-display font-semibold text-lg">Usensium Inc.</p>
              </div>

              <div>
                <p className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:contact@peptidrop.me" className="text-accent-cyan hover:underline text-base font-mono">
                  contact@peptidrop.me
                </a>
              </div>

              <div>
                <p className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider mb-1">Website</p>
                <a href="https://peptidrop.me" className="text-accent-cyan hover:underline text-sm font-mono">
                  peptidrop.me
                </a>
              </div>
            </div>
          </div>

          {/* What to Contact About */}
          <div className="glass-panel p-6 sm:p-8">
            <h3 className="font-display font-semibold text-lg mb-4">We Can Help With</h3>
            <div className="space-y-4">
              {[
                { icon: '🤝', title: 'Business & Partnerships', desc: 'Integration opportunities, affiliate programs, and collaborations.' },
                { icon: '🐛', title: 'Bug Reports', desc: 'Found something broken? Let us know and we\'ll fix it.' },
                { icon: '💡', title: 'Feature Requests', desc: 'Ideas for new peptides, features, or improvements.' },
                { icon: '⚖️', title: 'Legal Inquiries', desc: 'Questions about our terms, privacy, or data handling.' },
                { icon: '💳', title: 'Billing Support', desc: 'Issues with payments, subscriptions, or reports.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-display font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 glass-panel p-5 sm:p-6 text-center">
          <p className="text-text-secondary text-sm">
            We typically respond within 24-48 hours. For urgent matters, include <span className="text-accent-cyan font-mono">[URGENT]</span> in your subject line.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
