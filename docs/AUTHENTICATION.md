# Authentication & Authorization Guide

## Overview

Magazine SteppersLife uses **NextAuth.js v5** for authentication with two primary methods:

- **Magic Link** (passwordless email authentication via Resend)
- **Google OAuth** (social login)

All authentication shares sessions across `.stepperslife.com` subdomains via SSO cookies.

## Authentication Methods

### 1. Magic Link (Email)

Users receive a one-time login link via email.

**Configuration:** [lib/auth.ts](../lib/auth.ts)

```typescript
EmailProvider({
  server: {
    host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com',
    port: 465,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY!,
    },
  },
  from: process.env.EMAIL_FROM,
})
```

**Required Environment Variables:**

```bash
RESEND_API_KEY=your_resend_api_key
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_FROM=noreply@stepperslife.com
```

### 2. Google OAuth

Users authenticate using their Google account.

**Configuration:** [lib/auth.ts](../lib/auth.ts)

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

**Required Environment Variables:**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://magazine.stepperslife.com/api/auth/callback/google`

## User Roles

The platform uses a hierarchical role system:

| Role              | Level | Permissions                        |
| ----------------- | ----- | ---------------------------------- |
| `USER`            | 0     | Basic access, can comment          |
| `MAGAZINE_WRITER` | 10    | Create and edit own articles       |
| `MAGAZINE_EDITOR` | 20    | Review, approve, publish articles  |
| `ADMIN`           | 100   | Full platform access, manage roles |

Users can have multiple roles. All users have at least the `USER` role.

## Role-Based Access Control (RBAC)

### Using RBAC in API Routes

**Method 1: Middleware Wrappers**

```typescript
import { withAuth, withRole, withAnyRole } from '@/lib/auth-middleware'

// Require authentication
export const GET = withAuth(async (req, session) => {
  // session.user is guaranteed to exist
  return NextResponse.json({ user: session.user })
})

// Require specific role
export const POST = withRole('ADMIN', async (req, session) => {
  // Only admins can access
  return NextResponse.json({ message: 'Admin action' })
})

// Require any of multiple roles
export const PUT = withAnyRole(['MAGAZINE_EDITOR', 'ADMIN'], async (req, session) => {
  // Editors and admins can access
  return NextResponse.json({ message: 'Editor action' })
})
```

**Method 2: Manual Checks**

```typescript
import { requireAuth, requireRole, requireEditor } from '@/lib/auth-middleware'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await requireAuth()

    // Check specific role
    await requireRole('MAGAZINE_WRITER')

    // Or use convenience functions
    await requireEditor() // Requires MAGAZINE_EDITOR or ADMIN

    // Your code here
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAuthError(error)
  }
}
```

### Using RBAC Utilities

```typescript
import {
  hasRole,
  hasAnyRole,
  isAdmin,
  isWriter,
  isEditor,
  ArticlePermissions,
  UserPermissions,
  CommentPermissions,
} from '@/lib/rbac'

// Check if user has a role
if (hasRole(userRoles, 'ADMIN')) {
  // User is admin
}

// Check if user has any of multiple roles
if (hasAnyRole(userRoles, ['MAGAZINE_EDITOR', 'ADMIN'])) {
  // User is editor or admin
}

// Convenience checks
if (isAdmin(userRoles)) {
  /* ... */
}
if (isWriter(userRoles)) {
  /* ... */
}
if (isEditor(userRoles)) {
  /* ... */
}

// Article permissions
if (ArticlePermissions.canCreate(userRoles)) {
  // User can create articles
}

if (ArticlePermissions.canEdit(userRoles, articleAuthorId, userId)) {
  // User can edit this specific article
}

if (ArticlePermissions.canPublish(userRoles)) {
  // User can publish articles
}

// User management permissions
if (UserPermissions.canManageRoles(userRoles)) {
  // User can manage other users' roles
}

// Comment permissions
if (CommentPermissions.canModerate(userRoles)) {
  // User can moderate comments
}
```

## Session Management

### Get Current Session

```typescript
import { auth } from '@/lib/auth'

// In Server Components
export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    return <div>Please login</div>
  }

  return <div>Welcome {session.user.name}</div>
}

// In API Routes
import { getSession } from '@/lib/auth-middleware'

export async function GET() {
  const session = await getSession()
  // session may be null if not authenticated
}
```

### Session Structure

```typescript
{
  user: {
    id: string           // User ID
    email: string        // User email
    name: string         // User name
    image?: string       // Profile picture
    roles: UserRole[]    // Array of roles
  },
  expires: string        // Session expiration
}
```

## SSO Cookie Configuration

Sessions are shared across `.stepperslife.com` subdomains:

```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      domain: '.stepperslife.com', // SSO across subdomains
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
    },
  },
}
```

This allows users to authenticate once and access:

- `stepperslife.com` (main site)
- `magazine.stepperslife.com` (magazine)
- `events.stepperslife.com` (events)
- `shop.stepperslife.com` (shop)

## Managing User Roles

### Admin API Endpoints

**Get User Roles:**

```bash
GET /api/admin/users/:userId/roles
Authorization: Admin role required
```

**Update User Roles:**

```bash
PUT /api/admin/users/:userId/roles
Content-Type: application/json
Authorization: Admin role required

{
  "roles": ["USER", "MAGAZINE_WRITER"]
}
```

**Add Role to User:**

```bash
POST /api/admin/users/:userId/roles/add
Content-Type: application/json
Authorization: Admin role required

{
  "role": "MAGAZINE_EDITOR"
}
```

### Programmatic Role Management

```typescript
import { prisma } from '@/lib/db'

// Add a role to user
await prisma.user.update({
  where: { id: userId },
  data: {
    roles: {
      push: 'MAGAZINE_WRITER',
    },
  },
})

// Set exact roles
await prisma.user.update({
  where: { id: userId },
  data: {
    roles: ['USER', 'MAGAZINE_WRITER', 'MAGAZINE_EDITOR'],
  },
})

// Remove all non-USER roles
await prisma.user.update({
  where: { id: userId },
  data: {
    roles: ['USER'],
  },
})
```

## Testing

Run authentication tests:

```bash
npx tsx scripts/test-auth.ts
```

Run RBAC tests:

```bash
npx tsx scripts/test-rbac.ts
```

Test endpoints:

- `GET /api/test/protected` - Requires authentication
- `GET /api/test/writer-only` - Requires WRITER role
- `GET /api/test/admin-only` - Requires ADMIN role

## Security Best Practices

1. **Never expose NEXTAUTH_SECRET** - Keep it secure and rotated
2. **Use HTTPS in production** - Required for secure cookies
3. **Validate all inputs** - Even with authentication
4. **Check permissions on every request** - Don't trust client-side checks
5. **Log authentication events** - Track failed login attempts
6. **Implement rate limiting** - Prevent brute force attacks
7. **Regular security audits** - Review roles and permissions

## Troubleshooting

### Authentication not working

- Check `NEXTAUTH_SECRET` is set and valid
- Verify `NEXTAUTH_URL` matches your domain
- Ensure cookies are enabled in browser
- Check database connection (sessions stored in DB)

### Google OAuth fails

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URI matches exactly in Google Console
- Ensure Google+ API is enabled

### Magic link not received

- Verify `RESEND_API_KEY` is valid
- Check `EMAIL_FROM` domain is verified in Resend
- Look in spam/junk folders
- Check Resend dashboard for delivery status

### Permission denied errors

- Verify user has correct roles in database
- Check role hierarchy requirements
- Ensure middleware is applied to route
- Review session data structure

## Next Steps

- [RBAC System Documentation](./RBAC.md)
- [API Reference](./API.md)
- [Database Schema](./DATABASE.md)
