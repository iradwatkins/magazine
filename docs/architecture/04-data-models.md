# 4. Data Models

[← Back to Index](index.md) | [← Previous: Technology Stack](03-technology-stack.md) | [Next: API Specification →](05-api-specification.md)

---

## 4.1 Core Entities Overview

The magazine platform requires **8 primary entities**:

1. **User** - Authors, editors, admins (in isolated magazine database)
2. **Article** - Magazine articles with content blocks
3. **ContentBlock** - Individual blocks within articles
4. **Media** - Uploaded images, videos in MinIO
5. **Category** - Article categorization
6. **Tag** - Flexible article tagging
7. **ArticleTag** - Many-to-many relationship
8. **ArticleView** - Analytics for article views

## 4.2 Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│  (magazine) │
└──────┬──────┘
       │
       │ 1:N (author)
       │
       ↓
┌─────────────────────────────────────────────────┐
│                   Article                       │
│ ─────────────────────────────────────────────── │
│ id, title, slug, subtitle, excerpt             │
│ authorId, categoryId, featuredImageId          │
│ status, publishedAt, viewCount                 │
│ seoTitle, seoDescription                       │
└──────┬────────────┬────────────┬────────────────┘
       │            │            │
       │ 1:N        │ N:1        │ N:N
       │            │            │
       ↓            ↓            ↓
┌─────────────┐ ┌──────────┐ ┌─────────────┐
│ContentBlock │ │ Category │ │     Tag     │
│─────────────│ │──────────│ │─────────────│
│ id          │ │ id       │ │ id          │
│ articleId   │ │ name     │ │ name        │
│ type        │ │ slug     │ │ slug        │
│ content     │ │ desc     │ │ useCount    │
│ order       │ │ order    │ └─────────────┘
└──────┬──────┘ └──────────┘
       │
       │ N:1 (image blocks)
       │
       ↓
┌─────────────┐
│    Media    │
│─────────────│
│ id          │
│ filename    │
│ url         │
│ bucket      │
│ key         │
│ altText     │
│ uploaderId  │
└─────────────┘
```

## 4.3 Detailed Entity Definitions

### Article

```typescript
{
  id: string (cuid)
  title: string (max 200 chars)
  slug: string (unique, URL-friendly)
  subtitle?: string (max 300 chars)
  excerpt?: string (for listings)

  authorId: string (FK → User)
  categoryId: string (FK → Category)
  featuredImageId?: string (FK → Media)

  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: DateTime
  scheduledAt?: DateTime

  viewCount: number (default 0)

  seoTitle?: string (max 60)
  seoDescription?: string (max 160)

  createdAt: DateTime
  updatedAt: DateTime
}
```

### ContentBlock

```typescript
{
  id: string (cuid)
  articleId: string (FK → Article)

  type: 'HEADING' | 'PARAGRAPH' | 'IMAGE' | 'QUOTE' |
        'LIST' | 'DIVIDER' | 'EMBED' | 'CODE' | 'GALLERY'

  order: number (position in article)
  content: JSONB (block-specific data)
  metadata?: JSONB (optional settings)

  createdAt: DateTime
  updatedAt: DateTime
}
```

### Media

```typescript
{
  id: string (cuid)
  filename: string
  originalName: string
  mimeType: string
  size: number (bytes)

  bucket: string (default: 'magazine-media')
  key: string (MinIO object key)
  url: string (https://media.magazine.stepperslife.com/...)

  width?: number
  height?: number

  altText?: string
  caption?: string
  credit?: string

  uploaderId: string (FK → User)

  createdAt: DateTime
  updatedAt: DateTime
}
```

**MinIO Storage Structure:**

```
magazine-minio:/magazine-media/
  ├── 2025/
  │   ├── 10/
  │   │   ├── cm1x...original.jpg
  │   │   ├── cm1x...1200w.webp
  │   │   ├── cm1x...800w.webp
  │   │   └── cm1x...400w.webp
```

---

[← Back to Index](index.md) | [← Previous: Technology Stack](03-technology-stack.md) | [Next: API Specification →](05-api-specification.md)
