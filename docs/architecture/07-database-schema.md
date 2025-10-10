# 7. Database Schema

[← Back to Index](index.md) | [← Previous: Component Architecture](06-component-architecture.md) | [Next: Implementation Patterns →](08-implementation-patterns/index.md)

---

## 7.1 Complete Prisma Schema

See full schema in Section 7 (abbreviated here for document length).

**Key Tables:**

- `users` - Magazine users (isolated from other sites)
- `articles` - Magazine articles
- `content_blocks` - Drag-and-drop blocks
- `media` - MinIO-stored files
- `categories` - Article categories
- `tags` - Article tags
- `article_tags` - Junction table
- `article_views` - Analytics

**Database:** `magazine-postgres` container (PostgreSQL 16)

## 7.2 Seed Data

Default categories:

1. Culture & Arts
2. Business & Entrepreneurship
3. Lifestyle & Wellness
4. Community & Events
5. Fashion & Beauty
6. Technology & Innovation

---

[← Back to Index](index.md) | [← Previous: Component Architecture](06-component-architecture.md) | [Next: Implementation Patterns →](08-implementation-patterns/index.md)
