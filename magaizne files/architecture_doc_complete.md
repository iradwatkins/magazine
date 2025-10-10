# System Architecture Document

## Online Magazine Platform with Drag-and-Drop Editor

**Version:** 1.0  
**Last Updated:** October 2025  
**Architecture Owner:** [Lead Architect Name]  
**Status:** Production Ready

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Principles](#2-architecture-principles)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Design](#6-database-design)
7. [API Design](#7-api-design)
8. [Infrastructure & Deployment](#8-infrastructure--deployment)
9. [Security Architecture](#9-security-architecture)
10. [Performance & Scalability](#10-performance--scalability)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Development Workflow](#12-development-workflow)

---

## 1. System Overview

### 1.1 Architecture Goals

- **Modularity**: Loosely coupled components for easy maintenance and scaling
- **Performance**: Sub-2-second page loads, real-time editor updates
- **Scalability**: Support 100K+ monthly active users
- **Reliability**: 99.9% uptime SLA
- **Security**: Enterprise-grade data protection and access control
- **Developer Experience**: Easy to understand, test, and extend
- **Edge-First**: Leverage Cloudflare's global network for performance

### 1.2 Key Technical Requirements

- Server-side rendering (SSR) for SEO and initial load performance
- Real-time collaboration capabilities (future)
- Multi-tenant architecture support (future)
- Content versioning and rollback
- Media optimization pipeline via Cloudflare
- Global CDN integration for content delivery

---

## 2. Architecture Principles

### 2.1 Design Principles

1. **API-First**: All features accessible via well-documented REST APIs
2. **Progressive Enhancement**: Core content accessible without JavaScript
3. **Mobile-First**: Responsive design starting from smallest screens
4. **Component-Driven**: Reusable, testable UI components
5. **Edge-First**: Leverage Cloudflare's edge network for performance
6. **Type Safety**: TypeScript throughout frontend and backend
7. **Convention over Configuration**: Sensible defaults, minimal setup

### 2.2 Technology Choices

- **Modern Stack**: Next.js 14+ with App Router
- **Cloudflare Integration**: Workers, Pages, R2, D1, KV
- **Type Safety**: TypeScript 5+ throughout
- **Tested Code**: Minimum 80% code coverage
- **Cloud-Native**: Designed for edge deployment from day one

---

## 3. High-Level Architecture

### 3.1 System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         External Services                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ SendGrid │  │ Analytics│  │  OAuth   │  │ Stripe   │       │
│  │  (Email) │  │   (GA4)  │  │ Providers│  │(Payments)│       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
┌───────┼─────────────┼─────────────┼─────────────┼──────────────┐
│       │        Cloudflare Global Network        │              │
│  ┌────┴────────────────────────────────────────┴───────────┐  │
│  │                  Cloudflare CDN                          │  │
│  │         (DDoS Protection, WAF, SSL/TLS)                  │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │
┌─────────────────────────┼──────────────────────────────────────┐
│                  Application Layer (Edge)                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           Cloudflare Pages / Workers                      │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │   Reader    │  │    Editor    │  │      Admin      │ │ │
│  │  │   (SSR)     │  │     (CSR)    │  │   Dashboard     │ │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │            API Routes (Workers)                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼──────────────────────────────────────┐
│                     Data Layer (Cloudflare)                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │ D1 Database  │   │      KV      │   │      R2      │       │
│  │ (SQLite/PG)  │   │   (Cache)    │   │(Object Store)│       │
│  └──────────────┘   └──────────────┘   └──────────────┘       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Hyperdrive (Optional)                        │  │
│  │          (PostgreSQL Connection Pooling)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Overview

**Edge Layer (Cloudflare):**

- CDN for global content delivery (200+ locations)
- WAF for security (OWASP Top 10 protection)
- DDoS protection (Layer 3, 4, and 7)
- SSL/TLS termination (automatic certificates)

**Application Layer:**

- Cloudflare Pages for frontend hosting
- Cloudflare Workers for API (V8 isolates, instant cold starts)
- Next.js for SSR/SSG with React Server Components

**Data Layer:**

- Cloudflare D1 for structured data (SQLite-compatible, edge-replicated)
- Cloudflare KV for caching and sessions (eventually consistent)
- Cloudflare R2 for media storage (S3-compatible, zero egress fees)
- Hyperdrive for PostgreSQL connection pooling (optional, if you need Postgres)

**External Services:**

- Email delivery (SendGrid/Resend)
- Analytics tracking (GA4/Plausible)
- OAuth authentication (Google, GitHub)
- Payment processing (Stripe)

---

## 4. Frontend Architecture

### 4.1 Technology Stack

```yaml
Framework: Next.js 14+ (App Router)
Language: TypeScript 5+
Styling: Tailwind CSS 3+ with custom design tokens
State Management: Zustand + React Context
UI Components: Radix UI + shadcn/ui
Drag & Drop: @dnd-kit/core
Rich Text: TipTap (ProseMirror-based)
Forms: React Hook Form + Zod validation
HTTP Client: Fetch API with SWR
Build Tool: Turbopack (Next.js bundler)
Testing: Vitest + React Testing Library
E2E Testing: Playwright
Icons: Lucide React
```

### 4.2 Directory Structure

```
/app
  /(reader)                    # Public-facing pages (SSR/SSG)
    /page.tsx                  # Homepage
    /[slug]/page.tsx           # Article pages
    /category/[slug]/page.tsx  # Category pages
    /author/[slug]/page.tsx    # Author pages
    /search/page.tsx           # Search results
    /layout.tsx                # Reader layout

  /(admin)                     # Admin dashboard (CSR)
    /layout.tsx                # Admin layout with auth
    /dashboard/page.tsx        # Dashboard overview
    /articles/
      /page.tsx                # Article list
      /new/page.tsx            # Create article
      /[id]/edit/page.tsx      # Edit article
    /media/page.tsx            # Media library
    /users/page.tsx            # User management
    /categories/page.tsx       # Category management
    /settings/page.tsx         # Settings

  /api                         # API routes (Cloudflare Workers)
    /articles/
      /route.ts                # List & create articles
      /[id]/route.ts           # Get, update, delete article
      /[id]/blocks/route.ts    # Manage article blocks
      /[id]/publish/route.ts   # Publish article
    /media/
      /route.ts                # List & upload media
      /[id]/route.ts           # Get & delete media
    /users/route.ts            # User CRUD
    /categories/route.ts       # Category CRUD
    /tags/route.ts             # Tag CRUD
    /auth/[...nextauth]/route.ts  # NextAuth

  /layout.tsx                  # Root layout
  /globals.css                 # Global styles with CSS variables
  /error.tsx                   # Error boundary
  /not-found.tsx               # 404 page

/components
  /ui                          # shadcn/ui base components
    /button.tsx
    /input.tsx
    /textarea.tsx
    /select.tsx
    /dialog.tsx
    /dropdown-menu.tsx
    /card.tsx
    /badge.tsx
    /avatar.tsx
    /skeleton.tsx
    /toast.tsx

  /editor                      # Editor components
    /editor-canvas.tsx         # Main editor canvas
    /block-palette.tsx         # Block selector sidebar
    /block-toolbar.tsx         # Floating formatting toolbar
    /block-renderer.tsx        # Block rendering logic
    /sortable-block.tsx        # Draggable block wrapper
    /blocks/
      /heading-block.tsx       # H1-H6 blocks
      /paragraph-block.tsx     # Text paragraphs
      /image-block.tsx         # Image with caption
      /video-block.tsx         # Video embeds
      /audio-block.tsx         # Audio embeds
      /quote-block.tsx         # Blockquotes
      /list-block.tsx          # Bullet/numbered lists
      /divider-block.tsx       # Horizontal divider
      /spacer-block.tsx        # Vertical spacing
      /columns-block.tsx       # Multi-column layout
      /embed-block.tsx         # Social media embeds
      /cta-block.tsx           # Call-to-action button
      /gallery-block.tsx       # Image gallery

  /reader                      # Reader experience components
    /article-header.tsx        # Article title, author, date
    /article-body.tsx          # Article content renderer
    /article-footer.tsx        # Tags, sharing, author bio
    /related-articles.tsx      # Related content
    /newsletter-form.tsx       # Newsletter signup
    /comment-section.tsx       # Comments (future)
    /table-of-contents.tsx     # Auto-generated TOC
    /reading-progress.tsx      # Progress bar

  /admin                       # Admin dashboard components
    /article-list.tsx          # Article table
    /article-list-item.tsx     # Article row
    /media-library.tsx         # Media grid
    /media-upload.tsx          # Upload interface
    /user-table.tsx            # User management
    /stats-card.tsx            # Dashboard stats
    /recent-activity.tsx       # Activity feed

  /shared                      # Shared components
    /navbar.tsx                # Main navigation
    /footer.tsx                # Site footer
    /sidebar.tsx               # Admin sidebar
    /search-bar.tsx            # Search input
    /pagination.tsx            # Pagination controls
    /loading-spinner.tsx       # Loading states

/lib
  /api                         # API client functions
    /articles.ts               # Article CRUD
    /media.ts                  # Media operations
    /users.ts                  # User management
    /categories.ts             # Category management

  /hooks                       # Custom React hooks
    /use-article.ts            # Fetch article data
    /use-media.ts              # Media library
    /use-autosave.ts           # Auto-save logic
    /use-debounce.ts           # Debounce utility
    /use-local-storage.ts      # LocalStorage hook

  /utils                       # Utility functions
    /slugify.ts                # Generate URL slugs
    /date-format.ts            # Date formatting
    /cn.ts                     # Class name merger
    /image-optimizer.ts        # Image URL builder
    /seo.ts                    # SEO helpers

  /validators                  # Zod schemas
    /article.ts                # Article validation
    /block.ts                  # Block validation
    /user.ts                   # User validation
    /media.ts                  # Media validation

  /stores                      # Zustand stores
    /editor-store.ts           # Editor state
    /ui-store.ts               # UI state (modals, etc.)
    /auth-store.ts             # Auth state

  /cloudflare                  # Cloudflare SDK helpers
    /d1-client.ts              # D1 database client
    /r2-client.ts              # R2 storage client
    /kv-client.ts              # KV cache client

/types
  /article.ts                  # Article types
  /block.ts                    # Block types
  /user.ts                     # User types
  /media.ts                    # Media types
  /api.ts                      # API response types

/config
  /site.ts                     # Site configuration
  /navigation.ts               # Navigation structure
  /design-tokens.ts            # Design system tokens
  /categories.ts               # Category definitions

/db
  /schema.ts                   # Database schema (Drizzle)
  /migrations/                 # Migration files

/workers
  /api.ts                      # Main Worker entry
  /routes/
    /articles.ts               # Article routes
    /media.ts                  # Media routes
    /auth.ts                   # Auth routes

/public
  /images                      # Static images
  /fonts                       # Custom fonts
  /favicon.ico
  /robots.txt
  /sitemap.xml

/tests
  /unit/                       # Unit tests
  /integration/                # Integration tests
  /e2e/                        # E2E tests
```

### 4.3 Design System Implementation

```typescript
// /config/design-tokens.ts
export const designTokens = {
  colors: {
    light: {
      background: '#ffffff',
      foreground: '#0f1419',
      primary: '#1e9df1',
      primaryForeground: '#ffffff',
      secondary: '#0f1419',
      secondaryForeground: '#ffffff',
      accent: '#e3ecf6',
      accentForeground: '#1e9df1',
      gold: '#d4af37', // Editorial highlight (Ebony/Jet inspired)
      muted: '#e5e5e6',
      mutedForeground: '#0f1419',
      border: '#e1eaef',
      input: '#f7f9fa',
      card: '#f7f8f8',
      cardForeground: '#0f1419',
      destructive: '#f4212e',
      destructiveForeground: '#ffffff',
    },
    dark: {
      background: '#000000',
      foreground: '#e7e9ea',
      primary: '#1c9cf0',
      primaryForeground: '#ffffff',
      secondary: '#f0f3f4',
      secondaryForeground: '#0f1419',
      accent: '#061622',
      accentForeground: '#1c9cf0',
      gold: '#d4af37',
      muted: '#181818',
      mutedForeground: '#72767a',
      border: '#242628',
      input: '#22303c',
      card: '#17181c',
      cardForeground: '#d9d9d9',
      destructive: '#f4212e',
      destructiveForeground: '#ffffff',
    },
  },
  typography: {
    fonts: {
      sans: 'Open Sans, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Menlo, monospace',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
  },
  spacing: {
    base: '0.25rem', // 4px
  },
  radius: {
    sm: 'calc(1.3rem - 4px)',
    md: 'calc(1.3rem - 2px)',
    lg: '1.3rem',
    xl: 'calc(1.3rem + 4px)',
  },
} as const
```

```css
/* /app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #0f1419;
  --primary: #1e9df1;
  --primary-foreground: #ffffff;
  --secondary: #0f1419;
  --secondary-foreground: #ffffff;
  --accent: #e3ecf6;
  --accent-foreground: #1e9df1;
  --gold: #d4af37;
  --muted: #e5e5e6;
  --muted-foreground: #0f1419;
  --border: #e1eaef;
  --input: #f7f9fa;
  --card: #f7f8f8;
  --card-foreground: #0f1419;
  --destructive: #f4212e;
  --destructive-foreground: #ffffff;
  --ring: #1da1f2;

  --font-sans: Open Sans, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: Menlo, monospace;

  --radius: 1.3rem;
}

.dark {
  --background: #000000;
  --foreground: #e7e9ea;
  --primary: #1c9cf0;
  --primary-foreground: #ffffff;
  --secondary: #f0f3f4;
  --secondary-foreground: #0f1419;
  --accent: #061622;
  --accent-foreground: #1c9cf0;
  --muted: #181818;
  --muted-foreground: #72767a;
  --border: #242628;
  --input: #22303c;
  --card: #17181c;
  --card-foreground: #d9d9d9;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background font-sans text-foreground;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-serif;
  }
}
```

### 4.4 State Management Architecture

#### 4.4.1 Editor Store (Zustand)

```typescript
// /lib/stores/editor-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Article, Block, BlockType, BlockData } from '@/types'

interface EditorState {
  // Article data
  article: Article | null
  blocks: Block[]

  // Editor state
  selectedBlockId: string | null
  isDragging: boolean
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean

  // History for undo/redo
  history: Block[][]
  historyIndex: number
  maxHistorySize: number
}

interface EditorActions {
  // Article actions
  setArticle: (article: Article) => void
  updateArticleMetadata: (metadata: Partial<Article>) => void

  // Block actions
  addBlock: (type: BlockType, position?: number, data?: Partial<BlockData>) => void
  updateBlock: (id: string, data: Partial<BlockData>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (id: string, newPosition: number) => void

  // Selection
  selectBlock: (id: string | null) => void

  // Drag state
  setDragging: (isDragging: boolean) => void

  // History
  undo: () => void
  redo: () => void
  addToHistory: () => void

  // Save
  saveArticle: () => Promise<void>
  autoSave: () => void

  // Reset
  resetEditor: () => void
}

type EditorStore = EditorState & EditorActions

const initialState: EditorState = {
  article: null,
  blocks: [],
  selectedBlockId: null,
  isDragging: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  history: [[]],
  historyIndex: 0,
  maxHistorySize: 50,
}

export const useEditorStore = create<EditorStore>()(
  devtools((set, get) => ({
    ...initialState,

    setArticle: (article) => {
      set({
        article,
        blocks: article.blocks || [],
        hasUnsavedChanges: false,
      })
      get().addToHistory()
    },

    updateArticleMetadata: (metadata) => {
      set((state) => ({
        article: state.article ? { ...state.article, ...metadata } : null,
        hasUnsavedChanges: true,
      }))
      get().autoSave()
    },

    addBlock: (type, position, data) => {
      const { blocks } = get()
      const newBlock: Block = {
        id: crypto.randomUUID(),
        type,
        data: { ...getDefaultBlockData(type), ...data } as BlockData,
        order: position ?? blocks.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedBlocks = [...blocks]
      updatedBlocks.splice(position ?? blocks.length, 0, newBlock)

      // Update order for all blocks
      const reorderedBlocks = updatedBlocks.map((block, index) => ({
        ...block,
        order: index,
      }))

      set({
        blocks: reorderedBlocks,
        selectedBlockId: newBlock.id,
        hasUnsavedChanges: true,
      })

      get().addToHistory()
      get().autoSave()
    },

    updateBlock: (id, data) => {
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === id
            ? {
                ...block,
                data: { ...block.data, ...data } as BlockData,
                updatedAt: new Date(),
              }
            : block
        ),
        hasUnsavedChanges: true,
      }))
      get().autoSave()
    },

    deleteBlock: (id) => {
      set((state) => ({
        blocks: state.blocks
          .filter((block) => block.id !== id)
          .map((block, index) => ({ ...block, order: index })),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        hasUnsavedChanges: true,
      }))
      get().addToHistory()
      get().autoSave()
    },

    duplicateBlock: (id) => {
      const { blocks } = get()
      const blockIndex = blocks.findIndex((b) => b.id === id)
      if (blockIndex === -1) return

      const blockToDuplicate = blocks[blockIndex]
      const duplicatedBlock: Block = {
        ...blockToDuplicate,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedBlocks = [...blocks]
      updatedBlocks.splice(blockIndex + 1, 0, duplicatedBlock)

      set({
        blocks: updatedBlocks.map((block, index) => ({ ...block, order: index })),
        selectedBlockId: duplicatedBlock.id,
        hasUnsavedChanges: true,
      })

      get().addToHistory()
      get().autoSave()
    },

    moveBlock: (id, newPosition) => {
      const { blocks } = get()
      const blockIndex = blocks.findIndex((b) => b.id === id)
      if (blockIndex === -1) return

      const updatedBlocks = [...blocks]
      const [movedBlock] = updatedBlocks.splice(blockIndex, 1)
      updatedBlocks.splice(newPosition, 0, movedBlock)

      set({
        blocks: updatedBlocks.map((block, index) => ({ ...block, order: index })),
        hasUnsavedChanges: true,
      })

      get().addToHistory()
      get().autoSave()
    },

    selectBlock: (id) => set({ selectedBlockId: id }),

    setDragging: (isDragging) => set({ isDragging }),

    undo: () => {
      const { history, historyIndex } = get()
      if (historyIndex > 0) {
        set({
          blocks: history[historyIndex - 1],
          historyIndex: historyIndex - 1,
          hasUnsavedChanges: true,
        })
        get().autoSave()
      }
    },

    redo: () => {
      const { history, historyIndex } = get()
      if (historyIndex < history.length - 1) {
        set({
          blocks: history[historyIndex + 1],
          historyIndex: historyIndex + 1,
          hasUnsavedChanges: true,
        })
        get().autoSave()
      }
    },

    addToHistory: () => {
      const { blocks, history, historyIndex, maxHistorySize } = get()
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(blocks)))

      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift()
      } else {
        set({ historyIndex: historyIndex + 1 })
      }

      set({ history: newHistory })
    },

    saveArticle: async () => {
      const { article, blocks } = get()
      if (!article) return

      set({ isSaving: true })

      try {
        const response = await fetch(`/api/articles/${article.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...article,
            blocks: blocks.map(({ id, type, data, order }) => ({
              id,
              type,
              data,
              order,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save article')
        }

        set({
          lastSaved: new Date(),
          hasUnsavedChanges: false,
        })
      } catch (error) {
        console.error('Failed to save article:', error)
        // Show error toast
      } finally {
        set({ isSaving: false })
      }
    },

    autoSave: debounce(() => {
      get().saveArticle()
    }, 3000),

    resetEditor: () => set(initialState),
  }))
)

// Helper function to get default block data
function getDefaultBlockData(type: BlockType): BlockData {
  switch (type) {
    case 'heading':
      return { level: 2, content: '', alignment: 'left' }
    case 'paragraph':
      return { content: '', alignment: 'left' }
    case 'image':
      return { url: '', alt: '', layout: 'centered' }
    case 'video':
      return { provider: 'youtube', url: '' }
    case 'quote':
      return { content: '', style: 'default' }
    case 'list':
      return { items: [], type: 'bullet' }
    case 'divider':
      return { style: 'solid' }
    case 'spacer':
      return { height: 40 }
    default:
      return {}
  }
}

// Debounce utility
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

### 4.5 Drag and Drop Implementation

```typescript
// /components/editor/editor-canvas.tsx
'use client';

import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore } from '@/lib/stores/editor-store';
import { SortableBlock } from './sortable-block';
import { BlockPalette } from './block-palette';
import { cn } from '@/lib/utils';

export function EditorCanvas() {
  const { blocks, moveBlock, setDragging, addBlock } = useEditorStore();

  const handleDragStart = (event: DragStartEvent) => {
    setDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDragging(false);

    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(b => b.id === active.id);
    const newIndex = blocks.findIndex(b => b.id === over.id);

    if (oldIndex !== -1) {
      // Moving existing block
      moveBlock(active.id as string, newIndex);
    } else {
      // Adding new block from palette
      const blockType = active.id as BlockType;
      addBlock(blockType, newIndex);
    }
  };

  return (
    <div className="flex gap-6">
      <BlockPalette />

      <div className="flex-1 max-w-3xl mx-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4 min-h-[500px] py-8">
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">Start by dragging blocks from the left</p>
                  <p className="text-sm mt-2">or press / to open block menu</p>
                </div>
              ) : (
                blocks.map(block => (
                  <SortableBlock key={block.id} block={block} />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
```

```typescript
// /components/editor/sortable-block.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings, Copy, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { BlockRenderer } from './block-renderer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Block } from '@/types';

interface SortableBlockProps {
  block: Block;
}

export function SortableBlock({ block }: SortableBlockProps) {
  const {
    selectedBlockId,
    selectBlock,
    deleteBlock,
    duplicateBlock
  } = useEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedBlockId === block.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg transition-all',
        isDragging && 'opacity-50 z-50',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={() => selectBlock(block.id)}
    >
      {/* Drag Handle & Toolbar */}
      <div className={cn(
        'absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
        isSelected && 'opacity-100'
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab active:cursor-grabbing h-8 w-8"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Block Actions */}
      <div className={cn(
        'absolute -right-32 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
        isSelected && 'opacity-100'
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            // Open settings panel
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            duplicateBlock(block.id);
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            deleteBlock(block.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Block Content */}
      <div className="p-4">
        <BlockRenderer block={block} />
      </div>
    </div>
  );
}
```

---

## 5. Backend Architecture

### 5.1 Technology Stack

```yaml
Runtime: Cloudflare Workers (V8 Isolates)
Framework: Hono (fast, lightweight)
Database: Cloudflare D1 (SQLite-compatible)
ORM: Drizzle ORM
Cache: Cloudflare KV
File Storage: Cloudflare R2
Authentication: NextAuth.js
Validation: Zod
Email: Resend or SendGrid
Testing: Vitest
```

### 5.2 Worker Setup

```typescript
// /workers/api.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { articles } from './routes/articles'
import { media } from './routes/media'
import { auth } from './routes/auth'
import { users } from './routes/users'
import { categories } from './routes/categories'

export type Bindings = {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  ENVIRONMENT: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://yoursite.com'],
    credentials: true,
  })
)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
app.route('/api/articles', articles)
app.route('/api/media', media)
app.route('/api/auth', auth)
app.route('/api/users', users)
app.route('/api/categories', categories)

// Error handler
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: { message: err.message, code: 'INTERNAL_ERROR' } }, 500)
})

// 404 handler
app.notFound((c) => c.json({ error: { message: 'Not Found', code: 'NOT_FOUND' } }, 404))

export default app
```

---

## 6. Database Design

### 6.1 Drizzle Schema

```typescript
// /db/schema.ts
import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Users
export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    password: text('password'),
    name: text('name'),
    image: text('image'),
    bio: text('bio'),
    role: text('role', { enum: ['ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR'] })
      .default('AUTHOR')
      .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  })
)

// Articles
export const articles = sqliteTable(
  'articles',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    subtitle: text('subtitle'),
    excerpt: text('excerpt'),
    featuredImage: text('featured_image'),
    featuredImageAlt: text('featured_image_alt'),
    status: text('status', { enum: ['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] })
      .default('DRAFT')
      .notNull(),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    canonicalUrl: text('canonical_url'),
    viewCount: integer('view_count').default(0).notNull(),
    likeCount: integer('like_count').default(0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
    statusPublishedIdx: index('status_published_idx').on(table.status, table.publishedAt),
    authorIdx: index('author_idx').on(table.authorId),
    categoryIdx: index('category_idx').on(table.categoryId),
  })
)

// Blocks
export const blocks = sqliteTable(
  'blocks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: text('type').notNull(),
    data: text('data', { mode: 'json' }).$type<Record<string, any>>().notNull(),
    order: integer('order').notNull(),
    articleId: text('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    articleOrderIdx: index('article_order_idx').on(table.articleId, table.order),
  })
)

// Categories
export const categories = sqliteTable(
  'categories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    image: text('image'),
    parentId: text('parent_id'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    slugIdx: index('category_slug_idx').on(table.slug),
  })
)

// Tags
export const tags = sqliteTable(
  'tags',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    slugIdx: index('tag_slug_idx').on(table.slug),
    nameIdx: index('tag_name_idx').on(table.name),
  })
)

// Article Tags (Junction Table)
export const articleTags = sqliteTable(
  'article_tags',
  {
    articleId: text('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.tagId] }),
  })
)

// Media
export const media = sqliteTable(
  'media',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    mimeType: text('mime_type').notNull(),
    size: integer('size').notNull(),
    width: integer('width'),
    height: integer('height'),
    alt: text('alt'),
    caption: text('caption'),
    credit: text('credit'),
    uploadedBy: text('uploaded_by')
      .notNull()
      .references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    uploadedByIdx: index('uploaded_by_idx').on(table.uploadedBy),
    mimeTypeIdx: index('mime_type_idx').on(table.mimeType),
  })
)

// Comments (Future feature)
export const comments = sqliteTable(
  'comments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    content: text('content').notNull(),
    articleId: text('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id),
    parentId: text('parent_id'),
    status: text('status', { enum: ['PENDING', 'APPROVED', 'SPAM', 'TRASH'] })
      .default('PENDING')
      .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    articleCreatedIdx: index('article_created_idx').on(table.articleId, table.createdAt),
  })
)

// Newsletter Subscribers
export const subscribers = sqliteTable(
  'subscribers',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    name: text('name'),
    status: text('status', { enum: ['PENDING', 'ACTIVE', 'UNSUBSCRIBED'] })
      .default('PENDING')
      .notNull(),
    subscribedAt: integer('subscribed_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    confirmedAt: integer('confirmed_at', { mode: 'timestamp' }),
  },
  (table) => ({
    emailIdx: index('subscriber_email_idx').on(table.email),
    statusIdx: index('subscriber_status_idx').on(table.status),
  })
)
```

This is Part 1 of the complete architecture document. Would you like me to continue with the remaining sections (API Routes, Infrastructure, Security, Performance, etc.)?
