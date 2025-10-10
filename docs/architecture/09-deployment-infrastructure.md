# 9. Deployment & Infrastructure

[← Back to Index](index.md) | [← Previous: Implementation Patterns](08-implementation-patterns/index.md) | [Next: Security, Testing & QA →](10-security-testing-qa.md)

---

## 9.1 Docker Compose Configuration (Isolated)

**File:** `docker-compose.yml`

```yaml
version: '3.9'

services:
  # ============================================================================
  # Magazine Next.js Application
  # ============================================================================
  magazine-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: magazine-app
    ports:
      - '3007:3007'
    environment:
      # Isolated database
      DATABASE_URL: postgresql://magazine_user:${POSTGRES_PASSWORD}@magazine-postgres:5432/magazine_db

      # Isolated cache
      REDIS_URL: redis://magazine-redis:6379/0

      # Isolated MinIO
      MINIO_ENDPOINT: http://magazine-minio:9000
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY}
      MINIO_BUCKET: magazine-media
      MINIO_PUBLIC_URL: https://media.magazine.stepperslife.com

      # NextAuth
      NEXTAUTH_URL: https://magazine.stepperslife.com
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}

      # OAuth
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}

      # Email
      RESEND_API_KEY: ${RESEND_API_KEY}

      # App Config
      NEXT_PUBLIC_APP_URL: https://magazine.stepperslife.com
      NODE_ENV: production
      PORT: 3007

    depends_on:
      magazine-postgres:
        condition: service_healthy
      magazine-redis:
        condition: service_healthy
      magazine-minio:
        condition: service_healthy

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # Dedicated PostgreSQL (ISOLATED - Magazine Only)
  # ============================================================================
  magazine-postgres:
    image: postgres:16-alpine
    container_name: magazine-postgres
    environment:
      POSTGRES_USER: magazine_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: magazine_db

    ports:
      - '5407:5432' # Unique port mapping (NOT 5432 to avoid conflicts)

    volumes:
      - magazine-postgres-data:/var/lib/postgresql/data
      - ./backups/postgres:/backups

    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U magazine_user']
      interval: 10s
      timeout: 5s
      retries: 5

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # Dedicated Redis (ISOLATED - Magazine Only)
  # ============================================================================
  magazine-redis:
    image: redis:7-alpine
    container_name: magazine-redis

    ports:
      - '6407:6379' # Unique port mapping

    volumes:
      - magazine-redis-data:/data

    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru

    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # Dedicated MinIO (ISOLATED - Magazine Only)
  # ============================================================================
  magazine-minio:
    image: minio/minio:latest
    container_name: magazine-minio

    ports:
      - '9007:9000' # Unique S3 API port
      - '9107:9001' # Unique Web Console port

    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}

    volumes:
      - magazine-minio-data:/data

    command: server /data --console-address ":9001"

    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 20s
      retries: 3

    restart: unless-stopped

    networks:
      - magazine-isolated-network

  # ============================================================================
  # MinIO Bucket Initialization (One-time setup)
  # ============================================================================
  magazine-minio-init:
    image: minio/mc:latest
    container_name: magazine-minio-init

    depends_on:
      magazine-minio:
        condition: service_healthy

    entrypoint: >
      /bin/sh -c "
      mc alias set magazineminio http://magazine-minio:9000 ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY};
      mc mb magazineminio/magazine-media --ignore-existing;
      mc anonymous set public magazineminio/magazine-media;
      exit 0;
      "

    networks:
      - magazine-isolated-network

# ============================================================================
# Volumes (Isolated to Magazine)
# ============================================================================
volumes:
  magazine-postgres-data:
    driver: local
  magazine-redis-data:
    driver: local
  magazine-minio-data:
    driver: local

# ============================================================================
# Network (Isolated to Magazine)
# ============================================================================
networks:
  magazine-isolated-network:
    driver: bridge
```

## 9.2 Nginx Configuration

**File:** `/etc/nginx/sites-available/magazine.stepperslife.com`

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=magazine_limit:10m rate=10r/s;

# Upstream to Next.js app
upstream magazine_app {
    server localhost:3007;
}

# Upstream to MinIO (media)
upstream magazine_media {
    server localhost:9007;
}

# ============================================================================
# HTTP -> HTTPS Redirect
# ============================================================================
server {
    listen 80;
    listen [::]:80;
    server_name magazine.stepperslife.com media.magazine.stepperslife.com;

    return 301 https://$server_name$request_uri;
}

# ============================================================================
# HTTPS - Main Magazine App
# ============================================================================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name magazine.stepperslife.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/magazine.stepperslife.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/magazine.stepperslife.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/magazine.access.log;
    error_log /var/log/nginx/magazine.error.log;

    # Rate limiting
    limit_req zone=magazine_limit burst=20 nodelay;

    # Max upload size
    client_max_body_size 10M;

    # Static files (Next.js)
    location /_next/static {
        proxy_pass http://magazine_app;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        proxy_pass http://magazine_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# ============================================================================
# HTTPS - Media Subdomain (MinIO)
# ============================================================================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name media.magazine.stepperslife.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/media.magazine.stepperslife.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/media.magazine.stepperslife.com/privkey.pem;

    # CORS headers for media
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;

    location / {
        proxy_pass http://magazine_media;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cache media files
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 9.3 Deployment Script

**File:** `scripts/deploy.sh`

```bash
#!/bin/bash
set -e

echo "========================================="
echo "Magazine Platform Deployment (Isolated)"
echo "========================================="

# Load environment
source .env.production

# Pull latest code
echo "📦 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📚 Installing dependencies..."
npm ci

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Build Docker images
echo "🐳 Building Docker images..."
docker compose build magazine-app

# Stop old containers
echo "🛑 Stopping old containers..."
docker compose down magazine-app

# Start new containers
echo "🚀 Starting new containers..."
docker compose up -d

# Health check
echo "🏥 Waiting for health check..."
sleep 10

if curl -f http://localhost:3007/api/health > /dev/null 2>&1; then
  echo "✅ Deployment successful!"
else
  echo "❌ Health check failed!"
  exit 1
fi

echo "========================================="
echo "✅ Magazine deployed successfully!"
echo "========================================="
```

## 9.4 Backup Scripts

**Daily PostgreSQL Backup:**

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
docker exec magazine-postgres pg_dump -U magazine_user magazine_db > /backups/magazine_${TIMESTAMP}.sql
gzip /backups/magazine_${TIMESTAMP}.sql
find /backups -name "magazine_*.sql.gz" -mtime +30 -delete
```

**Weekly MinIO Backup:**

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d")
docker exec magazine-minio mc mirror /data/magazine-media /backups/minio-${TIMESTAMP}
tar -czf /backups/magazine-media-${TIMESTAMP}.tar.gz -C /backups minio-${TIMESTAMP}
rm -rf /backups/minio-${TIMESTAMP}
find /backups -name "magazine-media-*.tar.gz" -mtime +90 -delete
```

## 9.5 Resource Requirements

**Minimum VPS Requirements:**

- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 50 GB SSD

**Recommended (Production):**

- **CPU:** 4 cores
- **RAM:** 8 GB
- **Storage:** 100 GB SSD

**Container Resource Limits:**

```yaml
magazine-app: 2 CPU, 2GB RAM
magazine-postgres: 1 CPU, 1GB RAM
magazine-redis: 0.5 CPU, 512MB RAM
magazine-minio: 1 CPU, 1GB RAM
```

---

[← Back to Index](index.md) | [← Previous: Implementation Patterns](08-implementation-patterns/index.md) | [Next: Security, Testing & QA →](10-security-testing-qa.md)
