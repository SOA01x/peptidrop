// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Peptidrop — AI Peptide Intelligence Platform',
  description: 'Clinical-grade AI peptide protocol generation. Research 345+ peptides, analyze synergies, and generate personalized stacks.',
  keywords: ['peptides', 'peptide protocols', 'AI', 'biohacking', 'research'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Peptidrop — AI Peptide Intelligence Platform',
    description: 'Clinical-grade AI peptide protocol generation.',
    url: 'https://peptidrop.me',
    siteName: 'Peptidrop',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
