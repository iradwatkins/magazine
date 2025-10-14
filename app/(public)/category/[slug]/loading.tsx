/**
 * Category Page Loading State (Story 9.2)
 */

import { ArticleListSkeleton } from '@/components/ui/skeletons'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Category Header Skeleton */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <Skeleton className="h-6 w-24 mx-auto" />
              <Skeleton className="h-12 w-48 mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto" />
            </div>
          </div>
        </section>

        {/* Articles Grid Skeleton */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <ArticleListSkeleton count={9} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
