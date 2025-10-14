import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ArticleCategory } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 50)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const featured = searchParams.get('featured') === 'true'

    const skip = (page - 1) * pageSize

    // Build where clause - only PUBLISHED articles
    const where: any = { status: 'PUBLISHED' }

    // Add category filter if provided
    if (category) {
      const upperCategory = category.toUpperCase()
      if (Object.keys(ArticleCategory).includes(upperCategory)) {
        where.category = upperCategory as ArticleCategory
      }
    }

    // Add tag filter if provided
    if (tag) {
      where.tags = { has: tag }
    }

    // Determine sort order
    const orderBy = featured
      ? [{ likeCount: 'desc' as const }, { viewCount: 'desc' as const }]
      : { publishedAt: 'desc' as const }

    // Fetch articles and total count in parallel
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ])

    // Format response with full URLs
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      category: article.category,
      tags: article.tags,
      author: {
        id: article.author.id,
        name: article.author.name,
        image: article.author.image,
      },
      publishedAt: article.publishedAt,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      url: `http://magazine.stepperslife.com/articles/${article.slug}`,
    }))

    // Build response
    const response = NextResponse.json({
      articles: formattedArticles,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })

    // Add CORS headers for stepperslife.com
    response.headers.set('Access-Control-Allow-Origin', '*') // Allow all origins for public API
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}
