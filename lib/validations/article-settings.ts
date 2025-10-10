/**
 * Article Settings Validation Schema
 *
 * Zod schemas for validating article settings form data.
 *
 * @module lib/validations/article-settings
 */

import { z } from 'zod'

export const articleSettingsSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), {
      message: 'Slug cannot start or end with a hyphen',
    }),

  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),

  category: z.enum([
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
  ]),

  tags: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 tags allowed').default([]),

  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),

  metaTitle: z.string().max(60, 'Meta title must be 60 characters or less').optional(),

  metaDescription: z
    .string()
    .max(160, 'Meta description must be 160 characters or less')
    .optional(),

  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'PUBLISHED', 'REJECTED', 'ARCHIVED']),

  isFeatured: z.boolean().default(false),
})

export type ArticleSettingsInput = z.infer<typeof articleSettingsSchema>
