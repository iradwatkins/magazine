# Magazine Stepperslife - Architecture Documentation

**⚠️ READ THIS FIRST - Critical for maintaining consistency across all Stepperslife subdomains**

---

## 🎯 This Subdomain's Configuration

**Subdomain:** magazine.stepperslife.com
**Port:** 3007
**Database:** stepperslife_magazine
**Database URL:** postgresql://stepperslife:securepass123@localhost:5432/stepperslife_magazine
**MinIO Container:** magazine-minio
**MinIO Port:** 9007 (Console: 9107)
**MinIO Bucket:** magazine
**PM2 Process:** magazine-stepperslife
**Directory:** /root/websites/magazine-stepperslife

---

## 🏗️ Architecture Pattern

### This is a **Fully Isolated Microservice**

✅ **Own PostgreSQL database** (stepperslife_magazine)
✅ **Own MinIO container** (magazine-minio)
✅ **Own PM2 process** (magazine-stepperslife)
✅ **Can be sold separately** (complete isolation)

❌ **DO NOT share databases** with other subdomains
❌ **DO NOT share MinIO buckets** with other subdomains
❌ **DO NOT hardcode references** to other subdomain services

---

## 🔐 SSO Configuration (Shared Across All Subdomains)

All Stepperslife subdomains use **Clerk SSO** for authentication:

```env
NEXTAUTH_URL="https://magazine.stepperslife.com"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y3VycmVudC1hbnQtNzUuY2xlcmsuYWNjb3VudHMuZGV2JA"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

**Key Points:**

- ✅ User logs in once on stepperslife.com = logged into ALL subdomains
- ✅ Each subdomain validates session via Clerk
- ✅ NEXTAUTH_URL must be unique per subdomain (https://magazine.stepperslife.com)
- ✅ Clerk keys are SHARED across all subdomains

---

## 📊 Data Flow

```
User visits stepperslife.com (main site)
    ↓
Main site fetches data from magazine.stepperslife.com/api/*
    ↓
Magazine data displayed on main site
    ↓
User clicks to view/purchase magazine content
    ↓
Redirects to magazine.stepperslife.com
    ↓
Transaction happens on magazine subdomain
```

### Your Responsibilities

1. **Expose API endpoints** for main site to fetch data
2. **Handle transactions** on this subdomain
3. **Store data** in your own database (stepperslife_magazine)
4. **Store files** in your own MinIO bucket (magazine)

---

## 🚫 Critical Rules - DO NOT BREAK

### ❌ Never Change These

1. **Port:** 3007 (reserved for magazine)
2. **Database name:** stepperslife_magazine
3. **Database credentials:** stepperslife:securepass123
4. **MinIO credentials:** minioadmin:minioadmin
5. **Clerk publishable key:** Must match other subdomains
6. **PM2 process name:** magazine-stepperslife

### ✅ You Can Customize

1. **UI/UX** - Make it unique to magazine
2. **Features** - Add magazine-specific functionality
3. **Database schema** - Add tables as needed (in your own DB)
4. **API endpoints** - Create magazine-specific APIs
5. **Business logic** - Implement magazine workflows

---

## 🌐 All Stepperslife Subdomains

| Subdomain    | Port     | Database                  | MinIO Port | Status |
| ------------ | -------- | ------------------------- | ---------- | ------ |
| stores       | 3008     | stepperslife_stores       | 9003       | ✅     |
| events       | 3004     | stepperslife_events       | 9004       | ✅     |
| **magazine** | **3007** | **stepperslife_magazine** | **9007**   | **✅** |
| services     | 3011     | stepperslife_services     | 9011       | ✅     |
| restaurants  | 3010     | stepperslife_restaurants  | 9010       | ✅     |
| classes      | 3009     | stepperslife_classes      | 9009       | ✅     |

**Note:** Each subdomain follows the same pattern - complete isolation with shared SSO.

---

## 📝 Common Commands

### Start this subdomain

```bash
cd /root/websites/magazine-stepperslife
NODE_ENV=production PORT=3007 pm2 start npm --name "magazine-stepperslife" -- start
```

### Restart this subdomain

```bash
pm2 restart magazine-stepperslife
```

### View logs

```bash
pm2 logs magazine-stepperslife --lines 50
```

### Build application

```bash
cd /root/websites/magazine-stepperslife
npm run build
```

### Check database

```bash
PGPASSWORD=securepass123 psql -h localhost -U stepperslife -d stepperslife_magazine
```

### Check MinIO container

```bash
docker ps | grep magazine-minio
```

---

## 📂 Directory Structure

```
/root/websites/magazine-stepperslife/
├── .claude/              ← You are here
│   └── README.md         ← This file
├── .env                  ← Environment variables (DO NOT commit)
├── prisma/               ← Database schema
│   └── schema.prisma
├── src/                  ← Application code
├── public/               ← Static files
├── package.json          ← Dependencies
└── ...
```

---

## 🔗 Integration with Main Site

### Expose APIs for stepperslife.com

Create API routes that the main site can call:

```
GET /api/magazine/articles       - List all articles
GET /api/magazine/articles/:id   - Get single article
GET /api/magazine/featured       - Get featured content
GET /api/magazine/categories     - List categories
```

**Example API Response:**

```json
{
  "id": "123",
  "title": "Article Title",
  "excerpt": "Short description...",
  "image": "https://magazine.stepperslife.com/uploads/...",
  "category": "Lifestyle",
  "publishedAt": "2025-10-09T00:00:00Z"
}
```

Main site will fetch from: `https://magazine.stepperslife.com/api/magazine/articles`

---

## 🛡️ Environment Variables Template

Your `.env` file should look like this:

```env
# Database Configuration
DATABASE_URL="postgresql://stepperslife:securepass123@localhost:5432/stepperslife_magazine"

# MinIO Configuration (Isolated)
MINIO_ENDPOINT="localhost"
MINIO_PORT="9007"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="magazine"

# NextAuth Configuration (SSO)
NEXTAUTH_URL="https://magazine.stepperslife.com"
NEXTAUTH_SECRET="{unique_secret_here}"

# Clerk SSO Configuration (SHARED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y3VycmVudC1hbnQtNzUuY2xlcmsuYWNjb3VudHMuZGV2JA"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Application Configuration
NEXT_PUBLIC_APP_NAME="Magazine - Stepperslife"
NEXT_PUBLIC_APP_URL="https://magazine.stepperslife.com"

# Port Configuration
PORT=3007
```

---

## 🚀 Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] Environment variables configured in `.env`
- [ ] Database schema applied: `npx prisma db push`
- [ ] PM2 process running: `pm2 list | grep magazine`
- [ ] MinIO container running: `docker ps | grep magazine-minio`
- [ ] DNS points to server: magazine.stepperslife.com → 72.60.28.175
- [ ] SSL certificate installed: `certbot --nginx -d magazine.stepperslife.com`
- [ ] API endpoints accessible from main site
- [ ] SSO login works across domains

---

## 📚 Additional Resources

- **Full Setup Guide:** /var/www/downloads/stepperslife-docs/SUBDOMAIN_MICROSERVICES_SETUP.md
- **Setup Script:** /usr/local/bin/create-subdomain-microservice.sh
- **Quick Reference:** /var/www/downloads/stepperslife-docs/QUICK-REFERENCE.txt

---

## ⚠️ Final Reminder

**This subdomain (magazine.stepperslife.com) is part of a larger ecosystem:**

1. Users login via **stepperslife.com** (main site)
2. Main site **aggregates data** from all subdomains via APIs
3. This subdomain must **expose APIs** for data sharing
4. This subdomain is **fully isolated** - can operate independently
5. This subdomain can be **sold separately** if needed

**When in doubt, follow the pattern used by stores.stepperslife.com (the reference implementation).**

---

**Last Updated:** October 9, 2025
**Architecture Version:** 1.0
**Maintained By:** Stepperslife Development Team
