// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import CookieConsent from '@/components/ui/CookieConsent'

export const metadata: Metadata = {
  metadataBase: new URL('https://peptidrop.me'),
  title: {
    default: 'Peptidrop - #1 AI Peptide Research & Protocol Platform | 345+ Peptides Database',
    template: '%s | Peptidrop - AI Peptide Intelligence',
  },
  description: 'Peptidrop is the leading AI-powered peptide research platform. Explore 345+ peptides, generate personalized protocols, map synergies, and simulate risk profiles. Trusted by researchers and biohackers for clinical-grade peptide intelligence.',
  keywords: [
    'peptides', 'peptide database', 'peptide research', 'peptide protocols',
    'AI peptide analysis', 'peptide stacking', 'peptide synergy',
    'BPC-157', 'TB-500', 'GHK-Cu', 'CJC-1295', 'Ipamorelin', 'Thymosin Beta-4',
    'peptide therapy', 'peptide guide', 'best peptides',
    'peptide calculator', 'peptide interactions', 'peptide side effects',
    'biohacking', 'longevity peptides', 'healing peptides', 'growth hormone peptides',
    'peptide cycle', 'peptide dosage', 'peptide protocol generator',
    'research peptides', 'peptide information', 'peptide explorer',
  ],
  authors: [{ name: 'Peptidrop by Usensium Inc.' }],
  creator: 'Usensium Inc.',
  publisher: 'Peptidrop',
  verification: {
    google: 'REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'your-yandex-code',   // optional
    // yahoo: 'your-yahoo-code',     // optional
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Peptidrop - #1 AI Peptide Research & Protocol Platform',
    description: 'Explore 345+ peptides, generate AI-powered protocols, map synergies, and simulate risk profiles. The most comprehensive peptide intelligence platform available.',
    url: 'https://peptidrop.me',
    siteName: 'Peptidrop',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://peptidrop.me/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Peptidrop - AI Peptide Research & Protocol Platform with 345+ peptides',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptidrop - #1 AI Peptide Research & Protocol Platform',
    description: 'Explore 345+ peptides, generate AI-powered protocols, map synergies, and simulate risk profiles.',
    creator: '@peptidrop',
    images: ['https://peptidrop.me/og-image.svg'],
  },
  alternates: {
    canonical: 'https://peptidrop.me',
  },
  category: 'Health & Science',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://peptidrop.me/#website',
        url: 'https://peptidrop.me',
        name: 'Peptidrop',
        description: 'AI-powered peptide research and protocol intelligence platform with 345+ peptides database',
        publisher: { '@id': 'https://peptidrop.me/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://peptidrop.me/peptides?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://peptidrop.me/#organization',
        name: 'Peptidrop',
        legalName: 'Usensium Inc.',
        url: 'https://peptidrop.me',
        description: 'Peptidrop is the leading AI-powered peptide research and intelligence platform, providing clinical-grade peptide protocol generation for researchers and biohackers.',
        foundingDate: '2025',
        sameAs: [],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://peptidrop.me/#application',
        name: 'Peptidrop',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        description: 'AI peptide protocol generator and research platform with 345+ peptides, synergy mapping, risk simulation, and clinical report exports.',
        offers: [
          {
            '@type': 'Offer',
            name: 'Explorer (Free)',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free access to browse the full peptide database of 345+ peptides',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '19',
            priceCurrency: 'USD',
            billingIncrement: 'month',
            description: 'AI protocol generation, save and revisit protocols, progress tracking, and journal',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '49',
            priceCurrency: 'USD',
            billingIncrement: 'month',
            description: 'Full research suite with clinical PDF reports, risk simulation, AI coaching, and advanced synergy analysis',
          },
        ],
        featureList: [
          '345+ peptide database with mechanisms, receptors, and pathways',
          'AI protocol generation based on goals and risk tolerance',
          'Real-time synergy mapping and interaction analysis',
          'Weekly optimization with progress tracking',
          'Risk simulation for compound testing',
          'Clinical-grade PDF report exports',
        ],
      },
    ],
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-surface text-text-primary font-body antialiased">
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
