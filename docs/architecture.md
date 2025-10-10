# Architecture Document

## Online Magazine Platform - SteppersLife Magazine

**Version:** 1.0
**Date:** October 9, 2025
**Architect:** Winston (Architect Agent)
**Status:** Ready for Implementation

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Data Models](#4-data-models)
5. [API Specification](#5-api-specification)
6. [Component Architecture](#6-component-architecture)
7. [Database Schema](#7-database-schema)
8. [Implementation Patterns](#8-implementation-patterns)
9. [Deployment & Infrastructure](#9-deployment--infrastructure)
10. [Security, Testing & Quality Assurance](#10-security-testing--quality-assurance)

---

## 1. Introduction

### 1.1 Overview

This architecture document defines the technical implementation for a modern online magazine platform celebrating Black culture, excellence, and storytelling. The platform enables non-technical content creators to design and publish editorial-quality articles using an intuitive drag-and-drop interface while delivering a premium reading experience across all devices.

The architecture follows a **self-hosted, fully isolated infrastructure approach**, leveraging Next.js 15+ with App Router for a unified full-stack TypeScript application. The magazine platform runs completely independently on its own dedicated infrastructure with no shared resources with other SteppersLife properties.

### 1.2 Starter Template Analysis

**N/A - Greenfield Project**

This is a custom-built solution without relying on pre-existing starter templates. While frameworks like T3 Stack or create-t3-app provide excellent foundations for Next.js applications, the specific requirements of this project—particularly the fully isolated self-hosted infrastructure, custom drag-and-drop editor with TipTap, and dedicated PostgreSQL/MinIO setup—warrant a tailored approach.

**Key Architectural Principles:**

- **Isolation-first**: Magazine platform runs on dedicated containers with zero shared resources
- **Type-safe**: End-to-end TypeScript with Prisma ORM for compile-time safety
- **Component-driven**: Reusable UI components built on Radix UI primitives
- **Progressive enhancement**: Server-first rendering with client-side interactivity where needed
- **Accessibility-first**: WCAG 2.1 AA compliance baked into every component

### 1.3 Change Log

| Date       | Version | Description                                                | Author                    |
| ---------- | ------- | ---------------------------------------------------------- | ------------------------- |
| 2025-10-09 | 1.0     | Initial architecture document with isolated infrastructure | Winston (Architect Agent) |

---

## 2. High-Level Architecture

### 2.1 Infrastructure Context

**Isolated VPS Deployment:**

- **VPS Multi-Tenant Environment**: Running multiple isolated SteppersLife services
- **Port Assignment**: Magazine runs on **Port 3007** (magazine.stepperslife.com)
- **Dedicated Services** (NO SHARING):
  - PostgreSQL database (magazine-postgres container)
  - Redis cache (magazine-redis container)
  - MinIO object storage (magazine-minio container)
- **Isolated Domain Structure**:
  - Main app: `magazine.stepperslife.com`
  - Media storage: `media.magazine.stepperslife.com`
- **Reverse Proxy**: Nginx handling SSL and routing to port 3007

**Complete Isolation**: The magazine platform does NOT share any infrastructure with `stepperslife.com`, `events.stepperslife.com`, `shop.stepperslife.com`, or any other SteppersLife properties. Each platform has its own dedicated containers and data stores.

### 2.2 Architecture Layers

**1. Presentation Layer (Client-Side)**

- Next.js 15 App Router with React 19
- Server-rendered pages for SEO and performance
- Client-side interactivity for drag-and-drop editor
- Responsive design (mobile-first, 720px max article width)
- Tailwind CSS for styling

**2. Application Layer (Next.js Server)**

- Next.js API Routes (/api/\*)
- Server Actions for mutations
- NextAuth.js authentication middleware
- Integration with main SteppersLife site via webhooks (optional)
- Image optimization and transformation with Sharp

**3. Data Layer (Self-Hosted - Isolated)**

- **PostgreSQL**: Primary relational database (dedicated magazine container)
- **Redis**: Session storage, caching, rate limiting (dedicated container)
- **MinIO**: S3-compatible object storage for media assets (dedicated container)
- **Prisma ORM**: Type-safe database client with migrations

### 2.3 Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT DEVICES                          │
│              (Desktop, Tablet, Mobile Browsers)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Reverse Proxy)                        │
│                  SSL Termination + Routing                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ↓                                 ↓
   magazine.stepperslife.com       media.magazine.stepperslife.com
         → :3007                            → :9007
            │                                 │
            ↓                                 ↓
┌───────────────────────────┐      ┌─────────────────────┐
│  NEXT.JS APP (Port 3007)  │      │  MinIO (Port 9007)  │
│  ┌─────────────────────┐  │      │  Media Storage      │
│  │  Next.js 15 App     │  │      │  (Isolated)         │
│  │  Router (SSR/SSG)   │  │      └─────────────────────┘
│  └──────────┬──────────┘  │
│             │              │
│  ┌──────────┴──────────┐  │
│  │  API Routes +       │  │
│  │  Server Actions     │  │
│  └──────────┬──────────┘  │
└─────────────┼─────────────┘
              │
     ┌────────┼────────┐
     ↓        ↓        ↓
┌──────────┐ ┌──────┐ ┌──────┐
│PostgreSQL│ │Redis │ │MinIO │
│(Isolated)│ │(Iso.)│ │(Iso.)│
│          │ │      │ │      │
│ articles │ │Cache │ │Images│
│ users    │ │      │ │Videos│
│ media    │ │      │ │      │
└──────────┘ └──────┘ └──────┘
   magazine-    magazine-  magazine-
   postgres     redis      minio
```

### 2.4 Request Flow Patterns

**Pattern A: Public Article Page (SSR)**

```
User → Nginx → Next.js SSR → Prisma Query (magazine-postgres) → HTML
                            ↓
                       Redis Cache (magazine-redis)
```

**Pattern B: Dashboard/Editor (Protected Route)**

```
User → Nginx → NextAuth Middleware → Session Check (magazine-redis)
                     ↓
               React Client → API Route → Prisma → magazine-postgres
```

**Pattern C: Article Creation (Server Action)**

```
Editor → Server Action → Validation → Prisma Transaction (magazine-postgres)
                                    ↓
                        MinIO Upload (magazine-minio) → Update Media Records
```

**Pattern D: Media Upload**

```
Dashboard → Upload Component → MinIO Presigned URL
                             ↓
                Direct Upload to magazine-minio (Port 9007)
                             ↓
                API Route → Create Media Record (magazine-postgres)
```

### 2.5 Key Architectural Decisions

| Decision               | Choice                              | Rationale                                                          |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| **Deployment Model**   | Self-hosted isolated VPS containers | Complete isolation prevents cross-contamination between properties |
| **Database**           | PostgreSQL (dedicated container)    | Isolated magazine data, no shared schema conflicts                 |
| **ORM**                | Prisma                              | Type-safe, excellent DX, migrations, proven reliability            |
| **Authentication**     | NextAuth.js (isolated sessions)     | Can integrate with main site via webhook if needed                 |
| **Object Storage**     | MinIO (dedicated container)         | Isolated media storage, S3-compatible, no egress fees              |
| **Caching**            | Redis (dedicated container)         | Fast session storage, API caching, rate limiting                   |
| **Rendering Strategy** | Hybrid (SSR + Static + CSR)         | SEO for public pages, interactivity for editor                     |
| **State Management**   | React Server State + Zustand        | Minimize client state, server as source of truth                   |
| **Media Domain**       | media.magazine.stepperslife.com     | Under magazine domain for complete isolation                       |

### 2.6 Infrastructure Isolation Strategy

**Why Complete Isolation:**

1. **Fault Tolerance**: If stepperslife.com's database crashes, magazine.stepperslife.com continues running
2. **Resource Allocation**: Magazine platform gets dedicated CPU/RAM, no resource contention
3. **Security**: Breach in one property doesn't compromise others
4. **Scaling**: Can independently scale magazine infrastructure without affecting other sites
5. **Deployment**: Deploy magazine updates without touching other services
6. **Data Sovereignty**: Magazine data stays in magazine containers, no cross-contamination

**User Authentication Strategy:**

While infrastructure is isolated, user authentication CAN be synchronized:

- Magazine has its own `users` table in `magazine-postgres`
- Optional webhook integration with main site for SSO (Single Sign-On)
- Users created on magazine.stepperslife.com are independent
- Optional: Sync user data from stepperslife.com → magazine via API webhook

---

## 3. Technology Stack

### 3.1 Frontend Stack

| Technology         | Version | Purpose                         | Rationale                                 |
| ------------------ | ------- | ------------------------------- | ----------------------------------------- |
| **Next.js**        | 15.5.4  | React framework with App Router | Full-stack framework, SSR/SSG, API routes |
| **React**          | 19.2.0  | UI library                      | Latest version, RSC, improved performance |
| **TypeScript**     | 5.x     | Type-safe JavaScript            | Compile-time safety, better DX            |
| **Tailwind CSS**   | 4.x     | Utility-first CSS               | Rapid styling, consistent design          |
| **Shadcn/ui**      | Latest  | Component system                | Accessible, customizable, Radix UI        |
| **TanStack Query** | v5      | Data fetching & caching         | Cache management, optimistic updates      |
| **Framer Motion**  | Latest  | Animation library               | Smooth animations for editor              |
| **Lucide React**   | Latest  | Icon library                    | Consistent icons, tree-shakeable          |
| **Zod**            | Latest  | Schema validation               | Type-safe validation, form handling       |
| **TipTap**         | Latest  | Rich text editor                | ProseMirror-based, extensible, WYSIWYG    |
| **@dnd-kit**       | Latest  | Drag-and-drop                   | Accessible drag-and-drop for blocks       |
| **Zustand**        | Latest  | Client state management         | Lightweight, simple API                   |

### 3.2 Backend Stack

| Technology             | Version       | Purpose             | Rationale                                |
| ---------------------- | ------------- | ------------------- | ---------------------------------------- |
| **Node.js**            | 20.x LTS      | JavaScript runtime  | Required for Next.js, stable LTS         |
| **Next.js API Routes** | 15.x          | Backend API         | Co-located with frontend                 |
| **NextAuth.js**        | 5.0.0-beta.29 | Authentication      | OAuth + credentials, session management  |
| **Prisma**             | Latest        | ORM & migrations    | Type-safe DB client, PostgreSQL support  |
| **PostgreSQL**         | 16            | Primary database    | Relational DB, JSONB, full-text search   |
| **Redis**              | 7.x           | Caching & sessions  | Fast key-value store, rate limiting      |
| **MinIO**              | Latest        | Object storage      | S3-compatible, self-hosted, isolated     |
| **Sharp**              | Latest        | Image processing    | Fast image optimization, WebP conversion |
| **Resend**             | Latest        | Transactional email | Modern email API                         |

### 3.3 Infrastructure & DevOps

| Technology         | Version | Purpose                       | Rationale                              |
| ------------------ | ------- | ----------------------------- | -------------------------------------- |
| **Docker**         | Latest  | Containerization              | Isolated environments, easy deployment |
| **Docker Compose** | Latest  | Multi-container orchestration | Local dev, service dependencies        |
| **Nginx**          | Latest  | Reverse proxy                 | SSL termination, routing to port 3007  |
| **GitHub Actions** | N/A     | CI/CD pipeline                | Automated testing, deployment          |
| **VPS**            | N/A     | Hosting platform              | Self-hosted, full control              |

### 3.4 Development Tools

| Tool                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| **ESLint**                | Code linting and style enforcement |
| **Prettier**              | Code formatting                    |
| **Husky**                 | Git hooks for pre-commit checks    |
| **Vitest**                | Unit testing framework             |
| **Playwright**            | E2E testing                        |
| **React Testing Library** | Component testing                  |

---

## 4. Data Models

### 4.1 Core Entities Overview

The magazine platform requires **8 primary entities**:

1. **User** - Authors, editors, admins (in isolated magazine database)
2. **Article** - Magazine articles with content blocks
3. **ContentBlock** - Individual blocks within articles
4. **Media** - Uploaded images, videos in MinIO
5. **Category** - Article categorization
6. **Tag** - Flexible article tagging
7. **ArticleTag** - Many-to-many relationship
8. **ArticleView** - Analytics for article views

### 4.2 Entity Relationship Diagram

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

### 4.3 Detailed Entity Definitions

#### Article

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

#### ContentBlock

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

#### Media

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

## 5. API Specification

### 5.1 API Architecture Pattern

**Approach:** Hybrid API using Next.js App Router patterns:

- **Server Actions** for mutations (create, update, delete)
- **API Routes** for third-party integrations and webhooks
- **React Server Components** for data fetching (no API needed)

**Base URL:** `https://magazine.stepperslife.com`

**Authentication:** NextAuth.js session-based authentication

### 5.2 API Endpoints Overview

| Category       | Endpoint                        | Method | Auth | Purpose                 |
| -------------- | ------------------------------- | ------ | ---- | ----------------------- |
| **Articles**   | `/api/articles`                 | GET    | No   | List published articles |
|                | `/api/articles/[slug]`          | GET    | No   | Get single article      |
|                | `/api/articles/[id]/views`      | POST   | No   | Increment view count    |
|                | Server Action: `createArticle`  | -      | Yes  | Create article          |
|                | Server Action: `updateArticle`  | -      | Yes  | Update article          |
|                | Server Action: `publishArticle` | -      | Yes  | Publish article         |
| **Media**      | `/api/media/upload`             | POST   | Yes  | Upload to MinIO         |
|                | `/api/media`                    | GET    | Yes  | List media library      |
|                | `/api/media/[id]`               | DELETE | Yes  | Delete media            |
| **Categories** | `/api/categories`               | GET    | No   | List categories         |
| **Tags**       | `/api/tags`                     | GET    | No   | List tags               |
|                | `/api/tags/search`              | GET    | No   | Autocomplete search     |
| **Health**     | `/api/health`                   | GET    | No   | Health check            |

### 5.3 Rate Limiting

**Redis-based rate limiting (magazine-redis container):**

| Endpoint Type     | Rate Limit   | Window     |
| ----------------- | ------------ | ---------- |
| Public API        | 100 requests | 15 minutes |
| Authenticated API | 500 requests | 15 minutes |
| Media Upload      | 20 uploads   | 1 hour     |
| Server Actions    | 100 actions  | 5 minutes  |

---

## 6. Component Architecture

### 6.1 Frontend Structure

```
app/
├── (public)/              # Public pages
│   ├── page.tsx           # Homepage
│   ├── articles/
│   │   ├── page.tsx       # Article listing
│   │   └── [slug]/
│   │       └── page.tsx   # Article detail (SSR)
│   └── categories/
│       └── [slug]/
│           └── page.tsx   # Category page
│
├── (dashboard)/           # Protected dashboard
│   ├── layout.tsx         # Dashboard shell
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard home
│   ├── articles/
│   │   ├── page.tsx       # Article management
│   │   ├── new/
│   │   │   └── page.tsx   # Create article
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx  # Editor
│   └── media/
│       └── page.tsx       # Media library
│
└── api/                   # API routes
    ├── articles/
    ├── media/
    └── health/

components/
├── ui/                    # Shadcn/ui primitives
├── editor/                # Article editor
│   ├── editor-canvas.tsx
│   ├── block-palette.tsx
│   └── content-blocks/
├── article/               # Article display
│   ├── article-card.tsx
│   ├── article-content.tsx
│   └── related-articles.tsx
├── media/                 # Media library
│   ├── media-grid.tsx
│   ├── media-upload.tsx
│   └── media-picker.tsx
└── dashboard/             # Dashboard components
    ├── sidebar-nav.tsx
    └── stats-card.tsx
```

### 6.2 Core Components

**EditorCanvas** - Drag-and-drop editor with @dnd-kit
**BlockPalette** - Sidebar with available content blocks
**ContentBlock Components** - HeadingBlock, ParagraphBlock, ImageBlock, QuoteBlock, ListBlock, etc.
**MediaUpload** - Upload to MinIO with Sharp processing
**ArticleContent** - Render published articles with optimal typography

---

## 7. Database Schema

### 7.1 Complete Prisma Schema

See full schema in Section 7 (abbreviated here for document length).

**Key Tables:**

- `users` - Magazine users (isolated from other sites)
- `articles` - Magazine articles
- `content_blocks` - Drag-and-drop blocks
- `media` - MinIO-stored files
- `categories` - Article categories
- `tags` - Article tags
- `article_tags` - Junction table
- `article_views` - Analytics

**Database:** `magazine-postgres` container (PostgreSQL 16)

### 7.2 Seed Data

Default categories:

1. Culture & Arts
2. Business & Entrepreneurship
3. Lifestyle & Wellness
4. Community & Events
5. Fashion & Beauty
6. Technology & Innovation

---

## 8. Implementation Patterns

### 8.1 Frontend Patterns

**Server Components (Default):**

```typescript
// app/(public)/articles/[slug]/page.tsx
export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { author: true, category: true, contentBlocks: true }
  });

  return <ArticleContent article={article} />;
}
```

**Client Components (Interactive UI):**

```typescript
'use client'
export function EditorCanvas({ articleId, initialBlocks }: Props) {
  const { blocks, reorderBlocks } = useEditorStore()
  // ... drag-and-drop logic
}
```

**State Management:**

- **Zustand** for editor state
- **TanStack Query** for server state
- **React Server State** by default

### 8.2 Backend Patterns

**Server Actions:**

```typescript
'use server'
export async function createArticle(data: CreateArticleInput) {
  await requireRole(['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'])

  const article = await prisma.article.create({
    data: { ...data, authorId: session.user.id },
  })

  revalidatePath('/articles')
  return article
}
```

**Image Processing (Sharp):**

```typescript
export async function processImage(buffer: Buffer) {
  const optimized = await sharp(buffer)
    .jpeg({ quality: 85 })
    .toBuffer();

  const webp_1200 = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Upload all variants to magazine-minio
  return { optimized, webp_1200, ... };
}
```

**MinIO Upload:**

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT, // http://magazine-minio:9000
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
})

await s3Client.send(
  new PutObjectCommand({
    Bucket: 'magazine-media',
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read',
  })
)
```

---

## 9. Deployment & Infrastructure

### 9.1 Docker Compose Configuration (Isolated)

**File:** `docker-compose.yml`

```yaml
version: '3.9'

services:
  # ============================================================================
  # Magazine Next.js Application
  # ============================================================================
  magazine-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: magazine-app
    ports:
      - '3007:3007'
    environment:
      # Isolated database
      DATABASE_URL: postgresql://magazine_user:${POSTGRES_PASSWORD}@magazine-postgres:5432/magazine_db

      # Isolated cache
      REDIS_URL: redis://magazine-redis:6379/0

      # Isolated MinIO
      MINIO_ENDPOINT: http://magazine-minio:9000
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY}
      MINIO_BUCKET: magazine-media
      MINIO_PUBLIC_URL: https://media.magazine.stepperslife.com

      # NextAuth
      NEXTAUTH_URL: https://magazine.stepperslife.com
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}

      # OAuth
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}

      # Email
      RESEND_API_KEY: ${RESEND_API_KEY}

      # App Config
      NEXT_PUBLIC_APP_URL: https://magazine.stepperslife.com
      NODE_ENV: production
      PORT: 3007

    depends_on:
      magazine-postgres:
        condition: service_healthy
      magazine-redis:
        condition: service_healthy
      magazine-minio:
        condition: service_healthy

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # Dedicated PostgreSQL (ISOLATED - Magazine Only)
  # ============================================================================
  magazine-postgres:
    image: postgres:16-alpine
    container_name: magazine-postgres
    environment:
      POSTGRES_USER: magazine_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: magazine_db

    ports:
      - '5407:5432' # Unique port mapping (NOT 5432 to avoid conflicts)

    volumes:
      - magazine-postgres-data:/var/lib/postgresql/data
      - ./backups/postgres:/backups

    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U magazine_user']
      interval: 10s
      timeout: 5s
      retries: 5

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # Dedicated Redis (ISOLATED - Magazine Only)
  # ============================================================================
  magazine-redis:
    image: redis:7-alpine
    container_name: magazine-redis

    ports:
      - '6407:6379' # Unique port mapping

    volumes:
      - magazine-redis-data:/data

    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru

    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # Dedicated MinIO (ISOLATED - Magazine Only)
  # ============================================================================
  magazine-minio:
    image: minio/minio:latest
    container_name: magazine-minio

    ports:
      - '9007:9000' # Unique S3 API port
      - '9107:9001' # Unique Web Console port

    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}

    volumes:
      - magazine-minio-data:/data

    command: server /data --console-address ":9001"

    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 20s
      retries: 3

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # MinIO Bucket Initialization (One-time setup)
  # ============================================================================
  magazine-minio-init:
    image: minio/mc:latest
    container_name: magazine-minio-init

    depends_on:
      magazine-minio:
        condition: service_healthy

    entrypoint: >
      /bin/sh -c "
      mc alias set magazineminio http://magazine-minio:9000 ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY};
      mc mb magazineminio/magazine-media --ignore-existing;
      mc anonymous set public magazineminio/magazine-media;
      exit 0;
      "

    networks:
      - magazine-isolated-network

# ============================================================================
# Volumes (Isolated to Magazine)
# ============================================================================
volumes:
  magazine-postgres-data:
    driver: local
  magazine-redis-data:
    driver: local
  magazine-minio-data:
    driver: local

# ============================================================================
# Network (Isolated to Magazine)
# ============================================================================
networks:
  magazine-isolated-network:
    driver: bridge
```

### 9.2 Nginx Configuration

**File:** `/etc/nginx/sites-available/magazine.stepperslife.com`

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=magazine_limit:10m rate=10r/s;

# Upstream to Next.js app
upstream magazine_app {
    server localhost:3007;
}

# Upstream to MinIO (media)
upstream magazine_media {
    server localhost:9007;
}

# ============================================================================
# HTTP -> HTTPS Redirect
# ============================================================================
server {
    listen 80;
    listen [::]:80;
    server_name magazine.stepperslife.com media.magazine.stepperslife.com;

    return 301 https://$server_name$request_uri;
}

# ============================================================================
# HTTPS - Main Magazine App
# ============================================================================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name magazine.stepperslife.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/magazine.stepperslife.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/magazine.stepperslife.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/magazine.access.log;
    error_log /var/log/nginx/magazine.error.log;

    # Rate limiting
    limit_req zone=magazine_limit burst=20 nodelay;

    # Max upload size
    client_max_body_size 10M;

    # Static files (Next.js)
    location /_next/static {
        proxy_pass http://magazine_app;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        proxy_pass http://magazine_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# ============================================================================
# HTTPS - Media Subdomain (MinIO)
# ============================================================================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name media.magazine.stepperslife.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/media.magazine.stepperslife.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/media.magazine.stepperslife.com/privkey.pem;

    # CORS headers for media
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;

    location / {
        proxy_pass http://magazine_media;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cache media files
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 9.3 Deployment Script

**File:** `scripts/deploy.sh`

```bash
#!/bin/bash
set -e

echo "========================================="
echo "Magazine Platform Deployment (Isolated)"
echo "========================================="

# Load environment
source .env.production

# Pull latest code
echo "📦 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📚 Installing dependencies..."
npm ci

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Build Docker images
echo "🐳 Building Docker images..."
docker compose build magazine-app

# Stop old containers
echo "🛑 Stopping old containers..."
docker compose down magazine-app

# Start new containers
echo "🚀 Starting new containers..."
docker compose up -d

# Health check
echo "🏥 Waiting for health check..."
sleep 10

if curl -f http://localhost:3007/api/health > /dev/null 2>&1; then
  echo "✅ Deployment successful!"
else
  echo "❌ Health check failed!"
  exit 1
fi

echo "========================================="
echo "✅ Magazine deployed successfully!"
echo "========================================="
```

### 9.4 Backup Scripts

**Daily PostgreSQL Backup:**

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
docker exec magazine-postgres pg_dump -U magazine_user magazine_db > /backups/magazine_${TIMESTAMP}.sql
gzip /backups/magazine_${TIMESTAMP}.sql
find /backups -name "magazine_*.sql.gz" -mtime +30 -delete
```

**Weekly MinIO Backup:**

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d")
docker exec magazine-minio mc mirror /data/magazine-media /backups/minio-${TIMESTAMP}
tar -czf /backups/magazine-media-${TIMESTAMP}.tar.gz -C /backups minio-${TIMESTAMP}
rm -rf /backups/minio-${TIMESTAMP}
find /backups -name "magazine-media-*.tar.gz" -mtime +90 -delete
```

### 9.5 Resource Requirements

**Minimum VPS Requirements:**

- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 50 GB SSD

**Recommended (Production):**

- **CPU:** 4 cores
- **RAM:** 8 GB
- **Storage:** 100 GB SSD

**Container Resource Limits:**

```yaml
magazine-app: 2 CPU, 2GB RAM
magazine-postgres: 1 CPU, 1GB RAM
magazine-redis: 0.5 CPU, 512MB RAM
magazine-minio: 1 CPU, 1GB RAM
```

---

## 10. Security, Testing & Quality Assurance

### 10.1 Security Strategy

#### 10.1.1 Authentication & Authorization

**NextAuth.js with Role-Based Access Control:**

```typescript
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

#### 10.1.2 Input Validation

**Zod Schemas:**

```typescript
export const createArticleSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  subtitle: z.string().max(300).trim().optional(),
  categoryId: z.string().cuid(),
  tags: z.array(z.string()).max(10).optional(),
  seoTitle: z.string().max(60).trim().optional(),
  seoDescription: z.string().max(160).trim().optional(),
})
```

#### 10.1.3 File Upload Security

**Validation:**

- File size limit: 10MB
- MIME type validation
- Magic byte verification
- SVG sanitization (no scripts)

#### 10.1.4 Rate Limiting

**Redis-based (magazine-redis):**

- Public API: 100 req/15min
- Authenticated: 500 req/15min
- Media upload: 20 uploads/hour

#### 10.1.5 Security Headers

**Next.js Configuration:**

```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
    ]
  }];
}
```

### 10.2 Testing Strategy

#### 10.2.1 Unit Testing (Vitest)

**Example:**

```typescript
describe('generateSlug', () => {
  it('should convert title to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })
})
```

#### 10.2.2 Component Testing (React Testing Library)

**Example:**

```typescript
describe('ArticleCard', () => {
  it('should render article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

#### 10.2.3 E2E Testing (Playwright)

**Example:**

```typescript
test('should create new article draft', async ({ page }) => {
  await page.goto('/articles/new')
  await page.fill('input[name="title"]', 'My Test Article')
  await page.click('button:has-text("Save Draft")')
  await expect(page.locator('text=Draft saved')).toBeVisible()
})
```

### 10.3 Code Quality

**Tools:**

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- Husky for pre-commit hooks

### 10.4 Security Checklist

- ✅ Authentication via NextAuth.js
- ✅ Role-based authorization (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React, DOMPurify)
- ✅ CSRF protection (Server Actions)
- ✅ Rate limiting (Redis)
- ✅ File upload validation
- ✅ Security headers
- ✅ HTTPS (Let's Encrypt)
- ✅ Isolated infrastructure
- ✅ Automated backups

---

## Conclusion

This architecture document provides a comprehensive blueprint for implementing the SteppersLife Magazine platform with a **fully isolated, self-hosted infrastructure**. Key highlights:

1. **Complete Isolation**: Magazine runs on dedicated containers with zero shared resources
2. **Modern Stack**: Next.js 15, React 19, TypeScript, Prisma, PostgreSQL, MinIO
3. **Type Safety**: End-to-end type safety with TypeScript and Prisma
4. **Performance**: Server-first rendering, Redis caching, image optimization
5. **Security**: Multi-layer security with auth, validation, rate limiting, and isolation
6. **Scalability**: Containerized architecture allows independent scaling
7. **Developer Experience**: Hot reload, type checking, auto-save, comprehensive testing

**Domain Structure:**

- Main app: `magazine.stepperslife.com` (Port 3007)
- Media storage: `media.magazine.stepperslife.com` (MinIO Port 9007)

**Infrastructure:**

- `magazine-app` container (Next.js)
- `magazine-postgres` container (PostgreSQL 16)
- `magazine-redis` container (Redis 7)
- `magazine-minio` container (MinIO latest)

All services run on isolated Docker network with dedicated volumes and unique port mappings to prevent any conflicts with other SteppersLife properties.

---

**Document Status:** ✅ Complete and Ready for Implementation

**Architect:** Winston (Architect Agent)
**Date:** October 9, 2025
**Version:** 1.0
