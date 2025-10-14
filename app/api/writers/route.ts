/**
 * Writer Profiles API - List
 * GET /api/writers - List all writer profiles
 */

import { NextRequest, NextResponse } from 'next/server'
import { listWriterProfiles, searchWriterProfiles, getFeaturedWriters } from '@/lib/writer-profiles'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const query = searchParams.get('q')
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get featured writers
    if (featured) {
      const featuredLimit = parseInt(searchParams.get('limit') || '5')
      const writers = await getFeaturedWriters(featuredLimit)
      return NextResponse.json({ writers })
    }

    // Search writers
    if (query) {
      const result = await searchWriterProfiles(query, page, limit)
      return NextResponse.json(result)
    }

    // List all writers
    const result = await listWriterProfiles(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list writers' }, { status: 500 })
  }
}
