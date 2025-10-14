/**
 * Related Articles Component (Story 7.7)
 *
 * Displays 3-4 related articles below the current article
 * Uses algorithm: same category + matching tags
 *
 * @module components/articles/related-articles
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface RelatedArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  category: string
  tags: string[]
  authorName: string
  authorPhoto: string | null
  publishedAt: Date | null
  viewCount: number
  likeCount: number
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  // Don't render if no related articles
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t pt-12">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">Related Articles</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
          >
            {/* Featured Image */}
            {article.featuredImage && (
              <div className="aspect-video overflow-hidden relative">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Category Badge */}
              <Badge variant="secondary" className="mb-3 text-xs">
                {article.category}
              </Badge>

              {/* Title */}
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight group-hover:text-gold">
                {article.title}
              </h3>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
              )}

              {/* Author and Meta */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {article.authorPhoto && (
                  <div className="relative h-6 w-6 flex-shrink-0">
                    <Image
                      src={article.authorPhoto}
                      alt={article.authorName}
                      fill
                      className="rounded-full object-cover"
                      sizes="24px"
                    />
                  </div>
                )}
                <span className="font-medium">{article.authorName}</span>
                {article.publishedAt && (
                  <>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {article.viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {article.likeCount.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
