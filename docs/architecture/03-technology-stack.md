# 3. Technology Stack

[← Back to Index](index.md) | [← Previous: High-Level Architecture](02-high-level-architecture.md) | [Next: Data Models →](04-data-models.md)

---

## 3.1 Frontend Stack

| Technology         | Version | Purpose                         | Rationale                                 |
| ------------------ | ------- | ------------------------------- | ----------------------------------------- |
| **Next.js**        | 15.5.4  | React framework with App Router | Full-stack framework, SSR/SSG, API routes |
| **React**          | 19.2.0  | UI library                      | Latest version, RSC, improved performance |
| **TypeScript**     | 5.x     | Type-safe JavaScript            | Compile-time safety, better DX            |
| **Tailwind CSS**   | 4.x     | Utility-first CSS               | Rapid styling, consistent design          |
| **Shadcn/ui**      | Latest  | Component system                | Accessible, customizable, Radix UI        |
| **TanStack Query** | v5      | Data fetching & caching         | Cache management, optimistic updates      |
| **Framer Motion**  | Latest  | Animation library               | Smooth animations for editor              |
| **Lucide React**   | Latest  | Icon library                    | Consistent icons, tree-shakeable          |
| **Zod**            | Latest  | Schema validation               | Type-safe validation, form handling       |
| **TipTap**         | Latest  | Rich text editor                | ProseMirror-based, extensible, WYSIWYG    |
| **@dnd-kit**       | Latest  | Drag-and-drop                   | Accessible drag-and-drop for blocks       |
| **Zustand**        | Latest  | Client state management         | Lightweight, simple API                   |

## 3.2 Backend Stack

| Technology             | Version       | Purpose             | Rationale                                |
| ---------------------- | ------------- | ------------------- | ---------------------------------------- |
| **Node.js**            | 20.x LTS      | JavaScript runtime  | Required for Next.js, stable LTS         |
| **Next.js API Routes** | 15.x          | Backend API         | Co-located with frontend                 |
| **NextAuth.js**        | 5.0.0-beta.29 | Authentication      | OAuth + credentials, session management  |
| **Prisma**             | Latest        | ORM & migrations    | Type-safe DB client, PostgreSQL support  |
| **PostgreSQL**         | 16            | Primary database    | Relational DB, JSONB, full-text search   |
| **Redis**              | 7.x           | Caching & sessions  | Fast key-value store, rate limiting      |
| **MinIO**              | Latest        | Object storage      | S3-compatible, self-hosted, isolated     |
| **Sharp**              | Latest        | Image processing    | Fast image optimization, WebP conversion |
| **Resend**             | Latest        | Transactional email | Modern email API                         |

## 3.3 Infrastructure & DevOps

| Technology         | Version | Purpose                       | Rationale                              |
| ------------------ | ------- | ----------------------------- | -------------------------------------- |
| **Docker**         | Latest  | Containerization              | Isolated environments, easy deployment |
| **Docker Compose** | Latest  | Multi-container orchestration | Local dev, service dependencies        |
| **Nginx**          | Latest  | Reverse proxy                 | SSL termination, routing to port 3007  |
| **GitHub Actions** | N/A     | CI/CD pipeline                | Automated testing, deployment          |
| **VPS**            | N/A     | Hosting platform              | Self-hosted, full control              |

## 3.4 Development Tools

| Tool                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| **ESLint**                | Code linting and style enforcement |
| **Prettier**              | Code formatting                    |
| **Husky**                 | Git hooks for pre-commit checks    |
| **Vitest**                | Unit testing framework             |
| **Playwright**            | E2E testing                        |
| **React Testing Library** | Component testing                  |

---

[← Back to Index](index.md) | [← Previous: High-Level Architecture](02-high-level-architecture.md) | [Next: Data Models →](04-data-models.md)
