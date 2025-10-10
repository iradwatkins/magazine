# Epic 3: Content Model & Database Layer

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: User Management & Authentication ←](epic-02-authentication.md) | [Next Epic: Media Management & MinIO Integration →](epic-04-media-management.md)

---

## Epic Goal

Create the complete data models and database schema for the magazine platform's core content entities (Articles, Blocks, Categories, Tags, ArticleTags junction table) with full CRUD API endpoints, database migrations, and comprehensive validation. Establish the foundational content architecture that all UI features will build upon, ensuring data integrity and efficient querying patterns.

**Stories:** 10 | **Dependencies:** Epic 1 (Foundation & Setup)

---

## Story 3.1: Define Article Schema and Create Database Migration

**As a** developer,
**I want** to define the Article data model with all required fields and relationships,
**so that** we have a robust schema for storing magazine articles with metadata.

### Acceptance Criteria

1. Article schema defined in `/db/schema.ts` with fields: id (UUID), title, slug (unique), subtitle, excerpt, featuredImage, featuredImageAlt, status (DRAFT/PUBLISHED), publishedAt, authorId (FK to users), categoryId (FK to categories), seoTitle, seoDescription, canonicalUrl, viewCount, likeCount, createdAt, updatedAt
2. Status enum defined: DRAFT, PUBLISHED
3. Foreign key constraints: authorId references users.id, categoryId references categories.id
4. Indexes created: slug (unique), status + publishedAt (composite), authorId, categoryId
5. Database migration generated using Prisma Kit
6. Migration applied successfully to PostgreSQL database
7. Schema documented with JSDoc comments
8. Article type exported from schema for TypeScript usage

---

## Story 3.2: Define Block Schema for Article Content Blocks

**As a** developer,
**I want** to define the Block data model to store article content as structured blocks,
**so that** the drag-and-drop editor can save and render flexible content layouts.

### Acceptance Criteria

1. Block schema defined with fields: id (UUID), type (text), data (JSON), order (integer), articleId (FK to articles), createdAt, updatedAt
2. Block types documented: heading, paragraph, image, quote, list, divider
3. JSON data field stores block-specific properties (e.g., heading level, image URL, caption)
4. Foreign key constraint: articleId references articles.id with CASCADE delete
5. Composite index on (articleId, order) for efficient block retrieval
6. Database migration generated and applied
7. Block type union exported for TypeScript validation
8. Example block data structures documented in comments

---

## Story 3.3: Define Category and Tag Schemas

**As a** developer,
**I want** to define Category and Tag data models for content organization,
**so that** articles can be categorized and tagged for discovery and filtering.

### Acceptance Criteria

1. Category schema defined with fields: id (UUID), name (unique), slug (unique), description, image, parentId (self-reference for hierarchy), createdAt, updatedAt
2. Tag schema defined with fields: id (UUID), name (unique), slug (unique), createdAt
3. ArticleTag junction table defined with: articleId (FK), tagId (FK), composite primary key
4. Indexes created: category slug (unique), tag slug (unique), tag name
5. Foreign key constraints with CASCADE delete on junction table
6. Database migration generated and applied
7. Category and Tag types exported for TypeScript
8. Self-referencing parentId enables category hierarchy (future feature)

---

## Story 3.4: Implement Article CRUD API Endpoints

**As a** developer,
**I want** full CRUD API endpoints for articles,
**so that** the frontend can create, read, update, and delete articles.

### Acceptance Criteria

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

---

## Story 3.5: Implement Block CRUD Operations within Articles

**As a** developer,
**I want** API endpoints to manage blocks within an article,
**so that** the editor can add, reorder, update, and delete content blocks.

### Acceptance Criteria

1. `POST /api/articles/[id]/blocks` - Add new block to article at specified position
2. `PUT /api/articles/[id]/blocks/[blockId]` - Update block data
3. `PUT /api/articles/[id]/blocks/reorder` - Reorder blocks (accepts array of { blockId, order })
4. `DELETE /api/articles/[id]/blocks/[blockId]` - Delete block
5. All operations validate user permissions (owner or editor+)
6. Block order automatically recalculated on add/delete
7. Zod schema validates block data based on block type
8. Blocks returned in correct order (sorted by order field)

---

## Story 3.6: Implement Category CRUD API Endpoints

**As a** developer,
**I want** full CRUD API endpoints for categories,
**so that** admins can manage content categories.

### Acceptance Criteria

1. `POST /api/categories` - Create category (authenticated, admin/editor)
2. `GET /api/categories` - List all categories (public)
3. `GET /api/categories/[id]` - Get single category by ID (public)
4. `GET /api/categories/slug/[slug]` - Get category by slug (public)
5. `PUT /api/categories/[id]` - Update category (authenticated, admin/editor)
6. `DELETE /api/categories/[id]` - Delete category if no articles assigned (authenticated, admin)
7. Slug auto-generated from name if not provided
8. Validation prevents duplicate names or slugs
9. API returns category with article count

---

## Story 3.7: Implement Tag CRUD API Endpoints

**As a** developer,
**I want** full CRUD API endpoints for tags,
**so that** authors can create and manage tags for article categorization.

### Acceptance Criteria

1. `POST /api/tags` - Create tag (authenticated, author+)
2. `GET /api/tags` - List all tags with search/autocomplete (public)
3. `GET /api/tags/[id]` - Get single tag (public)
4. `PUT /api/tags/[id]` - Update tag name/slug (authenticated, admin/editor)
5. `DELETE /api/tags/[id]` - Delete tag and remove associations (authenticated, admin)
6. `POST /api/articles/[id]/tags` - Assign tags to article (accepts array of tag IDs or names, creates new tags if needed)
7. `DELETE /api/articles/[id]/tags/[tagId]` - Remove tag from article
8. Slug auto-generated from name if not provided
9. GET /api/tags supports search query parameter for autocomplete

---

## Story 3.8: Implement Slug Generation and Uniqueness Validation

**As a** developer,
**I want** automatic URL-friendly slug generation with uniqueness guarantees,
**so that** all articles, categories, and tags have clean, SEO-friendly URLs.

### Acceptance Criteria

1. Slug utility function created: `generateSlug(text: string): string`
2. Slug generation removes special characters, converts to lowercase, replaces spaces with hyphens
3. Slug uniqueness check function: `ensureUniqueSlug(slug: string, type: 'article' | 'category' | 'tag'): Promise<string>`
4. If slug exists, append numeric suffix (e.g., `article-title-2`)
5. Slug validation regex ensures valid URL characters only
6. Maximum slug length enforced (e.g., 100 characters)
7. Slug generation called automatically on article/category/tag creation if slug not provided
8. Slug immutable after creation (prevents broken links)

---

## Story 3.9: Implement Article View Count Tracking

**As a** product manager,
**I want** to track article view counts,
**so that** we can identify popular content and measure engagement.

### Acceptance Criteria

1. `POST /api/articles/[id]/view` endpoint increments viewCount
2. View tracking called on article page load (client-side)
3. View count incremented atomically (prevents race conditions)
4. View tracking rate-limited per IP/session (1 view per hour per article)
5. View count displayed on article cards and detail pages
6. Top articles query: `GET /api/articles?sort=views&limit=10`
7. View tracking works in both development and production
8. View count persisted in PostgreSQL database

---

## Story 3.10: Create Database Seeding Script with Sample Data

**As a** developer,
**I want** a database seeding script that populates sample articles, categories, and tags,
**so that** I can test the application with realistic data during development.

### Acceptance Criteria

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

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: User Management & Authentication ←](epic-02-authentication.md) | [Next Epic: Media Management & MinIO Integration →](epic-04-media-management.md)
