# Epic 1: Foundation & Core Infrastructure

[← Back to Epic List](../05-epic-list.md) | [Next Epic: Authentication →](epic-02-authentication.md)

---

## Epic Goal

Establish the complete project foundation including Next.js application setup on VPS Docker deployment, database schema with Prisma ORM, authentication scaffolding, CI/CD pipeline with GitHub Actions, and deployment to production. Deliver a deployable "health check" landing page that validates the full stack is operational from day one, ensuring all subsequent epics build on a solid, production-ready foundation.

**Stories:** 10 | **Dependencies:** None (starting epic)

---

## Story 1.1: Initialize Next.js Project with TypeScript and Docker Configuration

**As a** developer,
**I want** to initialize a Next.js 14+ project with TypeScript, Tailwind CSS, and VPS Docker deployment configuration,
**so that** we have a modern, type-safe frontend framework ready for development and deployment to VPS's edge network.

### Acceptance Criteria

1. Next.js 14+ project initialized with App Router enabled
2. TypeScript configured with strict mode enabled (`tsconfig.json`)
3. Tailwind CSS 3+ installed and configured with base styles
4. Project structure follows monorepo layout (`/app`, `/components`, `/lib`, `/types`, `/config`, `/public`)
5. `package.json` includes all core dependencies (React, Next.js, TypeScript, Tailwind)
6. `.gitignore` configured to exclude `node_modules`, `.next`, build artifacts
7. Development server runs successfully (`npm run dev`)
8. Basic homepage renders at `http://localhost:3000`

---

## Story 1.2: Configure VPS Docker deployment and Docker Compose

**As a** developer,
**I want** to configure VPS Docker deployment deployment and Docker Compose tooling,
**so that** the application can be deployed to self-hosted VPS infrastructure with automated builds.

### Acceptance Criteria

1. Docker Compose installed globally or as dev dependency
2. `docker-compose.yml` configured with project name, compatibility dates, and bindings
3. VPS Docker deployment project created in VPS management
4. Build command configured for Next.js (`next build`)
5. Output directory set to `.next` or appropriate Next.js build output
6. Local development can use Docker services via `wrangler pages dev`
7. Manual deployment to VPS Docker deployment succeeds (`wrangler pages deploy`)
8. Deployed site accessible via VPS Docker deployment URL

---

## Story 1.3: Set Up PostgreSQL Database with Prisma ORM

**As a** developer,
**I want** to configure PostgreSQL database and Prisma ORM with migrations,
**so that** we have a scalable, replicated database ready for content storage.

### Acceptance Criteria

1. PostgreSQL database created via Docker Compose
2. Prisma ORM installed with D1 adapter (`drizzle-orm`, `drizzle-kit`)
3. Database schema defined in `/db/schema.ts` (initial tables: users, articles, blocks, categories, tags, media)
4. Prisma Kit configured for migrations (`drizzle.config.ts`)
5. Initial migration generated and applied successfully
6. Database connection helper created in `/lib/cloudflare/d1-client.ts`
7. D1 binding configured in `docker-compose.yml`
8. Test query executes successfully in local development

---

## Story 1.4: Configure MinIO Object Storage

**As a** developer,
**I want** to set up MinIO bucket for media storage,
**so that** uploaded images and media files can be stored with zero egress fees.

### Acceptance Criteria

1. MinIO bucket created via VPS management or Docker
2. R2 binding configured in `docker-compose.yml`
3. R2 client helper created in `/lib/cloudflare/r2-client.ts`
4. Public access configured for uploaded media (or signed URLs if private)
5. Custom domain configured for MinIO bucket (e.g., `media.magazinename.com`)
6. Test file upload succeeds in local development
7. Uploaded file accessible via public URL
8. File deletion function implemented and tested

---

## Story 1.5: Configure Redis for Caching and Sessions

**As a** developer,
**I want** to set up Redis namespace for caching and session storage,
**so that** we can store ephemeral data on the server with low latency.

### Acceptance Criteria

1. Redis namespace created (e.g., `magazine_cache`)
2. Redis connection configured in `docker-compose.yml`
3. Redis client helper created in `/lib/cloudflare/kv-client.ts`
4. Basic cache utility functions implemented (get, set, delete, with TTL)
5. Test key-value pair stored and retrieved successfully
6. Session storage pattern documented for future auth implementation
7. Redis database accessible in local development via Docker

---

## Story 1.6: Set Up GitHub Repository with CI/CD Pipeline

**As a** developer,
**I want** to configure GitHub repository with automated CI/CD pipeline,
**so that** code changes trigger automated testing, linting, and deployment to VPS Docker deployment.

### Acceptance Criteria

1. GitHub repository initialized with remote origin configured
2. GitHub Actions workflow created (`.github/workflows/ci-cd.yml`)
3. CI pipeline runs on pull requests: lint (ESLint), type-check (TypeScript), test (Vitest)
4. CD pipeline deploys to VPS Docker deployment on merge to `main` branch
5. deployment credentials configured as GitHub secret
6. Preview deployments created for all pull requests
7. Build status badge added to `README.md`
8. Successful deployment triggers Slack/Discord notification (optional)

---

## Story 1.7: Implement ESLint, Prettier, and Pre-commit Hooks

**As a** developer,
**I want** to enforce code quality with ESLint, Prettier, and Husky pre-commit hooks,
**so that** code consistency is maintained and common errors are caught before commit.

### Acceptance Criteria

1. ESLint configured with Next.js and TypeScript rules (`.eslintrc.json`)
2. Prettier configured with project style preferences (`.prettierrc`)
3. Husky installed and initialized for Git hooks
4. Pre-commit hook runs: lint-staged, ESLint, Prettier, TypeScript check
5. VSCode settings included (`.vscode/settings.json`) for auto-format on save
6. All existing code passes linting and formatting checks
7. Committing code with errors is blocked by pre-commit hook
8. `npm run lint` and `npm run format` scripts work correctly

---

## Story 1.8: Create Design System Foundation with Tailwind and CSS Variables

**As a** developer,
**I want** to implement the design system foundation with Tailwind configuration and CSS variables,
**so that** consistent styling is available throughout the application.

### Acceptance Criteria

1. Tailwind config (`tailwind.config.ts`) extended with custom colors, fonts, spacing
2. CSS variables defined in `app/globals.css` for light theme (colors, radius, fonts)
3. Dark theme variables defined but not activated (post-MVP)
4. Typography scale configured (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
5. Custom font families configured: serif (Georgia), sans (Open Sans), mono (Menlo)
6. Border radius set to `1.3rem` as default
7. Gold accent color `#d4af37` configured and usable via Tailwind classes
8. Test page demonstrates all design tokens (colors, typography, spacing)

---

## Story 1.9: Set Up shadcn/ui Component Library

**As a** developer,
**I want** to initialize shadcn/ui and install essential base components,
**so that** accessible, customizable UI components are available for rapid development.

### Acceptance Criteria

1. shadcn/ui CLI initialized (`npx shadcn-ui@latest init`)
2. Base components installed: Button, Input, Textarea, Select, Dialog, Card, Badge, Avatar
3. Components located in `/components/ui` with TypeScript types
4. Radix UI primitives installed as dependencies
5. `cn()` utility function configured for className merging
6. All components render correctly with design system tokens
7. Component variants (primary, secondary, destructive) work as expected
8. Accessibility features verified (keyboard nav, ARIA labels)

---

## Story 1.10: Create Health Check Landing Page and API Endpoint

**As a** developer and stakeholder,
**I want** a deployable health check landing page and `/api/health` endpoint,
**so that** we can verify the full stack (frontend, API, database, storage) is operational in production.

### Acceptance Criteria

1. Homepage (`app/page.tsx`) displays "Magazine Platform - Coming Soon" with branding
2. Health check API endpoint created at `app/api/health/route.ts`
3. Health endpoint checks: database connection (D1), MinIO bucket access, Redis database access
4. Health endpoint returns JSON: `{ status: 'ok', services: { db: 'connected', r2: 'connected', kv: 'connected' }, timestamp: '...' }`
5. Homepage styled with Tailwind and design system tokens
6. Responsive layout works on mobile, tablet, desktop
7. Page successfully deploys to VPS Docker deployment production
8. Health endpoint accessible at `https://yoursite.com/api/health` and returns 200 status

---

[← Back to Epic List](../05-epic-list.md) | [Next Epic: Authentication →](epic-02-authentication.md)
