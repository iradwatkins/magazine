'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Types for our tracking events
export interface TrackingEvent {
  id: string
  timestamp: string
  type: 'action' | 'error' | 'api' | 'navigation' | 'auth'
  level: 'info' | 'warning' | 'error' | 'success'
  category: string
  message: string
  details?: any
  url?: string
  method?: string
  status?: number
  userId?: string
  sessionId?: string
  userAgent?: string
}

class ActivityTracker {
  private static instance: ActivityTracker
  private events: TrackingEvent[] = []
  private sessionId: string
  private userId: string | null = null
  private isEnabled: boolean = true
  private maxEvents: number = 500

  private constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId()
    this.setupGlobalErrorHandler()
    this.setupApiInterceptor()
    this.setupConsoleInterceptor()
  }

  static getInstance(): ActivityTracker {
    if (!ActivityTracker.instance) {
      ActivityTracker.instance = new ActivityTracker()
    }
    return ActivityTracker.instance
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server'

    let sessionId = sessionStorage.getItem('debug_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('debug_session_id', sessionId)
    }
    return sessionId
  }

  // Track any event
  track(event: Omit<TrackingEvent, 'id' | 'timestamp' | 'sessionId' | 'userAgent'>): void {
    if (!this.isEnabled) return

    const fullEvent: TrackingEvent = {
      ...event,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }

    this.events.push(fullEvent)

    // Limit stored events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Send to server
    this.sendToServer(fullEvent)

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const style = event.level === 'error' ? 'color: red' :
                   event.level === 'warning' ? 'color: orange' :
                   event.level === 'success' ? 'color: green' : 'color: blue'
      console.log(`%c[TRACKER] ${event.type}: ${event.message}`, style, event.details)
    }
  }

  // Send event to server
  private async sendToServer(event: TrackingEvent): Promise<void> {
    try {
      await fetch('/api/debug/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(() => {
        // Silently fail if tracking endpoint is down
      })
    } catch (error) {
      // Don't let tracking errors break the app
    }
  }

  // Setup global error handler
  private setupGlobalErrorHandler(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('error', (event) => {
      this.track({
        type: 'error',
        level: 'error',
        category: 'javascript',
        message: event.message,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack || event.error?.toString()
        },
        url: window.location.href
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.track({
        type: 'error',
        level: 'error',
        category: 'promise',
        message: 'Unhandled Promise Rejection',
        details: {
          reason: event.reason?.stack || event.reason?.toString() || event.reason
        },
        url: window.location.href
      })
    })
  }

  // Intercept fetch to track API calls
  private setupApiInterceptor(): void {
    if (typeof window === 'undefined') return

    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [input, init] = args
      const url = typeof input === 'string' ? input : input.url
      const method = init?.method || 'GET'

      const startTime = Date.now()

      try {
        const response = await originalFetch(...args)
        const duration = Date.now() - startTime

        // Track API call
        this.track({
          type: 'api',
          level: response.ok ? 'success' : 'error',
          category: 'fetch',
          message: `${method} ${url}`,
          details: {
            duration,
            headers: init?.headers
          },
          url,
          method,
          status: response.status
        })

        // Track auth failures specifically
        if (response.status === 401 || response.status === 403) {
          this.track({
            type: 'auth',
            level: 'error',
            category: 'authentication',
            message: `Authentication failed: ${response.status}`,
            details: {
              endpoint: url,
              status: response.status
            },
            url,
            method,
            status: response.status
          })
        }

        return response
      } catch (error) {
        const duration = Date.now() - startTime

        this.track({
          type: 'api',
          level: 'error',
          category: 'fetch',
          message: `${method} ${url} failed`,
          details: {
            error: error instanceof Error ? error.message : error,
            duration
          },
          url,
          method
        })

        throw error
      }
    }
  }

  // Intercept console for better error tracking
  private setupConsoleInterceptor(): void {
    if (typeof window === 'undefined') return

    const originalError = console.error
    console.error = (...args) => {
      this.track({
        type: 'error',
        level: 'error',
        category: 'console',
        message: args[0]?.toString() || 'Console error',
        details: args.length > 1 ? args.slice(1) : undefined,
        url: window.location.href
      })
      originalError.apply(console, args)
    }

    const originalWarn = console.warn
    console.warn = (...args) => {
      this.track({
        type: 'error',
        level: 'warning',
        category: 'console',
        message: args[0]?.toString() || 'Console warning',
        details: args.length > 1 ? args.slice(1) : undefined,
        url: window.location.href
      })
      originalWarn.apply(console, args)
    }
  }

  // Track user actions
  trackAction(action: string, details?: any): void {
    this.track({
      type: 'action',
      level: 'info',
      category: 'user',
      message: action,
      details,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    })
  }

  // Track navigation
  trackNavigation(from: string, to: string): void {
    this.track({
      type: 'navigation',
      level: 'info',
      category: 'router',
      message: `Navigate from ${from} to ${to}`,
      details: { from, to },
      url: to
    })
  }

  // Set user context
  setUser(userId: string | null): void {
    this.userId = userId
    this.track({
      type: 'auth',
      level: 'info',
      category: 'session',
      message: userId ? `User logged in: ${userId}` : 'User logged out',
      details: { userId }
    })
  }

  // Get all events
  getEvents(): TrackingEvent[] {
    return this.events
  }

  // Clear events
  clearEvents(): void {
    this.events = []
  }

  // Toggle tracking
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }
}

// React Hook for activity tracking
export function useActivityTracker() {
  const pathname = usePathname()
  const tracker = ActivityTracker.getInstance()

  useEffect(() => {
    // Track page views
    tracker.trackNavigation(window.location.pathname, pathname)
  }, [pathname, tracker])

  const trackAction = useCallback((action: string, details?: any) => {
    tracker.trackAction(action, details)
  }, [tracker])

  const trackError = useCallback((message: string, details?: any) => {
    tracker.track({
      type: 'error',
      level: 'error',
      category: 'manual',
      message,
      details
    })
  }, [tracker])

  return {
    trackAction,
    trackError,
    tracker
  }
}

// Export singleton instance
export const tracker = ActivityTracker.getInstance()