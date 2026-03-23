// app/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/5 rounded-full blur-[120px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel-light mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-xs font-mono text-text-secondary tracking-wider uppercase">AI-Powered Peptide Intelligence</span>
        </div>

        {/* Heading */}
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
          <span className="block">Precision</span>
          <span className="block text-gradient">Peptide</span>
          <span className="block">Protocols</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          Clinical-grade AI analysis engine. Research 345+ peptides, map synergies,
          and generate personalized protocol stacks — built for the serious researcher.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/generator" className="btn-primary text-base px-8 py-4">
            Generate Protocol
          </Link>
          <Link href="/peptides" className="btn-secondary text-base px-8 py-4">
            Explore Peptides
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: '345+', label: 'Peptides' },
            { value: 'AI', label: 'Protocol Engine' },
            { value: '∞', label: 'Synergy Maps' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent-cyan/50 to-transparent" />
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: '🧬',
      title: 'Peptide Database',
      description: 'Comprehensive database of 345+ peptides with mechanisms, receptors, pathways, and evidence levels.',
      accent: 'from-accent-cyan/20 to-transparent',
    },
    {
      icon: '🤖',
      title: 'AI Protocol Engine',
      description: 'Clinical decision-making AI that generates personalized stacks based on your goals, experience, and risk tolerance.',
      accent: 'from-accent-violet/20 to-transparent',
    },
    {
      icon: '🔗',
      title: 'Synergy Mapping',
      description: 'Real-time interaction analysis showing synergistic pairs, conflicts, and stack compatibility scores.',
      accent: 'from-accent-emerald/20 to-transparent',
    },
    {
      icon: '📊',
      title: 'Timeline Intelligence',
      description: 'Week-by-week protocol progression with adaptation logic and plateau-breaking strategies.',
      accent: 'from-accent-amber/20 to-transparent',
    },
    {
      icon: '🛡️',
      title: 'Risk Profiling',
      description: 'Multi-dimensional risk analysis including side effects, suppression risks, and monitoring recommendations.',
      accent: 'from-accent-rose/20 to-transparent',
    },
    {
      icon: '📄',
      title: 'PDF Reports',
      description: 'Export clinical-grade protocol reports with full explanations, timelines, and synergy breakdowns.',
      accent: 'from-accent-cyan/20 to-transparent',
    },
  ]

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
            Not Another <span className="text-gradient">Peptide Wiki</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            An intelligence platform built for protocol design, not surface-level information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-panel p-8 card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-2xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg mb-3 group-hover:text-accent-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { number: '01', title: 'Define Your Goal', description: 'Select your primary objective — fat loss, cognition, recovery, muscle gain, or longevity.' },
    { number: '02', title: 'Set Parameters', description: 'Input your experience level, risk tolerance, age, and optional biomarkers.' },
    { number: '03', title: 'AI Analysis', description: 'Our engine cross-references 345+ peptides, analyzing synergies, risks, and optimal combinations.' },
    { number: '04', title: 'Get Your Protocol', description: 'Receive a structured protocol with timelines, adaptation logic, and alternative options.' },
  ]

  return (
    <section className="py-32 relative border-t border-surface-border/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
        </div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-8 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-accent-cyan/30 flex items-center justify-center font-mono text-accent-cyan text-sm group-hover:bg-accent-cyan/10 transition-colors">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-20 bg-gradient-to-b from-accent-cyan/30 to-transparent" />
                )}
              </div>
              <div className="pb-16">
                <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="glass-panel glow-border p-16 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to Optimize?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Generate your first AI-powered peptide protocol in under 60 seconds.
            </p>
            <Link href="/generator" className="btn-primary text-base px-10 py-4 inline-block">
              Start Now — Free Credits
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
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  )
}
