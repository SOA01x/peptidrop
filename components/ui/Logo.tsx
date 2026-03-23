// components/ui/Logo.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function DropletLogo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: { box: 'w-7 h-7', text: 'text-[10px]' },
    md: { box: 'w-10 h-10', text: 'text-sm' },
    lg: { box: 'w-14 h-14', text: 'text-xl' },
  }
  const s = sizes[size]

  return (
    <div className={cn('relative flex-shrink-0', s.box, className)}>
      <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF"/>
            <stop offset="100%" stopColor="#7A5CFF"/>
          </linearGradient>
          <linearGradient id="ig" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0A0A0F"/>
            <stop offset="100%" stopColor="#12121A"/>
          </linearGradient>
        </defs>
        {/* Outer droplet */}
        <path d="M32 4 C32 4, 8 30, 8 42 C8 55.2 18.8 62 32 62 C45.2 62 56 55.2 56 42 C56 30 32 4 32 4Z" fill="url(#dg)" opacity="0.9"/>
        {/* Inner dark */}
        <path d="M32 8 C32 8, 12 31, 12 42 C12 53 20.9 58 32 58 C43.1 58 52 53 52 42 C52 31 32 8 32 8Z" fill="url(#ig)"/>
        {/* P letter */}
        <text x="25" y="49" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="30" fill="#00E5FF">P</text>
        {/* Highlight */}
        <ellipse cx="24" cy="28" rx="5" ry="8" fill="white" opacity="0.06" transform="rotate(-20 24 28)"/>
      </svg>
    </div>
  )
}

export function LogoWithText({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
      <DropletLogo size={size} />
      <span className={cn('font-display font-bold tracking-tight', textSizes[size])}>
        Pepti<span className="text-gradient">drop</span>
      </span>
    </Link>
  )
}
