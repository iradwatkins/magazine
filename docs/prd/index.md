# Product Requirements Document (PRD)

## Online Magazine Platform - Comprehensive MVP

**Version:** 1.1
**Date:** October 9, 2025
**Product Manager:** John (PM Agent)
**Product Owner:** Sarah (PO Agent)
**Status:** Architecture Aligned - Ready for Development

---

## Document Navigation

This PRD has been sharded into focused sections for easier navigation and development team consumption. Each section is self-contained with complete context.

### Core Documentation

1. **[Goals and Background Context](01-goals-and-context.md)**
   - Product goals and vision
   - Background context and market need
   - Change log and version history

2. **[Requirements](02-requirements.md)**
   - Functional Requirements (FR1-FR94)
   - Non-Functional Requirements (NFR1-NFR21)
   - Complete system requirements catalog

3. **[User Interface Design Goals](03-ui-ux-design.md)**
   - Overall UX vision
   - Key interaction paradigms
   - Core screens and views
   - Accessibility requirements (WCAG 2.1 AA)
   - Branding guidelines
   - Target devices and platforms

4. **[Technical Assumptions](04-technical-assumptions.md)**
   - Repository structure (Monorepo)
   - Service architecture (Self-hosted stack)
   - Testing requirements
   - Additional technical assumptions

5. **[Epic List Overview](05-epic-list.md)**
   - Summary of all 9 epics
   - Epic dependencies and sequencing
   - Quick reference guide

### Epic Details (Micro-Sharded)

Each epic has been extracted into its own file with all associated stories for focused development work:

6. **[Epic 1: Foundation & Core Infrastructure](epics/epic-01-foundation.md)** (10 stories)
   - Project initialization and Docker setup
   - PostgreSQL, MinIO, Redis configuration
   - CI/CD pipeline and development tooling

7. **[Epic 2: User Management & Authentication](epics/epic-02-authentication.md)** (11 stories)
   - NextAuth.js setup with Redis
   - Email/password and OAuth authentication
   - Role-Based Access Control (RBAC)
   - User profiles and session management

8. **[Epic 3: Content Model & Database Layer](epics/epic-03-content-model.md)** (11 stories)
   - Article, Category, Tag schemas
   - Database migrations
   - Prisma repository patterns
   - Content versioning

9. **[Epic 4: Media Management & MinIO Integration](epics/epic-04-media-management.md)** (11 stories)
   - MinIO bucket configuration
   - Image upload and optimization (Sharp)
   - Media library UI
   - CDN integration

10. **[Epic 5: Drag-and-Drop Article Editor](epics/epic-05-article-editor.md)** (14 stories)
    - TipTap editor integration
    - Content block system (Heading, Paragraph, Image, Quote, List, Divider)
    - Drag-and-drop functionality (@dnd-kit)
    - Auto-save and undo/redo

11. **[Epic 6: Article Management Dashboard](epics/epic-06-article-dashboard.md)** (12 stories)
    - Article listing with filters
    - Create/edit/delete workflows
    - SEO metadata management
    - Publishing workflow

12. **[Epic 7: Reader Experience - Public Site](epics/epic-07-reader-experience.md)** (12 stories)
    - Homepage with featured articles
    - Article detail pages
    - Category and tag pages
    - Search functionality
    - Responsive design

13. **[Epic 8: Category & Tag Management](epics/epic-08-category-tags.md)** (13 stories)
    - Category CRUD operations
    - Tag auto-suggest and management
    - Category pages and navigation
    - Tag merging and cleanup

14. **[Epic 9: Production Readiness & Polish](epics/epic-09-production-polish.md)** (8 stories)
    - Performance optimization
    - Error handling and logging
    - Security hardening
    - Production deployment
    - Monitoring and analytics

### Supporting Documentation

15. **[Checklist Results Report](06-checklist-results.md)**
    - PM Agent validation results
    - Completeness assessment
    - Quality checks

16. **[Next Steps](07-next-steps.md)**
    - Development priorities
    - Post-MVP considerations
    - Success metrics

---

## Quick Stats

- **Total Epics:** 9
- **Total Stories:** 92
- **Infrastructure:** Self-hosted (PostgreSQL, MinIO, Redis, Docker/VPS)
- **Frontend:** Next.js 15.5.4, React 19.2.0, TypeScript 5.x
- **Deployment:** Port 3007 (magazine.stepperslife.com)

---

## Version History

| Date       | Version       | Description                                                           | Author           |
| ---------- | ------------- | --------------------------------------------------------------------- | ---------------- |
| 2025-10-09 | 1.0           | Initial comprehensive MVP PRD created using BMAD methodology          | John (PM Agent)  |
| 2025-10-09 | 1.1           | Updated technical stack from Cloudflare to self-hosted infrastructure | Sarah (PO Agent) |
| 2025-10-09 | 1.1 (sharded) | Document sharded for development team consumption                     | Sarah (PO Agent) |

---

## Document Structure

```
docs/prd/
├── index.md                          # This file - main navigation
├── 01-goals-and-context.md          # Goals, background, changelog
├── 02-requirements.md                # FR + NFR catalog
├── 03-ui-ux-design.md               # UX vision and design goals
├── 04-technical-assumptions.md      # Architecture and tech stack
├── 05-epic-list.md                  # Epic summary overview
├── epics/
│   ├── epic-01-foundation.md        # Foundation epic with all stories
│   ├── epic-02-authentication.md    # Authentication epic with all stories
│   ├── epic-03-content-model.md     # Content model epic with all stories
│   ├── epic-04-media-management.md  # Media management epic with all stories
│   ├── epic-05-article-editor.md    # Article editor epic with all stories
│   ├── epic-06-article-dashboard.md # Article dashboard epic with all stories
│   ├── epic-07-reader-experience.md # Reader experience epic with all stories
│   ├── epic-08-category-tags.md     # Category/tag epic with all stories
│   └── epic-09-production-polish.md # Production polish epic with all stories
├── 06-checklist-results.md          # Validation results
└── 07-next-steps.md                 # Next steps and priorities
```

---

**Note:** This is a sharded version of the complete PRD. All sections maintain full context and can be read independently. Cross-references between sections use relative links for seamless navigation.
