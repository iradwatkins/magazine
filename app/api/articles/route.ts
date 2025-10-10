/**
 * Articles API - List and Create
 * GET /api/articles - List articles (public for published, auth for drafts)
 * POST /api/articles - Create article (writer+ only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-middleware'
import { listArticles, createArticle, generateUniqueSlug } from '@/lib/articles'
import { ArticleStatus, ArticleCategory, UserRole } from '@prisma/client'

/**
 * GET /api/articles
 * List articles with filters and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status') as ArticleStatus | null
    const category = searchParams.get('category') as ArticleCategory | null
    const authorId = searchParams.get('authorId')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Non-authenticated users can only see published articles
    let finalStatus = status
    if (!session?.user && status !== 'PUBLISHED') {
      finalStatus = 'PUBLISHED'
    }

    const result = await listArticles(
      {
        status: finalStatus || undefined,
        category: category || undefined,
        authorId: authorId || undefined,
        tag: tag || undefined,
        search: search || undefined,
      },
      page,
      limit
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing articles:', error)
    return NextResponse.json({ error: 'Failed to list articles' }, { status: 500 })
  }
}

/**
 * POST /api/articles
 * Create a new article (writer+ only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // SSO provides single role, convert to array for RBAC functions
    const userRole = (session.user as any)?.role || 'USER'
    const userRoles = [userRole] as UserRole[]

    // Check if user has writer permissions
    const hasWriterPermission = userRoles.some((role) =>
      ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(role)
    )

    if (!hasWriterPermission) {
      return NextResponse.json(
        { error: 'You need writer permissions to create articles' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, content, excerpt, category, featuredImageUrl, tags } = body

    // Validation
    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 })
    }

    // Validate category
    const validCategories: ArticleCategory[] = [
      'NEWS',
      'EVENTS',
      'INTERVIEWS',
      'HISTORY',
      'TUTORIALS',
      'LIFESTYLE',
      'FASHION',
      'MUSIC',
      'COMMUNITY',
      'OTHER',
    ]
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate unique slug from title
    const slug = await generateUniqueSlug(title)

    const article = await createArticle({
      title,
      slug,
      content: content || JSON.stringify([]),
      excerpt: excerpt || '',
      category,
      authorId: session.user.id,
      featuredImageUrl,
      tags: tags || [],
      status: 'DRAFT',
    })

    return NextResponse.json({ message: 'Article created successfully', article }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create article' },
      { status: 500 }
    )
  }
}
