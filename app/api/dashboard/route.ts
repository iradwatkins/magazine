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
 * - Total views
 * - Recent activity (last 10 articles)
 * - Popular articles (top 5 by views, last 30 days)
 * - Top contributors (top 5 by article count)
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Get recent activity - last 10 articles (created, updated, or published)
    const recentActivity = await prisma.article.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
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

    // Get popular articles - top 5 by view count (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const popularArticles = await prisma.article.findMany({
      take: 5,
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        featuredImageUrl: true,
        category: true,
      },
    })

    // Get top contributors - top 5 authors by article count
    const topContributors = await prisma.user.findMany({
      take: 5,
      where: {
        articles: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
    })

    return NextResponse.json({
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews,
      },
      recentActivity,
      popularArticles,
      topContributors,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
