# Authentication Quick Reference Card

**⚡ Keep this handy when working on auth! ⚡**

---

## Critical Files (DO NOT TOUCH WITHOUT TESTING)

| File | Purpose | Test After Change |
|------|---------|-------------------|
| `/lib/auth.ts` | NextAuth config | ALL 3 flows |
| `/components/auth/hybrid-session-provider.tsx` | Session management | Session persistence |
| `/app/api/auth/session-check/route.ts` | Custom session check | Session persistence |
| `/middleware.ts` | Route protection | Login + navigation |
| `/app/providers.tsx` | Provider setup | ALL 3 flows |
| `/etc/nginx/sites-available/magazine.stepperslife.com` | Server config | ALL 3 flows + logs |

---

## 3 Mandatory Test Flows

### 1. Login Flow (2 min)
```bash
# Open: https://magazine.stepperslife.com/sign-in
# Click "Sign in with Google"
# Complete OAuth
# ✅ Should land on /dashboard (NOT /sign-in)
```

### 2. Session Persistence (1 min)
```bash
# After successful login
# Press F5 to refresh page
# ✅ Should STAY logged in
# ✅ Check console: NO "ERR_HTTP2_SERVER_REFUSED_STREAM"
```

### 3. Navigation (1 min)
```bash
# Visit: /dashboard, /editor/new, /articles
# ✅ Should stay authenticated on all pages
# Run: pm2 logs magazine-stepperslife --lines 20 | grep "Token exists"
# ✅ Should see: "Token exists: true"
```

---

## Red Flags (STOP IMMEDIATELY IF YOU SEE THESE)

### Browser Console
```
❌ ERR_HTTP2_SERVER_REFUSED_STREAM
❌ Failed to fetch /api/auth/session
❌ Redirecting between /sign-in and /dashboard
```

### PM2 Logs
```bash
pm2 logs magazine-stepperslife --lines 50

❌ [Middleware] Path: /dashboard Token exists: false  (after login)
❌ UnknownAction: Unsupported action
❌ PKCE code verifier errors (repeating)
```

**If you see ANY red flag → Check AUTHENTICATION_RULES.md**

---

## Quick Diagnosis Commands

```bash
# Check if user logged in recently
pm2 logs magazine-stepperslife --lines 100 | grep "User signed in"

# Check middleware token validation
pm2 logs magazine-stepperslife --lines 50 | grep "Token exists"

# Check for HTTP2 errors in nginx
tail -50 /var/log/nginx/error.log | grep -i "http2"

# Verify auth environment variables
grep -E "(NEXTAUTH|GOOGLE)" .env

# Test session endpoint directly
curl -s https://magazine.stepperslife.com/api/auth/session-check | jq .
```

---

## Emergency Rollback (2 min)

```bash
# 1. Find last good commit
git log --oneline -10 | grep -i auth

# 2. Rollback (replace HASH)
git reset --hard HASH

# 3. Rebuild and restart
npm run build
pm2 restart magazine-stepperslife

# 4. Test login flow immediately
```

---

## The 10 Unbreakable Rules (Summary)

1. ✅ Use HybridSessionProvider (NOT NextAuth's SessionProvider)
2. ✅ Session checks via `/api/auth/session-check` ONLY
3. ✅ Google OAuth with exact config in rules doc
4. ✅ Middleware allows OAuth callbacks
5. ✅ JWT sessions ONLY (no database sessions)
6. ✅ 30-second minimum polling interval
7. ✅ Nginx auth endpoint configuration required
8. ✅ All auth env vars must exist
9. ✅ Test 3 flows before ANY deployment
10. ✅ Monitor logs after auth changes

**Full Details**: See `AUTHENTICATION_RULES.md`

---

## Common Mistakes to Avoid

```typescript
// ❌ WRONG
import { SessionProvider } from 'next-auth/react'

// ✅ CORRECT
import { HybridSessionProvider } from '@/components/auth/hybrid-session-provider'
```

```typescript
// ❌ WRONG
fetch('/api/auth/session')

// ✅ CORRECT
fetch('/api/auth/session-check')
```

```typescript
// ❌ WRONG - Too aggressive
const POLL_INTERVAL = 1000

// ✅ CORRECT
const POLL_INTERVAL = 30000
```

---

## Before You Deploy Auth Changes

- [ ] Read AUTHENTICATION_RULES.md
- [ ] Make ONE change at a time
- [ ] Test login flow (2 min)
- [ ] Test session persistence (1 min)
- [ ] Test navigation (1 min)
- [ ] Check PM2 logs for 60 seconds
- [ ] No red flags in console or logs
- [ ] Have rollback command ready

---

## If User Reports "Can't Login"

```bash
# 1. Check logs immediately
pm2 logs magazine-stepperslife --lines 100

# 2. Look for these patterns
grep -i "error\|failed\|refused"

# 3. Check session endpoint
curl -I https://magazine.stepperslife.com/api/auth/session-check

# 4. Verify nginx is running
systemctl status nginx

# 5. Test login yourself
# Open: https://magazine.stepperslife.com/sign-in

# 6. If broken, rollback immediately
```

---

## Support Documents

- **Detailed Rules**: `AUTHENTICATION_RULES.md`
- **Incident Report**: `LESSONS_LEARNED_4DAY_INCIDENT.md`
- **Auth Config Details**: `AUTH_SYSTEM_DOCUMENTATION.md`
- **Monitoring System**: `MONITORING_SYSTEM.md`

---

## Contact

**If something is broken and you can't fix it:**
1. DON'T make more changes
2. READ the rules document
3. Use emergency rollback
4. Review lessons learned document

**This system took 4 days to fix. Don't break it.**

---

**Last Updated**: October 14, 2025
**Status**: ✅ WORKING PERFECTLY
**Tested With**: iradwatkins@gmail.com
