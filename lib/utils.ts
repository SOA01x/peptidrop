// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString()
}

export const CREDIT_PACKAGES = [
  {
    id: 'starter',
    credits: 10,
    price: 9.99,
    priceUSDC: 10,
    label: 'Starter',
    description: '10 protocol generations',
    popular: false,
  },
  {
    id: 'pro',
    credits: 50,
    price: 39.99,
    priceUSDC: 40,
    label: 'Pro',
    description: '50 protocol generations',
    popular: true,
  },
  {
    id: 'elite',
    credits: 100,
    price: 69.99,
    priceUSDC: 70,
    label: 'Elite',
    description: '100 protocol generations',
    popular: false,
  },
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
