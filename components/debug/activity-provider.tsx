'use client'

import { useEffect, ReactNode } from 'react'
import { useSession } from '@/components/auth/hybrid-session-provider'
import { usePathname } from 'next/navigation'

interface ActivityProviderProps {
  children: ReactNode
}

// Simplified version that doesn't use the broken tracker
export function ActivityProvider({ children }: ActivityProviderProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Log to console for debugging
  useEffect(() => {
    if (status === 'loading') {
      console.log('[Auth] Checking session...')
    } else if (session?.user) {
      console.log('[Auth] User logged in:', session.user.email || session.user.id)
    } else {
      console.log('[Auth] User not logged in')
    }
  }, [session, status])

  // Log navigation
  useEffect(() => {
    console.log('[Navigation] Path changed to:', pathname)
  }, [pathname])

  return <>{children}</>
}