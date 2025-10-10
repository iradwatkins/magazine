/**
 * Comment Moderation API (Editor+ only)
 * POST /api/comments/:id/moderate - Approve/Reject/Spam comment
 * DELETE /api/comments/:id/moderate - Delete comment (moderator action)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { requireAnyRoleAuth } from '@/lib/auth-middleware'
import { approveComment, rejectComment, flagCommentAsSpam } from '@/lib/comments'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])

    const { id } = await context.params
    const body = await req.json()
    const { action, reason } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required (approve, reject, or spam)' },
        { status: 400 }
      )
    }

    let comment

    switch (action) {
      case 'approve':
        comment = await approveComment(id)
        return NextResponse.json({
          message: 'Comment approved successfully',
          comment,
        })

      case 'reject':
        if (!reason) {
          return NextResponse.json(
            { error: 'Reason is required when rejecting a comment' },
            { status: 400 }
          )
        }
        comment = await rejectComment(id, reason)
        return NextResponse.json({
          message: 'Comment rejected',
          comment,
        })

      case 'spam':
        comment = await flagCommentAsSpam(id)
        return NextResponse.json({
          message: 'Comment flagged as spam',
          comment,
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be approve, reject, or spam' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error moderating comment:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to moderate comment' },
      { status: 400 }
    )
  }
}

/**
 * DELETE /api/comments/:id/moderate
 * Delete comment as moderator (soft delete with tracking)
 */
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user has moderator permissions
    const userRole = (session.user as any)?.role || 'USER'
    const canModerate = ['MAGAZINE_EDITOR', 'ADMIN'].includes(userRole)

    if (!canModerate) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const { id } = await context.params

    // Check comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check if already deleted
    if (comment.deletedAt) {
      return NextResponse.json({ error: 'Comment already deleted' }, { status: 400 })
    }

    // Soft delete with moderator tracking
    await prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment deleted by moderator',
      moderator: session.user.name,
    })
  } catch (error) {
    console.error('Error deleting comment:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
