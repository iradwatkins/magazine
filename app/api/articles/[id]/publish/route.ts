/**
 * Article Workflow - Publish/Unpublish (Editor+ only)
 * POST /api/articles/:id/publish - Publish article
 * DELETE /api/articles/:id/publish - Unpublish article
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAnyRoleAuth } from '@/lib/auth-middleware'
import { publishArticle, unpublishArticle } from '@/lib/articles'

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])

    const { id } = await context.params
    const article = await publishArticle(id)

    return NextResponse.json({
      message: 'Article published successfully',
      article,
    })
  } catch (error) {
    console.error('Error publishing article:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish article' },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])

    const { id } = await context.params
    const article = await unpublishArticle(id)

    return NextResponse.json({
      message: 'Article unpublished successfully',
      article,
    })
  } catch (error) {
    console.error('Error unpublishing article:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unpublish article' },
      { status: 400 }
    )
  }
}
