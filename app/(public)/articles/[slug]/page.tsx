/**
 * Public Article View Page (Story 7.1)
 *
 * Displays published articles to readers (no authentication required)
 * Features:
 * - SEO optimized with Open Graph and Twitter Card meta tags
 * - Content block rendering (reuses preview logic)
 * - View count increment on page load
 * - Responsive typography with Tailwind prose
 * - Author byline with avatar
 * - Category badges and tags
 * - Article stats (views, likes, shares)
 *
 * Route: /articles/{slug}
 *
 * @module app/(public)/articles/[slug]
 */

import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticleComments, getRelatedArticles } from '@/lib/articles'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { CommentsList } from '@/components/articles/comments-list'
import { LikeButton } from '@/components/articles/like-button'
import { ShareButtons } from '@/components/articles/share-buttons'
import { RelatedArticles } from '@/components/articles/related-articles'
import { prisma } from '@/lib/db'

interface ArticlePageProps {
  params: { slug: string }
}

/**
 * Generate metadata for SEO (Open Graph, Twitter Cards)
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    }
  }

  // Only show published articles to public
  if (article.status !== 'PUBLISHED') {
    return {
      title: 'Article Not Available',
      description: 'This article is not available for viewing.',
    }
  }

  const title = article.metaTitle || article.title
  const description =
    article.metaDescription || article.excerpt || article.subtitle || 'Read this article'
  const imageUrl = article.featuredImage || '/images/default-og-image.png'

  // Ensure absolute URLs for Open Graph
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magazine.stepperslife.com'
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`
  const canonicalUrl = `${siteUrl}/articles/${article.slug}`

  return {
    title,
    description,
    authors: [{ name: article.authorName }],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'SteppersLife Magazine',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.authorName],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
      creator: article.authorName,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: article.tags.join(', '),
  }
}

/**
 * Article Detail Page Component
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  // Increment view count on page load (Story 7.1 requirement)
  const article = await getArticleBySlug(params.slug, true)

  // 404 if article not found
  if (!article) {
    notFound()
  }

  // Only show published articles to public
  // (Admins/editors can use /preview/{id} for unpublished articles)
  if (article.status !== 'PUBLISHED') {
    notFound()
  }

  // Fetch comments for this article (Story 7.2)
  const comments = await getArticleComments(article.id)

  // Fetch related articles (Story 7.7)
  const relatedArticles = await getRelatedArticles(
    article.id,
    article.category,
    article.tags,
    4 // Get up to 4 related articles
  )

  // Check if user is authenticated (Story 7.2 + 7.3 + 7.4 + 7.5)
  const session = await auth()
  const isAuthenticated = !!session?.user
  const currentUserId = session?.user?.id || null
  const currentUserRole = (session?.user as any)?.role || null

  // Check if current user has liked this article (Story 7.5)
  let hasLiked = false
  if (isAuthenticated && currentUserId) {
    const like = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: article.id,
          userId: currentUserId,
        },
      },
    })
    hasLiked = !!like
  }

  // Parse content blocks
  let contentBlocks: any[] = []
  try {
    contentBlocks =
      typeof article.content === 'string' ? JSON.parse(article.content) : article.content
  } catch (error) {
    console.error('Failed to parse article content:', error)
    contentBlocks = []
  }

  // Calculate estimated read time (assumes 200 words per minute)
  const wordCount =
    contentBlocks
      .filter((block: any) => block.type === 'paragraph' || block.type === 'heading')
      .reduce((count: number, block: any) => {
        const text = block.data?.text || ''
        return count + text.split(/\s+/).length
      }, 0) || 0

  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="min-h-screen bg-background">
      {/* Article Container */}
      <article className="container mx-auto max-w-4xl px-4 py-8 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-foreground">
            {article.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Link href={`/category/${article.category.toLowerCase()}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                {article.category}
              </Badge>
            </Link>
            {article.isFeatured && (
              <Badge variant="default" className="bg-gold text-black">
                Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-xl text-muted-foreground lg:text-2xl">{article.subtitle}</p>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          )}

          {/* Author Byline and Metadata */}
          <div className="flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between">
            {/* Author Info */}
            <Link
              href={`/author/${article.authorId}`}
              className="flex items-center gap-3 hover:opacity-80"
            >
              {article.authorPhoto && (
                <img
                  src={article.authorPhoto}
                  alt={article.authorName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{article.authorName}</p>
                <p className="text-sm text-muted-foreground">
                  {article.publishedAt && format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                  {readTime > 0 && ` · ${readTime} min read`}
                </p>
              </div>
            </Link>

            {/* Article Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
                  width="16"
                  height="16"
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
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-10">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '600px' }}
              loading="eager"
            />
          </div>
        )}

        {/* Article Content - Prose Styling */}
        <div className="prose prose-lg prose-slate dark:prose-invert mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
          {contentBlocks.length === 0 ? (
            <p className="italic text-muted-foreground">No content available</p>
          ) : (
            contentBlocks.map((block: any, index: number) => {
              switch (block.type) {
                case 'heading':
                  const HeadingTag = `h${block.data?.level || 2}` as keyof JSX.IntrinsicElements
                  return (
                    <HeadingTag key={block.id || index} className="font-bold">
                      {block.data?.text || ''}
                    </HeadingTag>
                  )

                case 'paragraph':
                  return (
                    <p key={block.id || index} className="leading-relaxed">
                      {block.data?.text || ''}
                    </p>
                  )

                case 'list':
                  const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul'
                  return (
                    <ListTag key={block.id || index}>
                      {(block.data?.items || []).map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ListTag>
                  )

                case 'quote':
                  return (
                    <blockquote
                      key={block.id || index}
                      className="border-l-4 border-gold pl-6 italic"
                    >
                      <p className="text-lg">{block.data?.text || ''}</p>
                      {block.data?.caption && (
                        <footer className="mt-2 text-sm font-normal not-italic">
                          — {block.data.caption}
                        </footer>
                      )}
                    </blockquote>
                  )

                case 'code':
                  return (
                    <pre
                      key={block.id || index}
                      className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm"
                    >
                      <code className="text-slate-100">{block.data?.code || ''}</code>
                    </pre>
                  )

                case 'image':
                  return (
                    <figure key={block.id || index} className="my-8">
                      <img
                        src={block.data?.url || ''}
                        alt={block.data?.caption || 'Article image'}
                        className="w-full rounded-lg"
                        loading="lazy"
                      />
                      {block.data?.caption && (
                        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                          {block.data.caption}
                        </figcaption>
                      )}
                    </figure>
                  )

                case 'divider':
                  return <hr key={block.id || index} className="my-8 border-t-2" />

                default:
                  return null
              }
            })
          )}
        </div>

        {/* Like and Share Buttons Section (Story 7.5 + 7.6) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <LikeButton
            articleId={article.id}
            initialLikeCount={article.likeCount}
            initialIsLiked={hasLiked}
            isAuthenticated={isAuthenticated}
          />

          <ShareButtons
            title={article.title}
            slug={article.slug}
            excerpt={article.excerpt || undefined}
          />
        </div>

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Link key={tag} href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Section */}
        {article.authorBio && (
          <div className="mt-12 border-t pt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              About the Author
            </h3>
            <Link
              href={`/author/${article.authorId}`}
              className="flex items-start gap-4 hover:opacity-80"
            >
              {article.authorPhoto && (
                <img
                  src={article.authorPhoto}
                  alt={article.authorName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="mb-1 font-semibold">{article.authorName}</p>
                <p className="text-sm text-muted-foreground">{article.authorBio}</p>
              </div>
            </Link>
          </div>
        )}

        {/* Related Articles Section (Story 7.7) */}
        <RelatedArticles articles={relatedArticles} />

        {/* Comments Section (Story 7.2 + 7.3 + 7.4) */}
        <CommentsList
          articleId={article.id}
          comments={comments}
          isAuthenticated={isAuthenticated}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      </article>
    </div>
  )
}
