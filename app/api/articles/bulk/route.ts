/**
 * Bulk Articles API Endpoint
 *
 * POST /api/articles/bulk - Perform bulk operations on articles
 *
 * @module app/api/articles/bulk
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * POST /api/articles/bulk
 *
 * Bulk operations: publish, unpublish, delete, change-category
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action, articleIds, category } = body

    if (!action || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Check user permissions - only editors and admins can perform bulk actions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const userRole = user?.role || 'USER'
    const canPerformBulkActions = ['MAGAZINE_EDITOR', 'ADMIN'].includes(userRole)

    if (!canPerformBulkActions) {
      return NextResponse.json(
        { error: 'You need editor permissions to perform bulk actions' },
        { status: 403 }
      )
    }

    let result: any

    switch (action) {
      case 'publish':
        result = await prisma.article.updateMany({
          where: {
            id: { in: articleIds },
          },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
          },
        })
        break

      case 'unpublish':
        result = await prisma.article.updateMany({
          where: {
            id: { in: articleIds },
          },
          data: {
            status: 'DRAFT',
          },
        })
        break

      case 'delete':
        result = await prisma.article.deleteMany({
          where: {
            id: { in: articleIds },
          },
        })
        break

      case 'change-category':
        if (!category) {
          return NextResponse.json({ error: 'Category is required' }, { status: 400 })
        }

        result = await prisma.article.updateMany({
          where: {
            id: { in: articleIds },
          },
          data: {
            category,
          },
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} article(s) ${action === 'change-category' ? 'updated' : action}ed successfully`,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
