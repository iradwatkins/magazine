/**
 * Article API - Individual Article Operations
 * GET /api/articles/:id - Get article by ID
 * PUT /api/articles/:id - Update article
 * DELETE /api/articles/:id - Delete article
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession, handleAuthError } from '@/lib/auth-middleware'
import { ArticlePermissions } from '@/lib/rbac'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles'
import { UserRole } from '@prisma/client'

/**
 * GET /api/articles/:id
 * Get article by ID (public for published articles)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    const article = await getArticleById(id)

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Public users can only see published articles
    if (!session?.user && article.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Writers can only see their own non-published articles
    // SSO provides single role, convert to array for RBAC functions
    const userRole = (session?.user as any)?.role || 'USER'
    const userRoles = [userRole] as UserRole[]
    const isAuthor = session?.user?.id === article.authorId
    const canViewUnpublished = ArticlePermissions.canReview(userRoles) || isAuthor

    if (article.status !== 'PUBLISHED' && !canViewUnpublished) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error getting article:', error)
    return NextResponse.json({ error: 'Failed to get article' }, { status: 500 })
  }
}

/**
 * PUT /api/articles/:id
 * Update article (author or editor+)
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const article = await getArticleById(id)

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check permissions
    // SSO provides single role, convert to array for RBAC functions
    const userRole = (session.user as any)?.role || 'USER'
    const userRoles = [userRole] as UserRole[]
    const canEdit = ArticlePermissions.canEdit(userRoles, article.authorId, session.user.id)

    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this article' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, slug, content, excerpt, category, featuredImageUrl, tags, status } = body

    const updatedArticle = await updateArticle(id, {
      title,
      slug,
      content,
      excerpt,
      category,
      featuredImageUrl,
      tags,
      status,
    })

    return NextResponse.json({
      message: 'Article updated successfully',
      article: updatedArticle,
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update article' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/articles/:id
 * Partial update article (for inline editing)
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const article = await getArticleById(id)

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check permissions
    // SSO provides single role, convert to array for RBAC functions
    const userRole = (session.user as any)?.role || 'USER'
    const userRoles = [userRole] as UserRole[]
    const canEdit = ArticlePermissions.canEdit(userRoles, article.authorId, session.user.id)

    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this article' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Only allow specific fields for inline editing
    const allowedFields = ['title', 'status', 'category']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Validate that at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
    }

    // Validate title length if title is being updated
    if (updateData.title !== undefined) {
      if (typeof updateData.title !== 'string' || updateData.title.trim().length === 0) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
      }
      if (updateData.title.length > 200) {
        return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 })
      }
    }

    const updatedArticle = await updateArticle(id, updateData)

    return NextResponse.json({
      message: 'Article updated successfully',
      article: updatedArticle,
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update article' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/articles/:id
 * Delete article (editor+ only)
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const article = await getArticleById(id)

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check permissions (only editors and admins can delete)
    // SSO provides single role, convert to array for RBAC functions
    const userRole = (session.user as any)?.role || 'USER'
    const userRoles = [userRole] as UserRole[]
    const canDelete = ArticlePermissions.canDelete(userRoles)

    if (!canDelete) {
      return NextResponse.json(
        { error: 'You do not have permission to delete articles' },
        { status: 403 }
      )
    }

    await deleteArticle(id)

    return NextResponse.json({
      message: 'Article deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
