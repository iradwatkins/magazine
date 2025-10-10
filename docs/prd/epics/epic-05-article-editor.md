# Epic 5: Drag-and-Drop Article Editor

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Media Management & MinIO Integration ←](epic-04-media-management.md) | [Next Epic: Article Management Dashboard →](epic-06-article-dashboard.md)

---

## Epic Goal

Implement the comprehensive drag-and-drop article editor with essential content blocks (Heading, Paragraph, Image, Quote, List, Divider), block palette sidebar, drag-to-reorder functionality, inline editing with TipTap rich text editor, block settings panel, auto-save every 30 seconds, undo/redo functionality, and real-time preview. Deliver the primary content creation experience that empowers creators to build magazine-quality articles without technical expertise.

**Stories:** 12 | **Dependencies:** Epic 1 (Foundation & Setup), Epic 3 (Content Model)

---

## Story 5.1: Set Up TipTap Rich Text Editor Foundation

**As a** developer,
**I want** to install and configure TipTap editor as the foundation for text editing,
**so that** content creators have a powerful, extensible rich text editing experience.

### Acceptance Criteria

1. TipTap core installed with React wrapper (`@tiptap/react`, `@tiptap/starter-kit`)
2. TipTap extensions installed: StarterKit, Placeholder, CharacterCount
3. Basic TipTap editor renders in a test component
4. Editor configured with: bold, italic, underline, headings, lists, links
5. Editor styling matches design system (fonts, colors)
6. Editor content serializes to/from JSON format
7. Keyboard shortcuts work: Cmd/Ctrl+B (bold), Cmd/Ctrl+I (italic), Cmd/Ctrl+K (link)
8. Editor accessible (keyboard navigation, ARIA labels)

---

## Story 5.2: Create Block Type Definitions and TypeScript Types

**As a** developer,
**I want** comprehensive TypeScript type definitions for all block types,
**so that** the editor has type safety and IDE autocompletion.

### Acceptance Criteria

1. Block type union defined: `'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'divider'`
2. Block data interface defined for each type with proper fields
3. Heading block: `{ level: 1-6, content: string, alignment: 'left' | 'center' | 'right' }`
4. Paragraph block: `{ content: string, alignment: 'left' | 'center' | 'right' | 'justify' }`
5. Image block: `{ url: string, alt: string, caption?: string, credit?: string, layout: 'full' | 'centered' | 'float-left' | 'float-right' }`
6. Quote block: `{ content: string, attribution?: string, style: 'default' | 'pullquote' }`
7. List block: `{ items: string[], type: 'bullet' | 'numbered' }`
8. Divider block: `{ style: 'solid' | 'dashed' | 'dotted' }`
9. Base Block interface: `{ id: string, type: BlockType, data: BlockData, order: number }`
10. Zod schemas created for runtime validation

---

## Story 5.3: Build Block Palette Sidebar Component

**As a** content creator,
**I want** a sidebar palette showing all available block types,
**so that** I can easily add new blocks to my article by dragging them to the canvas.

### Acceptance Criteria

1. Block palette sidebar component created at `/components/editor/block-palette.tsx`
2. Sidebar displays all block types with icons and labels: Heading, Paragraph, Image, Quote, List, Divider
3. Each block is draggable (using @dnd-kit/core)
4. Block icons use Lucide React icons (Heading, Type, Image, Quote, List, Minus)
5. Hover state highlights block item
6. Recently used blocks section (top 3 most recent)
7. Sidebar collapsible on mobile (hamburger icon)
8. Sidebar fixed position on desktop, overlay on mobile
9. Search input filters block types (future enhancement, placeholder added)

---

## Story 5.4: Implement Editor Canvas with DndContext

**As a** developer,
**I want** the main editor canvas with drag-and-drop context configured,
**so that** blocks can be added and reordered via drag-and-drop.

### Acceptance Criteria

1. Editor canvas component created at `/components/editor/editor-canvas.tsx`
2. DndContext from @dnd-kit/core wraps canvas and palette
3. SortableContext manages block list with vertical sorting strategy
4. Drop zone accepts blocks from palette (creates new block)
5. Drop zone accepts blocks from canvas (reorders existing blocks)
6. Collision detection set to `closestCenter`
7. Drag overlay shows block preview while dragging
8. Empty canvas shows placeholder: "Start by dragging blocks from the left"
9. Canvas max-width 720px for optimal reading line length
10. Canvas padding ensures comfortable editing space

---

## Story 5.5: Create Sortable Block Wrapper Component

**As a** developer,
**I want** a sortable block wrapper that handles drag interactions,
**so that** each block can be dragged, selected, and managed individually.

### Acceptance Criteria

1. SortableBlock component created at `/components/editor/sortable-block.tsx`
2. Uses `useSortable` hook from @dnd-kit/sortable
3. Drag handle visible on hover (grip icon on left side)
4. Block highlights on selection (blue border)
5. Block action buttons visible on hover: Settings, Duplicate, Delete
6. Drag handle cursor changes to `grab` on hover, `grabbing` while dragging
7. Dragging block shows semi-transparent preview
8. Click anywhere on block selects it
9. Selected block shows in editor store state
10. Block wrapper accessible (keyboard selection with Tab, Enter)

---

## Story 5.6: Implement Block Renderer for All Block Types

**As a** developer,
**I want** a block renderer that displays each block type correctly,
**so that** content creators see accurate previews of their content while editing.

### Acceptance Criteria

1. BlockRenderer component created at `/components/editor/block-renderer.tsx`
2. Renders Heading block: H1-H6 with proper styling, alignment
3. Renders Paragraph block: TipTap editor with rich text formatting
4. Renders Image block: Image preview, caption, credit, layout styles
5. Renders Quote block: Styled blockquote with attribution
6. Renders List block: Bullet or numbered list with items
7. Renders Divider block: Horizontal line with style variation
8. Each block type uses design system typography and spacing
9. Block rendering responsive (mobile, tablet, desktop)
10. Placeholder text shown for empty blocks

---

## Story 5.7: Create Individual Block Components (Heading, Paragraph, Quote)

**As a** content creator,
**I want** editable Heading, Paragraph, and Quote block components,
**so that** I can write and format text content inline within the editor.

### Acceptance Criteria

1. HeadingBlock component: Dropdown to select level (H1-H6), inline TipTap editor, alignment buttons
2. ParagraphBlock component: Full TipTap editor with toolbar (bold, italic, link), alignment options
3. QuoteBlock component: TipTap editor for quote text, input for attribution, style toggle (default/pullquote)
4. All blocks update Zustand store on content change
5. Formatting toolbar appears on text selection (floating toolbar)
6. Toolbar includes: Bold, Italic, Underline, Link, Text color (limited palette)
7. Alignment buttons: Left, Center, Right (Justify for paragraph only)
8. Keyboard shortcuts work in all text blocks
9. Placeholder text guides users: "Type / for commands", "Enter heading...", etc.

---

## Story 5.8: Create Individual Block Components (Image, List, Divider)

**As a** content creator,
**I want** Image, List, and Divider block components,
**so that** I can add visual and structural elements to my articles.

### Acceptance Criteria

1. ImageBlock component: "Select from library" button, URL input, alt text (required), caption, credit, layout dropdown (full/centered/float)
2. Image preview shows selected image with layout style applied
3. "Upload new" button opens media upload flow inline
4. ListBlock component: Add/remove items, drag-to-reorder items, toggle bullet/numbered
5. List items editable inline (click to edit)
6. DividerBlock component: Style selector (solid, dashed, dotted), color picker (optional)
7. All blocks update Zustand store on change
8. Image block validates URL format and alt text presence
9. List block supports nested lists (indent/outdent buttons)
10. Divider block renders correctly with selected style

---

## Story 5.9: Implement Block Settings Inspector Panel

**As a** content creator,
**I want** a settings panel that shows options for the selected block,
**so that** I can customize block appearance and behavior without cluttering the canvas.

### Acceptance Criteria

1. Inspector panel component created at `/components/editor/inspector-panel.tsx`
2. Panel positioned on right side of editor (desktop), bottom drawer (mobile)
3. Panel shows settings for selected block only
4. Heading settings: Level dropdown, alignment, custom color
5. Paragraph settings: Alignment, font family (serif/sans), line height
6. Image settings: Layout, width (%), border, shadow
7. Quote settings: Style, background color, font size
8. List settings: Type (bullet/numbered), marker style
9. Divider settings: Style, color, thickness
10. Settings changes update block data immediately
11. Panel collapsible (toggle button)

---

## Story 5.10: Implement Auto-Save Functionality with Status Indicator

**As a** content creator,
**I want** automatic saving of my article every 30 seconds,
**so that** I never lose my work due to browser crashes or accidental navigation.

### Acceptance Criteria

1. Auto-save hook created: `useAutoSave()` with 30-second debounce
2. Auto-save triggers on any block change (add, edit, delete, reorder)
3. Auto-save calls `PUT /api/articles/[id]` with article data + blocks
4. Save status indicator in editor header: "Saved", "Saving...", "Error saving"
5. Last saved timestamp displayed: "Last saved at 2:34 PM"
6. Manual save button in editor toolbar triggers immediate save
7. Unsaved changes warning on page navigation (beforeunload event)
8. Auto-save paused while user actively typing (resume after 3 seconds idle)
9. Save errors display toast notification with retry button
10. Save optimistic updates (update UI immediately, rollback on error)

---

## Story 5.11: Implement Undo/Redo Functionality

**As a** content creator,
**I want** undo and redo buttons in the editor,
**so that** I can easily revert mistakes or restore changes.

### Acceptance Criteria

1. History stack maintained in Zustand store (max 50 snapshots)
2. Undo button in toolbar (keyboard shortcut: Cmd/Ctrl+Z)
3. Redo button in toolbar (keyboard shortcut: Cmd/Ctrl+Shift+Z)
4. History snapshot saved on: block add, delete, reorder, major content change
5. Undo/redo updates canvas immediately
6. Undo/redo buttons disabled when history empty
7. History persists during session (cleared on page refresh)
8. Toast notification shows: "Undone" or "Redone"
9. Auto-save triggered after undo/redo
10. Text editing within blocks has separate undo/redo (TipTap native)

---

## Story 5.12: Build Article Editor Page with Full Layout

**As a** content creator,
**I want** a complete article editor page integrating all components,
**so that** I have a unified, professional editing experience.

### Acceptance Criteria

1. Article editor page created at `app/(admin)/articles/[id]/edit/page.tsx`
2. Page layout: Top toolbar, left block palette, center canvas, right inspector panel
3. Top toolbar includes: Article title input, Save button, Preview button, Publish button, Undo/Redo, Save status
4. Article title auto-updates in database on blur (debounced)
5. Preview button opens article in new tab (draft preview route)
6. Publish button toggles article status (Draft ↔ Published)
7. Page loads article data from API on mount
8. Loading state shown while fetching article data
9. Error state if article not found or unauthorized
10. Page fully responsive (mobile editor experience optimized)
11. Keyboard shortcuts documented in help modal (triggered by `?` key)

---

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Media Management & MinIO Integration ←](epic-04-media-management.md) | [Next Epic: Article Management Dashboard →](epic-06-article-dashboard.md)
