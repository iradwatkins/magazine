# Product Requirements Document (PRD)

## Online Magazine Platform - Comprehensive MVP

**Version:** 1.1
**Date:** October 9, 2025
**Product Manager:** John (PM Agent)
**Product Owner:** Sarah (PO Agent)
**Status:** Architecture Aligned - Ready for Development

---

## Table of Contents

1. [Goals and Background Context](#1-goals-and-background-context)
2. [Requirements](#2-requirements)
3. [User Interface Design Goals](#3-user-interface-design-goals)
4. [Technical Assumptions](#4-technical-assumptions)
5. [Epic List](#5-epic-list)
6. [Epic Details](#6-epic-details)
7. [Checklist Results Report](#7-checklist-results-report)
8. [Next Steps](#8-next-steps)

---

## 1. Goals and Background Context

### 1.1 Goals

- Enable non-technical content creators to design and publish editorial-quality articles using an intuitive drag-and-drop editor with essential content blocks
- Build complete article management system with user roles, categories, tags, and publish/draft workflow
- Deliver a premium, fast-loading reading experience across all devices with homepage, article pages, and category browsing
- Implement full media management with MinIO integration for image uploads and optimization
- Establish scalable foundation on self-hosted infrastructure for future feature expansion
- Celebrate Black culture, excellence, and storytelling through a sophisticated digital magazine platform

### 1.2 Background Context

The digital publishing landscape has evolved significantly, yet many content management systems remain complex and require technical expertise. Content creators—especially those transitioning from print media—struggle with platforms that offer limited design flexibility and cumbersome multimedia formatting.

This project addresses the need for a **modern, sophisticated online magazine platform** that empowers editors and writers to create visually stunning, editorial-quality content without technical barriers. The platform will specifically celebrate Black culture and storytelling, filling a gap in the market for premium digital magazines that combine ease of use with professional-grade publishing tools. By leveraging modern self-hosted infrastructure and a drag-and-drop editor, the platform will enable rapid content creation while maintaining editorial quality and performance. The MVP delivers a complete, production-ready publishing platform with all core functionality needed to launch and operate a professional online magazine.

### 1.3 Change Log

| Date       | Version | Description                                                                                   | Author           |
| ---------- | ------- | --------------------------------------------------------------------------------------------- | ---------------- |
| 2025-10-09 | 1.0     | Initial comprehensive MVP PRD created using BMAD methodology                                  | John (PM Agent)  |
| 2025-10-09 | 1.1     | Updated technical stack from Cloudflare to self-hosted (PostgreSQL, MinIO, Redis, Docker/VPS) | Sarah (PO Agent) |

---

## 2. Requirements

### 2.1 Functional Requirements

**Editor & Content Creation:**

- **FR1:** The system shall provide a drag-and-drop editor canvas where users can add, reorder, and remove content blocks
- **FR2:** The editor shall support essential content block types: Heading (H1-H6), Paragraph, Image, Quote, List (bullet/numbered), and Divider
- **FR3:** Users shall be able to drag blocks from a palette into the editor canvas at any position
- **FR4:** Users shall be able to reorder blocks by dragging them to new positions within the canvas
- **FR5:** Each block shall have inline editing capabilities (click to edit text, change heading levels, format lists)
- **FR6:** The editor shall auto-save draft content every 30 seconds without user interaction
- **FR7:** Users shall be able to manually save drafts at any time via a "Save Draft" button
- **FR8:** Image blocks shall support drag-and-drop file upload directly to MinIO storage
- **FR9:** Image blocks shall include fields for caption, alt text, and credit/attribution
- **FR10:** The editor shall provide undo/redo functionality for block operations

**Article Management:**

- **FR11:** Users shall be able to create new articles with title, subtitle, and content blocks
- **FR12:** Users shall be able to edit existing articles they have permission to modify
- **FR13:** Users shall be able to delete articles (soft delete to trash)
- **FR14:** Each article shall have a featured image that can be uploaded and displayed on listing pages
- **FR15:** Articles shall be assigned to exactly one category from a predefined list
- **FR16:** Articles shall support multiple tags that can be created on-the-fly or selected from existing tags
- **FR17:** Articles shall have two statuses: Draft (unpublished) and Published (visible to readers)
- **FR18:** The system shall automatically generate URL-friendly slugs from article titles
- **FR19:** Users shall be able to set SEO metadata (meta title, meta description) for each article
- **FR20:** The system shall track article view counts for analytics

**User Management & Roles:**

- **FR21:** The system shall support user authentication via email/password or OAuth providers
- **FR22:** The system shall implement three user roles: Admin, Editor, and Author
- **FR23:** Admins shall have full access to all articles, users, categories, and system settings
- **FR24:** Editors shall be able to create, edit, publish, and delete any article
- **FR25:** Authors shall be able to create and edit only their own articles
- **FR26:** All users shall have a profile with name, bio, profile photo, and social media links

**Category & Tag Management:**

- **FR27:** Admins and Editors shall be able to create, edit, and delete categories
- **FR28:** Each category shall have a name, URL slug, description, and optional featured image
- **FR29:** The system shall support auto-suggest for existing tags when creating/editing articles
- **FR30:** Admins shall be able to merge duplicate tags

**Media Library:**

- **FR31:** Users shall be able to upload images (JPEG, PNG, GIF, WebP) to the media library
- **FR32:** The system shall automatically optimize uploaded images for web delivery via Sharp
- **FR33:** Users shall be able to browse uploaded media in a grid view with search and filter capabilities
- **FR34:** Users shall be able to select images from the media library when adding image blocks

**Reader Experience - Homepage:**

- **FR35:** The homepage shall display a featured article at the top with large hero image
- **FR36:** The homepage shall display a grid of latest published articles (6-12 per page)
- **FR37:** The homepage shall support pagination or infinite scroll for browsing more articles
- **FR38:** Each article card shall display featured image, title, excerpt, author, category, and publication date

**Reader Experience - Article Pages:**

- **FR39:** Article pages shall display the full article content with all content blocks rendered correctly
- **FR40:** Article pages shall display article title, subtitle, author byline with photo, category, and publication date
- **FR41:** Article pages shall render content blocks responsively across mobile, tablet, and desktop devices
- **FR42:** Images in articles shall implement lazy loading for performance optimization

**Reader Experience - Category Pages:**

- **FR43:** Each category shall have a dedicated landing page displaying all articles in that category
- **FR44:** Category pages shall display category name, description, and featured image (if set)
- **FR45:** Category pages shall show articles in a grid layout with pagination

**Navigation:**

- **FR46:** The site shall have a sticky header with logo, navigation menu, and category links
- **FR47:** The site shall implement a mobile-responsive hamburger menu for small screens

### 2.2 Non-Functional Requirements

**Performance:**

- **NFR1:** Article pages shall achieve First Contentful Paint (FCP) < 1.5 seconds
- **NFR2:** Article pages shall achieve Time to Interactive (TTI) < 3 seconds
- **NFR3:** The homepage shall load and be interactive in < 2 seconds on 4G connections
- **NFR4:** Images shall be served via Nginx reverse proxy with automatic format optimization (WebP/AVIF)
- **NFR5:** The editor shall remain responsive during drag operations with no perceptible lag (<100ms)

**Scalability:**

- **NFR6:** The system shall support at least 100,000 monthly active readers without performance degradation
- **NFR7:** The database shall efficiently handle 10,000+ articles with optimized queries and indexes
- **NFR8:** MinIO storage shall accommodate at least 50GB of media assets

**Security:**

- **NFR9:** All connections shall use HTTPS with automatic SSL/TLS certificates
- **NFR10:** User passwords shall be hashed using bcrypt or Argon2 with appropriate cost factors
- **NFR11:** The system shall implement CSRF protection for all state-changing operations
- **NFR12:** File uploads shall be validated for type, size, and malicious content
- **NFR13:** The system shall implement rate limiting on authentication endpoints to prevent brute force attacks

**Accessibility:**

- **NFR14:** The reader experience shall conform to WCAG 2.1 AA standards
- **NFR15:** All images shall require alt text for screen reader compatibility
- **NFR16:** The site shall support keyboard navigation for all interactive elements
- **NFR17:** Color contrast ratios shall meet or exceed 4.5:1 for normal text

**Reliability:**

- **NFR18:** The system shall target 99.9% uptime SLA with proper infrastructure monitoring
- **NFR19:** Auto-save functionality shall prevent data loss in the event of browser crashes or network interruptions
- **NFR20:** The system shall implement graceful error handling with user-friendly error messages

**SEO:**

- **NFR21:** All article pages shall include proper meta tags (title, description, Open Graph)
- **NFR22:** The system shall generate valid Schema.org structured data for articles, authors, and organizations
- **NFR23:** The system shall automatically generate and maintain an XML sitemap
- **NFR24:** Article URLs shall be clean, semantic, and include article slug (e.g., /articles/article-title)

**Usability:**

- **NFR25:** Content creators shall be able to publish their first article within 30 minutes of onboarding
- **NFR26:** The editor interface shall provide contextual help and tooltips for all block types
- **NFR27:** The admin dashboard shall be intuitive and require minimal training

---

## 3. User Interface Design Goals

### 3.1 Overall UX Vision

The platform delivers a **premium, editorial-quality experience** that rivals traditional print magazines while embracing modern digital capabilities. The design aesthetic draws inspiration from iconic Black magazines like _Ebony_ and _Jet_, featuring sophisticated typography, generous whitespace, and gold accent touches that evoke luxury and cultural celebration. The interface prioritizes **clarity over clutter**, allowing content to shine while providing powerful tools that stay out of the creator's way until needed.

For content creators, the editor experience feels **intuitive and liberating**—like working with physical magazine layouts but with digital superpowers. For readers, articles feel **immersive and intentional**, with every typographic choice and layout decision serving the story.

### 3.2 Key Interaction Paradigms

**Editor Experience:**

- **Direct Manipulation:** Drag-and-drop as primary interaction—blocks are physical objects users can grab, move, and arrange
- **Contextual Tools:** Formatting options appear only when needed (hover states, selection toolbars)
- **Progressive Disclosure:** Basic block settings visible by default; advanced options revealed in inspector panel
- **Immediate Feedback:** Changes reflect instantly; auto-save indicator provides confidence

**Reader Experience:**

- **Distraction-Free Reading:** Clean article pages with typography optimized for long-form reading
- **Effortless Navigation:** Sticky header, smooth scrolling, intuitive category browsing
- **Progressive Enhancement:** Core content accessible without JavaScript; enhancements layer on top
- **Touch-First Mobile:** Large tap targets, swipe gestures, thumb-zone optimization

**Admin Dashboard:**

- **Information Density:** Table/list views for efficient content management
- **Batch Operations:** Multi-select for bulk actions when managing many articles
- **Quick Actions:** Inline editing and status changes without page navigation

### 3.3 Core Screens and Views

**Content Creation (Editor):**

1. **Article Editor Canvas** - Full-screen drag-and-drop workspace with block palette sidebar
2. **Article Settings Panel** - Featured image, category, tags, SEO, publish status
3. **Media Library Modal** - Grid view of uploaded images with search/filter
4. **Block Inspector Panel** - Context-specific settings for selected block

**Content Management (Admin Dashboard):** 5. **Dashboard Overview** - Recent articles, quick stats, recent activity feed 6. **Article List View** - Searchable/filterable table of all articles with inline actions 7. **Category Management** - CRUD interface for categories with drag-to-reorder 8. **User Management** - List of users with roles, permissions, and profile editing

**Reader Experience (Public Site):** 9. **Homepage** - Hero featured article + grid of latest articles 10. **Article Detail Page** - Full article with optimized reading experience 11. **Category Landing Page** - Category description + filtered article grid 12. **Author Profile Page** - Author bio + all articles by that author

### 3.4 Accessibility: WCAG 2.1 AA

The platform shall conform to **WCAG 2.1 Level AA** standards, ensuring:

- Semantic HTML structure throughout
- ARIA labels for interactive components
- Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Screen reader compatibility tested with NVDA/JAWS
- Color contrast ratios ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- Focus indicators visible and distinct
- Alt text required for all images (enforced in editor)
- Form labels properly associated with inputs

### 3.5 Branding

**Design System Foundation:**

- **Color Palette:** Professional blues (#1e9df1 primary) with sophisticated gold accents (#d4af37) inspired by classic Black magazines like _Ebony_ and _Jet_
- **Typography:**
  - **Serif (Georgia)** for article headlines and body text—editorial, timeless feel
  - **Sans-serif (Open Sans)** for UI, navigation, metadata—modern, readable
  - **Monospace (Menlo)** for code blocks if needed
- **Spacing & Layout:** Generous whitespace, max article width 720px for optimal reading, 1.3rem border radius for modern softness
- **Theme Support:** Light theme by default (white background, dark text); dark mode deferred to post-MVP
- **Visual Identity:** Clean, sophisticated, culturally resonant—celebrating Black excellence without stereotypes

**Brand Personality:**

- Premium yet accessible
- Modern yet timeless
- Bold yet refined
- Celebratory yet substantive

### 3.6 Target Device and Platforms: Web Responsive (Mobile-First)

**Primary Targets:**

- **Mobile (< 768px):** iPhone/Android smartphones—optimized for reading on commute, casual browsing
- **Tablet (768-1024px):** iPad/Android tablets—comfortable reading + light editing
- **Desktop (> 1024px):** Laptop/desktop browsers—primary editor experience, full dashboard capabilities

**Technical Approach:**

- **Mobile-first CSS:** Base styles for mobile, progressively enhanced for larger screens
- **Responsive breakpoints:**
  - Small: 0-767px (single column, hamburger menu, touch-optimized)
  - Medium: 768-1023px (two columns where appropriate, expanded navigation)
  - Large: 1024px+ (full layout, sidebar panels, multi-column grids)
- **Touch-friendly:** 44x44px minimum tap targets, touch-optimized drag-and-drop
- **Progressive Web App (PWA) ready:** Deferred to post-MVP but architecture supports it

**Browser Support:**

- **Modern browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **No IE11 support**—focus on modern standards

---

## 4. Technical Assumptions

### 4.1 Repository Structure: Monorepo

**Decision:** Single monorepo containing frontend, backend, and shared code.

**Rationale:**

- Simplified dependency management and versioning
- Easier code sharing between frontend/backend (types, validators, utilities)
- Single deployment pipeline and CI/CD configuration
- Next.js naturally fits monorepo structure (frontend + API routes)
- Small team benefit: Less repository overhead, unified tooling

**Structure:**

```
/magazine-stepperslife
  /app          # Next.js App Router (frontend + API routes)
  /components   # React components
  /lib          # Shared utilities, hooks, API clients
  /db           # Database schema, migrations
  /workers      # Next.js API routes (if separate from Next.js API)
  /types        # TypeScript type definitions
  /config       # Configuration files
  /public       # Static assets
  /tests        # All test suites
```

### 4.2 Service Architecture

**Decision:** **Self-hosted Monolith on VPS** (Next.js on VPS Docker deployment + Workers for API)

**Architecture Pattern:**

- **Frontend:** Next.js 14+ (App Router) deployed to VPS Docker deployment with SSR/SSG
- **Backend:** Next.js API Routes as Next.js API routes OR separate Hono-based Next.js API routes
- **Database:** PostgreSQL (SQLite-compatible, replicated)
- **Storage:** MinIO (S3-compatible object storage)
- **Cache:** Redis (key-value store for sessions, cache)
- **CDN:** Nginx reverse proxy (automatic, global distribution)

**Rationale:**

- **Edge-first performance:** Code runs close to users globally (200+ locations)
- **Cost efficiency:** Self-hosted VPS with no egress fees on MinIO
- **Simplified architecture:** No separate backend servers, database hosting, or CDN configuration
- **Scalability:** Next.js API routes scale automatically without cold starts (V8 isolates)
- **Developer experience:** Next.js provides full-stack framework in one codebase
- **Future-proof:** Can evolve to microservices if needed, but monolith sufficient for MVP

**Technology Stack:**

**Frontend:**

- Next.js 14+ (App Router) with React Server Components
- TypeScript 5+
- Tailwind CSS 3+ (utility-first styling)
- Radix UI + shadcn/ui (accessible component primitives)
- @dnd-kit/core (drag-and-drop)
- TipTap (rich text editor based on ProseMirror)
- Zustand (lightweight state management)
- React Hook Form + Zod (forms + validation)
- SWR or TanStack Query (data fetching)

**Backend:**

- Next.js API routes (V8 runtime)
- Hono (fast, lightweight web framework for Workers) OR Next.js API Routes
- Prisma ORM (TypeScript-first ORM for D1/SQLite)
- Zod (schema validation)
- NextAuth.js OR Clerk (authentication)
- Resend OR SendGrid (transactional email, post-MVP)

**Database & Storage:**

- PostgreSQL (primary database, SQLite-compatible)
- Redis (caching, sessions)
- MinIO (media storage)

**Infrastructure & DevOps:**

- VPS Docker deployment (hosting + deployment)
- GitHub Actions (CI/CD)
- Docker Compose (containerization)
- Vitest (unit testing)
- Playwright (E2E testing)

### 4.3 Testing Requirements

**Decision:** **Unit + Integration Testing** (Full testing pyramid for MVP)

**Testing Strategy:**

**Unit Tests (Required):**

- All utility functions, hooks, validators
- Critical business logic (slug generation, block operations, user permissions)
- Target: 70%+ code coverage
- Tool: Vitest (fast, Vite-native)

**Integration Tests (Required):**

- API endpoint testing (article CRUD, auth, media upload)
- Database operations (Prisma ORM queries)
- Full user flows (create article → add blocks → publish)
- Tool: Vitest + Next.js API routes testing utilities

**Component Tests (Required):**

- Editor components (block rendering, drag-and-drop)
- Form components (validation, submission)
- Tool: Vitest + React Testing Library

**E2E Tests (Selective):**

- Critical user journeys only (e.g., "Creator publishes first article")
- Run in CI before deployment
- Tool: Playwright

**Manual Testing:**

- Visual QA for responsive design across devices
- Accessibility testing with screen readers
- Performance testing with Lighthouse

**Rationale:**

- Full testing pyramid ensures quality without excessive maintenance burden
- Vitest provides fast unit/integration tests
- Playwright E2E tests catch critical regressions before production
- Manual testing supplements automated coverage for UX/accessibility

### 4.4 Additional Technical Assumptions and Requests

**Performance:**

- All images served via Nginx reverse proxy with automatic format optimization (WebP/AVIF)
- Implement image lazy loading for article pages (Intersection Observer API)
- Code splitting for editor routes (reduce bundle size for readers)
- Target Lighthouse scores: Performance >90, Accessibility >90, Best Practices >90, SEO >90

**Security:**

- HTTPS only (via Let's Encrypt)
- CSRF protection on all mutations
- Rate limiting on auth endpoints (prevent brute force)
- Content Security Policy (CSP) headers
- File upload validation (MIME type, size limits, malware scanning if feasible)

**SEO:**

- Server-side rendering (SSR) for all public pages (homepage, articles, categories)
- Automatic sitemap generation (update on publish)
- Schema.org structured data (Article, Person, Organization)
- Meta tags (title, description, Open Graph, Twitter Cards)
- Canonical URLs for all articles

**Developer Experience:**

- TypeScript strict mode enabled project-wide
- ESLint + Prettier for code consistency
- Husky for pre-commit hooks (lint, format, type-check)
- Conventional Commits for structured commit messages
- Hot reload in development (Next.js Fast Refresh)

**Authentication:**

- NextAuth.js OR Clerk for authentication provider
- Support email/password + OAuth (Google, GitHub)
- JWT-based sessions stored in Redis
- Role-based access control (RBAC) with middleware

**Deployment:**

- GitHub main branch → auto-deploy to production (VPS Docker deployment)
- Preview deployments for all PRs
- Environment variables managed via VPS management
- Database migrations run automatically on deploy

**Observability (Post-MVP):**

- Error tracking: Sentry or Next.js API routes Analytics
- Performance monitoring: self-hosted analytics (privacy-friendly)
- Logging: Console logs captured in Next.js API routes logs

---

## 5. Epic List

### Epic 1: Foundation & Core Infrastructure

**Goal:** Establish project foundation with Next.js on VPS, authentication, database schema, and basic deployment pipeline. Deliver a "health check" landing page to validate the full stack is operational and deployable.

### Epic 2: User Management & Authentication

**Goal:** Implement complete user authentication system with role-based access control (Admin, Editor, Author), user profiles, and secure session management. Enable team members to create accounts and access the admin dashboard.

### Epic 3: Content Model & Database Layer

**Goal:** Create the core data models (Articles, Categories, Tags, Blocks) with full CRUD operations and database migrations. Establish the foundational content architecture that all subsequent features will build upon.

### Epic 4: Media Management & MinIO Integration

**Goal:** Build complete media library system with upload to MinIO, image optimization, browsing interface, and search/filter capabilities. Enable creators to manage all media assets in one place.

### Epic 5: Drag-and-Drop Article Editor

**Goal:** Implement the core drag-and-drop editor with essential content blocks (Heading, Paragraph, Image, Quote, List, Divider), block palette, drag-to-reorder, inline editing, and auto-save functionality. Deliver the primary content creation experience.

### Epic 6: Article Management Dashboard

**Goal:** Build the admin dashboard for managing articles with list view, filtering, search, inline actions, and article settings (featured image, category, tags, status, SEO). Enable efficient content management workflows.

### Epic 7: Reader Experience - Public Site

**Goal:** Implement the public-facing reader experience with homepage (hero + article grid), article detail pages, category pages, author pages, and responsive navigation. Deliver the complete end-user reading experience with optimized performance and SEO.

### Epic 8: Category & Tag Management

**Goal:** Build administrative interfaces for creating, editing, and organizing categories and tags. Enable content taxonomy management to support content organization and discovery.

### Epic 9: Production Readiness & Polish

**Goal:** Implement final production requirements including comprehensive error handling, loading states, accessibility improvements, SEO enhancements, performance optimization, and deployment to production with monitoring. Prepare the platform for public launch.

---

## 6. Epic Details

### Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the complete project foundation including Next.js application setup on VPS Docker deployment, database schema with Prisma ORM, authentication scaffolding, CI/CD pipeline with GitHub Actions, and deployment to production. Deliver a deployable "health check" landing page that validates the full stack is operational from day one, ensuring all subsequent epics build on a solid, production-ready foundation.

#### Story 1.1: Initialize Next.js Project with TypeScript and Docker Configuration

As a **developer**,
I want **to initialize a Next.js 14+ project with TypeScript, Tailwind CSS, and VPS Docker deployment configuration**,
so that **we have a modern, type-safe frontend framework ready for development and deployment to VPS's edge network**.

**Acceptance Criteria:**

1. Next.js 14+ project initialized with App Router enabled
2. TypeScript configured with strict mode enabled (`tsconfig.json`)
3. Tailwind CSS 3+ installed and configured with base styles
4. Project structure follows monorepo layout (`/app`, `/components`, `/lib`, `/types`, `/config`, `/public`)
5. `package.json` includes all core dependencies (React, Next.js, TypeScript, Tailwind)
6. `.gitignore` configured to exclude `node_modules`, `.next`, build artifacts
7. Development server runs successfully (`npm run dev`)
8. Basic homepage renders at `http://localhost:3000`

#### Story 1.2: Configure VPS Docker deployment and Docker Compose

As a **developer**,
I want **to configure VPS Docker deployment deployment and Docker Compose tooling**,
so that **the application can be deployed to self-hosted VPS infrastructure with automated builds**.

**Acceptance Criteria:**

1. Docker Compose installed globally or as dev dependency
2. `docker-compose.yml` configured with project name, compatibility dates, and bindings
3. VPS Docker deployment project created in VPS management
4. Build command configured for Next.js (`next build`)
5. Output directory set to `.next` or appropriate Next.js build output
6. Local development can use Docker services via `wrangler pages dev`
7. Manual deployment to VPS Docker deployment succeeds (`wrangler pages deploy`)
8. Deployed site accessible via VPS Docker deployment URL

#### Story 1.3: Set Up PostgreSQL Database with Prisma ORM

As a **developer**,
I want **to configure PostgreSQL database and Prisma ORM with migrations**,
so that **we have a scalable, replicated database ready for content storage**.

**Acceptance Criteria:**

1. PostgreSQL database created via Docker Compose
2. Prisma ORM installed with D1 adapter (`drizzle-orm`, `drizzle-kit`)
3. Database schema defined in `/db/schema.ts` (initial tables: users, articles, blocks, categories, tags, media)
4. Prisma Kit configured for migrations (`drizzle.config.ts`)
5. Initial migration generated and applied successfully
6. Database connection helper created in `/lib/cloudflare/d1-client.ts`
7. D1 binding configured in `docker-compose.yml`
8. Test query executes successfully in local development

#### Story 1.4: Configure MinIO Object Storage

As a **developer**,
I want **to set up MinIO bucket for media storage**,
so that **uploaded images and media files can be stored with zero egress fees**.

**Acceptance Criteria:**

1. MinIO bucket created via VPS management or Docker
2. R2 binding configured in `docker-compose.yml`
3. R2 client helper created in `/lib/cloudflare/r2-client.ts`
4. Public access configured for uploaded media (or signed URLs if private)
5. Custom domain configured for MinIO bucket (e.g., `media.magazinename.com`)
6. Test file upload succeeds in local development
7. Uploaded file accessible via public URL
8. File deletion function implemented and tested

#### Story 1.5: Configure Redis for Caching and Sessions

As a **developer**,
I want **to set up Redis namespace for caching and session storage**,
so that **we can store ephemeral data on the server with low latency**.

**Acceptance Criteria:**

1. Redis namespace created (e.g., `magazine_cache`)
2. Redis connection configured in `docker-compose.yml`
3. Redis client helper created in `/lib/cloudflare/kv-client.ts`
4. Basic cache utility functions implemented (get, set, delete, with TTL)
5. Test key-value pair stored and retrieved successfully
6. Session storage pattern documented for future auth implementation
7. Redis database accessible in local development via Docker

#### Story 1.6: Set Up GitHub Repository with CI/CD Pipeline

As a **developer**,
I want **to configure GitHub repository with automated CI/CD pipeline**,
so that **code changes trigger automated testing, linting, and deployment to VPS Docker deployment**.

**Acceptance Criteria:**

1. GitHub repository initialized with remote origin configured
2. GitHub Actions workflow created (`.github/workflows/ci-cd.yml`)
3. CI pipeline runs on pull requests: lint (ESLint), type-check (TypeScript), test (Vitest)
4. CD pipeline deploys to VPS Docker deployment on merge to `main` branch
5. deployment credentials configured as GitHub secret
6. Preview deployments created for all pull requests
7. Build status badge added to `README.md`
8. Successful deployment triggers Slack/Discord notification (optional)

#### Story 1.7: Implement ESLint, Prettier, and Pre-commit Hooks

As a **developer**,
I want **to enforce code quality with ESLint, Prettier, and Husky pre-commit hooks**,
so that **code consistency is maintained and common errors are caught before commit**.

**Acceptance Criteria:**

1. ESLint configured with Next.js and TypeScript rules (`.eslintrc.json`)
2. Prettier configured with project style preferences (`.prettierrc`)
3. Husky installed and initialized for Git hooks
4. Pre-commit hook runs: lint-staged, ESLint, Prettier, TypeScript check
5. VSCode settings included (`.vscode/settings.json`) for auto-format on save
6. All existing code passes linting and formatting checks
7. Committing code with errors is blocked by pre-commit hook
8. `npm run lint` and `npm run format` scripts work correctly

#### Story 1.8: Create Design System Foundation with Tailwind and CSS Variables

As a **developer**,
I want **to implement the design system foundation with Tailwind configuration and CSS variables**,
so that **consistent styling is available throughout the application**.

**Acceptance Criteria:**

1. Tailwind config (`tailwind.config.ts`) extended with custom colors, fonts, spacing
2. CSS variables defined in `app/globals.css` for light theme (colors, radius, fonts)
3. Dark theme variables defined but not activated (post-MVP)
4. Typography scale configured (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
5. Custom font families configured: serif (Georgia), sans (Open Sans), mono (Menlo)
6. Border radius set to `1.3rem` as default
7. Gold accent color `#d4af37` configured and usable via Tailwind classes
8. Test page demonstrates all design tokens (colors, typography, spacing)

#### Story 1.9: Set Up shadcn/ui Component Library

As a **developer**,
I want **to initialize shadcn/ui and install essential base components**,
so that **accessible, customizable UI components are available for rapid development**.

**Acceptance Criteria:**

1. shadcn/ui CLI initialized (`npx shadcn-ui@latest init`)
2. Base components installed: Button, Input, Textarea, Select, Dialog, Card, Badge, Avatar
3. Components located in `/components/ui` with TypeScript types
4. Radix UI primitives installed as dependencies
5. `cn()` utility function configured for className merging
6. All components render correctly with design system tokens
7. Component variants (primary, secondary, destructive) work as expected
8. Accessibility features verified (keyboard nav, ARIA labels)

#### Story 1.10: Create Health Check Landing Page and API Endpoint

As a **developer** and **stakeholder**,
I want **a deployable health check landing page and `/api/health` endpoint**,
so that **we can verify the full stack (frontend, API, database, storage) is operational in production**.

**Acceptance Criteria:**

1. Homepage (`app/page.tsx`) displays "Magazine Platform - Coming Soon" with branding
2. Health check API endpoint created at `app/api/health/route.ts`
3. Health endpoint checks: database connection (D1), MinIO bucket access, Redis database access
4. Health endpoint returns JSON: `{ status: 'ok', services: { db: 'connected', r2: 'connected', kv: 'connected' }, timestamp: '...' }`
5. Homepage styled with Tailwind and design system tokens
6. Responsive layout works on mobile, tablet, desktop
7. Page successfully deploys to VPS Docker deployment production
8. Health endpoint accessible at `https://yoursite.com/api/health` and returns 200 status

---

### Epic 2: User Management & Authentication

**Epic Goal:** Implement a complete, secure authentication system with email/password and OAuth (Google, GitHub) support, role-based access control (Admin, Editor, Author), user profiles with bio and avatar, and protected admin dashboard routing. Enable team members to create accounts, log in securely, and access features based on their assigned roles, establishing the security foundation for all content management operations.

#### Story 2.1: Install and Configure NextAuth.js with Redis Adapter

As a **developer**,
I want **to install NextAuth.js and configure it to use Redis for session storage**,
so that **we have a flexible authentication framework compatible with Next.js API routes**.

**Acceptance Criteria:**

1. NextAuth.js installed with latest stable version
2. NextAuth.js API route created at `app/api/auth/[...nextauth]/route.ts`
3. Redis adapter configured for session storage
4. NextAuth configuration includes secret (environment variable `NEXTAUTH_SECRET`)
5. Session strategy set to JWT (compatible with edge runtime)
6. Auth configuration exported for reuse across app
7. Basic NextAuth pages accessible (sign-in, sign-out, error)
8. Test authentication flow completes without errors

#### Story 2.2: Implement Email/Password Authentication with Credentials Provider

As a **user**,
I want **to register and log in using my email address and password**,
so that **I can securely access the magazine platform**.

**Acceptance Criteria:**

1. Credentials provider configured in NextAuth
2. User registration endpoint created at `app/api/auth/register/route.ts`
3. Password hashing implemented using bcrypt or Argon2
4. User schema includes: id, email (unique), password (hashed), name, role, createdAt
5. Registration validates email format and password strength (min 8 chars, complexity)
6. Login validates credentials against database
7. Failed login attempts logged (for rate limiting in future)
8. Successful login creates session and redirects to dashboard

#### Story 2.3: Implement OAuth Authentication (Google and GitHub)

As a **user**,
I want **to sign in using my Google or GitHub account**,
so that **I can quickly access the platform without creating a new password**.

**Acceptance Criteria:**

1. Google OAuth provider configured with client ID and secret (environment variables)
2. GitHub OAuth provider configured with client ID and secret
3. OAuth callback URLs registered in Google and GitHub developer consoles
4. User profile created automatically on first OAuth login (email, name, image from provider)
5. OAuth users assigned default "Author" role
6. Existing users with same email can link OAuth accounts
7. OAuth login flow completes and redirects to dashboard
8. User profile image from OAuth provider displayed in UI

#### Story 2.4: Implement Role-Based Access Control (RBAC) Middleware

As a **developer**,
I want **to create middleware that enforces role-based access control**,
so that **users can only access features permitted by their role (Admin, Editor, Author)**.

**Acceptance Criteria:**

1. Middleware created at `middleware.ts` to protect routes
2. Protected routes: `/admin/*` require authentication
3. Role-based route protection: Admin can access all, Editor can manage content, Author can create own content
4. Unauthorized access redirects to sign-in page with return URL
5. Session validation checks user exists and role is valid
6. Helper functions created: `requireAuth()`, `requireRole(role)`, `isAuthorized(userId, resourceOwnerId)`
7. API routes protected with role checks (e.g., only Admin can delete users)
8. Unauthorized API requests return 403 Forbidden with error message

#### Story 2.5: Create User Profile Schema and Database Migration

As a **developer**,
I want **to extend the user schema with profile fields (bio, avatar, social links)**,
so that **authors can showcase their identity and build credibility with readers**.

**Acceptance Criteria:**

1. User schema extended with: bio (text), image (URL), socialLinks (JSON: twitter, instagram, linkedin)
2. Database migration created and applied successfully
3. User profile endpoints created: `GET /api/users/[id]`, `PUT /api/users/[id]`
4. Users can update their own profile (name, bio, image, social links)
5. Admins can update any user profile
6. Image URL validation ensures proper format
7. Social links validated for correct URL structure
8. Profile updates reflected immediately in UI

#### Story 2.6: Build User Registration and Login Pages

As a **user**,
I want **dedicated, accessible registration and login pages**,
so that **I can easily create an account or sign in to the platform**.

**Acceptance Criteria:**

1. Registration page created at `app/(auth)/register/page.tsx`
2. Login page created at `app/(auth)/login/page.tsx`
3. Both pages use shadcn/ui components (Input, Button, Card)
4. Registration form includes: email, password, confirm password, name
5. Login form includes: email, password, "Remember me" checkbox
6. OAuth buttons for Google and GitHub displayed prominently
7. Form validation with error messages (inline and toast notifications)
8. Successful registration/login redirects to `/admin/dashboard`
9. "Forgot password?" link present (functionality deferred to post-MVP)
10. Responsive design works on mobile and desktop
11. Accessibility: keyboard navigation, ARIA labels, screen reader support

#### Story 2.7: Build User Profile Settings Page

As a **user**,
I want **a profile settings page where I can update my information**,
so that **I can manage my account details, bio, and social links**.

**Acceptance Criteria:**

1. Profile settings page created at `app/(admin)/profile/page.tsx`
2. Form fields: name, email (read-only), bio (textarea), profile image URL, social links (Twitter, Instagram, LinkedIn)
3. Avatar preview displays current profile image
4. Form uses React Hook Form with Zod validation
5. Submit button saves changes via `PUT /api/users/[id]` endpoint
6. Success message displayed after save
7. Unsaved changes warning if user navigates away
8. Form is accessible and responsive
9. Only authenticated users can access this page

#### Story 2.8: Build Admin User Management Interface

As an **Admin**,
I want **an admin interface to view, create, edit, and delete users**,
so that **I can manage team members and assign appropriate roles**.

**Acceptance Criteria:**

1. User management page created at `app/(admin)/users/page.tsx`
2. Table displays all users: name, email, role, created date, actions
3. Table supports sorting by name, email, role, created date
4. Search functionality filters users by name or email
5. Role filter dropdown (All, Admin, Editor, Author)
6. "Add User" button opens modal to create new user (email, name, role, password)
7. Inline "Edit" action opens modal to update user role, name
8. Inline "Delete" action shows confirmation dialog before soft delete
9. Only Admins can access this page (role check in middleware)
10. Pagination for large user lists (20 users per page)

#### Story 2.9: Create Protected Admin Layout with Navigation

As an **authenticated user**,
I want **a consistent admin dashboard layout with navigation sidebar**,
so that **I can easily access different sections of the CMS**.

**Acceptance Criteria:**

1. Admin layout created at `app/(admin)/layout.tsx`
2. Layout includes: sidebar navigation, header with user menu, main content area
3. Sidebar navigation links: Dashboard, Articles, Media, Categories, Users (Admin only), Profile, Settings
4. Active route highlighted in navigation
5. User menu in header displays: avatar, name, role
6. User menu dropdown: Profile, Sign Out
7. Mobile responsive: hamburger menu for navigation on small screens
8. Unauthenticated users redirected to login page
9. Layout uses design system colors and typography

#### Story 2.10: Implement Session Management and Logout Functionality

As a **user**,
I want **to securely log out of my account**,
so that **my session is terminated and no one else can access my account from this device**.

**Acceptance Criteria:**

1. Logout button in user menu triggers NextAuth `signOut()` function
2. Logout clears session from Redis
3. Logout redirects user to homepage or login page
4. JWT token invalidated (cannot be reused)
5. Session expiry configured (e.g., 7 days for "Remember me", 24 hours otherwise)
6. Expired sessions automatically redirect to login
7. "Sign in" button visible on public pages when not authenticated
8. Session refresh works correctly (silent re-authentication)

---

### Epic 3: Content Model & Database Layer

**Epic Goal:** Create the complete data models and database schema for the magazine platform's core content entities (Articles, Blocks, Categories, Tags, ArticleTags junction table) with full CRUD API endpoints, database migrations, and comprehensive validation. Establish the foundational content architecture that all UI features will build upon, ensuring data integrity and efficient querying patterns.

#### Story 3.1: Define Article Schema and Create Database Migration

As a **developer**,
I want **to define the Article data model with all required fields and relationships**,
so that **we have a robust schema for storing magazine articles with metadata**.

**Acceptance Criteria:**

1. Article schema defined in `/db/schema.ts` with fields: id (UUID), title, slug (unique), subtitle, excerpt, featuredImage, featuredImageAlt, status (DRAFT/PUBLISHED), publishedAt, authorId (FK to users), categoryId (FK to categories), seoTitle, seoDescription, canonicalUrl, viewCount, likeCount, createdAt, updatedAt
2. Status enum defined: DRAFT, PUBLISHED
3. Foreign key constraints: authorId references users.id, categoryId references categories.id
4. Indexes created: slug (unique), status + publishedAt (composite), authorId, categoryId
5. Database migration generated using Prisma Kit
6. Migration applied successfully to PostgreSQL database
7. Schema documented with JSDoc comments
8. Article type exported from schema for TypeScript usage

#### Story 3.2: Define Block Schema for Article Content Blocks

As a **developer**,
I want **to define the Block data model to store article content as structured blocks**,
so that **the drag-and-drop editor can save and render flexible content layouts**.

**Acceptance Criteria:**

1. Block schema defined with fields: id (UUID), type (text), data (JSON), order (integer), articleId (FK to articles), createdAt, updatedAt
2. Block types documented: heading, paragraph, image, quote, list, divider
3. JSON data field stores block-specific properties (e.g., heading level, image URL, caption)
4. Foreign key constraint: articleId references articles.id with CASCADE delete
5. Composite index on (articleId, order) for efficient block retrieval
6. Database migration generated and applied
7. Block type union exported for TypeScript validation
8. Example block data structures documented in comments

#### Story 3.3: Define Category and Tag Schemas

As a **developer**,
I want **to define Category and Tag data models for content organization**,
so that **articles can be categorized and tagged for discovery and filtering**.

**Acceptance Criteria:**

1. Category schema defined with fields: id (UUID), name (unique), slug (unique), description, image, parentId (self-reference for hierarchy), createdAt, updatedAt
2. Tag schema defined with fields: id (UUID), name (unique), slug (unique), createdAt
3. ArticleTag junction table defined with: articleId (FK), tagId (FK), composite primary key
4. Indexes created: category slug (unique), tag slug (unique), tag name
5. Foreign key constraints with CASCADE delete on junction table
6. Database migration generated and applied
7. Category and Tag types exported for TypeScript
8. Self-referencing parentId enables category hierarchy (future feature)

#### Story 3.4: Implement Article CRUD API Endpoints

As a **developer**,
I want **full CRUD API endpoints for articles**,
so that **the frontend can create, read, update, and delete articles**.

**Acceptance Criteria:**

1. `POST /api/articles` - Create new article (authenticated, author+)
2. `GET /api/articles` - List articles with pagination, filtering (status, category, author), sorting
3. `GET /api/articles/[id]` - Get single article by ID with all blocks
4. `GET /api/articles/slug/[slug]` - Get article by slug (for public pages)
5. `PUT /api/articles/[id]` - Update article metadata and blocks (authenticated, owner or editor+)
6. `DELETE /api/articles/[id]` - Soft delete article (authenticated, owner or admin)
7. All endpoints validate input with Zod schemas
8. All endpoints enforce role-based permissions
9. Slug auto-generated from title if not provided
10. API returns consistent JSON structure: `{ data, error, meta }`

#### Story 3.5: Implement Block CRUD Operations within Articles

As a **developer**,
I want **API endpoints to manage blocks within an article**,
so that **the editor can add, reorder, update, and delete content blocks**.

**Acceptance Criteria:**

1. `POST /api/articles/[id]/blocks` - Add new block to article at specified position
2. `PUT /api/articles/[id]/blocks/[blockId]` - Update block data
3. `PUT /api/articles/[id]/blocks/reorder` - Reorder blocks (accepts array of { blockId, order })
4. `DELETE /api/articles/[id]/blocks/[blockId]` - Delete block
5. All operations validate user permissions (owner or editor+)
6. Block order automatically recalculated on add/delete
7. Zod schema validates block data based on block type
8. Blocks returned in correct order (sorted by order field)

#### Story 3.6: Implement Category CRUD API Endpoints

As a **developer**,
I want **full CRUD API endpoints for categories**,
so that **admins can manage content categories**.

**Acceptance Criteria:**

1. `POST /api/categories` - Create category (authenticated, admin/editor)
2. `GET /api/categories` - List all categories (public)
3. `GET /api/categories/[id]` - Get single category by ID (public)
4. `GET /api/categories/slug/[slug]` - Get category by slug (public)
5. `PUT /api/categories/[id]` - Update category (authenticated, admin/editor)
6. `DELETE /api/categories/[id]` - Delete category if no articles assigned (authenticated, admin)
7. Slug auto-generated from name if not provided
8. Validation prevents duplicate names or slugs
9. API returns category with article count

#### Story 3.7: Implement Tag CRUD API Endpoints

As a **developer**,
I want **full CRUD API endpoints for tags**,
so that **authors can create and manage tags for article categorization**.

**Acceptance Criteria:**

1. `POST /api/tags` - Create tag (authenticated, author+)
2. `GET /api/tags` - List all tags with search/autocomplete (public)
3. `GET /api/tags/[id]` - Get single tag (public)
4. `PUT /api/tags/[id]` - Update tag name/slug (authenticated, admin/editor)
5. `DELETE /api/tags/[id]` - Delete tag and remove associations (authenticated, admin)
6. `POST /api/articles/[id]/tags` - Assign tags to article (accepts array of tag IDs or names, creates new tags if needed)
7. `DELETE /api/articles/[id]/tags/[tagId]` - Remove tag from article
8. Slug auto-generated from name if not provided
9. GET /api/tags supports search query parameter for autocomplete

#### Story 3.8: Implement Slug Generation and Uniqueness Validation

As a **developer**,
I want **automatic URL-friendly slug generation with uniqueness guarantees**,
so that **all articles, categories, and tags have clean, SEO-friendly URLs**.

**Acceptance Criteria:**

1. Slug utility function created: `generateSlug(text: string): string`
2. Slug generation removes special characters, converts to lowercase, replaces spaces with hyphens
3. Slug uniqueness check function: `ensureUniqueSlug(slug: string, type: 'article' | 'category' | 'tag'): Promise<string>`
4. If slug exists, append numeric suffix (e.g., `article-title-2`)
5. Slug validation regex ensures valid URL characters only
6. Maximum slug length enforced (e.g., 100 characters)
7. Slug generation called automatically on article/category/tag creation if slug not provided
8. Slug immutable after creation (prevents broken links)

#### Story 3.9: Implement Article View Count Tracking

As a **product manager**,
I want **to track article view counts**,
so that **we can identify popular content and measure engagement**.

**Acceptance Criteria:**

1. `POST /api/articles/[id]/view` endpoint increments viewCount
2. View tracking called on article page load (client-side)
3. View count incremented atomically (prevents race conditions)
4. View tracking rate-limited per IP/session (1 view per hour per article)
5. View count displayed on article cards and detail pages
6. Top articles query: `GET /api/articles?sort=views&limit=10`
7. View tracking works in both development and production
8. View count persisted in PostgreSQL database

#### Story 3.10: Create Database Seeding Script with Sample Data

As a **developer**,
I want **a database seeding script that populates sample articles, categories, and tags**,
so that **I can test the application with realistic data during development**.

**Acceptance Criteria:**

1. Seeding script created at `/db/seed.ts`
2. Script creates sample data: 5 categories, 20 tags, 3 users, 50 articles with blocks
3. Sample articles have varied block types (heading, paragraph, image, quote, list)
4. Articles distributed across categories and tags
5. Some articles in DRAFT status, others PUBLISHED
6. Published articles have publishedAt dates (varied over past 6 months)
7. Script uses Prisma ORM for data insertion
8. Script idempotent (can run multiple times without errors)
9. Run via command: `npm run db:seed`
10. Sample images use placeholder services (e.g., Unsplash, Lorem Picsum)

---

### Epic 4: Media Management & MinIO Integration

**Epic Goal:** Build a complete media management system with drag-and-drop upload to MinIO, automatic image optimization, a browsable media library with grid view, search and filter capabilities, and seamless integration with the article editor. Enable creators to upload, organize, and reuse media assets efficiently across all articles.

#### Story 4.1: Define Media Schema and Create Database Migration

As a **developer**,
I want **to define the Media data model for tracking uploaded files**,
so that **we have a structured database of all media assets with metadata**.

**Acceptance Criteria:**

1. Media schema defined in `/db/schema.ts` with fields: id (UUID), filename, url (R2 public URL), thumbnailUrl, mimeType, size (bytes), width, height, alt, caption, credit, uploadedBy (FK to users), createdAt
2. Foreign key constraint: uploadedBy references users.id
3. Indexes created: uploadedBy, mimeType, createdAt
4. Database migration generated and applied
5. Media type exported for TypeScript usage
6. Supported MIME types documented: image/jpeg, image/png, image/gif, image/webp
7. Maximum file size documented (e.g., 10MB per image)
8. Schema includes metadata for image dimensions (width, height)

#### Story 4.2: Implement File Upload API Endpoint with MinIO Storage

As a **developer**,
I want **an API endpoint that accepts file uploads and stores them in MinIO**,
so that **users can upload images securely with proper validation**.

**Acceptance Criteria:**

1. `POST /api/media/upload` endpoint accepts multipart/form-data
2. File validation: type (JPEG, PNG, GIF, WebP), size (max 10MB)
3. File sanitization: remove EXIF data, validate image integrity
4. Generate unique filename: `{uuid}.{extension}`
5. Upload file to MinIO bucket with proper ACL (public-read)
6. Extract image dimensions using image processing library
7. Store media record in PostgreSQL database with all metadata
8. Return media object: `{ id, url, thumbnailUrl, filename, size, width, height }`
9. Authenticated users only (author+ role)
10. Error handling: file too large, invalid type, upload failure

#### Story 4.3: Implement Automatic Image Optimization and Thumbnail Generation

As a **developer**,
I want **automatic image optimization and thumbnail generation on upload**,
so that **images load quickly and efficiently across different contexts (thumbnails, full-size)**.

**Acceptance Criteria:**

1. Original image uploaded to R2 at full resolution
2. Thumbnail generated (e.g., 400x300px) and uploaded to R2
3. Sharp image processing configured for on-demand image variants
4. Image optimization: compress, convert to WebP if browser supports
5. Thumbnail URL stored in database: `thumbnailUrl`
6. Image URLs use Nginx reverse proxy for global delivery
7. Lazy loading attributes added to img tags (`loading="lazy"`)
8. Alt text required for accessibility (enforced in upload form)

#### Story 4.4: Create Media Library Grid View UI

As a **content creator**,
I want **a visual media library showing all uploaded images in a grid**,
so that **I can browse, search, and select images for my articles**.

**Acceptance Criteria:**

1. Media library page created at `app/(admin)/media/page.tsx`
2. Grid view displays image thumbnails with filename, size, upload date
3. Hover on image shows: alt text, dimensions, caption
4. Click on image opens detail modal with full metadata
5. Responsive grid: 4 columns desktop, 2 columns tablet, 1 column mobile
6. Infinite scroll or pagination (24 images per page)
7. Loading skeleton while images load
8. Empty state message if no media uploaded
9. Authenticated users only (author+ role)

#### Story 4.5: Implement Media Library Search and Filtering

As a **content creator**,
I want **to search and filter the media library**,
so that **I can quickly find specific images among hundreds of uploads**.

**Acceptance Criteria:**

1. Search input filters by filename, alt text, caption
2. Filter dropdown: Image type (JPEG, PNG, GIF, WebP, All)
3. Filter dropdown: Uploaded by (user dropdown, "My uploads", All)
4. Sort options: Newest first, Oldest first, Filename A-Z, Largest size
5. Search updates URL query parameters (shareable filtered views)
6. Debounced search (300ms delay to avoid excessive queries)
7. Search results update grid in real-time
8. Clear filters button resets all filters and search
9. Filter state persists across page navigation

#### Story 4.6: Implement Drag-and-Drop Upload Interface

As a **content creator**,
I want **to drag and drop images directly into the media library**,
so that **uploading multiple images is fast and intuitive**.

**Acceptance Criteria:**

1. Drag-and-drop zone in media library page
2. Drop zone highlights on drag-over
3. Multiple file selection supported
4. Upload progress bar for each file
5. Uploads happen in parallel (max 3 concurrent)
6. Success toast notification after upload completes
7. Newly uploaded images appear immediately in grid
8. Error toast for failed uploads with retry button
9. Drag-and-drop works on desktop and tablet
10. Fallback file input button for mobile/accessibility

#### Story 4.7: Build Media Detail Modal with Edit Capabilities

As a **content creator**,
I want **to view and edit media metadata in a modal**,
so that **I can update alt text, captions, and credits for uploaded images**.

**Acceptance Criteria:**

1. Click on media thumbnail opens detail modal
2. Modal displays: full-size image, filename, dimensions, size, upload date, uploader
3. Editable fields: alt text (required), caption, credit
4. Save button updates media record via `PUT /api/media/[id]`
5. Delete button removes media from R2 and database (with confirmation)
6. Copy URL button copies R2 public URL to clipboard
7. Modal keyboard navigation: ESC to close, Tab to navigate fields
8. Modal accessible (ARIA labels, focus trap)
9. Changes reflect immediately in media library grid

#### Story 4.8: Implement Media Selection Modal for Editor

As a **content creator**,
I want **to select images from the media library when adding image blocks to articles**,
so that **I can reuse existing images without re-uploading**.

**Acceptance Criteria:**

1. Media selection modal component created
2. Modal triggered from image block in editor ("Select from library" button)
3. Modal displays media library grid (same as media library page)
4. Search and filter functionality available in modal
5. Click on image selects it and returns URL to image block
6. "Upload new" tab in modal allows direct upload without leaving editor
7. Selected image automatically populates image block with URL, alt text, caption
8. Modal closeable via ESC key or close button
9. Modal responsive on all screen sizes

#### Story 4.9: Implement Media Usage Tracking

As an **admin**,
I want **to see which articles use each media asset**,
so that **I can safely delete unused media and avoid breaking articles**.

**Acceptance Criteria:**

1. Media detail modal shows "Used in" section with article list
2. Query finds all articles containing image URL in block data (JSON search)
3. Article list displays: title, author, status, link to edit
4. Delete button disabled if media is in use (with warning message)
5. "Force delete" option for admins (with strong confirmation warning)
6. Orphaned media report: `GET /api/media/orphaned` lists media not used in any article
7. Bulk delete action for orphaned media (admin only)
8. Media usage count displayed in grid view

#### Story 4.10: Implement MinIO Storage Cleanup and Quota Management

As a **developer**,
I want **automated cleanup of deleted media and storage quota monitoring**,
so that **we don't accumulate orphaned files or exceed storage limits**.

**Acceptance Criteria:**

1. Soft delete media: sets `deletedAt` timestamp instead of immediate removal
2. Background job (cron or manual) permanently deletes media marked deleted for >30 days
3. R2 cleanup removes both original and thumbnail files
4. Storage quota API: `GET /api/admin/storage` returns total used, file count, quota limit
5. Storage quota displayed in admin dashboard
6. Warning notification when storage reaches 80% capacity
7. Admin can manually trigger cleanup of orphaned R2 files (files in R2 not in database)
8. Cleanup logs activity to admin activity log

---

### Epic 5: Drag-and-Drop Article Editor

**Epic Goal:** Implement the comprehensive drag-and-drop article editor with essential content blocks (Heading, Paragraph, Image, Quote, List, Divider), block palette sidebar, drag-to-reorder functionality, inline editing with TipTap rich text editor, block settings panel, auto-save every 30 seconds, undo/redo functionality, and real-time preview. Deliver the primary content creation experience that empowers creators to build magazine-quality articles without technical expertise.

#### Story 5.1: Set Up TipTap Rich Text Editor Foundation

As a **developer**,
I want **to install and configure TipTap editor as the foundation for text editing**,
so that **content creators have a powerful, extensible rich text editing experience**.

**Acceptance Criteria:**

1. TipTap core installed with React wrapper (`@tiptap/react`, `@tiptap/starter-kit`)
2. TipTap extensions installed: StarterKit, Placeholder, CharacterCount
3. Basic TipTap editor renders in a test component
4. Editor configured with: bold, italic, underline, headings, lists, links
5. Editor styling matches design system (fonts, colors)
6. Editor content serializes to/from JSON format
7. Keyboard shortcuts work: Cmd/Ctrl+B (bold), Cmd/Ctrl+I (italic), Cmd/Ctrl+K (link)
8. Editor accessible (keyboard navigation, ARIA labels)

#### Story 5.2: Create Block Type Definitions and TypeScript Types

As a **developer**,
I want **comprehensive TypeScript type definitions for all block types**,
so that **the editor has type safety and IDE autocompletion**.

**Acceptance Criteria:**

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

#### Story 5.3: Build Block Palette Sidebar Component

As a **content creator**,
I want **a sidebar palette showing all available block types**,
so that **I can easily add new blocks to my article by dragging them to the canvas**.

**Acceptance Criteria:**

1. Block palette sidebar component created at `/components/editor/block-palette.tsx`
2. Sidebar displays all block types with icons and labels: Heading, Paragraph, Image, Quote, List, Divider
3. Each block is draggable (using @dnd-kit/core)
4. Block icons use Lucide React icons (Heading, Type, Image, Quote, List, Minus)
5. Hover state highlights block item
6. Recently used blocks section (top 3 most recent)
7. Sidebar collapsible on mobile (hamburger icon)
8. Sidebar fixed position on desktop, overlay on mobile
9. Search input filters block types (future enhancement, placeholder added)

#### Story 5.4: Implement Editor Canvas with DndContext

As a **developer**,
I want **the main editor canvas with drag-and-drop context configured**,
so that **blocks can be added and reordered via drag-and-drop**.

**Acceptance Criteria:**

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

#### Story 5.5: Create Sortable Block Wrapper Component

As a **developer**,
I want **a sortable block wrapper that handles drag interactions**,
so that **each block can be dragged, selected, and managed individually**.

**Acceptance Criteria:**

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

#### Story 5.6: Implement Block Renderer for All Block Types

As a **developer**,
I want **a block renderer that displays each block type correctly**,
so that **content creators see accurate previews of their content while editing**.

**Acceptance Criteria:**

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

#### Story 5.7: Create Individual Block Components (Heading, Paragraph, Quote)

As a **content creator**,
I want **editable Heading, Paragraph, and Quote block components**,
so that **I can write and format text content inline within the editor**.

**Acceptance Criteria:**

1. HeadingBlock component: Dropdown to select level (H1-H6), inline TipTap editor, alignment buttons
2. ParagraphBlock component: Full TipTap editor with toolbar (bold, italic, link), alignment options
3. QuoteBlock component: TipTap editor for quote text, input for attribution, style toggle (default/pullquote)
4. All blocks update Zustand store on content change
5. Formatting toolbar appears on text selection (floating toolbar)
6. Toolbar includes: Bold, Italic, Underline, Link, Text color (limited palette)
7. Alignment buttons: Left, Center, Right (Justify for paragraph only)
8. Keyboard shortcuts work in all text blocks
9. Placeholder text guides users: "Type / for commands", "Enter heading...", etc.

#### Story 5.8: Create Individual Block Components (Image, List, Divider)

As a **content creator**,
I want **Image, List, and Divider block components**,
so that **I can add visual and structural elements to my articles**.

**Acceptance Criteria:**

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

#### Story 5.9: Implement Block Settings Inspector Panel

As a **content creator**,
I want **a settings panel that shows options for the selected block**,
so that **I can customize block appearance and behavior without cluttering the canvas**.

**Acceptance Criteria:**

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

#### Story 5.10: Implement Auto-Save Functionality with Status Indicator

As a **content creator**,
I want **automatic saving of my article every 30 seconds**,
so that **I never lose my work due to browser crashes or accidental navigation**.

**Acceptance Criteria:**

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

#### Story 5.11: Implement Undo/Redo Functionality

As a **content creator**,
I want **undo and redo buttons in the editor**,
so that **I can easily revert mistakes or restore changes**.

**Acceptance Criteria:**

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

#### Story 5.12: Build Article Editor Page with Full Layout

As a **content creator**,
I want **a complete article editor page integrating all components**,
so that **I have a unified, professional editing experience**.

**Acceptance Criteria:**

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

### Epic 6: Article Management Dashboard

**Epic Goal:** Build a comprehensive admin dashboard for managing articles with a filterable, sortable table view, inline quick actions, bulk operations, article settings form (featured image, category, tags, SEO, publish status), search functionality, and status indicators. Enable editors and admins to efficiently oversee all content, transition articles through workflow states, and maintain editorial quality across the magazine.

#### Story 6.1: Create Dashboard Overview Page with Key Metrics

As an **editor or admin**,
I want **a dashboard overview page showing key content metrics**,
so that **I can quickly assess the health and activity of the magazine platform**.

**Acceptance Criteria:**

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

#### Story 6.2: Build Article List View with Table Component

As an **editor or admin**,
I want **a comprehensive table view of all articles**,
so that **I can see article metadata at a glance and take quick actions**.

**Acceptance Criteria:**

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

#### Story 6.3: Implement Article Search and Filtering

As an **editor or admin**,
I want **to search and filter the article list**,
so that **I can quickly find specific articles among hundreds of posts**.

**Acceptance Criteria:**

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

#### Story 6.4: Implement Table Sorting

As an **editor or admin**,
I want **to sort the article table by different columns**,
so that **I can organize content by priority, date, or popularity**.

**Acceptance Criteria:**

1. Sortable columns: Title, Author, Category, Status, Views, Updated, Published
2. Click column header to sort ascending, click again for descending
3. Sort indicator icon (up/down arrow) shows current sort state
4. Default sort: Updated (newest first)
5. Sort persists in URL query parameters
6. API endpoint supports sort parameter: `?sort=views&order=desc`
7. Multi-column sort (secondary sort) not required for MVP
8. Keyboard accessible (Enter/Space to toggle sort)

#### Story 6.5: Implement Bulk Actions for Articles

As an **editor or admin**,
I want **to perform bulk actions on multiple articles**,
so that **I can efficiently manage content at scale**.

**Acceptance Criteria:**

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

#### Story 6.6: Build Article Settings Form

As a **content creator**,
I want **a comprehensive settings form for article metadata**,
so that **I can configure featured image, category, tags, SEO, and publish status**.

**Acceptance Criteria:**

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

#### Story 6.7: Implement Inline Quick Edit for Articles

As an **editor or admin**,
I want **inline editing of article fields directly in the table**,
so that **I can make quick changes without opening the full editor**.

**Acceptance Criteria:**

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

#### Story 6.8: Build New Article Creation Flow

As a **content creator**,
I want **a streamlined flow for creating new articles**,
so that **I can quickly start writing without setup friction**.

**Acceptance Criteria:**

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

#### Story 6.9: Implement Article Duplication

As a **content creator**,
I want **to duplicate an existing article as a starting template**,
so that **I can reuse structure and formatting for similar articles**.

**Acceptance Criteria:**

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

#### Story 6.10: Implement Article Preview Functionality

As a **content creator**,
I want **to preview my article as it will appear to readers**,
so that **I can verify formatting and layout before publishing**.

**Acceptance Criteria:**

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

### Epic 7: Reader Experience - Public Site

**Epic Goal:** Implement the complete public-facing reader experience including homepage with hero featured article and article grid, article detail pages with optimized typography and lazy-loaded images, category landing pages, author profile pages, responsive navigation with mobile hamburger menu, and SEO optimization with meta tags and structured data. Deliver a premium, fast-loading magazine reading experience that celebrates content and engages readers across all devices.

#### Story 7.1: Build Homepage with Hero Section and Article Grid

As a **reader**,
I want **a visually appealing homepage showcasing featured and latest articles**,
so that **I can discover compelling content immediately upon visiting the site**.

**Acceptance Criteria:**

1. Homepage created at `app/(reader)/page.tsx`
2. Hero section displays featured article: Large featured image (full-width), title overlay, category badge, author, excerpt
3. Featured article determined by: Latest published OR manually pinned (future: add "featured" flag to article schema)
4. Article grid below hero: 6-12 latest published articles (excluding featured)
5. Article cards display: Thumbnail, title, excerpt, author with avatar, category badge, published date, read time estimate
6. Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
7. Pagination: "Load more" button or numbered pagination (20 articles per page)
8. Homepage fetches data server-side (SSR) for SEO and fast initial load
9. Hover effects on article cards (subtle lift, shadow)
10. Responsive design with design system styling

#### Story 7.2: Build Article Detail Page with Block Rendering

As a **reader**,
I want **to read articles with beautiful typography and optimal layout**,
so that **I have an immersive, distraction-free reading experience**.

**Acceptance Criteria:**

1. Article page created at `app/(reader)/[slug]/page.tsx`
2. Article header: Category badge, title (H1, serif, large), subtitle, author byline (name, avatar, bio snippet), published date, read time
3. Featured image displayed below header (full-width, caption, credit)
4. Article body renders all block types: Heading, Paragraph, Image, Quote, List, Divider
5. Typography optimized: Serif for body text, line-height 1.7, max-width 720px
6. Images lazy-loaded with loading="lazy" attribute
7. Image layouts respected: Full-width, centered, float-left, float-right
8. Quotes styled prominently with large text and accent color
9. Code blocks syntax-highlighted (if code block added later)
10. Responsive: Single-column on mobile, optimal reading on all devices
11. Server-side rendering (SSR) for SEO
12. 404 page if article slug not found

#### Story 7.3: Implement Article View Tracking

As a **product manager**,
I want **article views automatically tracked when readers load an article**,
so that **we can measure content popularity and engagement**.

**Acceptance Criteria:**

1. Article page calls `POST /api/articles/[id]/view` on mount (client-side)
2. View tracking only counts once per user per hour (rate limited by IP/session)
3. View tracking uses cookie or localStorage to track viewed articles
4. View count incremented atomically in database
5. View tracking works in production (not counted in preview mode)
6. View tracking doesn't block page render (fire-and-forget)
7. View tracking respects DNT (Do Not Track) header
8. Popular articles query uses view count for sorting

#### Story 7.4: Build Category Landing Pages

As a **reader**,
I want **dedicated pages for each category showing all related articles**,
so that **I can explore content by topic of interest**.

**Acceptance Criteria:**

1. Category page created at `app/(reader)/category/[slug]/page.tsx`
2. Page header: Category name (H1), description (if set), featured image (hero)
3. Article grid: All published articles in category, sorted by published date (newest first)
4. Article cards same format as homepage
5. Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
6. Pagination: 20 articles per page
7. Empty state if category has no published articles: "No articles in this category yet"
8. Breadcrumb navigation: Home > Category Name
9. Server-side rendering (SSR) for SEO
10. 404 page if category slug not found

#### Story 7.5: Build Author Profile Pages

As a **reader**,
I want **to view an author's profile and all their published articles**,
so that **I can follow writers I enjoy and discover more of their work**.

**Acceptance Criteria:**

1. Author page created at `app/(reader)/author/[id]/page.tsx`
2. Author header: Avatar (large), name (H1), bio, social media links (Twitter, Instagram, LinkedIn icons)
3. Article count: "X articles by [Author Name]"
4. Article grid: All published articles by author, sorted by published date (newest first)
5. Article cards same format as homepage
6. Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
7. Pagination: 20 articles per page
8. Empty state if author has no published articles: "No published articles yet"
9. Breadcrumb navigation: Home > Authors > Author Name
10. Server-side rendering (SSR)

#### Story 7.6: Build Responsive Navigation Header

As a **reader**,
I want **consistent navigation across all pages**,
so that **I can easily access different sections of the magazine**.

**Acceptance Criteria:**

1. Navigation component created at `/components/shared/navbar.tsx`
2. Sticky header (remains at top on scroll)
3. Logo/site name on left (links to homepage)
4. Navigation links: Home, Categories (dropdown), About
5. Categories dropdown shows all categories with article counts
6. Search icon placeholder (search deferred to post-MVP)
7. Mobile: Hamburger menu icon (≤768px)
8. Mobile menu: Slide-in drawer with navigation links, close button
9. Desktop: Horizontal nav bar with dropdowns
10. Header uses design system colors (background, text, accent)
11. Accessible: Keyboard navigation, ARIA labels, focus indicators

#### Story 7.7: Build Site Footer

As a **reader**,
I want **a footer with important links and site information**,
so that **I can access legal pages, social media, and additional resources**.

**Acceptance Criteria:**

1. Footer component created at `/components/shared/footer.tsx`
2. Footer sections: About (site description), Categories (links to all categories), Social (icon links), Legal (Privacy, Terms)
3. Copyright notice: "© 2025 [Magazine Name]. All rights reserved."
4. Newsletter signup form (placeholder: "Coming soon")
5. Footer background matches design system (dark theme or light with border)
6. Footer responsive: Stacks vertically on mobile
7. Social icons: Twitter, Instagram, Facebook, LinkedIn (configurable)
8. Accessible: Proper heading hierarchy, link labels

#### Story 7.8: Implement SEO Meta Tags and Open Graph

As a **marketer**,
I want **comprehensive SEO meta tags on all pages**,
so that **articles are discoverable via search engines and share beautifully on social media**.

**Acceptance Criteria:**

1. Meta tags component created at `/components/shared/seo-meta.tsx`
2. Article pages include: title, description, canonical URL, author, published date, modified date
3. Open Graph tags: og:title, og:description, og:image (featured image), og:url, og:type (article)
4. Twitter Card tags: twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image
5. Homepage includes: site title, description, logo as og:image
6. Category pages include: category name, description, image
7. Author pages include: author name, bio, avatar
8. Meta tags use article SEO fields if set, fallback to defaults
9. All images use absolute URLs for Open Graph
10. Validate tags with Facebook Debugger and Twitter Card Validator

#### Story 7.9: Implement Schema.org Structured Data

As a **marketer**,
I want **Schema.org structured data on all pages**,
so that **search engines can understand and display rich snippets for our content**.

**Acceptance Criteria:**

1. JSON-LD structured data component created
2. Article pages include Article schema: headline, description, image, datePublished, dateModified, author (Person), publisher (Organization)
3. Homepage includes Organization schema: name, logo, url, sameAs (social media)
4. Author pages include Person schema: name, image, description, sameAs (social links)
5. Category pages include CollectionPage schema
6. Breadcrumb structured data on all pages
7. Validate structured data with Google Rich Results Test
8. Schema rendered in <script type="application/ld+json"> tags in <head>

#### Story 7.10: Generate Dynamic Sitemap and Robots.txt

As a **marketer**,
I want **an automatically updated sitemap and robots.txt**,
so that **search engines can efficiently crawl and index all published content**.

**Acceptance Criteria:**

1. Sitemap generated at `/sitemap.xml` route
2. Sitemap includes: Homepage, all published articles, all category pages, all author pages
3. Sitemap dynamically updates as articles published/unpublished
4. Sitemap follows XML sitemap protocol (lastmod, changefreq, priority)
5. Articles have priority 0.8, categories 0.6, authors 0.5, homepage 1.0
6. Sitemap split into multiple files if >50,000 URLs (unlikely for MVP)
7. Robots.txt created at `/robots.txt`: Allow all, reference sitemap
8. Robots.txt blocks: /admin/_, /api/_, /preview/\*
9. Sitemap regenerated on-demand or cached (invalidate on publish)
10. Sitemap submitted to Google Search Console and Bing Webmaster Tools

---

### Epic 8: Category & Tag Management

**Epic Goal:** Build administrative interfaces for creating, editing, organizing, and deleting categories and tags. Enable admins and editors to establish and maintain content taxonomy, ensuring consistent content organization and improved reader discoverability across the magazine platform.

#### Story 8.1: Build Category Management List Page

As an **admin or editor**,
I want **a list view of all categories with management actions**,
so that **I can see and organize the site's content taxonomy at a glance**.

**Acceptance Criteria:**

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

#### Story 8.2: Build Create/Edit Category Form

As an **admin or editor**,
I want **a form to create new categories or edit existing ones**,
so that **I can define content organization structure**.

**Acceptance Criteria:**

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

#### Story 8.3: Implement Category Hierarchy (Parent-Child Relationships)

As an **admin or editor**,
I want **to create subcategories under parent categories**,
so that **I can organize content with hierarchical taxonomy (e.g., Culture > Music, Culture > Film)**.

**Acceptance Criteria:**

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

#### Story 8.4: Implement Category Deletion with Safeguards

As an **admin**,
I want **to delete unused categories safely**,
so that **I can clean up taxonomy without breaking article associations**.

**Acceptance Criteria:**

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

#### Story 8.5: Build Tag Management List Page

As an **admin or editor**,
I want **a list view of all tags with usage statistics**,
so that **I can manage tags and identify duplicate or underused tags**.

**Acceptance Criteria:**

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

#### Story 8.6: Build Create/Edit Tag Form

As an **admin or editor**,
I want **a simple form to create or edit tags**,
so that **I can maintain consistent tagging vocabulary**.

**Acceptance Criteria:**

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

#### Story 8.7: Implement Tag Merging Functionality

As an **admin or editor**,
I want **to merge duplicate or similar tags**,
so that **I can consolidate fragmented tagging and improve content discovery**.

**Acceptance Criteria:**

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

#### Story 8.8: Implement Tag Auto-Suggest in Article Editor

As a **content creator**,
I want **tag autocomplete suggestions as I type**,
so that **I can quickly find and select existing tags without creating duplicates**.

**Acceptance Criteria:**

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

#### Story 8.9: Implement Tag Cloud or Popular Tags Widget

As an **admin**,
I want **a visual representation of popular tags**,
so that **I can understand content themes and identify trending topics**.

**Acceptance Criteria:**

1. Tag cloud widget in admin dashboard
2. Shows top 20 tags by usage count
3. Tag size proportional to usage (CSS font-size scaling)
4. Click tag navigates to article list filtered by that tag
5. Widget updates dynamically as articles tagged
6. API endpoint: `GET /api/tags/popular?limit=20`
7. Responsive layout (tag cloud wraps on smaller screens)
8. Accessible (tags are clickable links with ARIA labels)
9. Optional: Color-coded by category (if tags associated with categories)

#### Story 8.10: Implement Category and Tag SEO Optimization

As a **marketer**,
I want **category and tag pages optimized for SEO**,
so that **taxonomy pages rank in search engines and drive organic traffic**.

**Acceptance Criteria:**

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

### Epic 9: Production Readiness & Polish

**Epic Goal:** Implement comprehensive error handling, loading states, accessibility enhancements (WCAG 2.1 AA compliance), performance optimization (image optimization, code splitting, caching), SEO final touches, responsive design polish, user onboarding, and production monitoring setup. Transform the functional MVP into a polished, production-ready platform that delivers a professional, reliable experience worthy of public launch.

#### Story 9.1: Implement Comprehensive Error Handling and User-Friendly Error Pages

As a **user**,
I want **clear, helpful error messages when something goes wrong**,
so that **I understand what happened and how to proceed**.

**Acceptance Criteria:**

1. Global error boundary component wraps entire app
2. Custom 404 page: "Page not found" with search, popular articles, home link
3. Custom 500 page: "Something went wrong" with retry button, support email
4. API error handling: Consistent JSON error format `{ error: { message, code, details } }`
5. Client-side error toast notifications for failed operations
6. Form validation errors displayed inline with helpful messages
7. Network error detection with retry mechanism
8. Authentication errors redirect to login with return URL
9. Permission errors show "Access denied" with contact info
10. Error logging to console (development) and error tracking service (production)

#### Story 9.2: Implement Loading States and Skeleton Screens

As a **user**,
I want **visual feedback while content loads**,
so that **I know the app is working and content is coming**.

**Acceptance Criteria:**

1. Skeleton screens for: Article list, article detail, media grid, dashboard stats
2. Loading spinners for: Form submissions, file uploads, API mutations
3. Progress bars for: Multi-file uploads, bulk operations
4. Suspense boundaries with loading fallbacks for code-split routes
5. "Loading..." text replaced with visual skeletons matching content layout
6. Loading states accessible (ARIA live regions, screen reader announcements)
7. Minimum display time for skeletons (avoid flash of loading state)
8. Loading states match design system styling
9. Smooth transitions from loading to loaded state
10. No layout shift during loading-to-content transition

#### Story 9.3: Conduct Accessibility Audit and Implement WCAG 2.1 AA Compliance

As a **user with disabilities**,
I want **the platform to be fully accessible**,
so that **I can use all features regardless of my abilities**.

**Acceptance Criteria:**

1. All interactive elements keyboard accessible (Tab, Enter, Escape, Arrow keys)
2. Focus indicators visible and distinct (2px outline, high contrast)
3. Color contrast ratios meet WCAG AA: ≥4.5:1 for normal text, ≥3:1 for large text
4. All images have descriptive alt text (enforced in editor, validated in forms)
5. ARIA labels on all icon buttons, navigation, modals, forms
6. Semantic HTML throughout (nav, main, article, section, header, footer)
7. Heading hierarchy correct (h1 → h2 → h3, no skipping levels)
8. Form labels properly associated with inputs
9. Skip to main content link for keyboard users
10. Screen reader testing with NVDA and VoiceOver (pass on common flows)
11. Automated accessibility testing with axe-core or Lighthouse (score >90)

#### Story 9.4: Optimize Image Delivery and Implement Lazy Loading

As a **reader**,
I want **images to load quickly without blocking content**,
so that **I can start reading immediately even on slower connections**.

**Acceptance Criteria:**

1. All images use Next.js Image component with automatic optimization
2. Lazy loading enabled for below-fold images (`loading="lazy"`)
3. Responsive images with srcset for different screen sizes
4. WebP format served to supporting browsers, fallback to JPEG/PNG
5. Placeholder blur-up effect while images load (low-quality image placeholder)
6. Sharp image processing configured for on-demand variants
7. CDN caching headers set: Cache-Control with long TTL (1 year)
8. Featured images prioritized for above-fold (eager loading)
9. Image dimensions specified to prevent layout shift (width/height attributes)
10. Image optimization validated: Lighthouse performance score >90

#### Story 9.5: Implement Code Splitting and Bundle Optimization

As a **developer**,
I want **optimized JavaScript bundles with code splitting**,
so that **pages load faster by only loading necessary code**.

**Acceptance Criteria:**

1. Route-based code splitting: Admin routes separate from reader routes
2. Component-level code splitting for heavy components (editor, media library)
3. Dynamic imports for modals, dialogs, and large UI components
4. Vendor bundle analysis: Identify and optimize large dependencies
5. Tree-shaking enabled to remove unused code
6. Polyfills loaded conditionally based on browser support
7. Bundle size target: Initial JS bundle <200KB (gzipped)
8. Next.js App Router automatic code splitting utilized
9. Build analysis: Run `next build` with bundle analyzer
10. Lighthouse performance score >90 on homepage and article pages

#### Story 9.6: Implement Caching Strategy with Redis

As a **developer**,
I want **intelligent caching to reduce database load and improve response times**,
so that **the platform scales efficiently under high traffic**.

**Acceptance Criteria:**

1. Published articles cached in Redis (TTL: 1 hour)
2. Cache invalidation on article publish/update
3. Category/tag lists cached (TTL: 15 minutes)
4. Homepage data cached (TTL: 5 minutes)
5. API responses include Cache-Control headers
6. Cache keys include version or timestamp for busting
7. Cache hit/miss logged for monitoring
8. Admin/draft content never cached
9. CDN caching for static assets: images, CSS, JS (long TTL)
10. Cache warming strategy for popular content

#### Story 9.7: Implement User Onboarding Flow for First-Time Creators

As a **new content creator**,
I want **guided onboarding when I first log in**,
so that **I quickly understand how to create and publish my first article**.

**Acceptance Criteria:**

1. Welcome modal on first login: "Welcome to [Magazine Name]!"
2. Optional guided tour (tooltips) highlighting: Dashboard, New Article, Media Library, Profile
3. Tour uses library like Shepherd.js or Intro.js
4. "Create your first article" CTA prominent on empty dashboard
5. Empty states in article list include helpful next-step prompts
6. Help documentation link in footer and navigation
7. Onboarding status tracked in user profile (dismissible, don't show again)
8. Video tutorial embed: "How to create your first article" (optional, placeholder)
9. Sample article template available for first article
10. Onboarding flow skippable and re-accessible from help menu

#### Story 9.8: Implement Rate Limiting and Security Hardening

As a **security-conscious developer**,
I want **rate limiting and security best practices enforced**,
so that **the platform is protected from abuse and common attacks**.

**Acceptance Criteria:**

1. Rate limiting on authentication endpoints: 5 attempts per 15 minutes per IP
2. Rate limiting on API mutations: 100 requests per minute per user
3. CSRF protection on all state-changing operations
4. Content Security Policy (CSP) headers configured
5. XSS protection: User-generated content sanitized (DOMPurify or similar)
6. SQL injection prevention: Parameterized queries via Prisma ORM
7. File upload validation: MIME type, file size, malicious content scanning
8. HTTPS enforced (redirect HTTP to HTTPS)
9. Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
10. Dependabot or Renovate enabled for dependency security updates

#### Story 9.9: Set Up Production Monitoring and Observability

As a **developer and admin**,
I want **monitoring and logging in production**,
so that **I can detect issues, track performance, and respond to incidents**.

**Acceptance Criteria:**

1. Error tracking integrated: Sentry or Next.js API routes Analytics
2. Performance monitoring: self-hosted analytics or Google Analytics 4
3. Application logs centralized: Next.js API routes logs accessible via dashboard
4. Uptime monitoring: External service pings homepage every 5 minutes
5. Alerting configured: Email/Slack notifications for critical errors or downtime
6. Dashboard for key metrics: Error rate, response time, uptime
7. Database query performance logging (slow query log)
8. API endpoint response times tracked
9. User analytics: Page views, unique visitors, top articles (privacy-compliant)
10. Status page (optional): Public status.yoursite.com showing system health

#### Story 9.10: Final QA, Testing, and Launch Preparation

As a **product manager**,
I want **comprehensive testing and launch readiness checks**,
so that **we launch a stable, high-quality product**.

**Acceptance Criteria:**

1. Full end-to-end testing: Creator journey (register → create article → publish), reader journey (homepage → article → explore)
2. Cross-browser testing: Chrome, Firefox, Safari, Edge (latest versions)
3. Device testing: iPhone, Android phone, iPad, desktop (1920x1080, 1366x768)
4. Accessibility testing: Keyboard navigation, screen reader (NVDA/VoiceOver)
5. Performance testing: Lighthouse scores >90 (Performance, Accessibility, Best Practices, SEO)
6. Load testing: Simulate 100 concurrent users, verify no errors or slowdowns
7. Security review: OWASP Top 10 checklist, penetration testing (basic)
8. Content review: Seed database with 50 high-quality sample articles
9. Launch checklist completed: DNS configured, SSL certificate active, analytics tracking, error monitoring, backups enabled
10. Soft launch: Invite 10 beta users, gather feedback, fix critical issues before public announcement

---

## 7. Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 95%
**MVP Scope Appropriateness:** Just Right (comprehensive but achievable)
**Readiness for Architecture Phase:** **READY**

### Validation Report

The comprehensive MVP PRD has been validated against the PM checklist with outstanding results:

- **9 Epics** with **98 User Stories** covering the complete magazine platform
- All functional requirements (47 FRs) and non-functional requirements (27 NFRs) clearly defined
- Comprehensive UI/UX design goals with WCAG 2.1 AA accessibility compliance
- Clear technical architecture: Self-hosted monolith on VPS with Next.js 14+
- Logical epic sequencing with appropriate dependencies
- Story acceptance criteria detailed and testable (average 8-10 per story)

**Category Validation:**

- Problem Definition & Context: PASS (100%)
- MVP Scope Definition: PASS (95%)
- User Experience Requirements: PASS (98%)
- Functional Requirements: PASS (100%)
- Non-Functional Requirements: PASS (100%)
- Epic & Story Structure: PASS (100%)
- Technical Guidance: PASS (98%)
- Cross-Functional Requirements: PASS (100%)

**Timeline Estimate:** 4-6 months for full MVP with single developer

### Recommendations

1. **Finalize technical decisions** - Choose NextAuth.js vs. Clerk in Epic 2 (recommend NextAuth.js)
2. **Consider Epic 8 timing** - Advanced category/tag features could be deferred if timeline is constrained
3. **Allocate 25-30% of development time to Epic 5** - Editor is the most complex component
4. **Plan for buffer time** - Add 20% contingency for unforeseen issues

**DECISION: ✅ READY FOR ARCHITECT**

The PRD and epics are comprehensive, properly structured, and ready for architectural design.

---

## 8. Next Steps

### 8.1 Architect Prompt

**Prompt for Architect Agent:**

"Review the comprehensive PRD at [docs/prd.md](docs/prd.md) for the Online Magazine Platform MVP. Create a detailed architecture document covering:

1. **System Architecture**: self-hosted self-hosted deployment with Next.js 14+, PostgreSQL database, MinIO storage, KV cache
2. **Database Schema**: Detailed schema for Articles, Blocks, Categories, Tags, Media, Users with Prisma ORM
3. **API Design**: RESTful endpoints with authentication, authorization, and validation patterns
4. **Frontend Architecture**: Next.js App Router structure, component hierarchy, state management with Zustand
5. **Security Architecture**: Auth flows with NextAuth.js, RBAC, CSRF protection, rate limiting
6. **Performance Strategy**: Code splitting, caching strategy, image optimization, CDN configuration
7. **Development Workflow**: CI/CD with GitHub Actions, testing strategy, deployment to VPS Docker deployment

Focus on the technical implementation details needed for Epic 1-9 development. Reference the existing architecture document at [magaizne files/architecture_doc_complete.md](magaizne files/architecture_doc_complete.md) but update it based on the finalized PRD scope and technical decisions."

### 8.2 UX Expert Prompt

**Prompt for UX Expert (Optional):**

"Review the UI Design Goals section of the PRD at [docs/prd.md](docs/prd.md). Create detailed design specifications for:

1. **Design System**: Complete color palette, typography scales, spacing system, component library
2. **Editor UX**: Drag-and-drop interactions, block palette, inspector panel, auto-save indicators
3. **Reader Experience**: Article layout, homepage grid, category pages, responsive breakpoints
4. **Accessibility**: WCAG 2.1 AA compliance checklist, keyboard navigation patterns, ARIA implementation

Provide Figma/design mockups or detailed component specifications to guide Epic 5-7 implementation."

---

**END OF PRD**

_This PRD was created using BMAD methodology with comprehensive elicitation and validation._
