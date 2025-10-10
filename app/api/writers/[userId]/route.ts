/**
 * Writer Profile API - Individual Profile Operations
 * GET /api/writers/:userId - Get writer profile with stats
 * PUT /api/writers/:userId - Update writer profile (self or admin)
 * DELETE /api/writers/:userId - Delete writer profile (self or admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-middleware'
import { UserRole } from '@prisma/client'
import {
  getWriterProfileWithStats,
  upsertWriterProfile,
  deleteWriterProfile,
  getWriterArticles,
} from '@/lib/writer-profiles'

/**
 * GET /api/writers/:userId
 * Get writer profile with statistics and articles
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const { searchParams } = new URL(req.url)

    const includeArticles = searchParams.get('articles') === 'true'
    const articlesPage = parseInt(searchParams.get('articlesPage') || '1')
    const articlesLimit = parseInt(searchParams.get('articlesLimit') || '10')

    const profile = await getWriterProfileWithStats(userId)

    if (!profile) {
      return NextResponse.json({ error: 'Writer profile not found' }, { status: 404 })
    }

    let articles = null
    if (includeArticles) {
      articles = await getWriterArticles(userId, articlesPage, articlesLimit)
    }

    return NextResponse.json({
      profile,
      articles,
    })
  } catch (error) {
    console.error('Error getting writer profile:', error)
    return NextResponse.json({ error: 'Failed to get writer profile' }, { status: 500 })
  }
}

/**
 * PUT /api/writers/:userId
 * Update writer profile (self or admin)
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check permissions - can only edit own profile unless admin
    const userRoles = (session.user.roles || ['USER']) as UserRole[]
    const isAdmin = userRoles.includes('ADMIN')
    const isSelf = session.user.id === userId

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: 'You can only edit your own profile' }, { status: 403 })
    }

    const body = await req.json()
    const { bio, website, twitter, linkedin, instagram, facebook, expertise, specialties } = body

    const profile = await upsertWriterProfile(userId, {
      bio,
      website,
      twitter,
      linkedin,
      instagram,
      facebook,
      expertise,
      specialties,
    })

    return NextResponse.json({
      message: 'Writer profile updated successfully',
      profile,
    })
  } catch (error) {
    console.error('Error updating writer profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update writer profile' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/writers/:userId
 * Delete writer profile (self or admin)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check permissions - can only delete own profile unless admin
    const userRoles = (session.user.roles || ['USER']) as UserRole[]
    const isAdmin = userRoles.includes('ADMIN')
    const isSelf = session.user.id === userId

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: 'You can only delete your own profile' }, { status: 403 })
    }

    await deleteWriterProfile(userId)

    return NextResponse.json({
      message: 'Writer profile deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting writer profile:', error)
    return NextResponse.json({ error: 'Failed to delete writer profile' }, { status: 500 })
  }
}
