/**
 * Comments API - Create New Comments (Story 7.3)
 * POST /api/comments - Create comment (authenticated users)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * POST /api/comments
 * Create a new comment (authenticated users only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const { articleId, content, parentId } = body

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

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    // Verify article exists and is published
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, status: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    if (article.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Comments are only allowed on published articles' },
        { status: 400 }
      )
    }

    // If parent comment specified, validate it exists and belongs to same article
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { articleId: true },
      })

      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }

      if (parentComment.articleId !== articleId) {
        return NextResponse.json(
          { error: 'Parent comment does not belong to this article' },
          { status: 400 }
        )
      }
    }

    // Create comment with user info
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        articleId,
        userId: session.user.id,
        userName: session.user.name || 'Anonymous',
        userPhoto: session.user.image || null,
        parentId: parentId || null,
        isApproved: true, // Auto-approve comments per Story 7.3 requirements
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

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    )
  }
}
