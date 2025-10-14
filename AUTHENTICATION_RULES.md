# AUTHENTICATION SYSTEM RULES - NEVER BREAK THESE

**⚠️ CRITICAL: This document contains non-negotiable rules learned from a 4-DAY authentication debugging nightmare.**

## The Problem We Had (October 2025)
- Login appeared to work but immediately kicked users out
- HTTP2_SERVER_REFUSED_STREAM errors caused session loss
- Users could not access dashboard or editor
- NextAuth's default session endpoint conflicted with HTTP2
- Took 4 DAYS to fix

## RULES THAT MUST NEVER BE BROKEN

### Rule #1: NEVER Use NextAuth's Default Session Provider with HTTP2
**WHY**: NextAuth's `/api/auth/session` endpoint causes `ERR_HTTP2_SERVER_REFUSED_STREAM` errors when polled frequently.

**SOLUTION**: Always use our custom HybridSessionProvider
```typescript
// ✅ CORRECT - Use this
import { HybridSessionProvider } from '@/components/auth/hybrid-session-provider'

// ❌ NEVER DO THIS
import { SessionProvider } from 'next-auth/react'
```

**File Location**: `/components/auth/hybrid-session-provider.tsx`

---

### Rule #2: Session Checks MUST Use Custom Endpoint
**WHY**: The custom endpoint doesn't trigger HTTP2 errors.

**SOLUTION**: All session checks go through `/api/auth/session-check`
```typescript
// ✅ CORRECT
fetch('/api/auth/session-check', {
  method: 'GET',
  credentials: 'include'
})

// ❌ NEVER DO THIS
fetch('/api/auth/session', { ... })
```

**File Location**: `/app/api/auth/session-check/route.ts`

---

### Rule #3: Google OAuth Configuration - Use Exact Settings
**WHY**: Incorrect OAuth settings break the callback flow.

**REQUIRED Settings in `/lib/auth.ts`:**
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  allowDangerousEmailAccountLinking: true,
  authorization: {
    params: {
      prompt: 'consent',
      access_type: 'offline',
      response_type: 'code',
    },
  },
})
```

**Google Cloud Console MUST Have**:
- Authorized redirect URI: `https://magazine.stepperslife.com/api/auth/callback/google`
- OAuth consent screen fully configured

---

### Rule #4: Middleware MUST Allow OAuth Callbacks
**WHY**: Blocking callback routes breaks OAuth flow.

**REQUIRED in `/middleware.ts`:**
```typescript
// Allow OAuth callbacks to pass through
if (path.startsWith('/api/auth/callback')) {
  return NextResponse.next()
}

// Add error handling for token checks
try {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })
} catch (error) {
  // Fail open for auth routes
  if (path.startsWith('/api/auth')) {
    return NextResponse.next()
  }
}
```

---

### Rule #5: JWT Session Strategy ONLY
**WHY**: Database sessions add complexity and failure points.

**REQUIRED in `/lib/auth.ts`:**
```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

**❌ NEVER use database sessions for this project**

---

### Rule #6: Session Polling - Conservative Intervals ONLY
**WHY**: Aggressive polling causes HTTP2 errors and server load.

**REQUIRED**: Minimum 30-second polling interval
```typescript
// ✅ CORRECT
const POLL_INTERVAL = 30000 // 30 seconds

// ❌ NEVER DO THIS
const POLL_INTERVAL = 1000 // Too aggressive!
```

---

### Rule #7: Nginx Configuration for Auth Endpoints
**WHY**: Auth endpoints need special handling to prevent HTTP2 issues.

**REQUIRED in nginx config:**
```nginx
location ~ ^/api/auth/(session|csrf|providers|signin|signout|callback) {
    proxy_pass http://127.0.0.1:3007;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_request_buffering off;
    proxy_set_header Connection "close";

    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

**File Location**: `/etc/nginx/sites-available/magazine.stepperslife.com`

---

### Rule #8: Environment Variables - No Compromises
**WHY**: Missing or incorrect env vars cause silent failures.

**REQUIRED Variables:**
```bash
NEXTAUTH_URL=https://magazine.stepperslife.com
NEXTAUTH_SECRET=[strong-secret-here]
GOOGLE_CLIENT_ID=[your-client-id]
GOOGLE_CLIENT_SECRET=[your-client-secret]
```

**TESTING**: Before deploying, verify all auth env vars exist:
```bash
grep -E "(NEXTAUTH|GOOGLE)" .env
```

---

### Rule #9: ALWAYS Test These 3 Flows Before Deployment
**WHY**: These are the critical paths that broke during the 4-day incident.

**MANDATORY Testing:**
1. **Login Flow**
   - Click "Sign in with Google"
   - Complete OAuth
   - Should land on /dashboard (NOT /sign-in)

2. **Session Persistence**
   - After login, refresh the page
   - Should stay logged in
   - Check browser console for NO `ERR_HTTP2_SERVER_REFUSED_STREAM`

3. **Navigation After Login**
   - Navigate to /dashboard, /editor/new, /articles
   - Should remain authenticated on all pages
   - Middleware should show `Token exists: true` in logs

**Testing Command:**
```bash
pm2 logs magazine-stepperslife --lines 100 | grep "Token exists"
```

---

### Rule #10: Monitor Logs After Auth Changes
**WHY**: Issues show up in logs before users report them.

**REQUIRED After Any Auth Change:**
```bash
# Watch logs for 60 seconds
pm2 logs magazine-stepperslife --lines 0

# Look for:
# ✅ [NextAuth] User signed in: [email]
# ✅ [Middleware] Path: /dashboard Token exists: true
# ❌ ERR_HTTP2_SERVER_REFUSED_STREAM
# ❌ UnknownAction
# ❌ PKCE errors
```

---

## What Files Must NEVER Be Changed Carelessly

### Critical Auth Files (Require Testing After Any Change)
1. `/lib/auth.ts` - Core auth configuration
2. `/components/auth/hybrid-session-provider.tsx` - Session management
3. `/app/api/auth/session-check/route.ts` - Custom session endpoint
4. `/middleware.ts` - Route protection
5. `/app/providers.tsx` - Provider setup
6. `/etc/nginx/sites-available/magazine.stepperslife.com` - Server config

### If You MUST Change These Files:
1. **READ THIS DOCUMENT FIRST**
2. Make a backup: `git stash`
3. Make ONE change at a time
4. Test IMMEDIATELY using Rule #9
5. Check logs using Rule #10
6. If anything breaks, IMMEDIATELY REVERT: `git stash pop`

---

## Red Flags That Indicate Auth Is Breaking

### In Browser Console:
- ❌ `ERR_HTTP2_SERVER_REFUSED_STREAM`
- ❌ `Failed to fetch` on session endpoint
- ❌ User logs in but immediately sees "User not logged in"
- ❌ Constant redirects between /sign-in and /dashboard

### In PM2 Logs:
- ❌ `[Middleware] Path: /dashboard Token exists: false` (after successful login)
- ❌ `UnknownAction: Unsupported action`
- ❌ PKCE code verifier errors
- ❌ Session check errors repeating constantly

### If You See Any Red Flag:
1. **STOP** making changes
2. Check this document
3. Verify all 10 rules are being followed
4. Roll back recent changes if needed

---

## Emergency Rollback Procedure

If authentication breaks completely:

```bash
# 1. Stop making changes
git status

# 2. Check last working commit
git log --oneline -10 | grep -i "auth\|login\|session"

# 3. Rollback to last known good commit (example)
git reset --hard efd1d4a  # Use actual commit hash

# 4. Rebuild and restart
npm run build
pm2 restart magazine-stepperslife

# 5. Test immediately
# Open https://magazine.stepperslife.com/sign-in
# Try logging in
# Check PM2 logs
```

---

## Why These Rules Exist

**The Cost of the 4-Day Incident:**
- 4 days of development time lost
- User frustration (couldn't access magazine)
- Multiple failed approaches before finding root cause
- Extensive debugging and testing
- Emergency fixes and rebuilds

**Root Causes Identified:**
1. NextAuth's session provider conflicted with HTTP2
2. Middleware blocked OAuth callbacks
3. Session polling was too aggressive
4. Nginx didn't have special auth endpoint handling
5. Testing was not comprehensive enough

**These rules prevent ALL of those issues.**

---

## Maintenance Checklist

### Monthly Auth System Check
- [ ] Test Google OAuth login flow
- [ ] Verify session persistence (refresh page after login)
- [ ] Check PM2 logs for HTTP2 errors
- [ ] Verify no PKCE errors in logs
- [ ] Test dashboard access after login
- [ ] Test editor navigation after login
- [ ] Verify signout clears session

### Before Any Auth-Related Deploy
- [ ] Read this document
- [ ] Follow Rule #9 (test 3 critical flows)
- [ ] Check PM2 logs for 60 seconds
- [ ] Have rollback plan ready

### If User Reports "Can't Login"
- [ ] Check PM2 logs immediately
- [ ] Look for red flags listed above
- [ ] Verify Google OAuth credentials haven't expired
- [ ] Test login flow yourself
- [ ] Check nginx is running: `systemctl status nginx`

---

## Document History
- **2025-10-14**: Created after 4-day authentication incident
- **Reason**: Prevent future multi-day debugging sessions
- **Author**: Created with Claude Code after successful fix

**⚠️ THIS DOCUMENT IS SACRED. DO NOT IGNORE THESE RULES. ⚠️**
