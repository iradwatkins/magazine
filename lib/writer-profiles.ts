/**
 * WriterProfile Service Layer
 * Business logic for managing writer profiles and portfolios
 */

import { prisma } from './db'

export interface CreateWriterProfileInput {
  userId: string
  bio: string
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  facebook?: string
  expertise?: string[]
  specialties?: string[]
}

export interface UpdateWriterProfileInput {
  bio?: string
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  facebook?: string
  expertise?: string[]
  specialties?: string[]
}

/**
 * Create or update writer profile
 */
export async function upsertWriterProfile(userId: string, input: UpdateWriterProfileInput) {
  // Check if user exists and has writer role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, roles: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const hasWriterRole = user.roles.some((role) =>
    ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(role)
  )

  if (!hasWriterRole) {
    throw new Error('User must have writer role to create a profile')
  }

  const profile = await prisma.writerProfile.upsert({
    where: { userId },
    create: {
      userId,
      bio: input.bio || '',
      website: input.website,
      twitter: input.twitter,
      linkedin: input.linkedin,
      instagram: input.instagram,
      facebook: input.facebook,
      expertise: input.expertise || [],
      specialties: input.specialties || [],
    },
    update: {
      bio: input.bio,
      website: input.website,
      twitter: input.twitter,
      linkedin: input.linkedin,
      instagram: input.instagram,
      facebook: input.facebook,
      expertise: input.expertise,
      specialties: input.specialties,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
        },
      },
    },
  })

  return profile
}

/**
 * Get writer profile by user ID
 */
export async function getWriterProfile(userId: string) {
  const profile = await prisma.writerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
        },
      },
    },
  })

  return profile
}

/**
 * Get writer profile with article statistics
 */
export async function getWriterProfileWithStats(userId: string) {
  const [profile, articleStats] = await Promise.all([
    prisma.writerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            roles: true,
          },
        },
      },
    }),
    prisma.article.groupBy({
      by: ['status'],
      where: { authorId: userId },
      _count: true,
    }),
  ])

  if (!profile) {
    return null
  }

  const stats = {
    totalArticles: articleStats.reduce((sum, item) => sum + item._count, 0),
    published: articleStats.find((s) => s.status === 'PUBLISHED')?._count || 0,
    draft: articleStats.find((s) => s.status === 'DRAFT')?._count || 0,
    submitted: articleStats.find((s) => s.status === 'SUBMITTED')?._count || 0,
    approved: articleStats.find((s) => s.status === 'APPROVED')?._count || 0,
  }

  return {
    ...profile,
    stats,
  }
}

/**
 * List all writer profiles
 */
export async function listWriterProfiles(page: number = 1, limit: number = 20) {
  const [profiles, total] = await Promise.all([
    prisma.writerProfile.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            roles: true,
          },
        },
      },
    }),
    prisma.writerProfile.count(),
  ])

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get writer's published articles
 */
export async function getWriterArticles(userId: string, page: number = 1, limit: number = 10) {
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        authorId: userId,
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        tags: true,
        publishedAt: true,
        viewCount: true,
      },
    }),
    prisma.article.count({
      where: {
        authorId: userId,
        status: 'PUBLISHED',
      },
    }),
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
 * Delete writer profile
 */
export async function deleteWriterProfile(userId: string) {
  await prisma.writerProfile.delete({
    where: { userId },
  })
}

/**
 * Search writer profiles by name, bio, or expertise
 */
export async function searchWriterProfiles(query: string, page: number = 1, limit: number = 20) {
  const [profiles, total] = await Promise.all([
    prisma.writerProfile.findMany({
      where: {
        OR: [
          {
            user: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
          {
            bio: { contains: query, mode: 'insensitive' },
          },
          {
            expertise: { has: query },
          },
          {
            specialties: { has: query },
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            roles: true,
          },
        },
      },
    }),
    prisma.writerProfile.count({
      where: {
        OR: [
          {
            user: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
          {
            bio: { contains: query, mode: 'insensitive' },
          },
          {
            expertise: { has: query },
          },
          {
            specialties: { has: query },
          },
        ],
      },
    }),
  ])

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get featured writers (based on article count and engagement)
 */
export async function getFeaturedWriters(limit: number = 5) {
  // Get writers with most published articles
  const topWriters = await prisma.article.groupBy({
    by: ['authorId'],
    where: { status: 'PUBLISHED' },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: limit,
  })

  const writerIds = topWriters.map((w) => w.authorId)

  const profiles = await prisma.writerProfile.findMany({
    where: {
      userId: { in: writerIds },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
        },
      },
    },
  })

  // Add article count to each profile
  return profiles.map((profile) => ({
    ...profile,
    articleCount: topWriters.find((w) => w.authorId === profile.userId)?._count.id || 0,
  }))
}
