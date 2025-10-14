import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/rbac'

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to access media
    const hasMediaPermission = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
    if (!hasMediaPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const mimeType = searchParams.get('mimeType') || ''
    const sortBy = searchParams.get('sortBy') || 'newest'

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (mimeType) {
      where.mimeType = mimeType
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' }
    } else if (sortBy === 'filename') {
      orderBy = { filename: 'asc' }
    }

    // Fetch media with pagination
    const [media, totalCount] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          filename: true,
          url: true,
          thumbnailUrl: true,
          mimeType: true,
          size: true,
          width: true,
          height: true,
          alt: true,
          caption: true,
          createdAt: true,
        },
      }),
      prisma.media.count({ where }),
    ])

    const hasMore = skip + media.length < totalCount

    return NextResponse.json({
      media: media.map((item) => ({
        ...item,
        uploadedAt: item.createdAt.toISOString(),
        createdAt: undefined, // Remove createdAt, we use uploadedAt
      })),
      hasMore,
      total: totalCount,
      page,
      limit,
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}
