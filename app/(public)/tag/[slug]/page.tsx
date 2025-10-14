/**
 * Tag Archive Page (Story 7.10)
 *
 * Displays all published articles with a specific tag
 *
 * @module app/(public)/tag/[slug]
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ArticleCard } from '@/components/articles/article-card'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Badge } from '@/components/ui/badge'

interface TagPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  // Decode the tag from URL
  const tagName = decodeURIComponent(params.slug).replace(/-/g, ' ')

  return {
    title: `${tagName} - SteppersLife Magazine`,
    description: `Browse all articles tagged with "${tagName}" on SteppersLife Magazine`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  // Decode the tag from URL (tags might have spaces, converted to hyphens in URL)
  const tagName = decodeURIComponent(params.slug).replace(/-/g, ' ')

  // Find all published articles with this tag
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      tags: {
        has: tagName,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })

  // If no articles found with this tag, show 404
  if (articles.length === 0) {
    notFound()
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Tag Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Tag</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{tagName}</h1>
              <p className="text-lg text-muted-foreground">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
