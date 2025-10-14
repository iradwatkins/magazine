import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, User, Eye, Heart } from 'lucide-react'
import type { Article, User as PrismaUser } from '@prisma/client'

interface ArticleCardProps {
  article: Article & {
    author: Pick<PrismaUser, 'id' | 'name' | 'image'>
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Format date
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(article.publishedAt))
    : 'Draft'

  // Extract plain text excerpt from content if no excerpt
  let displayExcerpt = article.excerpt || ''
  if (!displayExcerpt && article.content) {
    try {
      const blocks = JSON.parse(article.content)
      const textBlocks = blocks
        .filter((block: any) => block.type === 'paragraph' && block.data?.text)
        .slice(0, 1)
      displayExcerpt = textBlocks
        .map((block: any) => block.data.text.replace(/<[^>]*>/g, ''))
        .join(' ')
        .substring(0, 150) + '...'
    } catch {
      displayExcerpt = ''
    }
  }

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
      <Link
        href={`/articles/${article.slug}`}
        className="block"
        aria-label={`Read article: ${article.title}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/10 to-muted">
              <div className="text-4xl">📰</div>
            </div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="space-y-2">
          {/* Category Badge */}
          <div>
            <Badge variant="secondary" className="capitalize">
              {article.category.toLowerCase().replace('_', ' ')}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-xl font-bold leading-tight group-hover:text-gold transition-colors">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Excerpt */}
          {displayExcerpt && (
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
              {displayExcerpt}
            </p>
          )}

          {/* Author and Date */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{article.author.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={article.publishedAt?.toISOString()}>
                {formattedDate}
              </time>
            </div>
          </div>
        </CardContent>

        {/* Stats Footer */}
        <CardFooter className="border-t pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" aria-label={`${article.viewCount} views`}>
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5" aria-label={`${article.likeCount} likes`}>
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{article.likeCount.toLocaleString()}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
