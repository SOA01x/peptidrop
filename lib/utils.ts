// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PlanTier = 'free' | 'researcher' | 'pro'

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
    price: 49,
    period: '/month',
    description: 'The complete research suite',
    features: [
      'Everything in Researcher',
      'PDF Clinical-Grade Reports (unlimited)',
      'Saved stacks (unlimited)',
      'Stack Builder Pro (drag & drop)',
      'AI coaching suggestions',
      'Advanced synergy analysis',
      'Real risk simulation engine',
      'Priority support',
    ],
    limitations: [],
    cta: 'Go Pro',
    popular: true,
  },
  {
    id: 'researcher' as PlanTier,
    label: 'Researcher',
    price: 19,
    period: '/month',
    description: 'AI-powered protocol generation',
    features: [
      'Everything in Explorer',
      'AI protocol generator (unlimited)',
      'Save & revisit all protocols',
      'Protocol refinement & "what if" scenarios',
      'Progress tracking & weekly updates',
      'Progress journal',
    ],
    limitations: [
      'No clinical PDF reports',
      'No advanced stack tools',
      'No risk simulation',
    ],
    cta: 'Start Researching',
    popular: false,
  },
] as const

export const PDF_REPORT_PRICE = 9.99

export const REPORT_TYPES = [
  { id: 'fat-loss', label: 'Fat Loss Optimization Protocol', price: 14.99 },
  { id: 'muscle', label: 'Muscle Growth Protocol', price: 14.99 },
  { id: 'cognition', label: 'Cognitive Enhancement Plan', price: 19.99 },
  { id: 'libido', label: 'Libido Restoration Stack', price: 14.99 },
  { id: 'longevity', label: 'Anti-Aging & Longevity Protocol', price: 24.99 },
  { id: 'recovery', label: 'Healing & Recovery Blueprint', price: 12.99 },
  { id: 'sleep', label: 'Sleep Optimization Protocol', price: 12.99 },
  { id: 'immune', label: 'Immune Defense Protocol', price: 14.99 },
  { id: 'custom', label: 'Custom Multi-Goal Clinical Report', price: 29.99 },
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
