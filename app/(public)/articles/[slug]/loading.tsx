/**
 * Article Page Loading State (Story 9.2)
 */

import { ArticleDetailSkeleton } from '@/components/ui/skeletons'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <ArticleDetailSkeleton />
      </main>
      <SiteFooter />
    </>
  )
}
