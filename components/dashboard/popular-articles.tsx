/**
 * Popular Articles Widget
 *
 * Displays top articles by view count (last 30 days)
 *
 * @module components/dashboard/popular-articles
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PopularArticle {
  id: string
  title: string
  slug: string
  viewCount: number
  featuredImageUrl: string | null
  category: string
}

interface PopularArticlesProps {
  articles: PopularArticle[]
}

export function PopularArticles({ articles }: PopularArticlesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Popular Articles
        </CardTitle>
        <CardDescription>Top performing articles (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <TrendingUp className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No published articles yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                target="_blank"
                className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-primary">
                  {index + 1}
                </div>
                {article.featuredImageUrl && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={article.featuredImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-none">{article.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {article.viewCount.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
