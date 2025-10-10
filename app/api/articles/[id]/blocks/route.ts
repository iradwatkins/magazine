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

    // TODO: Check user has write permission for this article
    // const article = await getArticle(params.id)
    // if (!article) {
    //   return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    // }
    // if (article.authorId !== session.user.id && !hasPermission(session.user, 'EDIT_ANY_ARTICLE')) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    await updateArticleBlocks(params.id, blocks)

    return NextResponse.json({
      success: true,
      message: 'Blocks updated successfully',
    })
  } catch (error) {
    console.error('Error updating blocks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
