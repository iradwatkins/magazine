# Frontend Patterns

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [Next: Backend Patterns →](backend-patterns.md)

---

## Server Components (Default)

Server Components are the default in Next.js 15 App Router. They run on the server and can directly access databases and backend resources.

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

**Benefits:**

- Direct database access
- No client-side JavaScript
- Better SEO
- Faster initial page load

## Client Components (Interactive UI)

Client Components are used for interactive features like the drag-and-drop editor.

```typescript
'use client'
export function EditorCanvas({ articleId, initialBlocks }: Props) {
  const { blocks, reorderBlocks } = useEditorStore()
  // ... drag-and-drop logic
}
```

**Use Cases:**

- Interactive forms
- Drag-and-drop interfaces
- Real-time updates
- Client-side animations

## State Management

### Zustand for Editor State

Lightweight state management for the article editor:

```typescript
import { create } from 'zustand'

interface EditorStore {
  blocks: ContentBlock[]
  addBlock: (block: ContentBlock) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  blocks: [],
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
    })),
  reorderBlocks: (startIndex, endIndex) =>
    set((state) => {
      const newBlocks = [...state.blocks]
      const [removed] = newBlocks.splice(startIndex, 1)
      newBlocks.splice(endIndex, 0, removed)
      return { blocks: newBlocks }
    }),
}))
```

### TanStack Query for Server State

Cache management and optimistic updates:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await fetch('/api/articles')
      return res.json()
    },
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateArticleInput) => {
      const res = await fetch('/api/articles', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}
```

### React Server State

For simple cases, use React Server Components without additional state management:

```typescript
// No state management library needed
export default async function ArticleList() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

---

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [Next: Backend Patterns →](backend-patterns.md)
