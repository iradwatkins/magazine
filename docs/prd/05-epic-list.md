# 5. Epic List

[← Back to Index](index.md) | [Previous: Technical Assumptions](04-technical-assumptions.md) | [Next: Epic Details →](epics/epic-01-foundation.md)

---

This section provides a high-level overview of all 9 epics in the magazine platform MVP. Each epic represents a major feature area with multiple user stories. For detailed story breakdowns, see the individual epic files in the [epics/](epics/) directory.

## Epic Overview

### Epic 1: Foundation & Core Infrastructure

**Goal:** Establish project foundation with Next.js on VPS, authentication, database schema, and basic deployment pipeline. Deliver a "health check" landing page to validate the full stack is operational and deployable.

**Stories:** 10 | **File:** [epic-01-foundation.md](epics/epic-01-foundation.md)

---

### Epic 2: User Management & Authentication

**Goal:** Implement complete user authentication system with role-based access control (Admin, Editor, Author), user profiles, and secure session management. Enable team members to create accounts and access the admin dashboard.

**Stories:** 11 | **File:** [epic-02-authentication.md](epics/epic-02-authentication.md)

---

### Epic 3: Content Model & Database Layer

**Goal:** Create the core data models (Articles, Categories, Tags, Blocks) with full CRUD operations and database migrations. Establish the foundational content architecture that all subsequent features will build upon.

**Stories:** 11 | **File:** [epic-03-content-model.md](epics/epic-03-content-model.md)

---

### Epic 4: Media Management & MinIO Integration

**Goal:** Build complete media library system with upload to MinIO, image optimization, browsing interface, and search/filter capabilities. Enable creators to manage all media assets in one place.

**Stories:** 11 | **File:** [epic-04-media-management.md](epics/epic-04-media-management.md)

---

### Epic 5: Drag-and-Drop Article Editor

**Goal:** Implement the core drag-and-drop editor with essential content blocks (Heading, Paragraph, Image, Quote, List, Divider), block palette, drag-to-reorder, inline editing, and auto-save functionality. Deliver the primary content creation experience.

**Stories:** 14 | **File:** [epic-05-article-editor.md](epics/epic-05-article-editor.md)

---

### Epic 6: Article Management Dashboard

**Goal:** Build the admin dashboard for managing articles with list view, filtering, search, inline actions, and article settings (featured image, category, tags, status, SEO). Enable efficient content management workflows.

**Stories:** 12 | **File:** [epic-06-article-dashboard.md](epics/epic-06-article-dashboard.md)

---

### Epic 7: Reader Experience - Public Site

**Goal:** Implement the public-facing reader experience with homepage (hero + article grid), article detail pages, category pages, author pages, and responsive navigation. Deliver the complete end-user reading experience with optimized performance and SEO.

**Stories:** 12 | **File:** [epic-07-reader-experience.md](epics/epic-07-reader-experience.md)

---

### Epic 8: Category & Tag Management

**Goal:** Build administrative interfaces for creating, editing, and organizing categories and tags. Enable content taxonomy management to support content organization and discovery.

**Stories:** 13 | **File:** [epic-08-category-tags.md](epics/epic-08-category-tags.md)

---

### Epic 9: Production Readiness & Polish

**Goal:** Implement final production requirements including comprehensive error handling, loading states, accessibility improvements, SEO enhancements, performance optimization, and deployment to production with monitoring. Prepare the platform for public launch.

**Stories:** 8 | **File:** [epic-09-production-polish.md](epics/epic-09-production-polish.md)

---

## Epic Sequencing

The epics are designed to be executed in order, with each epic building upon the foundation established by previous epics:

1. **Foundation (Epic 1)** → Infrastructure ready
2. **Authentication (Epic 2)** → Users can log in
3. **Content Model (Epic 3)** → Database structure in place
4. **Media Management (Epic 4)** → Images can be uploaded
5. **Article Editor (Epic 5)** → Content can be created
6. **Article Dashboard (Epic 6)** → Content can be managed
7. **Reader Experience (Epic 7)** → Content can be viewed
8. **Category/Tag Management (Epic 8)** → Content can be organized
9. **Production Polish (Epic 9)** → Platform is production-ready

## Total Story Count

**92 user stories** across 9 epics, providing complete MVP functionality for the online magazine platform.

---

[← Back to Index](index.md) | [Previous: Technical Assumptions](04-technical-assumptions.md) | [Next: Epic Details →](epics/epic-01-foundation.md)
