# 5. API Specification

[← Back to Index](index.md) | [← Previous: Data Models](04-data-models.md) | [Next: Component Architecture →](06-component-architecture.md)

---

## 5.1 API Architecture Pattern

**Approach:** Hybrid API using Next.js App Router patterns:

- **Server Actions** for mutations (create, update, delete)
- **API Routes** for third-party integrations and webhooks
- **React Server Components** for data fetching (no API needed)

**Base URL:** `https://magazine.stepperslife.com`

**Authentication:** NextAuth.js session-based authentication

## 5.2 API Endpoints Overview

| Category       | Endpoint                        | Method | Auth | Purpose                 |
| -------------- | ------------------------------- | ------ | ---- | ----------------------- |
| **Articles**   | `/api/articles`                 | GET    | No   | List published articles |
|                | `/api/articles/[slug]`          | GET    | No   | Get single article      |
|                | `/api/articles/[id]/views`      | POST   | No   | Increment view count    |
|                | Server Action: `createArticle`  | -      | Yes  | Create article          |
|                | Server Action: `updateArticle`  | -      | Yes  | Update article          |
|                | Server Action: `publishArticle` | -      | Yes  | Publish article         |
| **Media**      | `/api/media/upload`             | POST   | Yes  | Upload to MinIO         |
|                | `/api/media`                    | GET    | Yes  | List media library      |
|                | `/api/media/[id]`               | DELETE | Yes  | Delete media            |
| **Categories** | `/api/categories`               | GET    | No   | List categories         |
| **Tags**       | `/api/tags`                     | GET    | No   | List tags               |
|                | `/api/tags/search`              | GET    | No   | Autocomplete search     |
| **Health**     | `/api/health`                   | GET    | No   | Health check            |

## 5.3 Rate Limiting

**Redis-based rate limiting (magazine-redis container):**

| Endpoint Type     | Rate Limit   | Window     |
| ----------------- | ------------ | ---------- |
| Public API        | 100 requests | 15 minutes |
| Authenticated API | 500 requests | 15 minutes |
| Media Upload      | 20 uploads   | 1 hour     |
| Server Actions    | 100 actions  | 5 minutes  |

---

[← Back to Index](index.md) | [← Previous: Data Models](04-data-models.md) | [Next: Component Architecture →](06-component-architecture.md)
