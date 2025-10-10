# Story 5.6: Implement Block Renderer for All Block Types

**Epic:** Epic 5 - Drag-and-Drop Article Editor
**Story ID:** 5.6
**Status:** QA Approved
**Created:** 2025-10-09
**Agent Model Used:** claude-sonnet-4-5

---

## User Story

**As a** developer,
**I want** a block renderer that displays each block type correctly,
**So that** content creators see accurate previews of their content while editing.

---

## Story Context

**Existing System Integration:**

- Integrates with: SortableBlock (Story 5.5), Block type definitions (Story 5.2), TipTap editor (Story 5.1)
- Technology: React 19, Next.js 15, TipTap, Tailwind CSS
- Follows pattern: Component architecture in `components/editor/` directory
- Touch points: Renders within SortableBlock children, used by all block types

**Epic Context:**
This is the **sixth story** in Epic 5. It creates the BlockRenderer component that displays each block type with proper styling and formatting. This story completes the visual representation layer, replacing placeholder content with actual block rendering. BlockRenderer is a critical component that interprets block data and renders it with design system styling, providing content creators with accurate WYSIWYG previews.

**Dependencies:**

- Story 5.1: TipTap Rich Text Editor Foundation ✅ Complete
- Story 5.2: Block type definitions (AnyBlock, BlockType) ✅ Complete
- Story 5.5: SortableBlock wrapper ✅ Complete

---

## Acceptance Criteria

### Functional Requirements

1. **BlockRenderer Component Creation:**
   - BlockRenderer component created at `components/editor/block-renderer.tsx`
   - Component is a Client Component ('use client' directive)
   - Accepts block prop (type: AnyBlock)
   - Component exports default

2. **Heading Block Rendering:**
   - Renders H1-H6 based on block.data.level (1-6)
   - Applies alignment: left, center, right
   - Uses design system typography (font size, weight, line height)
   - Shows placeholder "Enter heading..." when content empty

3. **Paragraph Block Rendering:**
   - Renders TipTap editor instance for rich text
   - Supports bold, italic, underline, links
   - Applies alignment: left, center, right, justify
   - Shows placeholder "Type your paragraph..." when empty
   - Read-only mode for initial implementation (editable in Story 5.7)

4. **Image Block Rendering:**
   - Displays image preview with block.data.url
   - Shows alt text below image
   - Renders caption if provided
   - Renders credit if provided
   - Applies layout: full, centered, float-left, float-right
   - Shows placeholder icon when URL empty

5. **Quote Block Rendering:**
   - Renders styled blockquote element
   - Displays quote content with proper styling
   - Shows attribution if provided
   - Applies style variation: default, pullquote
   - Shows placeholder "Enter quote..." when empty

6. **List Block Rendering:**
   - Renders <ul> for bullet lists, <ol> for numbered lists
   - Maps block.data.items to <li> elements
   - Applies proper list styling (markers, spacing)
   - Shows placeholder "Add list item..." for empty items

7. **Divider Block Rendering:**
   - Renders <hr> horizontal line element
   - Applies style: solid, dashed, dotted
   - Uses muted foreground color
   - Proper spacing above/below (my-8)

8. **Design System Integration:**
   - All text blocks use typography classes (font-sans, text-base, etc.)
   - Proper spacing follows design system (space-y-4, p-4, etc.)
   - Colors use design tokens (text-foreground, text-muted-foreground, etc.)
   - Responsive typography (text-sm md:text-base, etc.)

9. **Responsive Rendering:**
   - All blocks render properly on mobile (320px+)
   - Tablet optimization (768px+)
   - Desktop layout (1024px+)
   - Images scale responsively (max-w-full)

10. **Empty State Placeholders:**
    - All empty blocks show helpful placeholder text
    - Placeholders styled with muted colors
    - Placeholders italic for visual distinction

### Integration Requirements

11. **Type Safety:**
    - BlockRenderer accepts AnyBlock type
    - Switch statement handles all BlockType values
    - TypeScript strict mode compliance
    - Exhaustive type checking with default case

12. **TipTap Integration:**
    - Paragraph blocks use TipTap editor instance
    - Editor configured with StarterKit extensions
    - Editor content set from block.data.content
    - Editor initially read-only (editable in Story 5.7)

13. **Existing Patterns:**
    - Uses Next.js Image component for images
    - Uses Tailwind utility classes
    - Follows component structure conventions
    - Consistent with design system

### Quality Requirements

14. **Performance:**
    - Component renders efficiently (no unnecessary re-renders)
    - Images lazy-loaded (Next.js Image default)
    - TipTap editor instances managed properly
    - No memory leaks

15. **Testing:**
    - Component renders without errors
    - All 6 block types render correctly (manual test)
    - Empty states display placeholders
    - Responsive rendering verified

16. **Documentation:**
    - JSDoc comments for component and block rendering functions
    - Usage example in component file header
    - Code comments explain block type handling
    - File List updated in this story

---

## Tasks

### Component Setup

- [ ] Create `components/editor/block-renderer.tsx` file
- [ ] Set up component as Client Component ('use client' directive)
- [ ] Import block types from `@/types/blocks`
- [ ] Define BlockRendererProps interface (block: AnyBlock)
- [ ] Create default export function

### BlockRenderer Core Logic

- [ ] Implement switch statement on block.type
- [ ] Create case for each block type (heading, paragraph, image, quote, list, divider)
- [ ] Add default case with error message for unknown types
- [ ] Return appropriate JSX for each block type

### Heading Block Implementation

- [ ] Create heading rendering logic
- [ ] Map block.data.level to H1-H6 element
- [ ] Apply alignment classes (text-left, text-center, text-right)
- [ ] Apply typography classes (text-4xl for H1, text-3xl for H2, etc.)
- [ ] Show placeholder when content empty
- [ ] Ensure semantic HTML (<h1>, <h2>, etc.)

### Paragraph Block Implementation

- [ ] Import TipTapEditor component from Story 5.1
- [ ] Create paragraph rendering logic
- [ ] Pass block.data.content to TipTap editor
- [ ] Apply alignment classes
- [ ] Configure editor as read-only initially
- [ ] Show placeholder when content empty

### Image Block Implementation

- [ ] Import Next.js Image component
- [ ] Create image rendering logic
- [ ] Display image with block.data.url
- [ ] Apply layout styles (full, centered, float-left, float-right)
- [ ] Render caption in <figcaption> if provided
- [ ] Render credit in muted text if provided
- [ ] Show placeholder icon when URL empty
- [ ] Use Next.js Image for optimization (width, height, alt)

### Quote Block Implementation

- [ ] Create quote rendering logic
- [ ] Render <blockquote> element
- [ ] Apply quote styling (border-left, italic, padding)
- [ ] Display attribution if provided
- [ ] Handle style variations (default, pullquote)
- [ ] Show placeholder when content empty

### List Block Implementation

- [ ] Create list rendering logic
- [ ] Render <ul> for bullet type, <ol> for numbered type
- [ ] Map block.data.items to <li> elements
- [ ] Apply list styling (list-disc, list-decimal, pl-6)
- [ ] Show placeholder for empty items
- [ ] Handle empty items array

### Divider Block Implementation

- [ ] Create divider rendering logic
- [ ] Render <hr> element
- [ ] Apply style classes (border-solid, border-dashed, border-dotted)
- [ ] Apply color (border-muted-foreground)
- [ ] Add vertical spacing (my-8)

### Design System Styling

- [ ] Apply typography scale (text-xs to text-4xl)
- [ ] Use spacing tokens (space-y-4, p-4, my-8)
- [ ] Use color tokens (text-foreground, text-muted-foreground, bg-muted)
- [ ] Ensure responsive classes (text-sm md:text-base)
- [ ] Follow line-height patterns (leading-tight, leading-relaxed)

### Responsive Design

- [ ] Test all blocks on mobile (320px)
- [ ] Test all blocks on tablet (768px)
- [ ] Test all blocks on desktop (1024px+)
- [ ] Ensure images scale responsively (max-w-full h-auto)
- [ ] Verify text wraps properly on small screens

### Integration with SortableBlock

- [ ] Replace placeholder content in editor-canvas.tsx
- [ ] Pass block prop to BlockRenderer
- [ ] Verify BlockRenderer renders inside SortableBlock children
- [ ] Test drag-and-drop still works with rendered blocks

### Testing & Validation

- [ ] Verify component renders without errors
- [ ] Test heading block (all 6 levels, all alignments)
- [ ] Test paragraph block (with/without content, all alignments)
- [ ] Test image block (with/without URL, all layouts)
- [ ] Test quote block (with/without attribution, both styles)
- [ ] Test list block (bullet and numbered, multiple items)
- [ ] Test divider block (all 3 styles)
- [ ] Run TypeScript compilation: `npm run build`
- [ ] Run ESLint: `npm run lint`
- [ ] Run Prettier: `npm run format`

### Documentation

- [ ] Add JSDoc comments to component
- [ ] Add usage example in file header comment
- [ ] Document block type rendering logic
- [ ] Update File List in this story

---

## Technical Notes

### BlockRenderer Component Structure

```typescript
'use client'

import Image from 'next/image'
import type { AnyBlock } from '@/types/blocks'
import { Quote } from 'lucide-react'

interface BlockRendererProps {
  block: AnyBlock
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} />

    case 'paragraph':
      return <ParagraphBlock block={block} />

    case 'image':
      return <ImageBlock block={block} />

    case 'quote':
      return <QuoteBlock block={block} />

    case 'list':
      return <ListBlock block={block} />

    case 'divider':
      return <DividerBlock block={block} />

    default:
      return (
        <div className="text-destructive">
          Unknown block type: {(block as any).type}
        </div>
      )
  }
}

// Individual block rendering functions
function HeadingBlock({ block }: { block: Extract<AnyBlock, { type: 'heading' }> }) {
  const { level, content, alignment } = block.data
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment]

  const sizeClass = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium',
  }[level]

  return (
    <Tag className={cn(sizeClass, alignmentClass, !content && 'text-muted-foreground italic')}>
      {content || 'Enter heading...'}
    </Tag>
  )
}
```

### Typography Scale

Following design system:

- H1: `text-4xl font-bold` (36px)
- H2: `text-3xl font-bold` (30px)
- H3: `text-2xl font-semibold` (24px)
- H4: `text-xl font-semibold` (20px)
- H5: `text-lg font-medium` (18px)
- H6: `text-base font-medium` (16px)
- Paragraph: `text-base` (16px)

### Image Layouts

- **Full:** `w-full` (100% width)
- **Centered:** `mx-auto max-w-2xl` (centered, max 672px)
- **Float Left:** `float-left mr-4 mb-4 max-w-xs` (floats left, max 320px)
- **Float Right:** `float-right ml-4 mb-4 max-w-xs` (floats right, max 320px)

### Quote Styles

- **Default:** Left border, italic text, gray background
- **Pullquote:** Centered, larger text, no border, bold

### Placeholder Pattern

```typescript
{content || <span className="text-muted-foreground italic">Enter heading...</span>}
```

### Integration Approach

1. BlockRenderer created as separate component
2. EditorCanvas imports BlockRenderer
3. SortableBlock wraps BlockRenderer:
   ```tsx
   <SortableBlock key={block.id} block={block}>
     <BlockRenderer block={block} />
   </SortableBlock>
   ```
4. Each block type rendered with proper styling
5. Initial implementation is read-only (editing added in Stories 5.7-5.8)

---

## Definition of Done

- [ ] All tasks completed and checkboxes marked [x]
- [ ] BlockRenderer component created
- [ ] All 6 block types render correctly (heading, paragraph, image, quote, list, divider)
- [ ] Design system styling applied (typography, spacing, colors)
- [ ] Responsive rendering works (mobile, tablet, desktop)
- [ ] Empty state placeholders display
- [ ] Integrated with SortableBlock in EditorCanvas
- [ ] TypeScript strict mode passes: `npm run build`
- [ ] ESLint passes: `npm run lint`
- [ ] Prettier formatting applied: `npm run format`
- [ ] File List updated with all new files
- [ ] Story status updated to "Ready for Review"

---

## Risk and Compatibility

### Primary Risk

TipTap editor instances for paragraph blocks may cause performance issues if many blocks rendered.

### Mitigation

- Initial implementation uses read-only TipTap (simpler, faster)
- Each paragraph gets own editor instance (isolated state)
- React's reconciliation handles re-renders efficiently
- Monitor performance with many blocks (>50)
- Consider virtualization if needed (future optimization)

### Secondary Risk

Image blocks with external URLs may fail to load or have CORS issues.

### Mitigation

- Use Next.js Image component (handles optimization and errors gracefully)
- Show placeholder when image fails to load
- Validate image URLs in Story 5.8 (Image block component)
- Consider image proxy for external URLs (future enhancement)

### Rollback

- Remove block-renderer.tsx
- Revert editor-canvas.tsx to use placeholder content
- No database changes required
- No store changes required

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5

### Debug Log References

<!-- Link to .ai/debug-log.md entries if errors occur -->

### Completion Notes

<!-- Dev agent fills this after implementation -->

### File List

**New Files:**

<!-- Dev agent lists all new files created -->

**Modified Files:**

<!-- Dev agent lists all modified files -->

**Deleted Files:**

<!-- Dev agent lists any deleted files -->

### Change Log

<!-- Dev agent logs significant changes with timestamps -->

---

## Related Stories

**Depends On:**

- Story 5.1: Set Up TipTap Rich Text Editor Foundation ✅ Complete
- Story 5.2: Create Block Type Definitions and TypeScript Types ✅ Complete
- Story 5.5: Create Sortable Block Wrapper Component ✅ Complete

**Blocks:**

- Story 5.7: Create Individual Block Components (Heading, Paragraph, Quote) - will make blocks editable
- Story 5.8: Create Individual Block Components (Image, List, Divider) - will add block-specific controls

**Related:**

- Story 5.9: Block Settings Inspector Panel - will customize block appearance
- Story 5.12: Build Article Editor Page - will use BlockRenderer in full editor

---

**Status:** Draft
**Last Updated:** 2025-10-09
