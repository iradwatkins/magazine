/**
 * Article Workflow - Reject (Editor+ only)
 * POST /api/articles/:id/reject
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAnyRoleAuth } from '@/lib/auth-middleware'
import { rejectArticle } from '@/lib/articles'

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    const session = await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])

    const { id } = await context.params
    const body = await req.json()
    const { feedback } = body

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback is required when rejecting an article' },
        { status: 400 }
      )
    }

    const article = await rejectArticle(id, session.user.id, feedback)

    return NextResponse.json({
      message: 'Article rejected',
      article,
    })
  } catch (error) {
    console.error('Error rejecting article:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reject article' },
      { status: 400 }
    )
  }
}
