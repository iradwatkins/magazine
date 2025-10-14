'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode
} from 'react'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: string
}

interface Session {
  user: User
  expires?: string
}

interface SessionContextValue {
  data: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  update: () => Promise<Session | null>
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

// Polling interval in milliseconds (30 seconds - very conservative)
const POLL_INTERVAL = 30000

export function HybridSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const pathname = usePathname()

  const fetchSession = useCallback(async () => {
    try {
      // Use our custom session-check endpoint that doesn't have HTTP2 issues
      const response = await fetch('/api/auth/session-check', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Session check failed')
      }

      const data = await response.json()

      if (data.authenticated && data.user) {
        setSession({
          user: data.user,
          expires: data.expires,
        })
        setStatus('authenticated')
        return { user: data.user, expires: data.expires }
      } else {
        setSession(null)
        setStatus('unauthenticated')
        return null
      }
    } catch (error) {
      console.error('[HybridAuth] Session check error:', error)
      setSession(null)
      setStatus('unauthenticated')
      return null
    }
  }, [])

  // Initial session check
  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  // Poll for session changes (but less frequently)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only poll if we're not on the sign-in page
      if (!pathname?.includes('/sign-in')) {
        fetchSession()
      }
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchSession, pathname])

  // Check session when pathname changes (navigation)
  useEffect(() => {
    if (pathname && !pathname.includes('/sign-in')) {
      fetchSession()
    }
  }, [pathname, fetchSession])

  const update = useCallback(async () => {
    return fetchSession()
  }, [fetchSession])

  return (
    <SessionContext.Provider value={{ data: session, status, update }}>
      {children}
    </SessionContext.Provider>
  )
}

// Custom hook to use session
export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within HybridSessionProvider')
  }
  return context
}
