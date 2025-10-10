/**
 * Comment API - Individual Comment Operations
 * GET /api/comments/:id - Get comment by ID
 * PUT /api/comments/:id - Update comment
 * DELETE /api/comments/:id - Delete comment
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-middleware'
import { CommentPermissions } from '@/lib/rbac'
import { getCommentById, updateComment, deleteComment } from '@/lib/comments'
import { UserRole } from '@prisma/client'

/**
 * GET /api/comments/:id
 * Get comment by ID
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    const comment = await getCommentById(id)

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Non-authenticated users can only see approved comments
    if (!session?.user && comment.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Regular users can see their own comments regardless of status
    const isAuthor = session?.user?.id === comment.authorId
    const userRoles = (session?.user?.roles || ['USER']) as UserRole[]
    const canModerate = CommentPermissions.canModerate(userRoles)

    if (comment.status !== 'APPROVED' && !isAuthor && !canModerate) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error getting comment:', error)
    return NextResponse.json({ error: 'Failed to get comment' }, { status: 500 })
  }
}

/**
 * PUT /api/comments/:id
 * Update comment (author only, within edit window)
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const comment = await getCommentById(id)

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check permissions
    const userRoles = (session.user.roles || ['USER']) as UserRole[]
    const canEdit = CommentPermissions.canEdit(userRoles, comment.authorId, session.user.id)

    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this comment' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { content } = body

    // Validation
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters long' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be less than 2000 characters' },
        { status: 400 }
      )
    }

    const updatedComment = await updateComment(id, {
      content: content.trim(),
      // Reset to pending if content changed
      status: content !== comment.content ? 'PENDING' : comment.status,
    })

    return NextResponse.json({
      message: 'Comment updated successfully',
      comment: updatedComment,
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

/**
 * DELETE /api/comments/:id
 * Delete comment (author or moderator)
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const comment = await getCommentById(id)

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check permissions
    const userRoles = (session.user.roles || ['USER']) as UserRole[]
    const canDelete = CommentPermissions.canDelete(userRoles, comment.authorId, session.user.id)

    if (!canDelete) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this comment' },
        { status: 403 }
      )
    }

    await deleteComment(id)

    return NextResponse.json({
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
