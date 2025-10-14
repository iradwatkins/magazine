/**
 * Global Error Boundary (Story 9.1)
 *
 * Catches unhandled errors and displays user-friendly error page
 * This must be a Client Component
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console (in production, send to error tracking service)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Something Went Wrong</h1>
          <p className="text-lg text-muted-foreground">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg bg-muted p-4 text-left text-sm font-mono">
            <div className="text-destructive font-semibold mb-2">Error Details:</div>
            <div className="text-muted-foreground overflow-auto max-h-32">
              {error.message}
            </div>
            {error.digest && (
              <div className="text-muted-foreground mt-2">
                Error ID: {error.digest}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg" className="bg-gold text-black hover:bg-gold/90">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            If this problem persists, please{' '}
            <Link href="/contact" className="text-gold hover:underline">
              contact support
            </Link>
            {' '}with error ID: {error.digest || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
