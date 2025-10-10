/**
 * Article Not Found Page
 *
 * Shown when an article slug doesn't exist
 *
 * @module app/(public)/articles/[slug]/not-found
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Article Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button>Return to Homepage</Button>
        </Link>
      </div>
    </div>
  )
}
