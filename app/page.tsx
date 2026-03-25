// app/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peptidrop — #1 AI Peptide Research & Protocol Platform | 345+ Peptides',
  description: 'Peptidrop is the most comprehensive AI-powered peptide research platform. Explore 345+ peptides including BPC-157, TB-500, and GHK-Cu. Generate personalized peptide protocols, map synergies, simulate risks, and export clinical-grade reports. Free to start.',
  alternates: {
    canonical: 'https://peptidrop.me',
  },
}

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
          The most comprehensive AI peptide research platform. Explore 345+ peptides including BPC-157, TB-500, GHK-Cu, and more.
          Generate personalized protocol stacks, map synergies, and simulate risk profiles — all backed by clinical-grade AI analysis.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <Link href="/generator" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
            Generate Protocol
          </Link>
          <Link href="/peptides" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
            Explore 345+ Peptides
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

function WhatIsPeptidropSection() {
  return (
    <section className="py-16 sm:py-24 relative border-t border-surface-border/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-6 text-center">
          What Is <span className="text-gradient">Peptidrop</span>?
        </h2>
        <div className="glass-panel p-6 sm:p-10 text-text-secondary leading-relaxed space-y-4 text-sm sm:text-base">
          <p>
            <strong className="text-text-primary">Peptidrop is an AI-powered peptide research and intelligence platform</strong> that provides
            researchers, biohackers, and clinicians with the most comprehensive peptide database available — featuring over 345 peptides
            with detailed mechanisms of action, receptor targets, biological pathways, and evidence-based risk profiles.
          </p>
          <p>
            Unlike traditional peptide wikis or forums, Peptidrop uses a <strong className="text-text-primary">clinical-grade AI protocol engine</strong> to
            generate personalized peptide stacks based on your specific goals (muscle growth, recovery, cognition, longevity, fat loss),
            experience level, and risk tolerance. The AI analyzes receptor interactions, half-lives, and synergy profiles to recommend
            optimal combinations and dosing schedules.
          </p>
          <p>
            Key peptides in our database include popular compounds like <strong className="text-text-primary">BPC-157</strong> (body protection compound),
            <strong className="text-text-primary"> TB-500</strong> (Thymosin Beta-4 fragment), <strong className="text-text-primary">GHK-Cu</strong> (copper peptide),
            <strong className="text-text-primary"> CJC-1295</strong>, <strong className="text-text-primary">Ipamorelin</strong>,
            <strong className="text-text-primary"> Semaglutide</strong>, <strong className="text-text-primary">Tirzepatide</strong>,
            <strong className="text-text-primary"> DSIP</strong>, <strong className="text-text-primary">Epithalon</strong>,
            <strong className="text-text-primary"> Selank</strong>, <strong className="text-text-primary">Semax</strong>, and hundreds more —
            each with full mechanism breakdowns, evidence ratings, and interaction data.
          </p>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: '🧬',
      title: 'Peptide Database — 345+ Compounds',
      description: 'The most comprehensive peptide database available. Browse 345+ peptides with detailed mechanisms of action, receptor targets, biological pathways, evidence levels, and safety profiles. Covers BPC-157, TB-500, GHK-Cu, CJC-1295, Ipamorelin, Semaglutide, and hundreds more.',
      accent: 'from-accent-cyan/20 to-transparent',
    },
    {
      icon: '🤖',
      title: 'AI Protocol Generator',
      description: 'Clinical-grade AI that generates personalized peptide stacks based on your goals (muscle growth, recovery, cognition, longevity, fat loss), experience level, and risk tolerance. Analyzes receptor interactions and synergy profiles for optimal combinations.',
      accent: 'from-accent-violet/20 to-transparent',
    },
    {
      icon: '🔗',
      title: 'Peptide Synergy Mapping',
      description: 'Real-time interaction analysis showing synergistic peptide pairs, potential conflicts, and stack compatibility scores. Understand how peptides like BPC-157 + TB-500 work together or which combinations to avoid.',
      accent: 'from-accent-emerald/20 to-transparent',
    },
    {
      icon: '📊',
      title: 'Weekly Protocol Optimization',
      description: 'AI-driven progress tracking with weekly adjustments and new peptide stack suggestions based on your results. Continuously optimize your protocol for maximum effectiveness.',
      accent: 'from-accent-amber/20 to-transparent',
    },
    {
      icon: '🛡️',
      title: 'Peptide Risk Simulation',
      description: 'Run "what if" scenarios before committing to a protocol. Test different peptide compounds and combinations to see risk/reward profiles, potential side effects, and safety considerations.',
      accent: 'from-accent-rose/20 to-transparent',
    },
    {
      icon: '📄',
      title: 'Clinical-Grade Reports',
      description: 'Export professional PDF protocols with full mechanism breakdowns, dosing timelines, interaction maps, and practitioner-ready formatting. Share with your healthcare provider for informed discussions.',
      accent: 'from-accent-cyan/20 to-transparent',
    },
  ]

  return (
    <section className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl mb-4">
            Not Another <span className="text-gradient">Peptide Wiki</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
            An AI-powered intelligence platform built for peptide protocol design, synergy analysis, and risk simulation — not surface-level information.
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

function HowItWorksSection() {
  const steps = [
    { step: '1', title: 'Choose Your Goal', description: 'Select from muscle growth, recovery, cognition, longevity, fat loss, sleep, or immune support. Set your experience level and risk tolerance.' },
    { step: '2', title: 'AI Analyzes & Generates', description: 'Our AI scans 345+ peptides, maps receptor interactions, calculates synergy scores, and evaluates risk profiles to build your optimal stack.' },
    { step: '3', title: 'Review Your Protocol', description: 'Get a detailed protocol with peptide selections, dosing schedules, cycle timelines, synergy maps, and safety considerations.' },
    { step: '4', title: 'Track & Optimize', description: 'Log progress, get weekly AI adjustments, and export clinical-grade PDF reports to share with your healthcare provider.' },
  ]

  return (
    <section className="py-16 sm:py-24 relative border-t border-surface-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-4 text-center">
          How <span className="text-gradient">Peptidrop</span> Works
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto text-center mb-12 text-sm sm:text-base">
          From goal selection to optimized protocol in minutes — not weeks of forum research.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((item, i) => (
            <div key={i} className="glass-panel p-6 text-center relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center text-surface font-display font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-display font-semibold text-sm sm:text-base mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PopularPeptidesSection() {
  const peptides = [
    { name: 'BPC-157', category: 'Healing & Recovery', description: 'Body Protection Compound-157. One of the most researched healing peptides. Promotes angiogenesis, reduces inflammation, and accelerates tissue repair including tendons, ligaments, muscles, and gut lining.' },
    { name: 'TB-500', category: 'Healing & Recovery', description: 'Thymosin Beta-4 fragment. Promotes cell migration, blood vessel growth, and tissue repair. Often stacked with BPC-157 for enhanced healing and recovery protocols.' },
    { name: 'GHK-Cu', category: 'Skin & Longevity', description: 'Copper peptide with powerful anti-aging and wound healing properties. Stimulates collagen production, reduces inflammation, and has been shown to activate over 4,000 genes related to tissue remodeling.' },
    { name: 'CJC-1295 + Ipamorelin', category: 'Growth Hormone', description: 'The most popular growth hormone secretagogue combination. CJC-1295 extends GH release while Ipamorelin provides a clean GH pulse without cortisol or prolactin increases.' },
    { name: 'Semaglutide', category: 'Metabolic & Weight Loss', description: 'GLP-1 receptor agonist used for weight management and blood sugar control. Has demonstrated significant weight loss results in clinical trials and is one of the most studied peptides for metabolic health.' },
    { name: 'Epithalon', category: 'Longevity', description: 'Tetrapeptide that activates telomerase, the enzyme responsible for maintaining telomere length. Studied for anti-aging properties and potential lifespan extension in multiple animal models.' },
  ]

  return (
    <section className="py-16 sm:py-24 relative border-t border-surface-border/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-4 text-center">
          Popular Peptides in Our <span className="text-gradient">Database</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto text-center mb-12 text-sm sm:text-base">
          Explore detailed profiles for 345+ peptides. Here are some of the most researched compounds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {peptides.map((peptide, i) => (
            <div key={i} className="glass-panel p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base sm:text-lg text-accent-cyan">{peptide.name}</h3>
                <span className="text-[10px] sm:text-xs font-mono text-text-muted bg-surface-elevated px-2 py-1 rounded">{peptide.category}</span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{peptide.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/peptides" className="btn-secondary text-sm px-6 py-3">
            Browse All 345+ Peptides
          </Link>
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
          Start free. Upgrade when you're ready for AI-powered peptide protocols.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Free */}
          <div className="glass-panel p-6 sm:p-8 text-left">
            <h3 className="font-display font-bold text-lg mb-1">Explorer</h3>
            <div className="mb-4">
              <span className="text-3xl font-display font-bold">Free</span>
            </div>
            <p className="text-sm text-text-muted mb-6">Browse the full peptide database of 345+ compounds with mechanisms, pathways, and evidence levels</p>
            <Link href="/signup" className="btn-secondary text-sm w-full">Get Started Free</Link>
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
            <p className="text-sm text-text-muted mb-6">AI protocol generation, synergy mapping, weekly optimization, progress tracking, and risk simulation</p>
            <Link href="/signup" className="btn-primary text-sm w-full">Get Pro Access</Link>
          </div>

          {/* Clinical Reports */}
          <div className="glass-panel p-6 sm:p-8 text-left">
            <h3 className="font-display font-bold text-lg mb-1">Clinical Report</h3>
            <div className="mb-4">
              <span className="text-2xl font-display font-bold">$12.99</span>
              <span className="text-text-muted text-sm"> — $29.99</span>
            </div>
            <p className="text-sm text-text-muted mb-6">Clinic-grade PDF exports with mechanism breakdowns, timelines, and practitioner-ready formatting</p>
            <Link href="/pricing" className="btn-secondary text-sm w-full">View Report Types</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      question: 'What is Peptidrop?',
      answer: 'Peptidrop is the leading AI-powered peptide research and intelligence platform. It features a database of 345+ peptides with detailed mechanisms of action, receptor targets, and evidence levels. The platform includes an AI protocol generator that creates personalized peptide stacks based on your goals, experience, and risk tolerance, plus synergy mapping, risk simulation, and clinical-grade PDF report exports.',
    },
    {
      question: 'What peptides are in the Peptidrop database?',
      answer: 'Peptidrop\'s database includes over 345 peptides covering all major categories: healing peptides (BPC-157, TB-500), growth hormone secretagogues (CJC-1295, Ipamorelin, MK-677), copper peptides (GHK-Cu), metabolic peptides (Semaglutide, Tirzepatide), longevity peptides (Epithalon, FOXO4-DRI), cognitive peptides (Selank, Semax, Dihexa), sleep peptides (DSIP), immune peptides (Thymosin Alpha-1), and many more. Each peptide includes mechanisms, dosing research, receptor targets, and interaction data.',
    },
    {
      question: 'How does the AI peptide protocol generator work?',
      answer: 'The AI protocol engine analyzes your selected health goals (muscle growth, recovery, cognition, longevity, fat loss, sleep, or immune support), experience level, and risk tolerance. It then scans all 345+ peptides in the database, maps receptor interactions, calculates synergy scores between potential combinations, evaluates risk profiles, and generates an optimized protocol with specific peptide selections, dosing schedules, cycle timelines, and stacking recommendations.',
    },
    {
      question: 'What is peptide synergy mapping?',
      answer: 'Peptide synergy mapping is Peptidrop\'s real-time interaction analysis system that shows how different peptides work together. It identifies synergistic pairs (like BPC-157 + TB-500 for enhanced healing), potential conflicts between compounds, and overall stack compatibility scores. This helps you build optimal peptide combinations while avoiding negative interactions.',
    },
    {
      question: 'Is Peptidrop free to use?',
      answer: 'Yes, Peptidrop offers a free Explorer plan that gives you full access to browse the entire 345+ peptide database with mechanisms, pathways, and evidence levels. The Pro plan ($29/month) adds AI protocol generation, synergy mapping, weekly optimization, and risk simulation. Clinical-grade PDF reports are available as one-time purchases from $12.99 to $29.99.',
    },
    {
      question: 'What is the best peptide for healing and recovery?',
      answer: 'Based on research evidence, BPC-157 (Body Protection Compound-157) is one of the most studied peptides for healing and recovery. It promotes angiogenesis, reduces inflammation, and accelerates tissue repair. It is frequently stacked with TB-500 (Thymosin Beta-4) for enhanced healing. Peptidrop\'s AI can generate personalized recovery protocols based on your specific needs and analyze synergies between healing peptides.',
    },
    {
      question: 'What are the best peptides for muscle growth?',
      answer: 'Popular peptides for muscle growth include CJC-1295 and Ipamorelin (growth hormone secretagogues), BPC-157 (recovery and repair), TB-500 (tissue regeneration), and Follistatin (myostatin inhibition). The optimal combination depends on your experience, goals, and health profile. Peptidrop\'s AI protocol generator analyzes these factors to create personalized muscle growth stacks with proper dosing and cycling.',
    },
    {
      question: 'What are the best peptides for anti-aging and longevity?',
      answer: 'Key longevity peptides include Epithalon (telomerase activation), GHK-Cu (gene expression modulation and collagen production), Thymosin Alpha-1 (immune modulation), and FOXO4-DRI (senescent cell clearance). Peptidrop provides detailed research data on all longevity peptides and can generate anti-aging protocols tailored to your specific goals.',
    },
    {
      question: 'Is Peptidrop medical advice?',
      answer: 'No, Peptidrop is for educational and research purposes only. It is not medical advice, and the information provided should not replace consultation with a qualified healthcare professional. Always consult a doctor or licensed practitioner before starting any peptide protocol. Peptidrop\'s clinical reports are designed to facilitate informed discussions with your healthcare provider.',
    },
    {
      question: 'How is Peptidrop different from other peptide databases?',
      answer: 'Unlike traditional peptide wikis or forums, Peptidrop is an AI-powered intelligence platform built for protocol design. It offers: (1) The largest curated peptide database with 345+ compounds, (2) AI-generated personalized protocols, (3) Real-time synergy mapping between peptides, (4) Risk simulation before committing to protocols, (5) Weekly AI optimization based on progress, and (6) Clinical-grade PDF exports for practitioners. It combines comprehensive data with actionable, personalized intelligence.',
    },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="py-16 sm:py-24 relative border-t border-surface-border/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-4 text-center">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto text-center mb-12 text-sm sm:text-base">
          Everything you need to know about Peptidrop, peptide research, and AI-powered protocols.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="glass-panel group">
              <summary className="p-5 sm:p-6 cursor-pointer font-display font-semibold text-sm sm:text-base flex items-center justify-between list-none">
                <span>{faq.question}</span>
                <span className="text-accent-cyan ml-4 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
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
              Ready to Optimize Your Peptide Protocol?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm sm:text-base">
              Join thousands of researchers exploring 345+ peptides. Start with free database access, then generate your first AI protocol when you're ready.
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
      <WhatIsPeptidropSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PopularPeptidesSection />
      <PricingPreview />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
