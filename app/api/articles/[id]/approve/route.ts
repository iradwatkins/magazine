/**
 * Article Workflow - Approve (Editor+ only)
 * POST /api/articles/:id/approve
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAnyRoleAuth } from '@/lib/auth-middleware'
import { approveArticle } from '@/lib/articles'

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Require editor or admin role
    const session = await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])

    const { id } = await context.params
    const body = await req.json()
    const { feedback } = body

    const article = await approveArticle(id, session.user.id, feedback)

    return NextResponse.json({
      message: 'Article approved successfully',
      article,
    })
  } catch (error) {
    console.error('Error approving article:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to approve article' },
      { status: 400 }
    )
  }
}
