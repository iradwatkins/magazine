# Epic 6: Article Management Dashboard - Kickoff Document

**Date:** 2025-10-10
**Epic:** 6 - Article Management Dashboard
**Status:** Ready to Start (0/10 Stories)
**Product Manager:** John (PM Agent)
**Dependencies:** ✅ Epic 3 (Content Model), ✅ Epic 5 (Article Editor)

---

## 📋 Epic Overview

### Goal

Build a comprehensive admin dashboard for managing articles with a filterable, sortable table view, inline quick actions, bulk operations, article settings form (featured image, category, tags, SEO, publish status), search functionality, and status indicators. Enable editors and admins to efficiently oversee all content, transition articles through workflow states, and maintain editorial quality across the magazine.

### Why This Epic Matters

With Epic 5 complete, users can now **create** articles using the drag-and-drop editor. Epic 6 closes the loop by enabling them to **manage** those articles at scale:

- **Dashboard Overview:** Get quick insights into content health (total articles, published/draft counts, top performers)
- **Article List Table:** See all articles at a glance with metadata, thumbnails, and quick actions
- **Search & Filtering:** Find specific articles among hundreds of posts
- **Bulk Operations:** Efficiently manage multiple articles (publish, unpublish, delete, change category)
- **Article Settings:** Configure metadata (featured image, category, tags, SEO, status)
- **Preview & Duplication:** Review articles before publishing, reuse structure for similar posts

### Success Criteria

- [ ] Editors can view dashboard with key metrics and recent activity
- [ ] All articles visible in sortable, filterable table
- [ ] Search works across title, subtitle, and excerpt
- [ ] Bulk actions (publish, unpublish, delete, change category) functional
- [ ] Article settings form updates metadata correctly
- [ ] Preview shows article as readers will see it
- [ ] Article duplication creates proper copy
- [ ] All features respect user permissions (RBAC)
- [ ] Build passes, no TypeScript errors
- [ ] Responsive design works on mobile/tablet/desktop

---

## 🎯 Stories Breakdown (10 Stories)

### Story 6.1: Dashboard Overview Page with Key Metrics

**Priority:** HIGH | **Est:** 4 hours

Create dashboard page with stat cards, recent activity feed, quick actions, popular articles widget, and top contributors widget.

**Key Deliverables:**

- `app/(admin)/dashboard/page.tsx`
- Stat cards component
- Recent activity feed
- Popular articles widget
- API endpoints for dashboard data

---

### Story 6.2: Article List View with Table Component

**Priority:** HIGH | **Est:** 6 hours

Build comprehensive article list table with columns for thumbnail, title, author, category, status, views, updated date, and actions.

**Key Deliverables:**

- `app/(admin)/articles/page.tsx`
- Article table component using shadcn/ui Table
- Status badges (Draft/Published)
- Actions dropdown (Edit, Preview, Duplicate, Delete)
- Pagination controls

---

### Story 6.3: Search and Filtering

**Priority:** HIGH | **Est:** 5 hours

Implement search input and filter dropdowns (status, category, author, date range) with URL query parameters for shareable views.

**Key Deliverables:**

- Debounced search input (300ms)
- Filter dropdowns (Status, Category, Author)
- Date range picker
- URL query parameter sync
- "Clear filters" button

---

### Story 6.4: Table Sorting

**Priority:** MEDIUM | **Est:** 3 hours

Enable column sorting with visual indicators and URL persistence.

**Key Deliverables:**

- Sortable columns: Title, Author, Category, Status, Views, Updated
- Sort indicator icons (up/down arrows)
- URL query parameter sync
- API support for `?sort=views&order=desc`

---

### Story 6.5: Bulk Actions

**Priority:** MEDIUM | **Est:** 6 hours

Implement bulk operations (publish, unpublish, delete, change category) with confirmation dialogs.

**Key Deliverables:**

- Checkbox selection (header + rows)
- Selection counter
- Bulk actions dropdown
- Confirmation dialogs
- API endpoints for bulk operations
- Permission checks

---

### Story 6.6: Article Settings Form

**Priority:** HIGH | **Est:** 8 hours

Build comprehensive settings form for article metadata (featured image, category, tags, SEO, excerpt, status).

**Key Deliverables:**

- Article settings modal/form
- Featured image upload (media library integration)
- Category dropdown (single-select)
- Tags input (multi-select with autocomplete)
- SEO fields (meta title, meta description, slug)
- Excerpt textarea
- Form validation with Zod

---

### Story 6.7: Inline Quick Edit

**Priority:** LOW | **Est:** 5 hours

Enable inline editing of title, status, and category directly in table.

**Key Deliverables:**

- Double-click title to edit inline
- Click status badge to change status
- Click category to change category
- Auto-save on blur
- ESC to cancel, Enter to save

---

### Story 6.8: New Article Creation Flow

**Priority:** HIGH | **Est:** 3 hours

Streamlined modal for creating new articles with title input.

**Key Deliverables:**

- "New Article" button
- Create article modal
- `POST /api/articles` endpoint
- Redirect to editor on success
- Modal with title input (required)

---

### Story 6.9: Article Duplication

**Priority:** MEDIUM | **Est:** 4 hours

Implement article duplication with proper handling of title, blocks, tags, and metadata.

**Key Deliverables:**

- "Duplicate" action in article list
- `POST /api/articles/[id]/duplicate` endpoint
- Duplicate blocks, tags, category
- Reset view count, published date
- Generate unique slug

---

### Story 6.10: Article Preview Functionality

**Priority:** MEDIUM | **Est:** 4 hours

Enable article preview in new tab with authentication and banner indicator.

**Key Deliverables:**

- "Preview" button in editor toolbar + article list
- `app/(preview)/preview/[id]/page.tsx`
- Preview banner: "You are previewing a draft article"
- Authentication required
- SEO noindex/nofollow

---

## 🏗️ Technical Architecture

### Routes to Create

```
app/
├── (admin)/
│   ├── dashboard/
│   │   └── page.tsx              # Story 6.1 - Dashboard overview
│   ├── articles/
│   │   ├── page.tsx               # Story 6.2 - Article list table
│   │   └── [id]/
│   │       └── settings/
│   │           └── page.tsx       # Story 6.6 - Article settings
│   └── (preview)/
│       └── preview/
│           └── [id]/
│               └── page.tsx       # Story 6.10 - Article preview
```

### API Endpoints to Create/Extend

```
app/api/
├── dashboard/
│   └── route.ts                   # GET - Dashboard stats
├── articles/
│   └── route.ts                   # GET - List articles (add search, filter, sort)
├── articles/[id]/
│   ├── duplicate/
│   │   └── route.ts               # POST - Duplicate article
│   └── bulk/
│       └── route.ts               # POST - Bulk actions
```

### Components to Create

```
components/
├── dashboard/
│   ├── stat-card.tsx             # Stat cards for metrics
│   ├── recent-activity.tsx       # Recent activity feed
│   ├── popular-articles.tsx      # Popular articles widget
│   └── top-contributors.tsx      # Top contributors widget
├── articles/
│   ├── article-table.tsx         # Main article table
│   ├── article-filters.tsx       # Search + filter controls
│   ├── article-actions.tsx       # Actions dropdown
│   ├── bulk-actions-bar.tsx      # Bulk actions bar
│   ├── article-settings-form.tsx # Article settings form
│   └── create-article-modal.tsx  # New article modal
└── preview/
    └── preview-banner.tsx        # Draft preview banner
```

### State Management

- **URL Query Parameters:** For search, filters, sort, pagination (shareable views)
- **React State:** For table selection, modals, inline editing
- **Server Actions/API:** For data mutations

### Key Libraries

- **shadcn/ui:** Table, Dialog, Select, Input, Badge, Button
- **react-hook-form:** Article settings form
- **zod:** Form validation
- **date-fns:** Date formatting
- **zustand:** (if needed for complex state)

---

## 📊 Dependencies & Prerequisites

### Completed (Ready to Use)

✅ **Epic 3:** Content Model

- Article, Category, Tag models in Prisma schema
- CRUD API endpoints for articles

✅ **Epic 5:** Article Editor

- `/articles/[id]/edit` route
- Article editing functionality

✅ **Epic 4:** Media Management

- Media library for featured image selection

✅ **Epic 2:** Authentication

- User roles (Admin, Editor, Author)
- RBAC permissions

### Required Next

🔧 **API Enhancements:**

- Extend `/api/articles` with query params (search, filter, sort, pagination)
- Add dashboard stats endpoint
- Add bulk actions endpoint
- Add duplicate endpoint

🔧 **RBAC Enforcement:**

- Ensure permissions checked on all mutations
- Authors can only edit/delete their own articles
- Editors/Admins can manage all articles

---

## 🚀 Recommended Implementation Order

### Phase 1: Foundation (Stories 6.1, 6.2, 6.8)

**Goal:** Get basic dashboard + article list + create article working

1. **Story 6.8:** New Article Creation Flow (3h)
   - Start with simplest feature to establish patterns
   - Test API integration early

2. **Story 6.2:** Article List View (6h)
   - Build table component with basic data
   - No filters/sorting yet

3. **Story 6.1:** Dashboard Overview (4h)
   - Create dashboard page with widgets
   - Wire up API endpoints

**Checkpoint:** Users can see dashboard, view article list, create new articles

---

### Phase 2: Search & Organization (Stories 6.3, 6.4)

**Goal:** Make article list useful at scale

4. **Story 6.3:** Search and Filtering (5h)
   - Add search input and filter dropdowns
   - Implement URL query parameters

5. **Story 6.4:** Table Sorting (3h)
   - Make columns sortable
   - Persist sort in URL

**Checkpoint:** Users can find articles among hundreds of posts

---

### Phase 3: Bulk Operations & Settings (Stories 6.5, 6.6)

**Goal:** Enable efficient content management

6. **Story 6.6:** Article Settings Form (8h)
   - Build comprehensive settings form
   - Integrate media library for featured image
   - Implement tag autocomplete

7. **Story 6.5:** Bulk Actions (6h)
   - Implement checkbox selection
   - Add bulk actions dropdown
   - Create API endpoints for bulk operations

**Checkpoint:** Users can manage article metadata and perform bulk actions

---

### Phase 4: Quality of Life (Stories 6.7, 6.9, 6.10)

**Goal:** Add convenience features

8. **Story 6.10:** Article Preview (4h)
   - Create preview route
   - Add preview banner

9. **Story 6.9:** Article Duplication (4h)
   - Implement duplicate functionality
   - Test with complex articles

10. **Story 6.7:** Inline Quick Edit (5h)
    - Add inline editing to table
    - Polish UX with keyboard shortcuts

**Checkpoint:** Epic 6 complete! Full article management dashboard ready

---

## ✅ Definition of Done (Epic Level)

- [ ] All 10 stories completed with acceptance criteria met
- [ ] Dashboard shows accurate metrics
- [ ] Article list table displays all articles
- [ ] Search and filtering works correctly
- [ ] Bulk actions execute without errors
- [ ] Article settings form saves metadata
- [ ] Preview shows article correctly
- [ ] Duplication creates proper copies
- [ ] All features respect user permissions (RBAC)
- [ ] TypeScript strict mode passes
- [ ] Build successful (no errors)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] PM2 restart successful
- [ ] Manual QA completed for all user flows
- [ ] Epic 6 completion report created

---

## 🎯 Next Steps

### Immediate Actions

1. **Assign Development Team:**
   - Recommended: **Dev Agent** for implementation
   - **QA Agent** for testing each story
   - **PM Agent** for progress tracking

2. **Create First Story Branch:**
   - Start with Story 6.8 (New Article Creation Flow)
   - Simplest feature, establishes patterns

3. **Set Up API Endpoints:**
   - Extend `/api/articles` route with query parameters
   - Create `/api/dashboard` route

### Questions to Resolve

- [ ] Do we need soft delete or hard delete for articles?
- [ ] Should draft articles be visible to all authenticated users or only authors?
- [ ] What's the max number of articles to show in recent activity feed?
- [ ] Should we track who deleted an article (audit log)?

---

## 📚 Resources

- **PRD:** [docs/prd/epics/epic-06-article-dashboard.md](prd/epics/epic-06-article-dashboard.md)
- **Epic 5 Completion Report:** [docs/epic-05-handoff-document.md](epic-05-handoff-document.md)
- **Architecture:** [docs/architecture.md](architecture.md)
- **API Documentation:** [docs/architecture/05-api-specification.md](architecture/05-api-specification.md)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-10
**Status:** Ready for Story 6.1 Implementation
