# Magazine SteppersLife API Documentation

Complete REST API reference for the Magazine platform.

## Base URL

```
Development: http://localhost:3007/api
Production: https://magazine.stepperslife.com/api
```

## Authentication

All authenticated endpoints require a valid session cookie. Authenticate via:

- Magic Link (email)
- Google OAuth

Session cookies are shared across `.stepperslife.com` subdomains (SSO).

## Response Format

### Success Response

```json
{
  "data": {},
  "message": "Success message" // optional
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": {} // optional
}
```

## HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource doesn't exist      |
| 500  | Internal Server Error                   |

---

## Articles

### List Articles

```http
GET /api/articles
```

**Query Parameters:**

- `status` (string): Filter by status (DRAFT, SUBMITTED, APPROVED, PUBLISHED, REJECTED, ARCHIVED)
- `category` (string): Filter by category
- `authorId` (string): Filter by author
- `tag` (string): Filter by tag
- `search` (string): Search in title, content, excerpt
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response:**

```json
{
  "articles": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Create Article

```http
POST /api/articles
```

**Auth Required:** Writer+

**Request Body:**

```json
{
  "title": "Article Title",
  "content": "Article content...",
  "excerpt": "Short summary",
  "category": "NEWS",
  "featuredImageUrl": "https://...",
  "tags": ["tag1", "tag2"]
}
```

**Response:** `201 Created`

### Get Article

```http
GET /api/articles/:id
```

**Response:**

```json
{
  "article": {
    "id": "...",
    "title": "...",
    "content": "...",
    "author": {...},
    "comments": [...]
  }
}
```

### Update Article

```http
PUT /api/articles/:id
```

**Auth Required:** Author or Editor+

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt",
  "category": "CULTURE",
  "tags": ["updated", "tags"]
}
```

### Delete Article

```http
DELETE /api/articles/:id
```

**Auth Required:** Editor+

### Article Workflow

#### Submit for Review

```http
POST /api/articles/:id/submit
```

**Auth Required:** Author

#### Approve Article

```http
POST /api/articles/:id/approve
```

**Auth Required:** Editor+

**Request Body:**

```json
{
  "feedback": "Looks great!" // optional
}
```

#### Reject Article

```http
POST /api/articles/:id/reject
```

**Auth Required:** Editor+

**Request Body:**

```json
{
  "feedback": "Needs more work on..." // required
}
```

#### Publish Article

```http
POST /api/articles/:id/publish
```

**Auth Required:** Editor+

#### Unpublish Article

```http
DELETE /api/articles/:id/publish
```

**Auth Required:** Editor+

---

## Comments

### List Comments

```http
GET /api/comments
```

**Query Parameters:**

- `articleId` (string): Filter by article
- `authorId` (string): Filter by author
- `status` (string): Filter by status (PENDING, APPROVED, REJECTED, SPAM)
- `parentId` (string): Filter by parent comment (use "null" for top-level)
- `page` (number): Page number
- `limit` (number): Items per page
- `stats` (boolean): Return statistics only

**Response:**

```json
{
  "comments": [...],
  "pagination": {...}
}
```

### Create Comment

```http
POST /api/comments
```

**Auth Required:** Yes

**Request Body:**

```json
{
  "content": "Comment text...",
  "articleId": "article_id",
  "parentId": "parent_comment_id" // optional, for replies
}
```

**Response:** `201 Created` (comment starts as PENDING)

### Get Comment

```http
GET /api/comments/:id
```

### Update Comment

```http
PUT /api/comments/:id
```

**Auth Required:** Author or Moderator

**Request Body:**

```json
{
  "content": "Updated comment text..."
}
```

**Note:** Editing a comment resets it to PENDING status for re-moderation.

### Delete Comment

```http
DELETE /api/comments/:id
```

**Auth Required:** Author or Moderator

### Moderate Comment

```http
POST /api/comments/:id/moderate
```

**Auth Required:** Editor+

**Request Body:**

```json
{
  "action": "approve|reject|spam",
  "reason": "Rejection reason..." // required for reject
}
```

### Bulk Moderate Comments

```http
POST /api/comments/moderate/bulk
```

**Auth Required:** Editor+

**Request Body:**

```json
{
  "commentIds": ["id1", "id2", "id3"],
  "action": "approve|reject",
  "reason": "Reason..." // optional
}
```

---

## Writer Profiles

### List Writers

```http
GET /api/writers
```

**Query Parameters:**

- `q` (string): Search query (name, bio, expertise)
- `featured` (boolean): Get featured writers only
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**

```json
{
  "profiles": [
    {
      "userId": "...",
      "bio": "...",
      "expertise": ["topic1", "topic2"],
      "user": {...}
    }
  ],
  "pagination": {...}
}
```

### Get Writer Profile

```http
GET /api/writers/:userId
```

**Query Parameters:**

- `articles` (boolean): Include published articles
- `articlesPage` (number): Articles page number
- `articlesLimit` (number): Articles per page

**Response:**

```json
{
  "profile": {
    "userId": "...",
    "bio": "...",
    "website": "...",
    "twitter": "...",
    "expertise": [...],
    "stats": {
      "totalArticles": 42,
      "published": 40,
      "draft": 2
    }
  },
  "articles": {...} // if requested
}
```

### Update Writer Profile

```http
PUT /api/writers/:userId
```

**Auth Required:** Self or Admin

**Request Body:**

```json
{
  "bio": "Writer bio...",
  "website": "https://...",
  "twitter": "@handle",
  "linkedin": "profile-url",
  "instagram": "@handle",
  "facebook": "profile-url",
  "expertise": ["topic1", "topic2"],
  "specialties": ["specialty1"]
}
```

### Delete Writer Profile

```http
DELETE /api/writers/:userId
```

**Auth Required:** Self or Admin

---

## User Management (Admin)

### Get User Roles

```http
GET /api/admin/users/:userId/roles
```

**Auth Required:** Admin

**Response:**

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "roles": ["USER", "MAGAZINE_WRITER"]
  }
}
```

### Update User Roles

```http
PUT /api/admin/users/:userId/roles
```

**Auth Required:** Admin

**Request Body:**

```json
{
  "roles": ["USER", "MAGAZINE_WRITER", "MAGAZINE_EDITOR"]
}
```

**Note:** USER role is always included automatically.

### Add Role to User

```http
POST /api/admin/users/:userId/roles/add
```

**Auth Required:** Admin

**Request Body:**

```json
{
  "role": "MAGAZINE_EDITOR"
}
```

---

## Test Endpoints

### Test Authentication

```http
GET /api/test/protected
```

**Auth Required:** Yes

Returns current user information.

### Test Writer Access

```http
GET /api/test/writer-only
```

**Auth Required:** Writer+

### Test Admin Access

```http
GET /api/test/admin-only
```

**Auth Required:** Admin

---

## Article Categories

Available categories:

- `NEWS` - News and current events
- `CULTURE` - Culture and lifestyle
- `EVENTS` - Event coverage and previews
- `INTERVIEWS` - Interviews with community members
- `TUTORIALS` - How-to guides and tutorials
- `COMMUNITY` - Community stories and highlights
- `OPINION` - Opinion pieces and editorials

## Comment Status Flow

```
User posts comment → PENDING
                        ↓
              Moderator reviews
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
          APPROVED            REJECTED/SPAM
        (visible)            (hidden)
```

## Article Status Flow

```
Writer creates → DRAFT
                   ↓
     Writer submits → SUBMITTED
                         ↓
              Editor reviews
                         ↓
           ┌─────────────┴─────────────┐
           ↓                           ↓
       APPROVED                    REJECTED
           ↓                           ↓
    Editor publishes          Back to DRAFT
           ↓
      PUBLISHED → ARCHIVED (unpublished)
```

## Rate Limiting

_To be implemented_

## Pagination

All list endpoints support pagination:

- Default: 20 items per page
- Maximum: 100 items per page
- Use `page` and `limit` query parameters

## Error Codes

| Error                      | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `INVALID_INPUT`            | Request validation failed                      |
| `AUTH_REQUIRED`            | Authentication required                        |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions                |
| `NOT_FOUND`                | Resource not found                             |
| `ALREADY_EXISTS`           | Resource already exists (e.g., duplicate slug) |
| `SERVER_ERROR`             | Internal server error                          |

## Best Practices

1. **Always check HTTP status codes** before parsing response
2. **Handle authentication errors** (401) by redirecting to login
3. **Handle permission errors** (403) with user-friendly messages
4. **Use pagination** for large data sets
5. **Cache responses** where appropriate
6. **Validate input** before sending requests
7. **Use HTTPS** in production

## SDK/Client Examples

### JavaScript/TypeScript

```typescript
// Create article
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Article',
    content: '...',
    category: 'NEWS',
  }),
})

const { article } = await response.json()
```

### cURL

```bash
# List articles
curl https://magazine.stepperslife.com/api/articles?status=PUBLISHED

# Create comment (with auth cookie)
curl -X POST https://magazine.stepperslife.com/api/comments \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{"content":"Great article!","articleId":"123"}'
```

## Webhooks

_To be implemented_

Future webhook events:

- `article.published`
- `article.submitted`
- `comment.created`
- `comment.approved`

## API Versioning

Current version: **v1** (implicit)

Future versions will be accessible via: `/api/v2/...`

## Support

For API support:

- GitHub Issues: [Link to repo]
- Documentation: https://docs.magazine.stepperslife.com
- Email: dev@stepperslife.com
