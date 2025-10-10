# Epic 2: User Management & Authentication

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Foundation & Setup ←](epic-01-foundation.md) | [Next Epic: Content Model & Database Layer →](epic-03-content-model.md)

---

## Epic Goal

Implement a complete, secure authentication system with email/password and OAuth (Google, GitHub) support, role-based access control (Admin, Editor, Author), user profiles with bio and avatar, and protected admin dashboard routing. Enable team members to create accounts, log in securely, and access features based on their assigned roles, establishing the security foundation for all content management operations.

**Stories:** 10 | **Dependencies:** Epic 1 (Foundation & Setup)

---

## Story 2.1: Install and Configure NextAuth.js with Redis Adapter

**As a** developer,
**I want** to install NextAuth.js and configure it to use Redis for session storage,
**so that** we have a flexible authentication framework compatible with Next.js API routes.

### Acceptance Criteria

1. NextAuth.js installed with latest stable version
2. NextAuth.js API route created at `app/api/auth/[...nextauth]/route.ts`
3. Redis adapter configured for session storage
4. NextAuth configuration includes secret (environment variable `NEXTAUTH_SECRET`)
5. Session strategy set to JWT (compatible with edge runtime)
6. Auth configuration exported for reuse across app
7. Basic NextAuth pages accessible (sign-in, sign-out, error)
8. Test authentication flow completes without errors

---

## Story 2.2: Implement Email/Password Authentication with Credentials Provider

**As a** user,
**I want** to register and log in using my email address and password,
**so that** I can securely access the magazine platform.

### Acceptance Criteria

1. Credentials provider configured in NextAuth
2. User registration endpoint created at `app/api/auth/register/route.ts`
3. Password hashing implemented using bcrypt or Argon2
4. User schema includes: id, email (unique), password (hashed), name, role, createdAt
5. Registration validates email format and password strength (min 8 chars, complexity)
6. Login validates credentials against database
7. Failed login attempts logged (for rate limiting in future)
8. Successful login creates session and redirects to dashboard

---

## Story 2.3: Implement OAuth Authentication (Google and GitHub)

**As a** user,
**I want** to sign in using my Google or GitHub account,
**so that** I can quickly access the platform without creating a new password.

### Acceptance Criteria

1. Google OAuth provider configured with client ID and secret (environment variables)
2. GitHub OAuth provider configured with client ID and secret
3. OAuth callback URLs registered in Google and GitHub developer consoles
4. User profile created automatically on first OAuth login (email, name, image from provider)
5. OAuth users assigned default "Author" role
6. Existing users with same email can link OAuth accounts
7. OAuth login flow completes and redirects to dashboard
8. User profile image from OAuth provider displayed in UI

---

## Story 2.4: Implement Role-Based Access Control (RBAC) Middleware

**As a** developer,
**I want** to create middleware that enforces role-based access control,
**so that** users can only access features permitted by their role (Admin, Editor, Author).

### Acceptance Criteria

1. Middleware created at `middleware.ts` to protect routes
2. Protected routes: `/admin/*` require authentication
3. Role-based route protection: Admin can access all, Editor can manage content, Author can create own content
4. Unauthorized access redirects to sign-in page with return URL
5. Session validation checks user exists and role is valid
6. Helper functions created: `requireAuth()`, `requireRole(role)`, `isAuthorized(userId, resourceOwnerId)`
7. API routes protected with role checks (e.g., only Admin can delete users)
8. Unauthorized API requests return 403 Forbidden with error message

---

## Story 2.5: Create User Profile Schema and Database Migration

**As a** developer,
**I want** to extend the user schema with profile fields (bio, avatar, social links),
**so that** authors can showcase their identity and build credibility with readers.

### Acceptance Criteria

1. User schema extended with: bio (text), image (URL), socialLinks (JSON: twitter, instagram, linkedin)
2. Database migration created and applied successfully
3. User profile endpoints created: `GET /api/users/[id]`, `PUT /api/users/[id]`
4. Users can update their own profile (name, bio, image, social links)
5. Admins can update any user profile
6. Image URL validation ensures proper format
7. Social links validated for correct URL structure
8. Profile updates reflected immediately in UI

---

## Story 2.6: Build User Registration and Login Pages

**As a** user,
**I want** dedicated, accessible registration and login pages,
**so that** I can easily create an account or sign in to the platform.

### Acceptance Criteria

1. Registration page created at `app/(auth)/register/page.tsx`
2. Login page created at `app/(auth)/login/page.tsx`
3. Both pages use shadcn/ui components (Input, Button, Card)
4. Registration form includes: email, password, confirm password, name
5. Login form includes: email, password, "Remember me" checkbox
6. OAuth buttons for Google and GitHub displayed prominently
7. Form validation with error messages (inline and toast notifications)
8. Successful registration/login redirects to `/admin/dashboard`
9. "Forgot password?" link present (functionality deferred to post-MVP)
10. Responsive design works on mobile and desktop
11. Accessibility: keyboard navigation, ARIA labels, screen reader support

---

## Story 2.7: Build User Profile Settings Page

**As a** user,
**I want** a profile settings page where I can update my information,
**so that** I can manage my account details, bio, and social links.

### Acceptance Criteria

1. Profile settings page created at `app/(admin)/profile/page.tsx`
2. Form fields: name, email (read-only), bio (textarea), profile image URL, social links (Twitter, Instagram, LinkedIn)
3. Avatar preview displays current profile image
4. Form uses React Hook Form with Zod validation
5. Submit button saves changes via `PUT /api/users/[id]` endpoint
6. Success message displayed after save
7. Unsaved changes warning if user navigates away
8. Form is accessible and responsive
9. Only authenticated users can access this page

---

## Story 2.8: Build Admin User Management Interface

**As an** Admin,
**I want** an admin interface to view, create, edit, and delete users,
**so that** I can manage team members and assign appropriate roles.

### Acceptance Criteria

1. User management page created at `app/(admin)/users/page.tsx`
2. Table displays all users: name, email, role, created date, actions
3. Table supports sorting by name, email, role, created date
4. Search functionality filters users by name or email
5. Role filter dropdown (All, Admin, Editor, Author)
6. "Add User" button opens modal to create new user (email, name, role, password)
7. Inline "Edit" action opens modal to update user role, name
8. Inline "Delete" action shows confirmation dialog before soft delete
9. Only Admins can access this page (role check in middleware)
10. Pagination for large user lists (20 users per page)

---

## Story 2.9: Create Protected Admin Layout with Navigation

**As an** authenticated user,
**I want** a consistent admin dashboard layout with navigation sidebar,
**so that** I can easily access different sections of the CMS.

### Acceptance Criteria

1. Admin layout created at `app/(admin)/layout.tsx`
2. Layout includes: sidebar navigation, header with user menu, main content area
3. Sidebar navigation links: Dashboard, Articles, Media, Categories, Users (Admin only), Profile, Settings
4. Active route highlighted in navigation
5. User menu in header displays: avatar, name, role
6. User menu dropdown: Profile, Sign Out
7. Mobile responsive: hamburger menu for navigation on small screens
8. Unauthenticated users redirected to login page
9. Layout uses design system colors and typography

---

## Story 2.10: Implement Session Management and Logout Functionality

**As a** user,
**I want** to securely log out of my account,
**so that** my session is terminated and no one else can access my account from this device.

### Acceptance Criteria

1. Logout button in user menu triggers NextAuth `signOut()` function
2. Logout clears session from Redis
3. Logout redirects user to homepage or login page
4. JWT token invalidated (cannot be reused)
5. Session expiry configured (e.g., 7 days for "Remember me", 24 hours otherwise)
6. Expired sessions automatically redirect to login
7. "Sign in" button visible on public pages when not authenticated
8. Session refresh works correctly (silent re-authentication)

---

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Foundation & Setup ←](epic-01-foundation.md) | [Next Epic: Content Model & Database Layer →](epic-03-content-model.md)
