# Epic 6: Article Management Dashboard

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Drag-and-Drop Article Editor ←](epic-05-article-editor.md) | [Next Epic: Reader Experience - Public Site →](epic-07-reader-experience.md)

---

## Epic Goal

Build a comprehensive admin dashboard for managing articles with a filterable, sortable table view, inline quick actions, bulk operations, article settings form (featured image, category, tags, SEO, publish status), search functionality, and status indicators. Enable editors and admins to efficiently oversee all content, transition articles through workflow states, and maintain editorial quality across the magazine.

**Stories:** 10 | **Dependencies:** Epic 3 (Content Model), Epic 5 (Article Editor)

---

## Story 6.1: Create Dashboard Overview Page with Key Metrics

**As an** editor or admin,
**I want** a dashboard overview page showing key content metrics,
**so that** I can quickly assess the health and activity of the magazine platform.

### Acceptance Criteria

1. Dashboard page created at `app/(admin)/dashboard/page.tsx`
2. Stat cards display: Total articles, Published articles, Draft articles, Total views
3. Recent activity feed: Latest 10 articles (created, published, updated) with timestamps
4. Quick actions: "New Article", "View Media", "Manage Categories"
5. Popular articles widget: Top 5 articles by view count (last 30 days)
6. Authors widget: Top 5 contributors by article count
7. All data fetched from API endpoints
8. Loading skeletons for data-heavy widgets
9. Responsive layout (cards stack on mobile)
10. Authenticated users only (author+ role)

---

## Story 6.2: Build Article List View with Table Component

**As an** editor or admin,
**I want** a comprehensive table view of all articles,
**so that** I can see article metadata at a glance and take quick actions.

### Acceptance Criteria

1. Article list page created at `app/(admin)/articles/page.tsx`
2. Table displays columns: Checkbox, Thumbnail, Title, Author, Category, Status, Views, Updated, Actions
3. Table uses shadcn/ui Table component with proper styling
4. Status badge colored: Draft (gray), Published (green)
5. Thumbnail shows featured image (fallback to placeholder)
6. Author shows name with avatar
7. Actions dropdown per row: Edit, Preview, Duplicate, Delete
8. Table shows 20 articles per page with pagination controls
9. Empty state message if no articles exist: "Create your first article"
10. Responsive: table scrollable horizontally on mobile

---

## Story 6.3: Implement Article Search and Filtering

**As an** editor or admin,
**I want** to search and filter the article list,
**so that** I can quickly find specific articles among hundreds of posts.

### Acceptance Criteria

1. Search input at top of table filters by title, subtitle, excerpt
2. Debounced search (300ms delay)
3. Filter dropdown: Status (All, Draft, Published)
4. Filter dropdown: Category (All, + list of categories)
5. Filter dropdown: Author (All, + list of authors)
6. Date range picker: Filter by published date or updated date
7. Filters combinable (e.g., Published + Category:Culture + Author:Maya)
8. URL query parameters update with filters (shareable filtered views)
9. "Clear filters" button resets all filters and search
10. Filter state persists across page navigation

---

## Story 6.4: Implement Table Sorting

**As an** editor or admin,
**I want** to sort the article table by different columns,
**so that** I can organize content by priority, date, or popularity.

### Acceptance Criteria

1. Sortable columns: Title, Author, Category, Status, Views, Updated, Published
2. Click column header to sort ascending, click again for descending
3. Sort indicator icon (up/down arrow) shows current sort state
4. Default sort: Updated (newest first)
5. Sort persists in URL query parameters
6. API endpoint supports sort parameter: `?sort=views&order=desc`
7. Multi-column sort (secondary sort) not required for MVP
8. Keyboard accessible (Enter/Space to toggle sort)

---

## Story 6.5: Implement Bulk Actions for Articles

**As an** editor or admin,
**I want** to perform bulk actions on multiple articles,
**so that** I can efficiently manage content at scale.

### Acceptance Criteria

1. Checkbox in table header selects/deselects all visible articles
2. Checkbox per row selects individual articles
3. Selection counter shows: "X articles selected"
4. Bulk actions dropdown appears when articles selected: Publish, Unpublish, Delete, Change Category
5. "Publish" action changes status of selected drafts to Published
6. "Unpublish" action changes status of published articles to Draft
7. "Delete" action shows confirmation dialog, then soft deletes selected articles
8. "Change Category" opens modal with category dropdown
9. Bulk actions respect user permissions (authors can't bulk delete others' articles)
10. Success toast notification after bulk action: "5 articles published"

---

## Story 6.6: Build Article Settings Form

**As a** content creator,
**I want** a comprehensive settings form for article metadata,
**so that** I can configure featured image, category, tags, SEO, and publish status.

### Acceptance Criteria

1. Article settings form accessible from editor (gear icon or "Settings" tab)
2. Featured image section: Upload button (opens media library), preview, remove button
3. Category dropdown: Single-select from available categories
4. Tags input: Multi-select with autocomplete, create new tags inline
5. Publish status section: Draft/Published toggle, scheduled publish date/time (disabled for MVP)
6. SEO section: Meta title (60 char max), meta description (160 char max), slug (editable)
7. Excerpt textarea: Article summary for listings (200 char max)
8. Form validation with Zod schema
9. Save button updates article via API
10. Form responsive and accessible

---

## Story 6.7: Implement Inline Quick Edit for Articles

**As an** editor or admin,
**I want** inline editing of article fields directly in the table,
**so that** I can make quick changes without opening the full editor.

### Acceptance Criteria

1. Double-click on Title cell makes it editable inline
2. Click on Status badge opens dropdown to change status (Draft/Published)
3. Click on Category cell opens dropdown to change category
4. Save inline changes automatically on blur
5. ESC key cancels inline edit and reverts changes
6. Enter key saves inline edit
7. Loading indicator while saving
8. Toast notification on successful save
9. Error handling if save fails (revert to original value)
10. Inline edit restricted by permissions (authors can only edit own articles)

---

## Story 6.8: Build New Article Creation Flow

**As a** content creator,
**I want** a streamlined flow for creating new articles,
**so that** I can quickly start writing without setup friction.

### Acceptance Criteria

1. "New Article" button in dashboard and article list page
2. Click button opens modal: "Create new article"
3. Modal has single input: Article title (required)
4. Optional: "Start from template" dropdown (future feature, UI placeholder)
5. "Create" button creates article with title, assigns current user as author, sets status to Draft
6. Article created via `POST /api/articles`
7. On success, redirect to article editor: `/admin/articles/[id]/edit`
8. Editor initializes with empty canvas, title pre-filled
9. Cancel button closes modal without creating article
10. Modal accessible (keyboard navigation, focus trap)

---

## Story 6.9: Implement Article Duplication

**As a** content creator,
**I want** to duplicate an existing article as a starting template,
**so that** I can reuse structure and formatting for similar articles.

### Acceptance Criteria

1. "Duplicate" action in article list dropdown
2. Duplicate creates new article with: Title (append "Copy"), all blocks, category, tags
3. Duplicated article assigned to current user as author
4. Duplicated article status set to Draft
5. Featured image duplicated (reference, not re-upload)
6. Slug regenerated to avoid conflict: `article-slug-copy`
7. View count and published date NOT duplicated (reset)
8. API endpoint: `POST /api/articles/[id]/duplicate`
9. On success, redirect to duplicated article editor
10. Toast notification: "Article duplicated successfully"

---

## Story 6.10: Implement Article Preview Functionality

**As a** content creator,
**I want** to preview my article as it will appear to readers,
**so that** I can verify formatting and layout before publishing.

### Acceptance Criteria

1. "Preview" button in editor toolbar and article list actions
2. Preview opens article in new tab at route: `/preview/[articleId]`
3. Preview route requires authentication (only author, editors, admins can preview drafts)
4. Preview renders article exactly as public article page (same components)
5. Preview banner at top: "You are previewing a draft article"
6. Preview link shareable with team members (requires login)
7. Preview reflects latest auto-saved changes
8. Preview responsive (test on mobile, tablet, desktop)
9. SEO meta tags NOT indexed (noindex, nofollow)
10. Preview route: `app/(preview)/preview/[id]/page.tsx`

---

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Drag-and-Drop Article Editor ←](epic-05-article-editor.md) | [Next Epic: Reader Experience - Public Site →](epic-07-reader-experience.md)
