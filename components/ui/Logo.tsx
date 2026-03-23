// components/ui/Logo.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function DropletLogo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className={cn('relative flex-shrink-0', sizes[size], className)}>
      <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`drop-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF"/>
            <stop offset="100%" stopColor="#7A5CFF"/>
          </linearGradient>
        </defs>
        {/* Rounded square background */}
        <rect x="2" y="2" width="60" height="60" rx="14" ry="14"
          fill={`url(#drop-grad-${size})`} opacity="1"/>
        {/* Inner dark square */}
        <rect x="4" y="4" width="56" height="56" rx="12" ry="12" fill="#0A0A0F"/>
        {/* Droplet shape inside */}
        <path d="M32 12 C32 12, 18 28, 18 36 C18 43.7 24.3 50 32 50 C39.7 50 46 43.7 46 36 C46 28 32 12 32 12Z"
          fill={`url(#drop-grad-${size})`} opacity="0.9"/>
        {/* P letter inside droplet */}
        <text x="27" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="18" fill="#0A0A0F">P</text>
        {/* Subtle highlight on droplet */}
        <ellipse cx="28" cy="28" rx="3" ry="5" fill="white" opacity="0.15" transform="rotate(-15 28 28)"/>
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
