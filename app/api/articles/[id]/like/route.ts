/**
 * Article Like API Endpoint (Story 7.5)
 *
 * POST /api/articles/[id]/like
 *
 * Toggle like/unlike for an article
 * - Requires authentication
 * - Article must exist and be PUBLISHED
 * - One like per user per article (toggle behavior)
 * - Uses transactions for atomic like count updates
 *
 * @module app/api/articles/[id]/like
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Check if article exists and is published
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, status: true },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    if (article.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Article is not published' },
        { status: 403 }
      )
    }

    // Check if user has already liked this article
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: id,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      // Unlike: Delete the like and decrement count
      await prisma.$transaction([
        prisma.articleLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.article.update({
          where: { id },
          data: { likeCount: { decrement: 1 } },
        }),
      ])

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Article unliked',
      })
    } else {
      // Like: Create like and increment count
      await prisma.$transaction([
        prisma.articleLike.create({
          data: {
            articleId: id,
            userId: session.user.id,
          },
        }),
        prisma.article.update({
          where: { id },
          data: { likeCount: { increment: 1 } },
        }),
      ])

      return NextResponse.json({
        success: true,
        liked: true,
        message: 'Article liked',
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
