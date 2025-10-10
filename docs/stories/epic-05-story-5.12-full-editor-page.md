# Story 5.12: Full Article Editor Page

**Epic:** 5 - Drag-and-Drop Article Editor
**Story Points:** 8
**Priority:** High
**Status:** In Progress
**Assignee:** Dev Team
**Sprint:** Current

---

## 📋 Story Description

As a **content writer**,
I want to **access a complete article editor page with all editing features integrated**,
So that I can **create and edit articles with drag-and-drop blocks, auto-save, undo/redo, and keyboard shortcuts in a seamless interface**.

---

## 🎯 Acceptance Criteria

### 1. Editor Page Route

- [ ] Page accessible at `/articles/{id}/edit`
- [ ] Server-side article loading from database
- [ ] User authentication required (redirect to sign-in if not authenticated)
- [ ] Permission check (user must be author or have EDIT_ANY_ARTICLE permission)
- [ ] Article not found redirects to articles list

### 2. Component Integration

- [ ] EditorCanvas (center) - drag-drop blocks with reordering
- [ ] BlockPalette (left sidebar) - all 6 block types available
- [ ] InspectorPanel (right sidebar) - shows settings for selected block
- [ ] EditorToolbar (top) - title, buttons, undo/redo, save status
- [ ] All components properly communicate via Zustand store

### 3. Auto-Save Integration

- [ ] Auto-save triggers every 30 seconds when idle
- [ ] Pauses while user is typing (3-second idle detection)
- [ ] Save status indicator shows: idle/saving/saved/error
- [ ] Manual save button triggers immediate save
- [ ] Changes persist to database via API endpoint

### 4. Keyboard Shortcuts

- [ ] `Cmd/Ctrl + Z` → Undo last action
- [ ] `Cmd/Ctrl + Shift + Z` → Redo last action
- [ ] `Cmd/Ctrl + S` → Manual save (prevents browser default)
- [ ] `?` → Open keyboard shortcuts help modal
- [ ] Toast notifications confirm actions

### 5. Editor Toolbar

- [ ] Article title input (editable, saves on blur)
- [ ] Undo button (disabled when canUndo() is false)
- [ ] Redo button (disabled when canRedo() is false)
- [ ] Save status indicator with timestamp
- [ ] Preview button (future: opens preview modal)
- [ ] Publish button (future: changes article status)
- [ ] Help button (opens keyboard shortcuts modal)

### 6. History Management

- [ ] `saveToHistory()` called after `addBlock()`
- [ ] `saveToHistory()` called after `updateBlock()`
- [ ] `saveToHistory()` called after `deleteBlock()`
- [ ] `saveToHistory()` called after `updateBlockOrder()`
- [ ] History stack limited to 50 snapshots
- [ ] Deep cloning prevents reference mutations

### 7. Data Persistence

- [ ] Article blocks loaded from database on page mount
- [ ] Blocks saved as JSON string via PUT `/api/articles/{id}/blocks`
- [ ] Page refresh loads previously saved blocks
- [ ] Error handling shows retry option on save failure

### 8. Help Modal

- [ ] Modal shows all keyboard shortcuts
- [ ] Platform-specific modifier keys (Cmd on Mac, Ctrl on Windows)
- [ ] Opens via help button or `?` key
- [ ] Closes via Esc key or close button

---

## 🏗️ Technical Design

### Architecture

```
app/articles/[id]/edit/page.tsx (Server Component)
  ↓
  Loads article from database
  ↓
components/editor/article-editor.tsx (Client Component)
  ├── EditorToolbar
  │   ├── Title Input → updateArticle({ title })
  │   ├── Undo/Redo Buttons → undo(), redo()
  │   ├── SaveStatusIndicator → shows auto-save state
  │   └── Action Buttons → Preview, Publish, Help
  │
  ├── BlockPalette (left sidebar)
  │   └── Drag blocks to canvas
  │
  ├── EditorCanvas (center)
  │   └── SortableBlock → BlockRenderer
  │       └── Editable blocks (Heading, Paragraph, etc.)
  │
  └── InspectorPanel (right sidebar)
      └── Block-specific settings
```

### Data Flow

```
1. Page Load
   ↓
2. Fetch article from DB (server-side)
   ↓
3. Parse blocks JSON → AnyBlock[]
   ↓
4. Initialize Zustand store with blocks
   ↓
5. Save initial snapshot to history
   ↓
6. User edits blocks
   ↓
7. Auto-save hook watches for changes
   ↓
8. After 30s idle → PUT /api/articles/{id}/blocks
   ↓
9. Database updated with new blocks JSON
   ↓
10. Save status indicator updates
```

### State Management

```typescript
// Zustand Store
const {
  blocks,           // Current blocks array
  addBlock,         // Add new block
  updateBlock,      // Update block data
  deleteBlock,      // Remove block
  updateBlockOrder, // Reorder blocks (drag-drop)
  undo,             // Undo last action
  redo,             // Redo last action
  saveToHistory     // Save current state to history stack
} = useEditorStore()

// Auto-Save Hook
const {
  saveStatus,       // 'idle' | 'saving' | 'saved' | 'error'
  lastSaved,        // Date | null
  triggerSave,      // Manual save function
  error             // Error | null
} = useAutoSave({
  data: blocks,
  onSave: async (blocks) => { ... }
})
```

---

## 📁 Files to Create

### 1. Article Editor Page

**Path:** `app/articles/[id]/edit/page.tsx`

**Purpose:** Server component that loads article data and renders client editor

**Dependencies:**

- `@/lib/articles` - getArticle()
- `@/lib/auth` - getServerSession()
- `next-auth` - Authentication
- `next/navigation` - redirect()

**Key Functions:**

- Load article from database
- Check authentication
- Validate user permissions
- Handle article not found

---

### 2. Article Editor Client Component

**Path:** `components/editor/article-editor.tsx`

**Purpose:** Main client component that integrates all editor components

**Dependencies:**

- `@/lib/stores/editor-store` - Zustand store
- `@/hooks/useAutoSave` - Auto-save hook
- `@/hooks/useEditorKeyboardShortcuts` - Keyboard shortcuts
- All editor components (Canvas, Palette, Inspector, Toolbar)

**Key Functions:**

- Initialize store with article blocks
- Set up auto-save with API endpoint
- Register keyboard shortcuts
- Coordinate component communication

---

### 3. Editor Toolbar

**Path:** `components/editor/editor-toolbar.tsx`

**Purpose:** Top toolbar with title, undo/redo, save status, and actions

**Dependencies:**

- `@/components/ui/button` - Button components
- `@/components/ui/input` - Title input
- `@/hooks/useAutoSave` - SaveStatus type
- `@/lib/stores/editor-store` - undo/redo functions
- `lucide-react` - Icons

**Key Functions:**

- Article title editing with blur save
- Undo/Redo button management
- Action button handlers (Preview, Publish, Help)
- Keyboard shortcuts modal trigger

---

### 4. Keyboard Shortcuts Hook

**Path:** `hooks/useEditorKeyboardShortcuts.ts`

**Purpose:** Register global keyboard shortcuts for editor

**Dependencies:**

- `@/lib/stores/editor-store` - undo/redo
- `@/hooks/use-toast` - Toast notifications

**Key Functions:**

- Detect Cmd (Mac) vs Ctrl (Windows/Linux)
- Ignore shortcuts when typing in inputs
- Handle Undo (Cmd/Ctrl+Z)
- Handle Redo (Cmd/Ctrl+Shift+Z)
- Handle Manual Save (Cmd/Ctrl+S)

---

### 5. Keyboard Shortcuts Modal

**Path:** `components/editor/keyboard-shortcuts-modal.tsx`

**Purpose:** Help modal showing all available keyboard shortcuts

**Dependencies:**

- `@/components/ui/dialog` - Modal component

**Key Functions:**

- Display keyboard shortcuts list
- Platform detection (Mac vs Windows)
- Responsive modal layout

---

### 6. API Endpoint - Update Blocks

**Path:** `app/api/articles/[id]/blocks/route.ts`

**Purpose:** Save article blocks to database

**Dependencies:**

- `next-auth` - Authentication
- `@/lib/articles` - updateArticleBlocks()
- `@/types/blocks` - AnyBlock type

**Key Functions:**

- Validate authentication
- Check user permissions
- Save blocks JSON to database
- Error handling

---

### 7. Database Function

**Path:** `lib/articles.ts` (add function)

**Purpose:** Update article blocks in database

**Dependencies:**

- Prisma client

**Key Functions:**

- Update article.blocks column
- Update article.updatedAt timestamp

---

## 🧪 Testing Plan

### Manual Testing

#### Happy Path

1. Navigate to `/articles/{existing-id}/edit`
2. Verify article title and blocks load
3. Edit article title → blur → verify API call
4. Drag new block from palette → verify appears in canvas
5. Edit block content → verify updates in store
6. Change block settings in inspector → verify live update
7. Wait 30 seconds → verify auto-save triggers
8. Check save status indicator shows "Saved"
9. Make change → press Cmd/Ctrl+Z → verify undo
10. Press Cmd/Ctrl+Shift+Z → verify redo
11. Press Cmd/Ctrl+S → verify manual save
12. Refresh page → verify blocks persist
13. Check database → verify blocks JSON saved

#### Error Scenarios

1. Navigate to `/articles/invalid-id/edit` → verify redirects
2. Not authenticated → verify redirects to sign-in
3. No permission → verify redirects to articles list
4. API error during save → verify error status + retry button
5. Network offline → verify error handling

#### Keyboard Shortcuts

1. Make change → Cmd/Ctrl+Z → verify undo + toast
2. Cmd/Ctrl+Shift+Z → verify redo + toast
3. Cmd/Ctrl+S → verify save + toast
4. Press ? → verify help modal opens
5. Press Esc → verify modal closes

#### Responsive Design

1. Desktop (>1024px) → verify all sidebars visible
2. Tablet (768-1024px) → verify responsive layout
3. Mobile (<768px) → verify sidebars collapse
4. Touch gestures → verify drag-drop works

### Automated Testing (Future)

```typescript
// Example E2E test with Playwright
test('complete editor workflow', async ({ page }) => {
  await page.goto('/articles/123/edit')

  // Load editor
  await expect(page.locator('input[placeholder*="title"]')).toBeVisible()

  // Add block
  await page.dragAndDrop('[data-block-type="heading"]', '[data-canvas]')

  // Edit block
  await page.locator('[contenteditable]').first().fill('Test Heading')

  // Auto-save
  await page.waitForSelector('text=Saved')

  // Undo
  await page.keyboard.press('Meta+Z')
  await expect(page.locator('text=Test Heading')).not.toBeVisible()
})
```

---

## 📦 Dependencies

### Existing (Already Installed)

- `zustand` - State management
- `@dnd-kit/*` - Drag and drop
- `date-fns` - Date formatting
- `next-auth` - Authentication
- `@prisma/client` - Database

### New (Need to Add)

- `@radix-ui/react-dialog` - Modal (via shadcn toast)
  ```bash
  npx shadcn@latest add toast
  npx shadcn@latest add dialog
  ```

---

## 🚀 Implementation Steps

### Phase 1: Setup (30 min)

1. ✅ Create story documentation (this file)
2. ⏳ Add toast and dialog components
3. ⏳ Create all 7 files from templates

### Phase 2: Core Integration (2 hours)

1. ⏳ Implement article editor page (server component)
2. ⏳ Implement article editor client component
3. ⏳ Implement editor toolbar
4. ⏳ Wire up auto-save to API endpoint
5. ⏳ Add history saving to store actions

### Phase 3: Keyboard Shortcuts (1 hour)

1. ⏳ Implement keyboard shortcuts hook
2. ⏳ Implement keyboard shortcuts modal
3. ⏳ Add toast notifications
4. ⏳ Test platform detection (Mac/Windows)

### Phase 4: API & Database (30 min)

1. ⏳ Implement blocks API endpoint
2. ⏳ Add updateArticleBlocks function
3. ⏳ Test save/load flow

### Phase 5: Testing & QA (1 hour)

1. ⏳ Manual testing of all acceptance criteria
2. ⏳ Error scenario testing
3. ⏳ Responsive design testing
4. ⏳ Cross-browser testing

### Phase 6: Documentation (30 min)

1. ⏳ Create QA report
2. ⏳ Update handoff document
3. ⏳ Mark story as complete

**Total Estimated Time:** 5-6 hours

---

## 🎯 Definition of Done

- [ ] All acceptance criteria met
- [ ] All 7 files created and tested
- [ ] Manual testing completed successfully
- [ ] No TypeScript errors
- [ ] Build passes successfully
- [ ] PM2 restart successful
- [ ] Code committed to git
- [ ] QA report created
- [ ] Epic 5 marked as 100% complete

---

## 📝 Notes

### Known Limitations

- Preview and Publish buttons are placeholders (implementation in future stories)
- No real-time collaboration (single user editing)
- No revision history beyond 50 undo snapshots
- No rich text formatting in paragraphs yet

### Future Enhancements

- Implement Preview modal (Story 6.x)
- Implement Publish workflow (Story 6.x)
- Add rich text editor to ParagraphBlock
- Add keyboard shortcut customization
- Add collaborative editing with WebSockets
- Add AI-assisted content generation

---

**Story Created:** 2025-10-09
**Last Updated:** 2025-10-09
**Status:** Ready for Development
