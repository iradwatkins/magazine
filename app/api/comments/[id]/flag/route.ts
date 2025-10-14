/**
 * Comment Flag API (Story 7.4)
 * POST /api/comments/:id/flag - Flag/report a comment as inappropriate
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * POST /api/comments/:id/flag
 * Flag a comment as inappropriate
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

    const { id } = await params
    const body = await req.json()
    const { reason, details } = body

    // Validation
    const validReasons = ['spam', 'harassment', 'inappropriate', 'off-topic', 'other']
    if (!reason || !validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid reason. Must be one of: spam, harassment, inappropriate, off-topic, other' },
        { status: 400 }
      )
    }

    // Check comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check if comment is already deleted
    if (comment.deletedAt) {
      return NextResponse.json({ error: 'Cannot flag a deleted comment' }, { status: 400 })
    }

    // Check if user is trying to flag their own comment
    if (comment.userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot flag your own comment' }, { status: 400 })
    }

    // Check if user already flagged this comment
    const existingFlag = await prisma.commentFlag.findUnique({
      where: {
        commentId_userId: {
          commentId: id,
          userId: session.user.id,
        },
      },
    })

    if (existingFlag) {
      return NextResponse.json(
        { error: 'You have already flagged this comment' },
        { status: 400 }
      )
    }

    // Create flag and update comment
    await prisma.$transaction([
      prisma.commentFlag.create({
        data: {
          id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          commentId: id,
          userId: session.user.id,
          reason,
          details: details || null,
        },
      }),
      prisma.comment.update({
        where: { id },
        data: {
          isFlagged: true,
          flagCount: { increment: 1 },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Comment flagged successfully',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to flag comment' }, { status: 500 })
  }
}
