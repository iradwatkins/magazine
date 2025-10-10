/**
 * Comments API - List and Create
 * GET /api/comments - List comments (with filters)
 * POST /api/comments - Create comment (authenticated users)
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth, getSession } from '@/lib/auth-middleware'
import { listComments, createComment, getCommentStats } from '@/lib/comments'
import { CommentStatus } from '@prisma/client'

/**
 * GET /api/comments
 * List comments with filters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(req.url)

    const articleId = searchParams.get('articleId')
    const authorId = searchParams.get('authorId')
    const status = searchParams.get('status') as CommentStatus | null
    const parentId = searchParams.get('parentId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Non-authenticated users can only see approved comments
    let finalStatus = status
    if (!session?.user && status !== 'APPROVED') {
      finalStatus = 'APPROVED'
    }

    // If requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getCommentStats(articleId || undefined)
      return NextResponse.json({ stats })
    }

    const result = await listComments(
      {
        articleId: articleId || undefined,
        authorId: authorId || undefined,
        status: finalStatus || undefined,
        parentId: parentId === 'null' ? null : parentId || undefined,
      },
      page,
      limit
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing comments:', error)
    return NextResponse.json({ error: 'Failed to list comments' }, { status: 500 })
  }
}

/**
 * POST /api/comments
 * Create a new comment (authenticated users only)
 */
export const POST = withAuth(async (req, session) => {
  try {
    const body = await req.json()
    const { content, articleId, parentId } = body

    // Validation
    if (!content || !articleId) {
      return NextResponse.json({ error: 'Content and articleId are required' }, { status: 400 })
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

    const comment = await createComment({
      content: content.trim(),
      articleId,
      authorId: session.user.id,
      parentId: parentId || undefined,
    })

    return NextResponse.json(
      {
        message: 'Comment created successfully and is pending moderation',
        comment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    )
  }
})
