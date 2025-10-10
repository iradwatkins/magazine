/**
 * Articles API - List and Create
 * GET /api/articles - List articles (public for published, auth for drafts)
 * POST /api/articles - Create article (writer+ only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAnyRole, getSession } from '@/lib/auth-middleware'
import { listArticles, createArticle, generateUniqueSlug } from '@/lib/articles'
import { ArticleStatus, ArticleCategory } from '@prisma/client'

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
export const POST = withAnyRole(
  ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'],
  async (req, session) => {
    try {
      const body = await req.json()
      const { title, content, excerpt, category, featuredImageUrl, tags } = body

      // Validation
      if (!title || !content || !category) {
        return NextResponse.json(
          { error: 'Title, content, and category are required' },
          { status: 400 }
        )
      }

      // Validate category
      const validCategories: ArticleCategory[] = [
        'NEWS',
        'CULTURE',
        'EVENTS',
        'INTERVIEWS',
        'TUTORIALS',
        'COMMUNITY',
        'OPINION',
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
        content,
        excerpt,
        category,
        authorId: session.user.id,
        featuredImageUrl,
        tags: tags || [],
        status: 'DRAFT',
      })

      return NextResponse.json(
        { message: 'Article created successfully', article },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error creating article:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to create article' },
        { status: 500 }
      )
    }
  }
)
