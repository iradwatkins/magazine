/**
 * Comment Unflag API (Story 7.4)
 * POST /api/comments/:id/unflag - Approve comment and clear all flags (moderator only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * POST /api/comments/:id/unflag
 * Clear all flags and mark comment as approved
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Delete all flags and update comment
    await prisma.$transaction([
      // Delete all flags for this comment
      prisma.commentFlag.deleteMany({
        where: { commentId: id },
      }),
      // Update comment to clear flag status
      prisma.comment.update({
        where: { id },
        data: {
          isFlagged: false,
          flagCount: 0,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Comment approved and flags cleared',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unflag comment' }, { status: 500 })
  }
}
