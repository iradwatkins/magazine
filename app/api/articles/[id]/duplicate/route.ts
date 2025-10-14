/**
 * Article Duplication API Endpoint
 *
 * POST /api/articles/:id/duplicate - Duplicate an existing article
 *
 * Creates a copy of an article with:
 * - Modified title (appends " (Copy)")
 * - Unique slug generated from new title
 * - Reset stats (views, likes, shares to 0)
 * - Reset publishing data (status to DRAFT, publishedAt to null)
 * - Reset review data (submittedAt, reviewedBy, etc. to null)
 * - Current user as author
 * - Copy of all content, metadata, tags, category
 *
 * @module app/api/articles/[id]/duplicate
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/articles'
import { ArticlePermissions } from '@/lib/rbac'
import { UserRole } from '@prisma/client'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * POST /api/articles/:id/duplicate
 *
 * Duplicates an existing article
 * Only the author or editors/admins can duplicate articles
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params

    // Fetch the original article
    const originalArticle = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (!originalArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check permissions - SSO compatible
    // Only the author or editors/admins can duplicate
    const userRole = (session.user as any)?.role || 'USER'
    const userRoles = [userRole] as UserRole[]
    const canEdit = ArticlePermissions.canEdit(userRoles, originalArticle.authorId, session.user.id)

    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to duplicate this article' },
        { status: 403 }
      )
    }

    // Generate new title with " (Copy)" suffix
    const newTitle = `${originalArticle.title} (Copy)`

    // Generate unique slug from new title
    const newSlug = await generateUniqueSlug(newTitle)

    // Get current user's info for author fields
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create the duplicate article
    const duplicatedArticle = await prisma.article.create({
      data: {
        // Set current user as author
        authorId: currentUser.id,
        authorName: currentUser.name || 'Anonymous',
        authorPhoto: currentUser.image,
        authorBio: currentUser.bio,

        // Modified fields
        title: newTitle,
        slug: newSlug,

        // Copied content and metadata
        subtitle: originalArticle.subtitle,
        content: originalArticle.content,
        excerpt: originalArticle.excerpt,

        // Copied media
        featuredImage: originalArticle.featuredImage,
        images: originalArticle.images,

        // Copied categorization
        category: originalArticle.category,
        tags: originalArticle.tags,

        // Copied SEO
        metaTitle: originalArticle.metaTitle,
        metaDescription: originalArticle.metaDescription,

        // Reset publishing status
        status: 'DRAFT',
        publishedAt: null,

        // Reset review data
        submittedAt: null,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,

        // Copy featured status
        isFeatured: originalArticle.isFeatured,
        featuredUntil: originalArticle.featuredUntil,

        // Reset stats
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,

        // Timestamps are auto-set by Prisma
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    })

    return NextResponse.json({
      success: true,
      id: duplicatedArticle.id,
      title: duplicatedArticle.title,
      slug: duplicatedArticle.slug,
      message: 'Article duplicated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to duplicate article' },
      { status: 500 }
    )
  }
}
