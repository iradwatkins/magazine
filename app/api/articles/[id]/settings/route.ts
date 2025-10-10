/**
 * Article Settings API Endpoint
 *
 * PATCH /api/articles/[id]/settings - Update article settings
 *
 * @module app/api/articles/[id]/settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { articleSettingsSchema } from '@/lib/validations/article-settings'
import { z } from 'zod'

interface RouteContext {
  params: { id: string }
}

/**
 * PATCH /api/articles/[id]/settings
 *
 * Update article settings (metadata, SEO, categorization)
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Validate request body
    let validatedData
    try {
      validatedData = articleSettingsSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors,
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // TODO: Check user has permission to edit this article
    // For now, only allow the author to edit
    // In production, also check if user has ADMIN role or MAGAZINE_WRITER permission
    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if slug is unique (excluding current article)
    if (validatedData.slug) {
      const existingArticle = await prisma.article.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id },
        },
      })

      if (existingArticle) {
        return NextResponse.json(
          { error: 'An article with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update article settings
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        slug: validatedData.slug,
        excerpt: validatedData.excerpt || null,
        category: validatedData.category,
        tags: validatedData.tags,
        featuredImage: validatedData.featuredImage || null,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
        status: validatedData.status,
        isFeatured: validatedData.isFeatured,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        slug: true,
        category: true,
        tags: true,
        status: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      article: updatedArticle,
    })
  } catch (error) {
    console.error('Article settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
