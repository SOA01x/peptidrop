// app/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

function HeroSection() {
  return (
    <section className="relative min-h-[100vh] min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-accent-cyan/5 rounded-full blur-[80px] sm:blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-accent-violet/5 rounded-full blur-[80px] sm:blur-[120px]" />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-32 pb-16">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 glass-panel-light mb-6 sm:mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono text-text-secondary tracking-wider uppercase">AI-Powered Peptide Intelligence</span>
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 sm:mb-8">
          <span className="block">Precision</span>
          <span className="block text-gradient">Peptide</span>
          <span className="block">Protocols</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
          Clinical-grade AI analysis engine. Research 345+ peptides, map synergies,
          and generate personalized protocol stacks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <Link href="/generator" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
            Generate Protocol
          </Link>
          <Link href="/peptides" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
            Explore Peptides
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-sm sm:max-w-lg mx-auto">
          {[
            { value: '345+', label: 'Peptides' },
            { value: 'AI', label: 'Protocol Engine' },
            { value: '∞', label: 'Synergy Maps' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden sm:flex">
        <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent-cyan/50 to-transparent" />
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: '🧬', title: 'Peptide Database', description: 'Comprehensive database of 345+ peptides with mechanisms, receptors, pathways, and evidence levels.', accent: 'from-accent-cyan/20 to-transparent' },
    { icon: '🤖', title: 'AI Protocol Engine', description: 'Clinical decision-making AI that generates personalized stacks based on your goals, experience, and risk tolerance.', accent: 'from-accent-violet/20 to-transparent' },
    { icon: '🔗', title: 'Synergy Mapping', description: 'Real-time interaction analysis showing synergistic pairs, conflicts, and stack compatibility scores.', accent: 'from-accent-emerald/20 to-transparent' },
    { icon: '📊', title: 'Weekly Optimization', description: 'Progress tracking with AI adjustments, weekly updates, and new stack suggestions based on your results.', accent: 'from-accent-amber/20 to-transparent' },
    { icon: '🛡️', title: 'Risk Simulation', description: 'Run "what if" scenarios. Test different compounds and see risk/reward before committing to a protocol.', accent: 'from-accent-rose/20 to-transparent' },
    { icon: '📄', title: 'Clinical Reports', description: 'Export clinic-grade PDF protocols with full mechanism breakdowns, timelines, and practitioner-ready formatting.', accent: 'from-accent-cyan/20 to-transparent' },
  ]

  return (
    <section className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl mb-4">
            Not Another <span className="text-gradient">Peptide Wiki</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
            An intelligence platform built for protocol design, not surface-level information.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <div key={i} className="glass-panel p-6 sm:p-8 card-hover group">
              <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6`}>
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-accent-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingPreview() {
  return (
    <section className="py-20 sm:py-32 relative border-t border-surface-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl mb-4">
          Simple <span className="text-gradient">Pricing</span>
        </h2>
        <p className="text-text-secondary mb-12 max-w-lg mx-auto text-sm sm:text-base">
          Start free. Upgrade when you're ready for AI-powered protocols.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Free */}
          <div className="glass-panel p-6 sm:p-8 text-left">
            <h3 className="font-display font-bold text-lg mb-1">Explorer</h3>
            <div className="mb-4">
              <span className="text-3xl font-display font-bold">Free</span>
            </div>
            <p className="text-sm text-text-muted mb-6">Browse the full peptide database</p>
            <Link href="/signup" className="btn-secondary text-sm w-full">Get Started</Link>
          </div>

          {/* Pro */}
          <div className="glass-panel glow-border p-6 sm:p-8 text-left relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full text-xs font-display font-semibold text-surface">
              Most Popular
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Pro</h3>
            <div className="mb-4">
              <span className="text-3xl font-display font-bold text-gradient">$29</span>
              <span className="text-text-muted text-sm">/mo</span>
            </div>
            <p className="text-sm text-text-muted mb-6">AI protocols, tracking, optimization</p>
            <Link href="/signup" className="btn-primary text-sm w-full">Get Pro Access</Link>
          </div>

          {/* Clinical Reports */}
          <div className="glass-panel p-6 sm:p-8 text-left">
            <h3 className="font-display font-bold text-lg mb-1">Clinical Report</h3>
            <div className="mb-4">
              <span className="text-2xl font-display font-bold">$12.99</span>
              <span className="text-text-muted text-sm"> — $29.99</span>
            </div>
            <p className="text-sm text-text-muted mb-6">Clinic-grade PDF exports, per report</p>
            <Link href="/pricing" className="btn-secondary text-sm w-full">View Report Types</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="glass-panel glow-border p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
              Ready to Optimize?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm sm:text-base">
              Start exploring for free. Generate your first AI protocol when you're ready.
            </p>
            <Link href="/signup" className="btn-primary text-base px-10 py-4">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PricingPreview />
      <CTASection />
      <Footer />
    </main>
  )
}
