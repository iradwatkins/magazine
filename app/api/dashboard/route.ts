/**
 * Dashboard API Endpoint
 *
 * GET /api/dashboard - Get dashboard statistics and metrics
 *
 * @module app/api/dashboard
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/dashboard
 *
 * Returns dashboard statistics including:
 * - Total articles, published, drafts
 * - Total views and comments
 * - Recent articles with images
 * - User information
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get article counts by status
    const [totalArticles, publishedArticles, draftArticles] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
    ])

    // Get total views (sum of all article views)
    const viewsResult = await prisma.article.aggregate({
      _sum: {
        viewCount: true,
      },
    })
    const totalViews = viewsResult._sum.viewCount || 0

    // Get total comments
    const totalComments = await prisma.comment.count()

    // Get recent articles based on user role
    // ADMIN and MAGAZINE_EDITOR see all articles
    // Others see only their own articles
    const recentArticles = await prisma.article.findMany({
      where: ['ADMIN', 'MAGAZINE_EDITOR'].includes(user.role)
        ? {}
        : { authorId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Format articles - featuredImage already comes from the query
    const formattedArticles = recentArticles.map(article => ({
      ...article,
      featuredImage: article.featuredImage || null
    }))

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image
      },
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews,
        totalComments,
      },
      recentArticles: formattedArticles
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}