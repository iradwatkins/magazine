# 8. Next Steps

[← Back to Index](index.md) | [Previous: Checklist Results](06-checklist-results.md)

---

## 8.1 Architect Prompt

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

## 8.2 UX Expert Prompt

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

---

[← Back to Index](index.md) | [Previous: Checklist Results](06-checklist-results.md)
