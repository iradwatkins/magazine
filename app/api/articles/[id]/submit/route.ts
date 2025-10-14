/**
 * Article Workflow - Submit for Review
 * POST /api/articles/:id/submit
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-middleware'
import { submitArticleForReview } from '@/lib/articles'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const article = await submitArticleForReview(id, session.user.id)

    return NextResponse.json({
      message: 'Article submitted for review',
      article,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit article' },
      { status: 400 }
    )
  }
}
