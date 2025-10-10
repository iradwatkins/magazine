# 8. Implementation Patterns

[← Back to Index](../index.md) | [← Previous: Database Schema](../07-database-schema.md) | [Next: Deployment & Infrastructure →](../09-deployment-infrastructure.md)

---

## Overview

This section covers the key implementation patterns used throughout the magazine platform. The patterns are organized into focused subsections for easier navigation.

## Subsections

### [Frontend Patterns](frontend-patterns.md)

Server Components, Client Components, and State Management strategies

- Server Components (Default)
- Client Components (Interactive UI)
- State Management with Zustand and TanStack Query

### [Backend Patterns](backend-patterns.md)

Server Actions and API patterns

- Server Actions for mutations
- Role-based authorization
- Request validation

### [Image Processing](image-processing.md)

Image optimization and transformation with Sharp

- Multi-format image generation
- Responsive image variants
- WebP optimization

### [MinIO Integration](minio-integration.md)

S3-compatible object storage implementation

- S3 client configuration
- File upload patterns
- Public access configuration

---

## Quick Reference

**State Management:**

- **Zustand** for editor state
- **TanStack Query** for server state
- **React Server State** by default

**Authentication:**

- NextAuth.js session-based
- Role-based authorization
- Server Action protection

**Media Processing:**

- Sharp for image optimization
- MinIO for storage
- Multi-variant generation

---

[← Back to Index](../index.md) | [← Previous: Database Schema](../07-database-schema.md) | [Next: Deployment & Infrastructure →](../09-deployment-infrastructure.md)
