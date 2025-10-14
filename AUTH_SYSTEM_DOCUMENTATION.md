# SteppersLife Magazine - Authentication System Documentation

## Status: ✅ FULLY OPERATIONAL

Last Verified: October 14, 2025
URL: https://magazine.stepperslife.com

---

## Overview

The authentication system has been completely rebuilt and is now fully functional. The system uses NextAuth.js with JWT sessions for reliable, scalable authentication.

## Key Features

### Authentication Methods
1. **Google OAuth** - Sign in with Google account
2. **Magic Link Email** - Passwordless email authentication via Resend

### Session Management
- **Type**: JWT (JSON Web Tokens)
- **Duration**: 30 days
- **Storage**: Secure HTTP-only cookies

### Security Features
- All protected routes redirect to sign-in when unauthenticated
- API endpoints return 401/307 for unauthorized requests
- Role-based access control (RBAC) implemented
- CSRF protection enabled

---

## Admin Users

The following users have ADMIN privileges:

| Email | Role | Auth Method |
|-------|------|-------------|
| iradwatkins@gmail.com | ADMIN | Google OAuth |
| bobbygwaatkins@gmail.com | ADMIN | Email/Google |
| ira@irawatkins.com | ADMIN | Email |

---

## How to Login

### Method 1: Google OAuth
1. Navigate to https://magazine.stepperslife.com/sign-in
2. Click "Continue with Google"
3. Sign in with iradwatkins@gmail.com
4. You'll be redirected to the dashboard

### Method 2: Magic Link
1. Navigate to https://magazine.stepperslife.com/sign-in
2. Enter your email address
3. Click "Send Magic Link"
4. Check your email for the login link
5. Click the link to authenticate

---

## Protected Routes

The following routes require authentication:

- `/dashboard` - Admin dashboard
- `/articles` - Article management
- `/editor/new` - Create new article
- `/editor/[id]` - Edit article
- `/media` - Media library
- `/comments/moderate` - Comment moderation

---

## API Endpoints

### Public Endpoints
- `GET /api/public/articles` - List published articles
- `GET /api/auth/*` - Authentication endpoints

### Protected Endpoints
- `POST /api/articles` - Create article (requires writer role)
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article (requires editor role)
- `GET /api/dashboard` - Dashboard data
- `POST /api/media/upload` - Upload media

---

## Role Permissions

| Role | Capabilities |
|------|-------------|
| USER | View published articles, comment |
| MAGAZINE_WRITER | Create and edit own articles |
| MAGAZINE_EDITOR | Edit all articles, moderate comments |
| ADMIN | Full system access |

---

## Configuration Files

### Core Authentication Files
- `/lib/auth.ts` - NextAuth configuration
- `/lib/auth-middleware.ts` - Authentication helpers
- `/middleware.ts` - Route protection middleware
- `/app/sign-in/page.tsx` - Sign-in page UI

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://magazine.stepperslife.com"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Email (Resend)
RESEND_API_KEY="your-api-key"
EMAIL_FROM="noreply@stepperslife.com"
```

---

## Testing Results

All authentication tests have passed successfully:

- ✅ Database connection verified
- ✅ Admin users configured
- ✅ NextAuth providers operational
- ✅ Protected routes redirect correctly
- ✅ API endpoints secured
- ✅ Sign-in page fully functional

### Test Commands

```bash
# Test 1: Basic authentication flow
node test-login-attempt1.js

# Test 2: Route protection
./test-login-attempt2.sh

# Test 3: Final verification
node test-login-attempt3.js
```

---

## Troubleshooting

### Cannot Login
1. Verify you're using a registered admin email
2. Check browser cookies are enabled
3. Ensure you're accessing via HTTPS

### Session Issues
1. Clear browser cookies for the domain
2. Try incognito/private browsing mode
3. Check JWT expiration (30 days)

### Google OAuth Issues
1. Verify Google credentials in .env
2. Check authorized redirect URIs in Google Console
3. Ensure callback URL is https://magazine.stepperslife.com/api/auth/callback/google

### Magic Link Issues
1. Check Resend API key is valid
2. Verify email is not in spam folder
3. Ensure link hasn't expired (24 hours)

---

## Summary

The authentication system is fully operational and ready for production use. All three test attempts have verified:

1. ✅ Login functionality works correctly
2. ✅ Dashboard is accessible after authentication
3. ✅ Article creation requires proper permissions
4. ✅ All protected routes are secured

The system has been simplified from the previous complex SSO configuration to a reliable JWT-based approach that works consistently.

---

## Contact

For issues or questions about the authentication system:
- Admin: iradwatkins@gmail.com
- Platform: SteppersLife Magazine
- URL: https://magazine.stepperslife.com