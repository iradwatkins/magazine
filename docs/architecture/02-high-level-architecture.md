# 2. High-Level Architecture

[← Back to Index](index.md) | [← Previous: Introduction](01-introduction.md) | [Next: Technology Stack →](03-technology-stack.md)

---

## 2.1 Infrastructure Context

**Isolated VPS Deployment:**

- **VPS Multi-Tenant Environment**: Running multiple isolated SteppersLife services
- **Port Assignment**: Magazine runs on **Port 3007** (magazine.stepperslife.com)
- **Dedicated Services** (NO SHARING):
  - PostgreSQL database (magazine-postgres container)
  - Redis cache (magazine-redis container)
  - MinIO object storage (magazine-minio container)
- **Isolated Domain Structure**:
  - Main app: `magazine.stepperslife.com`
  - Media storage: `media.magazine.stepperslife.com`
- **Reverse Proxy**: Nginx handling SSL and routing to port 3007

**Complete Isolation**: The magazine platform does NOT share any infrastructure with `stepperslife.com`, `events.stepperslife.com`, `shop.stepperslife.com`, or any other SteppersLife properties. Each platform has its own dedicated containers and data stores.

## 2.2 Architecture Layers

**1. Presentation Layer (Client-Side)**

- Next.js 15 App Router with React 19
- Server-rendered pages for SEO and performance
- Client-side interactivity for drag-and-drop editor
- Responsive design (mobile-first, 720px max article width)
- Tailwind CSS for styling

**2. Application Layer (Next.js Server)**

- Next.js API Routes (/api/\*)
- Server Actions for mutations
- NextAuth.js authentication middleware
- Integration with main SteppersLife site via webhooks (optional)
- Image optimization and transformation with Sharp

**3. Data Layer (Self-Hosted - Isolated)**

- **PostgreSQL**: Primary relational database (dedicated magazine container)
- **Redis**: Session storage, caching, rate limiting (dedicated container)
- **MinIO**: S3-compatible object storage for media assets (dedicated container)
- **Prisma ORM**: Type-safe database client with migrations

## 2.3 Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT DEVICES                          │
│              (Desktop, Tablet, Mobile Browsers)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Reverse Proxy)                        │
│                  SSL Termination + Routing                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ↓                                 ↓
   magazine.stepperslife.com       media.magazine.stepperslife.com
         → :3007                            → :9007
            │                                 │
            ↓                                 ↓
┌───────────────────────────┐      ┌─────────────────────┐
│  NEXT.JS APP (Port 3007)  │      │  MinIO (Port 9007)  │
│  ┌─────────────────────┐  │      │  Media Storage      │
│  │  Next.js 15 App     │  │      │  (Isolated)         │
│  │  Router (SSR/SSG)   │  │      └─────────────────────┘
│  └──────────┬──────────┘  │
│             │              │
│  ┌──────────┴──────────┐  │
│  │  API Routes +       │  │
│  │  Server Actions     │  │
│  └──────────┬──────────┘  │
└─────────────┼─────────────┘
              │
     ┌────────┼────────┐
     ↓        ↓        ↓
┌──────────┐ ┌──────┐ ┌──────┐
│PostgreSQL│ │Redis │ │MinIO │
│(Isolated)│ │(Iso.)│ │(Iso.)│
│          │ │      │ │      │
│ articles │ │Cache │ │Images│
│ users    │ │      │ │Videos│
│ media    │ │      │ │      │
└──────────┘ └──────┘ └──────┘
   magazine-    magazine-  magazine-
   postgres     redis      minio
```

## 2.4 Request Flow Patterns

**Pattern A: Public Article Page (SSR)**

```
User → Nginx → Next.js SSR → Prisma Query (magazine-postgres) → HTML
                            ↓
                       Redis Cache (magazine-redis)
```

**Pattern B: Dashboard/Editor (Protected Route)**

```
User → Nginx → NextAuth Middleware → Session Check (magazine-redis)
                     ↓
               React Client → API Route → Prisma → magazine-postgres
```

**Pattern C: Article Creation (Server Action)**

```
Editor → Server Action → Validation → Prisma Transaction (magazine-postgres)
                                    ↓
                        MinIO Upload (magazine-minio) → Update Media Records
```

**Pattern D: Media Upload**

```
Dashboard → Upload Component → MinIO Presigned URL
                             ↓
                Direct Upload to magazine-minio (Port 9007)
                             ↓
                API Route → Create Media Record (magazine-postgres)
```

## 2.5 Key Architectural Decisions

| Decision               | Choice                              | Rationale                                                          |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| **Deployment Model**   | Self-hosted isolated VPS containers | Complete isolation prevents cross-contamination between properties |
| **Database**           | PostgreSQL (dedicated container)    | Isolated magazine data, no shared schema conflicts                 |
| **ORM**                | Prisma                              | Type-safe, excellent DX, migrations, proven reliability            |
| **Authentication**     | NextAuth.js (isolated sessions)     | Can integrate with main site via webhook if needed                 |
| **Object Storage**     | MinIO (dedicated container)         | Isolated media storage, S3-compatible, no egress fees              |
| **Caching**            | Redis (dedicated container)         | Fast session storage, API caching, rate limiting                   |
| **Rendering Strategy** | Hybrid (SSR + Static + CSR)         | SEO for public pages, interactivity for editor                     |
| **State Management**   | React Server State + Zustand        | Minimize client state, server as source of truth                   |
| **Media Domain**       | media.magazine.stepperslife.com     | Under magazine domain for complete isolation                       |

## 2.6 Infrastructure Isolation Strategy

**Why Complete Isolation:**

1. **Fault Tolerance**: If stepperslife.com's database crashes, magazine.stepperslife.com continues running
2. **Resource Allocation**: Magazine platform gets dedicated CPU/RAM, no resource contention
3. **Security**: Breach in one property doesn't compromise others
4. **Scaling**: Can independently scale magazine infrastructure without affecting other sites
5. **Deployment**: Deploy magazine updates without touching other services
6. **Data Sovereignty**: Magazine data stays in magazine containers, no cross-contamination

**User Authentication Strategy:**

While infrastructure is isolated, user authentication CAN be synchronized:

- Magazine has its own `users` table in `magazine-postgres`
- Optional webhook integration with main site for SSO (Single Sign-On)
- Users created on magazine.stepperslife.com are independent
- Optional: Sync user data from stepperslife.com → magazine via API webhook

---

[← Back to Index](index.md) | [← Previous: Introduction](01-introduction.md) | [Next: Technology Stack →](03-technology-stack.md)
