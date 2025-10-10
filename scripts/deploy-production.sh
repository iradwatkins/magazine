#!/bin/bash

# Magazine SteppersLife - Production Deployment Script
# This script handles the deployment process for the magazine platform

set -e  # Exit on error

echo "🚀 Starting Magazine SteppersLife Production Deployment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/root/websites/magazine-stepperslife"
APP_NAME="magazine-stepperslife"
NODE_ENV="production"
PORT=3007

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Please run as root${NC}"
  exit 1
fi

# Navigate to app directory
cd $APP_DIR || exit 1

echo -e "\n${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm ci --production=false

echo -e "\n${YELLOW}🗄️  Step 2: Running database migrations...${NC}"
npx prisma generate
npx prisma migrate deploy

echo -e "\n${YELLOW}🏗️  Step 3: Building application...${NC}"
npm run build

echo -e "\n${YELLOW}🔄 Step 4: Restarting PM2 process...${NC}"
if pm2 describe $APP_NAME > /dev/null 2>&1; then
  pm2 restart $APP_NAME
else
  pm2 start ecosystem.config.js
fi

pm2 save

echo -e "\n${YELLOW}🔍 Step 5: Verifying deployment...${NC}"
sleep 5

# Check if app is running
if pm2 describe $APP_NAME | grep -q "online"; then
  echo -e "${GREEN}✅ Application is running${NC}"
else
  echo -e "${RED}❌ Application failed to start${NC}"
  pm2 logs $APP_NAME --lines 50
  exit 1
fi

# Test health endpoint
echo -e "\n${YELLOW}🏥 Testing health endpoint...${NC}"
if curl -f http://localhost:$PORT > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Health check passed${NC}"
else
  echo -e "${RED}❌ Health check failed${NC}"
  exit 1
fi

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=================================================="
echo -e "Application: ${GREEN}$APP_NAME${NC}"
echo -e "Port: ${GREEN}$PORT${NC}"
echo -e "PM2 Status: ${GREEN}pm2 status${NC}"
echo -e "Logs: ${GREEN}pm2 logs $APP_NAME${NC}"
echo -e "URL: ${GREEN}https://magazine.stepperslife.com${NC}"
echo "=================================================="
