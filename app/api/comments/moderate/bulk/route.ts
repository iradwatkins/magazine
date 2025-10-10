/**
 * Bulk Comment Moderation API (Editor+ only)
 * POST /api/comments/moderate/bulk - Approve/Reject multiple comments at once
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAnyRoleAuth } from '@/lib/auth-middleware'
import { bulkApproveComments, bulkRejectComments } from '@/lib/comments'

export async function POST(req: NextRequest) {
  try {
    // Require editor or admin role
    await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])

    const body = await req.json()
    const { commentIds, action, reason } = body

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json(
        { error: 'commentIds array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json({ error: 'Action is required (approve or reject)' }, { status: 400 })
    }

    let result

    switch (action) {
      case 'approve':
        result = await bulkApproveComments(commentIds)
        return NextResponse.json({
          message: `${result.count} comment(s) approved successfully`,
          count: result.count,
        })

      case 'reject':
        result = await bulkRejectComments(commentIds, reason)
        return NextResponse.json({
          message: `${result.count} comment(s) rejected`,
          count: result.count,
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be approve or reject' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error bulk moderating comments:', error)

    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json({ error: 'Failed to moderate comments' }, { status: 500 })
  }
}
