/**
 * Article Service Layer
 * Business logic for article management
 */

import { prisma } from './db'
import { ArticleStatus, ArticleCategory, Prisma } from '@prisma/client'

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
          roles: true,
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
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          author: {
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
 * Get article by slug
 */
export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
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

  // Increment view count
  if (article) {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
  }

  return article
}

/**
 * List articles with filters and pagination
 */
export async function listArticles(
  filters: ArticleFilters = {},
  page: number = 1,
  limit: number = 20
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

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

  return article
}

/**
 * Delete article
 */
export async function deleteArticle(id: string) {
  // This will cascade delete comments due to the schema
  await prisma.article.delete({
    where: { id },
  })
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

  return await prisma.article.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: article.publishedAt || new Date(),
    },
  })
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
