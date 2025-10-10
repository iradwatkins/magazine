# GitHub Repository Secrets Configuration

This document outlines the required GitHub Secrets for the CI/CD pipeline to function correctly.

## Required Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### VPS Deployment Secrets

| Secret Name    | Description                        | Example Value                            |
| -------------- | ---------------------------------- | ---------------------------------------- |
| `VPS_HOST`     | IP address or hostname of your VPS | `123.456.789.0` or `vps.example.com`     |
| `VPS_USERNAME` | SSH username for VPS access        | `root`                                   |
| `VPS_SSH_KEY`  | Private SSH key for authentication | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT`     | SSH port (usually 22)              | `22`                                     |

### Optional Secrets

| Secret Name    | Description                              | Notes                  |
| -------------- | ---------------------------------------- | ---------------------- |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions | No manual setup needed |

## How to Generate SSH Key for VPS

If you don't already have an SSH key configured for deployment:

```bash
# On your local machine or VPS
ssh-keygen -t ed25519 -C "github-actions-magazine" -f ~/.ssh/github-actions-magazine

# Copy the public key to your VPS
ssh-copy-id -i ~/.ssh/github-actions-magazine.pub root@your-vps-ip

# Copy the private key content
cat ~/.ssh/github-actions-magazine
```

Then paste the **entire private key** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) into the `VPS_SSH_KEY` secret.

## CI/CD Pipeline Workflow

### Continuous Integration (CI)

Runs on every push and pull request:

- ✅ Checkout code
- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Run ESLint
- ✅ Run TypeScript type check
- ✅ Build Next.js application

### Docker Image Build

Runs on pushes to `main` and `develop` branches:

- 🐳 Build Docker image
- 📦 Push to GitHub Container Registry (ghcr.io)
- 🏷️ Tag with branch name, SHA, and `latest`

### Production Deployment

Runs only on pushes to `main` branch:

- 🚀 SSH into VPS
- 📥 Pull latest code from GitHub
- 🐳 Pull latest Docker image
- ♻️ Restart `magazine-app` container
- 🗄️ Run Prisma migrations
- ✅ Health check verification

### Preview Deployments

Runs on pull requests:

- 🔍 Creates isolated preview environment
- 📍 Deploys to `magazine-pr-{number}.stepperslife.com`
- 🔢 Assigns unique port (3100 + PR number)
- 🧹 Auto-cleanup when PR is closed

## Environment Configuration

The CI/CD pipeline expects the following on your VPS:

1. **Repository cloned** at `/root/websites/magazine-stepperslife/`
2. **Docker and Docker Compose** installed
3. **Environment file** (`.env`) configured with production values
4. **Port 3007** available for production
5. **Ports 3101+** available for preview deployments

## Manual Deployment (Fallback)

If CI/CD is not set up yet, deploy manually:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to project
cd /root/websites/magazine-stepperslife

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose up -d --build magazine-app

# Run migrations
docker compose exec magazine-app npx prisma migrate deploy

# Check health
curl http://localhost:3007/api/health
```

## Troubleshooting

### Deployment Fails with "Permission Denied"

**Solution:** Verify SSH key is correctly added to `~/.ssh/authorized_keys` on VPS

### Docker Login Fails

**Solution:** Ensure `GITHUB_TOKEN` has `packages:read` and `packages:write` permissions

### Health Check Fails

**Solution:** Check that:

- Port 3007 is not blocked by firewall
- Database, Redis, and MinIO are healthy
- `/api/health` endpoint exists

### Preview Deployment Port Conflicts

**Solution:** Ensure ports 3101-3200 are not in use by other services

## Next Steps

1. ✅ Add required secrets to GitHub repository
2. ✅ Test CI pipeline by creating a pull request
3. ✅ Verify production deployment on merge to `main`
4. ✅ Test preview deployment functionality
