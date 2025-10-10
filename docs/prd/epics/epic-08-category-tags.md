# Epic 8: Category & Tag Management

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Reader Experience - Public Site ←](epic-07-reader-experience.md) | [Next Epic: Production Readiness & Polish →](epic-09-production-polish.md)

---

## Epic Goal

Build administrative interfaces for creating, editing, organizing, and deleting categories and tags. Enable admins and editors to establish and maintain content taxonomy, ensuring consistent content organization and improved reader discoverability across the magazine platform.

**Stories:** 10 | **Dependencies:** Epic 3 (Content Model)

---

## Story 8.1: Build Category Management List Page

**As an** admin or editor,
**I want** a list view of all categories with management actions,
**so that** I can see and organize the site's content taxonomy at a glance.

### Acceptance Criteria

1. Category management page created at `app/(admin)/categories/page.tsx`
2. Table displays: Category name, slug, article count, description (truncated), image thumbnail, actions
3. "Add Category" button at top of page
4. Actions per row: Edit, Delete (if no articles), View on site (link to public category page)
5. Article count shows number of published articles in category
6. Delete button disabled if category has articles (with tooltip explanation)
7. Table sortable by: Name (A-Z), Article count, Created date
8. Loading state while fetching categories
9. Empty state: "No categories yet. Create your first category to organize content."
10. Only admins and editors can access this page

---

## Story 8.2: Build Create/Edit Category Form

**As an** admin or editor,
**I want** a form to create new categories or edit existing ones,
**so that** I can define content organization structure.

### Acceptance Criteria

1. Category form modal or page at `app/(admin)/categories/new` and `app/(admin)/categories/[id]/edit`
2. Form fields: Name (required), slug (auto-generated, editable), description (textarea), featured image (upload from media library)
3. Slug auto-generated from name, editable, validated for uniqueness
4. Image field opens media library modal for selection
5. Form uses React Hook Form with Zod validation
6. Save button creates/updates category via API
7. Success toast notification on save
8. Cancel button returns to category list
9. Form accessible (keyboard navigation, ARIA labels)
10. Responsive layout

---

## Story 8.3: Implement Category Hierarchy (Parent-Child Relationships)

**As an** admin or editor,
**I want** to create subcategories under parent categories,
**so that** I can organize content with hierarchical taxonomy (e.g., Culture > Music, Culture > Film).

### Acceptance Criteria

1. Category form includes "Parent Category" dropdown (optional)
2. Dropdown lists all categories except current category (prevents circular references)
3. Database parentId field stores parent category reference
4. API endpoint supports filtering categories by parent: `GET /api/categories?parent=[id]`
5. Category list shows hierarchy: Indented subcategories under parents
6. Breadcrumb navigation on public category pages: Home > Culture > Music
7. Deleting parent category requires reassigning or deleting children (confirmation dialog)
8. Maximum hierarchy depth: 2 levels (Category > Subcategory)
9. Navigation dropdown shows hierarchical category structure
10. Subcategories inherit parent's visibility settings (if applicable)

---

## Story 8.4: Implement Category Deletion with Safeguards

**As an** admin,
**I want** to delete unused categories safely,
**so that** I can clean up taxonomy without breaking article associations.

### Acceptance Criteria

1. Delete button in category list and edit form
2. Delete blocked if category has articles (error message: "Cannot delete category with articles. Reassign articles first.")
3. "Force delete" option for admins: Reassigns articles to "Uncategorized" default category
4. Confirmation dialog shows category name and article count
5. Soft delete: Sets deletedAt timestamp (category hidden but recoverable)
6. API endpoint: `DELETE /api/categories/[id]`
7. Delete removes category from navigation
8. Redirect to category list after successful deletion
9. Toast notification: "Category deleted successfully"
10. Audit log entry created (for future admin activity tracking)

---

## Story 8.5: Build Tag Management List Page

**As an** admin or editor,
**I want** a list view of all tags with usage statistics,
**so that** I can manage tags and identify duplicate or underused tags.

### Acceptance Criteria

1. Tag management page created at `app/(admin)/tags/page.tsx`
2. Table displays: Tag name, slug, article count (usage), created date, actions
3. "Add Tag" button at top
4. Actions per row: Edit, Merge (combine with another tag), Delete (if unused)
5. Article count shows number of articles using tag
6. Delete button disabled if tag has articles
7. Table sortable by: Name (A-Z), Usage count, Created date
8. Search input filters tags by name
9. Bulk selection for bulk tag operations (merge, delete)
10. Only admins and editors can access

---

## Story 8.6: Build Create/Edit Tag Form

**As an** admin or editor,
**I want** a simple form to create or edit tags,
**so that** I can maintain consistent tagging vocabulary.

### Acceptance Criteria

1. Tag form modal: "Add Tag" or "Edit Tag"
2. Form fields: Name (required), slug (auto-generated, editable)
3. Slug auto-generated from name, validated for uniqueness
4. Form uses React Hook Form with Zod validation
5. Save button creates/updates tag via API
6. Success toast notification on save
7. Cancel button closes modal
8. Duplicate tag name prevented with error message
9. Form accessible and responsive
10. Tag immediately available for article tagging after creation

---

## Story 8.7: Implement Tag Merging Functionality

**As an** admin or editor,
**I want** to merge duplicate or similar tags,
**so that** I can consolidate fragmented tagging and improve content discovery.

### Acceptance Criteria

1. "Merge" action in tag list opens merge modal
2. Modal shows source tag and "Merge into" dropdown (select target tag)
3. Merge preview: "X articles will be retagged from [source] to [target]"
4. Confirm button executes merge: All article-tag associations updated to target tag, source tag deleted
5. API endpoint: `POST /api/tags/merge` with sourceId, targetId
6. Merge operation atomic (transaction)
7. Success toast: "Tags merged successfully. X articles updated."
8. Merged tag disappears from tag list
9. Undo not supported (emphasize in confirmation dialog)
10. Merge operation logged for audit trail

---

## Story 8.8: Implement Tag Auto-Suggest in Article Editor

**As a** content creator,
**I want** tag autocomplete suggestions as I type,
**so that** I can quickly find and select existing tags without creating duplicates.

### Acceptance Criteria

1. Tag input field in article settings form uses Combobox component (shadcn/ui)
2. Typing triggers API call: `GET /api/tags?search=[query]`
3. Dropdown shows matching tags (fuzzy search)
4. Click tag to add to article
5. "Create new tag" option if no exact match (e.g., "+Create: [query]")
6. Multiple tags displayed as removable badges
7. Debounced search (300ms delay)
8. Keyboard navigation: Arrow keys to select, Enter to add, Backspace to remove
9. Max 10 tags per article (enforced in validation)
10. Tags saved with article on save/auto-save

---

## Story 8.9: Implement Tag Cloud or Popular Tags Widget

**As an** admin,
**I want** a visual representation of popular tags,
**so that** I can understand content themes and identify trending topics.

### Acceptance Criteria

1. Tag cloud widget in admin dashboard
2. Shows top 20 tags by usage count
3. Tag size proportional to usage (CSS font-size scaling)
4. Click tag navigates to article list filtered by that tag
5. Widget updates dynamically as articles tagged
6. API endpoint: `GET /api/tags/popular?limit=20`
7. Responsive layout (tag cloud wraps on smaller screens)
8. Accessible (tags are clickable links with ARIA labels)
9. Optional: Color-coded by category (if tags associated with categories)

---

## Story 8.10: Implement Category and Tag SEO Optimization

**As a** marketer,
**I want** category and tag pages optimized for SEO,
**so that** taxonomy pages rank in search engines and drive organic traffic.

### Acceptance Criteria

1. Category pages have unique meta titles: "[Category Name] Articles | [Site Name]"
2. Category pages have meta descriptions from category.description field
3. Tag pages have meta titles: "Articles tagged: [Tag Name] | [Site Name]"
4. Tag pages have meta descriptions: "Browse all articles tagged with [Tag Name]"
5. Open Graph tags for category/tag pages include category image (if set)
6. Canonical URLs set on all category/tag pages
7. Structured data (CollectionPage schema) on category/tag pages
8. Category/tag pages included in sitemap.xml
9. Category/tag slugs follow SEO best practices (lowercase, hyphens, no special chars)
10. H1 tags properly set (category/tag name)
11. Breadcrumb structured data on category/tag pages

---

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Reader Experience - Public Site ←](epic-07-reader-experience.md) | [Next Epic: Production Readiness & Polish →](epic-09-production-polish.md)
