/**
 * Comment Service Layer
 * Business logic for comment management and moderation
 */

import { prisma } from './db'
import { CommentStatus, Prisma } from '@prisma/client'

export interface CreateCommentInput {
  content: string
  articleId: string
  authorId: string
  parentId?: string // For threaded replies
}

export interface UpdateCommentInput {
  content?: string
  status?: CommentStatus
}

export interface CommentFilters {
  articleId?: string
  authorId?: string
  status?: CommentStatus
  parentId?: string | null // null for top-level comments
}

/**
 * Create a new comment
 */
export async function createComment(input: CreateCommentInput) {
  const { content, articleId, authorId, parentId } = input

  // Validate article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, status: true },
  })

  if (!article) {
    throw new Error('Article not found')
  }

  // Only allow comments on published articles
  if (article.status !== 'PUBLISHED') {
    throw new Error('Comments are only allowed on published articles')
  }

  // If parent comment specified, validate it exists and belongs to same article
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { articleId: true },
    })

    if (!parentComment) {
      throw new Error('Parent comment not found')
    }

    if (parentComment.articleId !== articleId) {
      throw new Error('Parent comment does not belong to this article')
    }
  }

  // Get author information
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      id: true,
      name: true,
      image: true,
    },
  })

  if (!author) {
    throw new Error('Author not found')
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      articleId,
      authorId,
      authorName: author.name || 'Anonymous',
      authorPhoto: author.image,
      parentId,
      status: 'PENDING', // All comments start as pending for moderation
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })

  return comment
}

/**
 * Get comment by ID
 */
export async function getCommentById(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      replies: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'asc' },
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

  return comment
}

/**
 * List comments with filters and pagination
 */
export async function listComments(
  filters: CommentFilters = {},
  page: number = 1,
  limit: number = 20
) {
  const where: Prisma.CommentWhereInput = {}

  if (filters.articleId) {
    where.articleId = filters.articleId
  }

  if (filters.authorId) {
    where.authorId = filters.authorId
  }

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.parentId !== undefined) {
    where.parentId = filters.parentId
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ])

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get comments for an article (approved only, hierarchical)
 */
export async function getArticleComments(articleId: string) {
  // Get top-level comments (no parent)
  const topLevelComments = await prisma.comment.findMany({
    where: {
      articleId,
      parentId: null,
      status: 'APPROVED',
    },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      replies: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'asc' },
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
      _count: {
        select: {
          replies: true,
        },
      },
    },
  })

  return topLevelComments
}

/**
 * Update comment
 */
export async function updateComment(id: string, input: UpdateCommentInput) {
  const comment = await prisma.comment.update({
    where: { id },
    data: input,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  return comment
}

/**
 * Delete comment
 */
export async function deleteComment(id: string) {
  // This will cascade delete replies due to schema
  await prisma.comment.delete({
    where: { id },
  })
}

/**
 * Approve comment (moderator action)
 */
export async function approveComment(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  return await prisma.comment.update({
    where: { id },
    data: {
      status: 'APPROVED',
      moderatedAt: new Date(),
    },
  })
}

/**
 * Reject comment (moderator action)
 */
export async function rejectComment(id: string, reason?: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  return await prisma.comment.update({
    where: { id },
    data: {
      status: 'REJECTED',
      moderatedAt: new Date(),
      moderationReason: reason,
    },
  })
}

/**
 * Flag comment as spam (moderator action)
 */
export async function flagCommentAsSpam(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  return await prisma.comment.update({
    where: { id },
    data: {
      status: 'SPAM',
      moderatedAt: new Date(),
    },
  })
}

/**
 * Get comment statistics
 */
export async function getCommentStats(articleId?: string) {
  const where = articleId ? { articleId } : {}

  const [total, byStatus, pendingCount] = await Promise.all([
    prisma.comment.count({ where }),
    prisma.comment.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.comment.count({
      where: { ...where, status: 'PENDING' },
    }),
  ])

  return {
    total,
    byStatus: Object.fromEntries(byStatus.map((item) => [item.status, item._count])),
    pendingModeration: pendingCount,
  }
}

/**
 * Get comments pending moderation
 */
export async function getPendingComments(page: number = 1, limit: number = 20) {
  return listComments({ status: 'PENDING' }, page, limit)
}

/**
 * Bulk approve comments
 */
export async function bulkApproveComments(commentIds: string[]) {
  const result = await prisma.comment.updateMany({
    where: {
      id: { in: commentIds },
      status: 'PENDING',
    },
    data: {
      status: 'APPROVED',
      moderatedAt: new Date(),
    },
  })

  return result
}

/**
 * Bulk reject comments
 */
export async function bulkRejectComments(commentIds: string[], reason?: string) {
  const result = await prisma.comment.updateMany({
    where: {
      id: { in: commentIds },
      status: 'PENDING',
    },
    data: {
      status: 'REJECTED',
      moderatedAt: new Date(),
      moderationReason: reason,
    },
  })

  return result
}
