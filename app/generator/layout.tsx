import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Peptide Protocol Generator - Personalized Stacks & Dosing',
  description: 'Generate personalized peptide protocols with AI. Select your goals (muscle growth, recovery, cognition, longevity, fat loss), set your experience level and risk tolerance, and get optimized peptide stacks with dosing schedules, synergy maps, and cycle timelines.',
  alternates: {
    canonical: 'https://peptidrop.me/generator',
  },
  openGraph: {
    title: 'AI Peptide Protocol Generator - Custom Stacks in Minutes',
    description: 'AI-powered peptide protocol generation. Get personalized stacks based on your goals, experience, and risk tolerance with synergy analysis and dosing schedules.',
    url: 'https://peptidrop.me/generator',
  },
}

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
