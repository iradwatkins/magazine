/**
 * Article Validation Schemas
 *
 * Zod schemas for validating article creation and update inputs
 *
 * @module lib/validation/article-schema
 */

import { z } from 'zod'
import { ArticleCategory } from '@prisma/client'

/**
 * Valid article categories
 */
const articleCategories: [ArticleCategory, ...ArticleCategory[]] = [
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

/**
 * New Article Creation Schema
 * Used for validating article creation form inputs
 */
export const newArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),

  category: z.enum(articleCategories, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),

  excerpt: z
    .string()
    .max(500, 'Excerpt must be 500 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),

  featuredImage: z
    .string()
    .url('Featured image must be a valid URL')
    .optional()
    .or(z.literal('')),

  templateId: z.string().optional(),
})

/**
 * Type inference from schema
 */
export type NewArticleInput = z.infer<typeof newArticleSchema>

/**
 * Article Update Schema
 * Used for validating article update inputs
 */
export const updateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .optional(),

  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and use hyphens')
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .optional(),

  category: z.enum(articleCategories).optional(),

  excerpt: z
    .string()
    .max(500, 'Excerpt must be 500 characters or less')
    .trim()
    .optional(),

  featuredImage: z.string().url('Featured image must be a valid URL').optional().or(z.literal('')),

  tags: z.array(z.string()).optional(),

  metaTitle: z.string().max(60, 'Meta title should be 60 characters or less').optional(),

  metaDescription: z
    .string()
    .max(160, 'Meta description should be 160 characters or less')
    .optional(),
})

/**
 * Type inference from schema
 */
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>

/**
 * Validate new article data
 */
export function validateNewArticle(data: unknown): {
  success: boolean
  data?: NewArticleInput
  errors?: z.ZodError
} {
  const result = newArticleSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Validate article update data
 */
export function validateArticleUpdate(data: unknown): {
  success: boolean
  data?: UpdateArticleInput
  errors?: z.ZodError
} {
  const result = updateArticleSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Get field-specific error message from Zod error
 */
export function getFieldError(errors: z.ZodError | undefined, fieldName: string): string | undefined {
  if (!errors) return undefined

  const fieldError = errors.errors.find(
    (error) => error.path[0] === fieldName
  )

  return fieldError?.message
}
