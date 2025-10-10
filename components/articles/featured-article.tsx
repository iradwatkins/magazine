import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User } from 'lucide-react'
import type { Article, User as PrismaUser } from '@prisma/client'

interface FeaturedArticleProps {
  article: Article & {
    author: Pick<PrismaUser, 'id' | 'name' | 'image'>
  }
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  // Format date
  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(article.publishedAt))
    : 'Not published'

  // Extract plain text excerpt from content if no excerpt
  let displayExcerpt = article.excerpt || ''
  if (!displayExcerpt && article.content) {
    try {
      const blocks = JSON.parse(article.content)
      const textBlocks = blocks
        .filter((block: any) => block.type === 'paragraph' && block.data?.text)
        .slice(0, 2)
      displayExcerpt = textBlocks
        .map((block: any) => block.data.text.replace(/<[^>]*>/g, ''))
        .join(' ')
        .substring(0, 200) + '...'
    } catch {
      displayExcerpt = 'Read this featured article...'
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Featured Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-2xl lg:order-2">
            {article.featuredImage ? (
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5">
                <div className="text-6xl">📰</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-6 lg:order-1">
            {/* Badge */}
            <div>
              <Badge className="bg-gold text-black hover:bg-gold/90">
                Featured Article
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              <Link
                href={`/articles/${article.slug}`}
                className="hover:text-gold transition-colors"
              >
                {article.title}
              </Link>
            </h1>

            {/* Excerpt */}
            {displayExcerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {displayExcerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {/* Category */}
              <Badge variant="outline" className="capitalize">
                {article.category.toLowerCase().replace('_', ' ')}
              </Badge>

              {/* Author */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author.name || 'Anonymous'}</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt?.toISOString()}>
                  {formattedDate}
                </time>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link href={`/articles/${article.slug}`}>
                <Button size="lg" className="bg-gold text-black hover:bg-gold/90">
                  Read Full Article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
