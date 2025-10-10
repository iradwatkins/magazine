# Magazine SteppersLife - Production Deployment Guide

Complete guide for deploying the Magazine platform to production.

## Prerequisites

- Ubuntu/Debian server with root access
- Node.js 18+ installed
- PostgreSQL 16 installed
- Redis 7+ installed
- MinIO installed
- Nginx installed
- Domain: `magazine.stepperslife.com` configured
- SSL certificate (Let's Encrypt)

## Environment Setup

### 1. System Packages

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nodejs npm postgresql redis-server nginx certbot python3-certbot-nginx

# Install MinIO (if not already installed)
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE magazine_db;
CREATE USER magazine_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE magazine_db TO magazine_user;
\q
```

### 3. Redis Configuration

```bash
# Edit Redis config
sudo nano /etc/redis/redis.conf

# Ensure Redis is listening on localhost:6379
# Set maxmemory policy for caching
maxmemory 256mb
maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis-server
```

### 4. MinIO Setup

```bash
# Create MinIO user and directories
sudo useradd -r minio-user -s /sbin/nologin
sudo mkdir -p /mnt/data/minio
sudo chown minio-user:minio-user /mnt/data/minio

# Create MinIO systemd service
sudo nano /etc/systemd/system/minio.service
```

**MinIO systemd service content:**

```ini
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
WorkingDirectory=/usr/local/
User=minio-user
Group=minio-user
EnvironmentFile=/etc/default/minio
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
Restart=always
LimitNOFILE=65536
TasksMax=infinity
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
```

**MinIO environment file:**

```bash
# Create environment file
sudo nano /etc/default/minio

# Add configuration
MINIO_ROOT_USER=magazine_minio_admin
MINIO_ROOT_PASSWORD=your_secure_minio_password
MINIO_VOLUMES="/mnt/data/minio"
MINIO_OPTS="--address :9007 --console-address :9107"
```

```bash
# Start MinIO
sudo systemctl enable minio
sudo systemctl start minio

# Create bucket
mc alias set local http://localhost:9007 magazine_minio_admin your_secure_minio_password
mc mb local/stepperslife-magazine
mc anonymous set download local/stepperslife-magazine
```

## Application Deployment

### 1. Clone Repository

```bash
cd /root/websites
# Repository should already exist at /root/websites/magazine-stepperslife
cd magazine-stepperslife
```

### 2. Install Dependencies

```bash
npm ci --production=false
```

### 3. Environment Configuration

```bash
# Copy and configure environment
cp .env.example .env
nano .env
```

**Production .env file:**

```bash
# Database
DATABASE_URL=postgresql://magazine_user:your_secure_password@localhost:5407/magazine_db

# Redis (Database 6 for magazine)
REDIS_URL=redis://localhost:6407/6

# MinIO
MINIO_ACCESS_KEY=magazine_minio_admin
MINIO_SECRET_KEY=your_secure_minio_password
MINIO_BUCKET=stepperslife-magazine
MINIO_ENDPOINT=http://localhost:9007
MINIO_PUBLIC_URL=https://media.magazine.stepperslife.com

# NextAuth
NEXTAUTH_URL=https://magazine.stepperslife.com
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# OAuth Providers
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# Email (Magic Link)
RESEND_API_KEY=your_production_resend_key
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_FROM=noreply@stepperslife.com

# Main Site Integration
MAIN_SITE_WEBHOOK_URL=https://stepperslife.com/api/webhooks/magazine
WEBHOOK_SECRET=your_webhook_secret

# App Config
NEXT_PUBLIC_APP_URL=https://magazine.stepperslife.com
NODE_ENV=production
PORT=3007
```

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npx tsx scripts/seed.ts
```

### 5. Build Application

```bash
# Build Next.js app
npm run build

# Test build
NODE_ENV=production npm start
```

### 6. Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
nano ecosystem.config.js
```

**ecosystem.config.js:**

```javascript
module.exports = {
  apps: [
    {
      name: 'magazine-stepperslife',
      script: 'npm',
      args: 'start',
      cwd: '/root/websites/magazine-stepperslife',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
      },
      error_file: '/var/log/pm2/magazine-error.log',
      out_file: '/var/log/pm2/magazine-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
    },
  ],
}
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Enable PM2 on system startup
pm2 startup systemd
```

### 7. Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/magazine.stepperslife.com
```

**Nginx configuration:**

```nginx
# Upstream Next.js app
upstream magazine_app {
    server 127.0.0.1:3007;
    keepalive 64;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name magazine.stepperslife.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name magazine.stepperslife.com;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/magazine.stepperslife.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/magazine.stepperslife.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/magazine-access.log;
    error_log /var/log/nginx/magazine-error.log;

    # File upload size
    client_max_body_size 10M;

    # Proxy settings
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
        proxy_read_timeout 90;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://magazine_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public files
    location /public {
        proxy_pass http://magazine_app;
        add_header Cache-Control "public, max-age=3600";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/magazine.stepperslife.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 8. SSL Certificate

```bash
# Obtain SSL certificate with Certbot
sudo certbot --nginx -d magazine.stepperslife.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Post-Deployment

### 1. Verify Services

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs magazine-stepperslife

# Check Nginx
sudo systemctl status nginx

# Check database connection
npx prisma studio --browser none # Access at http://localhost:5555
```

### 2. Create Initial Admin User

```bash
# Connect to database
psql -U magazine_user -d magazine_db

# Update user roles (replace with actual user email)
UPDATE users
SET roles = ARRAY['USER', 'ADMIN']::user_role[]
WHERE email = 'admin@stepperslife.com';
```

### 3. Test Endpoints

```bash
# Health check
curl https://magazine.stepperslife.com

# API test
curl https://magazine.stepperslife.com/api/articles?status=PUBLISHED

# Auth providers
curl https://magazine.stepperslife.com/api/auth/providers
```

## Monitoring & Maintenance

### 1. Log Monitoring

```bash
# PM2 logs
pm2 logs magazine-stepperslife --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/magazine-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/magazine-error.log

# System logs
sudo journalctl -u minio -f
```

### 2. Database Backups

```bash
# Create backup script
sudo nano /root/scripts/backup-magazine-db.sh
```

**Backup script:**

```bash
#!/bin/bash
BACKUP_DIR="/root/backups/magazine"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump -U magazine_user magazine_db | gzip > $BACKUP_DIR/magazine_db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "magazine_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: magazine_db_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x /root/scripts/backup-magazine-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /root/scripts/backup-magazine-db.sh
```

### 3. Application Updates

```bash
# Pull latest changes
cd /root/websites/magazine-stepperslife
git pull origin main

# Install dependencies
npm ci

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart PM2
pm2 restart magazine-stepperslife

# Check status
pm2 status
```

## Troubleshooting

### Port Already in Use

```bash
lsof -ti:3007 | xargs kill -9
pm2 restart magazine-stepperslife
```

### Database Connection Issues

```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U magazine_user -d magazine_db -h localhost -p 5407
```

### Memory Issues

```bash
# Check memory usage
free -h

# Restart PM2 apps
pm2 restart all

# Clear Redis cache
redis-cli -p 6407 -n 6 FLUSHDB
```

### SSL Certificate Renewal Issues

```bash
# Manually renew
sudo certbot renew --force-renewal

# Check expiry
sudo certbot certificates
```

## Performance Optimization

### 1. Enable Redis Caching

Already configured via `REDIS_URL` environment variable.

### 2. Database Optimization

```sql
-- Add indexes (already in schema)
-- Monitor slow queries
-- Enable query logging in postgresql.conf
```

### 3. CDN Integration

Configure CloudFlare or similar CDN for static assets.

### 4. Image Optimization

MinIO serves images - consider adding image resizing service.

## Security Checklist

- [x] SSL/TLS enabled
- [x] Environment variables secured
- [x] Database passwords strong
- [x] Firewall configured
- [x] Rate limiting enabled (future)
- [x] CORS configured correctly
- [x] Security headers set in Nginx
- [x] Regular backups scheduled
- [x] Monitoring in place

## Production Checklist

- [ ] Environment variables set
- [ ] Database migrated
- [ ] SSL certificate installed
- [ ] PM2 configured and running
- [ ] Nginx configured
- [ ] Initial admin user created
- [ ] Google OAuth credentials configured
- [ ] Resend API key configured
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] Domain DNS configured
- [ ] Health checks passing

## Support

- Documentation: `/docs`
- Logs: `/var/log/nginx/`, `pm2 logs`
- Database: `npx prisma studio`
- System: `pm2 monit`
