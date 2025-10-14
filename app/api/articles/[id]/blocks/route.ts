/**
 * Article Blocks API Endpoint
 *
 * PUT /api/articles/{id}/blocks - Update article blocks
 *
 * @module app/api/articles/[id]/blocks
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateArticleBlocks } from '@/lib/articles'
import { AnyBlock } from '@/types/blocks'

/**
 * PUT /api/articles/{id}/blocks
 *
 * Update article blocks array
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { blocks }: { blocks: AnyBlock[] } = await req.json()

    // Validate blocks array
    if (!Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Invalid blocks format' }, { status: 400 })
    }

    // Check user has write permission for this article
    const { getArticleById } = await import('@/lib/articles')
    const { prisma } = await import('@/lib/db')

    const article = await getArticleById(params.id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const { ArticlePermissions } = await import('@/lib/rbac')
    const userRoles = user?.role ? [user.role] : []
    const canEdit = ArticlePermissions.canEdit(userRoles, article.authorId, session.user.id)

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden - You do not have permission to edit this article' }, { status: 403 })
    }

    await updateArticleBlocks(params.id, blocks)

    return NextResponse.json({
      success: true,
      message: 'Blocks updated successfully',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
