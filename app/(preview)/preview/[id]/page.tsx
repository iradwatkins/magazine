/**
 * Article Preview Page
 *
 * Displays article in reader view with preview banner
 * Requires authentication - only author/editor can preview
 *
 * Route: /preview/{id}
 *
 * @module app/(preview)/preview/[id]
 */

import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getArticleById } from '@/lib/articles'
import { ArticlePermissions } from '@/lib/rbac'
import { UserRole } from '@prisma/client'
import { PreviewBanner } from '@/components/articles/preview-banner'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Metadata } from 'next'

interface PreviewPageProps {
  params: { id: string }
}

/**
 * Generate metadata with noindex/nofollow for SEO
 */
export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const article = await getArticleById(params.id)

  if (!article) {
    return {
      title: 'Article Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: `Preview: ${article.title}`,
    description: article.excerpt || undefined,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const session = await auth()

  // Require authentication
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/preview/' + params.id)
  }

  // Fetch article
  const article = await getArticleById(params.id)

  if (!article) {
    notFound()
  }

  // Check permissions - SSO compatible
  // Only author or editors/admins can preview
  const userRole = (session.user as any)?.role || 'USER'
  const userRoles = [userRole] as UserRole[]
  const canView = ArticlePermissions.canEdit(userRoles, article.authorId, session.user.id)

  if (!canView) {
    redirect('/articles')
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

  // Show banner for non-published articles
  const showBanner = article.status !== 'PUBLISHED'

  return (
    <>
      {showBanner && <PreviewBanner articleId={article.id} status={article.status} />}

      <article className="container mx-auto max-w-4xl px-4 py-8">
        {/* Article Header */}
        <header className="mb-8 space-y-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            {article.isFeatured && <Badge variant="default">Featured</Badge>}
            <Badge variant="outline" className="capitalize">
              {article.status.toLowerCase()}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{article.title}</h1>

          {/* Subtitle */}
          {article.subtitle && <p className="text-xl text-muted-foreground">{article.subtitle}</p>}

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          )}

          {/* Author and Date */}
          <div className="flex items-center gap-4 border-t pt-4">
            <div className="flex items-center gap-3">
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
                  {article.publishedAt
                    ? format(new Date(article.publishedAt), 'MMMM d, yyyy')
                    : format(new Date(article.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {contentBlocks.length === 0 ? (
            <p className="italic text-muted-foreground">No content yet</p>
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
                    <blockquote key={block.id || index} className="border-l-4 pl-4 italic">
                      {block.data?.text || ''}
                      {block.data?.caption && (
                        <footer className="mt-2 text-sm">— {block.data.caption}</footer>
                      )}
                    </blockquote>
                  )

                case 'code':
                  return (
                    <pre
                      key={block.id || index}
                      className="overflow-x-auto rounded-lg bg-muted p-4"
                    >
                      <code>{block.data?.code || ''}</code>
                    </pre>
                  )

                case 'image':
                  return (
                    <figure key={block.id || index} className="my-8">
                      <img
                        src={block.data?.url || ''}
                        alt={block.data?.caption || ''}
                        className="w-full rounded-lg"
                      />
                      {block.data?.caption && (
                        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                          {block.data.caption}
                        </figcaption>
                      )}
                    </figure>
                  )

                case 'divider':
                  return <hr key={block.id || index} className="my-8" />

                default:
                  return null
              }
            })
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 border-t pt-6">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 flex gap-6 border-t pt-6 text-sm text-muted-foreground">
          <span>{article.viewCount} views</span>
          <span>{article.likeCount} likes</span>
          <span>{article.shareCount} shares</span>
        </div>
      </article>
    </>
  )
}
