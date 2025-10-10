# 4. Technical Assumptions

[← Back to Index](index.md) | [Previous: UI/UX Design](03-ui-ux-design.md) | [Next: Epic List →](05-epic-list.md)

---

## 4.1 Repository Structure: Monorepo

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

## 4.2 Service Architecture

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

## 4.3 Testing Requirements

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

## 4.4 Additional Technical Assumptions and Requests

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

[← Back to Index](index.md) | [Previous: UI/UX Design](03-ui-ux-design.md) | [Next: Epic List →](05-epic-list.md)
