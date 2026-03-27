// components/ui/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_KEY = 'peptidrop_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true)
    } catch {}
  }, [])

  const accept = () => {
    try { localStorage.setItem(COOKIE_KEY, 'accepted') } catch {}
    setVisible(false)
  }

  const decline = () => {
    try { localStorage.setItem(COOKIE_KEY, 'declined') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto glass-panel p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-card">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary leading-relaxed">
            We use cookies to enhance your experience, analyze site traffic, and personalize content.
            By continuing to use Peptidrop, you consent to our use of cookies.{' '}
            <Link href="/privacy" className="text-accent-cyan hover:underline">Privacy Policy</Link>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={decline}
            className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors rounded-lg">
            Decline
          </button>
          <button onClick={accept}
            className="btn-primary text-sm !py-2 !px-6">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
