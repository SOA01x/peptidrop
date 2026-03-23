// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString()
}

// ============================================
// PRICING TIERS
// ============================================

export type PlanTier = 'free' | 'pro' | 'premium'

export const PRICING_PLANS = [
  {
    id: 'free' as PlanTier,
    label: 'Explorer',
    price: 0,
    period: 'forever',
    description: 'Browse and learn',
    features: [
      'Full peptide explorer (345+ compounds)',
      'Basic stack builder',
      'Community synergy data',
      'Educational dosing references',
    ],
    limitations: [
      'No AI protocol generation',
      'No saved stacks',
      'No progress tracking',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro' as PlanTier,
    label: 'Pro',
    price: 29,
    period: '/month',
    description: 'AI-powered optimization',
    features: [
      'Everything in Explorer',
      'AI protocol generator (unlimited)',
      'AI deep analysis',
      'Protocol refinement & "what if" scenarios',
      'Risk simulation engine',
      'Progress tracking & weekly updates',
      'Saved stacks (unlimited)',
      'Stack Builder Pro (drag & drop)',
      'AI coaching suggestions',
      'Advanced synergy analysis',
    ],
    limitations: [],
    cta: 'Get Pro Access',
    popular: true,
  },
  {
    id: 'premium' as PlanTier,
    label: 'Clinical Report',
    price: 19,
    period: 'per report',
    description: 'Clinic-grade PDF exports',
    features: [
      'Clinical-grade PDF protocol report',
      'Full mechanism breakdowns',
      'Week-by-week timeline',
      'Risk discussion & alternatives',
      'Professional formatting',
      'Shareable with practitioners',
    ],
    limitations: [],
    cta: 'Generate Report — $19',
    popular: false,
    isOneTime: true,
  },
] as const

// Report types available for premium one-time purchase
export const REPORT_TYPES = [
  { id: 'fat-loss', label: 'Fat Loss Optimization Protocol', price: 19 },
  { id: 'muscle', label: 'Muscle Growth Protocol', price: 19 },
  { id: 'cognition', label: 'Cognitive Enhancement Plan', price: 24 },
  { id: 'libido', label: 'Libido Restoration Stack', price: 19 },
  { id: 'longevity', label: 'Anti-Aging & Longevity Protocol', price: 29 },
  { id: 'recovery', label: 'Healing & Recovery Blueprint', price: 19 },
  { id: 'custom', label: 'Custom Clinical Report', price: 29 },
] as const

// Legacy credit system for backwards compat — credits now come with Pro plan
export const CREDIT_PACKAGES = [
  { id: 'starter', credits: 10, price: 9.99, priceUSDC: 10, label: 'Starter', description: '10 AI analyses', popular: false },
  { id: 'pro', credits: 50, price: 39.99, priceUSDC: 40, label: 'Pro', description: '50 AI analyses', popular: true },
  { id: 'elite', credits: 100, price: 69.99, priceUSDC: 70, label: 'Elite', description: '100 AI analyses', popular: false },
] as const

export const GOALS = [
  { id: 'fat-loss', label: 'Fat Loss', icon: '🔥', color: '#FFB800' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪', color: '#34D399' },
  { id: 'cognition', label: 'Cognition', icon: '🧠', color: '#7A5CFF' },
  { id: 'recovery', label: 'Recovery', icon: '💚', color: '#00D68F' },
  { id: 'longevity', label: 'Longevity', icon: '⏳', color: '#A78BFA' },
  { id: 'sleep', label: 'Sleep', icon: '🌙', color: '#6366F1' },
  { id: 'libido', label: 'Libido', icon: '❤️', color: '#FF4D6A' },
  { id: 'immune', label: 'Immunity', icon: '🛡️', color: '#FF6B6B' },
] as const

export const GENDERS = [
  { id: 'male', label: 'Male', icon: '♂' },
  { id: 'female', label: 'Female', icon: '♀' },
  { id: 'other', label: 'Prefer not to say', icon: '⚪' },
] as const
