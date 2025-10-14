/**
 * Article Service Layer
 * Business logic for article management
 */

import { prisma } from './db'
import { ArticleStatus, ArticleCategory, Prisma } from '@prisma/client'
import { getCache, setCache, deleteCache, deleteCachePattern } from './redis'

export interface CreateArticleInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  category: ArticleCategory
  authorId: string
  featuredImageUrl?: string
  tags?: string[]
  status?: ArticleStatus
}

export interface UpdateArticleInput {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  category?: ArticleCategory
  featuredImageUrl?: string
  tags?: string[]
  status?: ArticleStatus
}

export interface ArticleFilters {
  status?: ArticleStatus
  category?: ArticleCategory
  authorId?: string
  tag?: string
  search?: string
}

/**
 * Create a new article
 */
export async function createArticle(input: CreateArticleInput) {
  const { tags, ...articleData } = input

  // Check if slug already exists
  const existing = await prisma.article.findUnique({
    where: { slug: input.slug },
  })

  if (existing) {
    throw new Error(`Article with slug "${input.slug}" already exists`)
  }

  // Get author information
  const author = await prisma.user.findUnique({
    where: { id: input.authorId },
    select: {
      id: true,
      name: true,
      image: true,
      writerProfile: {
        select: {
          bio: true,
        },
      },
    },
  })

  if (!author) {
    throw new Error('Author not found')
  }

  const article = await prisma.article.create({
    data: {
      ...articleData,
      authorName: author.name || 'Anonymous',
      authorPhoto: author.image,
      authorBio: author.writerProfile?.bio,
      status: input.status || 'DRAFT',
      tags: tags || [],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  return article
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  })

  return article
}

/**
 * Get article by slug (with Redis caching - Story 9.6)
 * Use this for metadata generation or preview
 */
export async function getArticleBySlug(slug: string, incrementView: boolean = false) {
  // Try to get from cache first (only for non-incrementing views)
  if (!incrementView) {
    const cached = await getCache<any>(`article:slug:${slug}`)
    if (cached) {
      return cached
    }
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  // Cache published articles for 5 minutes
  if (article && article.status === 'PUBLISHED' && !incrementView) {
    await setCache(`article:slug:${slug}`, article, 300)
  }

  // Optionally increment view count (only when rendering full page)
  if (article && incrementView) {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
  }

  return article
}

/**
 * Increment article view count
 * Should be called client-side after page load
 */
export async function incrementArticleView(articleId: string) {
  await prisma.article.update({
    where: { id: articleId },
    data: { viewCount: { increment: 1 } },
  })
}

/**
 * List articles with filters and pagination
 */
export async function listArticles(
  filters: ArticleFilters = {},
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'updatedAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const where: Prisma.ArticleWhereInput = {}

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.category) {
    where.category = filters.category
  }

  if (filters.authorId) {
    where.authorId = filters.authorId
  }

  if (filters.tag) {
    where.tags = {
      has: filters.tag,
    }
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
      { excerpt: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  // Build orderBy based on sortBy parameter
  let orderBy: any = { [sortBy]: sortOrder }

  // Special handling for author sorting (nested relation)
  if (sortBy === 'author') {
    orderBy = { author: { name: sortOrder } }
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ])

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Update article
 */
export async function updateArticle(id: string, input: UpdateArticleInput) {
  // Get current article to clear old cache
  const currentArticle = await prisma.article.findUnique({ where: { id } })

  // If slug is being updated, check it doesn't conflict
  if (input.slug) {
    const existing = await prisma.article.findFirst({
      where: {
        slug: input.slug,
        NOT: { id },
      },
    })

    if (existing) {
      throw new Error(`Article with slug "${input.slug}" already exists`)
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data: input,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  // Invalidate cache (Story 9.6)
  if (currentArticle) {
    await deleteCache(`article:slug:${currentArticle.slug}`)
    await deleteCache(`article:id:${id}`)
  }
  // Also invalidate new slug if changed
  if (input.slug && input.slug !== currentArticle?.slug) {
    await deleteCache(`article:slug:${input.slug}`)
  }
  // Invalidate list caches
  await deleteCachePattern('articles:list:*')
  await deleteCachePattern('articles:category:*')
  await deleteCachePattern('articles:tag:*')

  return article
}

/**
 * Delete article
 */
export async function deleteArticle(id: string) {
  // Get article to clear cache
  const article = await prisma.article.findUnique({ where: { id } })

  // This will cascade delete comments due to the schema
  await prisma.article.delete({
    where: { id },
  })

  // Invalidate cache (Story 9.6)
  if (article) {
    await deleteCache(`article:slug:${article.slug}`)
    await deleteCache(`article:id:${id}`)
    await deleteCachePattern('articles:list:*')
    await deleteCachePattern('articles:category:*')
    await deleteCachePattern('articles:tag:*')
  }
}

/**
 * Submit article for review
 */
export async function submitArticleForReview(id: string, authorId: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  if (article.authorId !== authorId) {
    throw new Error('Only the author can submit their article for review')
  }

  if (article.status !== 'DRAFT') {
    throw new Error('Only draft articles can be submitted for review')
  }

  return await prisma.article.update({
    where: { id },
    data: { status: 'SUBMITTED' },
  })
}

/**
 * Approve article (editor action)
 */
export async function approveArticle(id: string, reviewerId: string, feedback?: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  if (article.status !== 'SUBMITTED') {
    throw new Error('Only submitted articles can be approved')
  }

  return await prisma.article.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewFeedback: feedback,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Reject article (editor action)
 */
export async function rejectArticle(id: string, reviewerId: string, feedback: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  if (article.status !== 'SUBMITTED') {
    throw new Error('Only submitted articles can be rejected')
  }

  return await prisma.article.update({
    where: { id },
    data: {
      status: 'REJECTED',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewFeedback: feedback,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Publish article (editor action)
 */
export async function publishArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  if (article.status !== 'APPROVED' && article.status !== 'PUBLISHED') {
    throw new Error('Only approved articles can be published')
  }

  const result = await prisma.article.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: article.publishedAt || new Date(),
    },
  })

  // Invalidate cache when publishing (Story 9.6)
  await deleteCache(`article:slug:${article.slug}`)
  await deleteCache(`article:id:${id}`)
  await deleteCachePattern('articles:list:*')
  await deleteCachePattern('articles:category:*')
  await deleteCachePattern('articles:tag:*')
  await deleteCachePattern('articles:related:*')

  return result
}

/**
 * Unpublish article (editor action)
 */
export async function unpublishArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  if (article.status !== 'PUBLISHED') {
    throw new Error('Only published articles can be unpublished')
  }

  return await prisma.article.update({
    where: { id },
    data: { status: 'ARCHIVED' },
  })
}

/**
 * Get article statistics
 */
export async function getArticleStats(authorId?: string) {
  const where = authorId ? { authorId } : {}

  const [total, byStatus, byCategory] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.article.groupBy({
      by: ['category'],
      where,
      _count: true,
    }),
  ])

  return {
    total,
    byStatus: Object.fromEntries(byStatus.map((item) => [item.status, item._count])),
    byCategory: Object.fromEntries(byCategory.map((item) => [item.category, item._count])),
  }
}

/**
 * Generate unique slug from title
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Update article blocks (content)
 *
 * @param articleId - Article ID
 * @param blocks - Array of blocks to save
 */
export async function updateArticleBlocks(articleId: string, blocks: any[]) {
  await prisma.article.update({
    where: { id: articleId },
    data: {
      content: JSON.stringify(blocks),
      updatedAt: new Date(),
    },
  })
}

/**
 * Get article for editing (alias for getArticleById)
 */
export async function getArticle(id: string) {
  return getArticleById(id)
}

/**
 * Get approved comments for an article (Story 7.2 + 7.4)
 * Returns only approved, non-deleted comments, ordered by creation date (newest first)
 */
export async function getArticleComments(articleId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      articleId,
      isApproved: true,
      deletedAt: null, // Exclude soft-deleted comments
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      content: true,
      userName: true,
      userPhoto: true,
      createdAt: true,
      updatedAt: true,
      parentId: true,
      userId: true,
      deletedAt: true, // Include for frontend display logic
    },
  })

  return comments
}

/**
 * Get related articles (Story 7.7)
 * Algorithm:
 * 1. Same category + matching tags (ranked by tag overlap)
 * 2. Fallback to same category if no tag matches
 * Returns 3-4 related articles, excludes current article
 */
export async function getRelatedArticles(
  currentArticleId: string,
  category: string,
  tags: string[],
  limit: number = 4
) {
  // Try cache first (Story 9.6)
  const cacheKey = `articles:related:${currentArticleId}:${limit}`
  const cached = await getCache<any[]>(cacheKey)
  if (cached) {
    return cached
  }

  // Get all published articles in same category (excluding current article)
  const candidates = await prisma.article.findMany({
    where: {
      id: { not: currentArticleId },
      category,
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      category: true,
      tags: true,
      authorName: true,
      authorPhoto: true,
      publishedAt: true,
      viewCount: true,
      likeCount: true,
    },
    take: 20, // Get more candidates for better matching
  })

  // Score articles by tag overlap
  const scoredArticles = candidates.map((article) => {
    const tagOverlap = article.tags.filter((tag) => tags.includes(tag)).length
    return {
      ...article,
      score: tagOverlap,
    }
  })

  // Sort by score (tag overlap) descending, then by publishedAt descending
  const sorted = scoredArticles.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    // If same score, prefer newer articles
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return bDate - aDate
  })

  // Return top N articles
  const result = sorted.slice(0, limit)

  // Cache for 10 minutes
  await setCache(cacheKey, result, 600)

  return result
}

/**
 * Get recommended articles (Story 7.9)
 * Algorithm:
 * - Authenticated users: Articles from categories they've interacted with
 * - Guests: Popular articles (by like count + view count)
 * Returns 6 recommended articles
 */
export async function getRecommendedArticles(userId?: string | null, limit: number = 6) {
  if (userId) {
    // For authenticated users: Get articles from categories they've interacted with
    const readArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { likes: { some: { userId } } },
          { comments: { some: { userId } } },
        ],
      },
      select: { category: true },
      distinct: ['category'],
      take: 5,
    })

    const interestedCategories = readArticles.map((a) => a.category)

    if (interestedCategories.length > 0) {
      // Get popular articles from those categories
      return await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          category: { in: interestedCategories },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          tags: true,
          authorName: true,
          authorPhoto: true,
          publishedAt: true,
          viewCount: true,
          likeCount: true,
        },
        orderBy: [{ likeCount: 'desc' }, { viewCount: 'desc' }, { publishedAt: 'desc' }],
        take: limit,
      })
    }
  }

  // For guests or users with no history: Return popular articles
  return await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      category: true,
      tags: true,
      authorName: true,
      authorPhoto: true,
      publishedAt: true,
      viewCount: true,
      likeCount: true,
    },
    orderBy: [{ likeCount: 'desc' }, { viewCount: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })
}
