# Backend Patterns

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [← Previous: Frontend Patterns](frontend-patterns.md) | [Next: Image Processing →](image-processing.md)

---

## Server Actions

Server Actions are the primary way to handle mutations in Next.js 15 App Router. They provide type-safe server-side functions that can be called directly from client components.

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function createArticle(data: CreateArticleInput) {
  // Authorization check
  await requireRole(['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'])

  // Create article in database
  const article = await prisma.article.create({
    data: { ...data, authorId: session.user.id },
  })

  // Revalidate article list page
  revalidatePath('/articles')

  return article
}
```

**Benefits:**

- Type-safe client-server communication
- No need to define API routes
- Automatic CSRF protection
- Easy revalidation

## Role-Based Authorization

Authorization helper for protecting server actions and API routes:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireRole(allowedRoles: string[]) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const hasRole = session.user.roles.some((role: string) => allowedRoles.includes(role))

  if (!hasRole) {
    throw new Error('Forbidden')
  }

  return session
}
```

**Magazine Roles:**

- `MAGAZINE_WRITER` - Can create and edit own articles
- `MAGAZINE_EDITOR` - Can publish any article
- `ADMIN` - Full access

## Request Validation

Use Zod schemas for validating input data:

```typescript
import { z } from 'zod'

export const createArticleSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  subtitle: z.string().max(300).trim().optional(),
  categoryId: z.string().cuid(),
  tags: z.array(z.string()).max(10).optional(),
  seoTitle: z.string().max(60).trim().optional(),
  seoDescription: z.string().max(160).trim().optional(),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
```

Use in Server Actions:

```typescript
'use server'

export async function createArticle(rawData: unknown) {
  // Validate input
  const data = createArticleSchema.parse(rawData)

  // Authorization
  const session = await requireRole(['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'])

  // Create article
  const article = await prisma.article.create({
    data: {
      ...data,
      authorId: session.user.id,
      status: 'DRAFT',
    },
  })

  return article
}
```

---

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [← Previous: Frontend Patterns](frontend-patterns.md) | [Next: Image Processing →](image-processing.md)
