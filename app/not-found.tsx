/**
 * Custom 404 Not Found Page (Story 9.1)
 *
 * Displayed when a page or resource is not found
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
        <div className="text-center space-y-8 max-w-2xl">
          {/* 404 Visual */}
          <div className="text-9xl font-bold text-gold">404</div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Page Not Found</h1>
            <p className="text-lg text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/articles">
                <Search className="mr-2 h-5 w-5" />
                Browse Articles
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p>
              If you believe this is a mistake, please{' '}
              <Link href="/contact" className="text-gold hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
