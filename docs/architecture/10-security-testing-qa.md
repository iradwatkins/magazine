# 10. Security, Testing & Quality Assurance

[← Back to Index](index.md) | [← Previous: Deployment & Infrastructure](09-deployment-infrastructure.md) | [Next: Conclusion →](11-conclusion.md)

---

## 10.1 Security Strategy

### 10.1.1 Authentication & Authorization

**NextAuth.js with Role-Based Access Control:**

```typescript
export async function requireRole(allowedRoles: string[]) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const hasRole = session.user.roles.some((role: string) => allowedRoles.includes(role))

  if (!hasRole) {
    throw new Error('Forbidden')
  }

  return session
}
```

**Magazine Roles:**

- `MAGAZINE_WRITER` - Can create and edit own articles
- `MAGAZINE_EDITOR` - Can publish any article
- `ADMIN` - Full access

### 10.1.2 Input Validation

**Zod Schemas:**

```typescript
export const createArticleSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  subtitle: z.string().max(300).trim().optional(),
  categoryId: z.string().cuid(),
  tags: z.array(z.string()).max(10).optional(),
  seoTitle: z.string().max(60).trim().optional(),
  seoDescription: z.string().max(160).trim().optional(),
})
```

### 10.1.3 File Upload Security

**Validation:**

- File size limit: 10MB
- MIME type validation
- Magic byte verification
- SVG sanitization (no scripts)

### 10.1.4 Rate Limiting

**Redis-based (magazine-redis):**

- Public API: 100 req/15min
- Authenticated: 500 req/15min
- Media upload: 20 uploads/hour

### 10.1.5 Security Headers

**Next.js Configuration:**

```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
    ]
  }];
}
```

## 10.2 Testing Strategy

### 10.2.1 Unit Testing (Vitest)

**Example:**

```typescript
describe('generateSlug', () => {
  it('should convert title to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })
})
```

### 10.2.2 Component Testing (React Testing Library)

**Example:**

```typescript
describe('ArticleCard', () => {
  it('should render article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

### 10.2.3 E2E Testing (Playwright)

**Example:**

```typescript
test('should create new article draft', async ({ page }) => {
  await page.goto('/articles/new')
  await page.fill('input[name="title"]', 'My Test Article')
  await page.click('button:has-text("Save Draft")')
  await expect(page.locator('text=Draft saved')).toBeVisible()
})
```

## 10.3 Code Quality

**Tools:**

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- Husky for pre-commit hooks

## 10.4 Security Checklist

- ✅ Authentication via NextAuth.js
- ✅ Role-based authorization (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React, DOMPurify)
- ✅ CSRF protection (Server Actions)
- ✅ Rate limiting (Redis)
- ✅ File upload validation
- ✅ Security headers
- ✅ HTTPS (Let's Encrypt)
- ✅ Isolated infrastructure
- ✅ Automated backups

---

[← Back to Index](index.md) | [← Previous: Deployment & Infrastructure](09-deployment-infrastructure.md) | [Next: Conclusion →](11-conclusion.md)
