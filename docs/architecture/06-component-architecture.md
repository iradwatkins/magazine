# 6. Component Architecture

[← Back to Index](index.md) | [← Previous: API Specification](05-api-specification.md) | [Next: Database Schema →](07-database-schema.md)

---

## 6.1 Frontend Structure

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

## 6.2 Core Components

**EditorCanvas** - Drag-and-drop editor with @dnd-kit
**BlockPalette** - Sidebar with available content blocks
**ContentBlock Components** - HeadingBlock, ParagraphBlock, ImageBlock, QuoteBlock, ListBlock, etc.
**MediaUpload** - Upload to MinIO with Sharp processing
**ArticleContent** - Render published articles with optimal typography

---

[← Back to Index](index.md) | [← Previous: API Specification](05-api-specification.md) | [Next: Database Schema →](07-database-schema.md)
