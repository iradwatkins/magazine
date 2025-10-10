/**
 * Comment API - Edit and Delete Comment (Story 7.3 & 7.4)
 * PATCH /api/comments/:id - Update comment (author only, within 15 min edit window)
 * DELETE /api/comments/:id - Delete own comment (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * PATCH /api/comments/:id
 * Update comment (author only, within 15 minute edit window)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { content } = body

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.trim().length < 1) {
      return NextResponse.json({ error: 'Content must be at least 1 character' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Content must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Check comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (existingComment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Check 15 minute edit window
    const now = new Date()
    const commentAge = now.getTime() - existingComment.createdAt.getTime()
    const fifteenMinutes = 15 * 60 * 1000 // 15 minutes in milliseconds

    if (commentAge > fifteenMinutes) {
      return NextResponse.json(
        { error: 'Edit window expired (15 minutes)' },
        { status: 403 }
      )
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

/**
 * DELETE /api/comments/:id
 * Delete own comment (soft delete)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params

    // Check comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check if user owns the comment
    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Check if already deleted
    if (comment.deletedAt) {
      return NextResponse.json({ error: 'Comment already deleted' }, { status: 400 })
    }

    // Soft delete the comment
    await prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: session.user.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
