/**
 * Comment Moderation API (Editor+ only)
 * POST /api/comments/:id/moderate - Approve/Reject/Spam comment
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAnyRoleAuth } from '@/lib/auth-middleware'
import { approveComment, rejectComment, flagCommentAsSpam } from '@/lib/comments'

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
