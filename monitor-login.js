#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const https = require('https');
const { exec } = require('child_process');
const prisma = new PrismaClient();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

let monitoring = true;
let lastSessionCheck = null;
let lastUserCheck = null;

console.clear();
console.log(`${colors.bright}${colors.cyan}========================================`);
console.log(`🔍 LOGIN MONITORING SYSTEM ACTIVE`);
console.log(`========================================${colors.reset}`);
console.log(`${colors.yellow}Monitoring for: iradwatkins@gmail.com${colors.reset}`);
console.log(`${colors.green}✅ Ready for Google login attempt${colors.reset}`);
console.log('');
console.log(`${colors.bright}Instructions:${colors.reset}`);
console.log('1. Go to: https://magazine.stepperslife.com/sign-in');
console.log('2. Click "Continue with Google"');
console.log('3. Select your account');
console.log('4. Watch this terminal for real-time updates');
console.log('');
console.log(`${colors.cyan}Press Ctrl+C to stop monitoring${colors.reset}`);
console.log('');
console.log(`${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log('');

// Function to check PM2 logs for errors
async function checkLogs() {
  return new Promise((resolve) => {
    exec('pm2 logs magazine-stepperslife --lines 5 --nostream 2>&1 | grep -i "error\\|warn\\|fail" || true', (error, stdout) => {
      if (stdout && stdout.trim()) {
        const lines = stdout.trim().split('\n').slice(-3); // Last 3 error lines
        if (lines.some(line => line.length > 0)) {
          console.log(`${colors.red}⚠️  Log Errors Detected:${colors.reset}`);
          lines.forEach(line => {
            if (line.includes('error') || line.includes('Error')) {
              console.log(`   ${colors.red}${line}${colors.reset}`);
            } else {
              console.log(`   ${colors.yellow}${line}${colors.reset}`);
            }
          });
        }
      }
      resolve();
    });
  });
}

// Function to check user in database
async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'iradwatkins@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
            access_token: true,
            expires_at: true,
          }
        }
      }
    });

    if (user) {
      const userStr = JSON.stringify(user);
      if (userStr !== lastUserCheck) {
        lastUserCheck = userStr;
        console.log(`${colors.green}✅ USER FOUND:${colors.reset}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Role: ${colors.bright}${user.role}${colors.reset}`);
        if (user.accounts.length > 0) {
          console.log(`   Auth Provider: ${user.accounts[0].provider}`);
          console.log(`   Provider ID: ${user.accounts[0].providerAccountId}`);
        }
        console.log('');
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ Database Error:${colors.reset}`, error.message);
  }
}

// Function to check active sessions
async function checkSessions() {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        expires: { gte: new Date() }
      },
      select: {
        id: true,
        userId: true,
        expires: true,
        sessionToken: true,
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        expires: 'desc'
      },
      take: 5
    });

    const sessionsStr = JSON.stringify(sessions.map(s => s.id));
    if (sessionsStr !== lastSessionCheck && sessions.length > 0) {
      lastSessionCheck = sessionsStr;
      console.log(`${colors.blue}📊 ACTIVE SESSIONS:${colors.reset}`);
      sessions.forEach((session, index) => {
        if (session.user?.email === 'iradwatkins@gmail.com') {
          console.log(`   ${colors.green}✅ Session ${index + 1}: ${session.user.email}${colors.reset}`);
          console.log(`      Token: ${session.sessionToken.substring(0, 20)}...`);
          console.log(`      Role: ${colors.bright}${session.user.role}${colors.reset}`);
          console.log(`      Expires: ${session.expires}`);
        } else if (session.user) {
          console.log(`   Session ${index + 1}: ${session.user.email}`);
        }
      });
      console.log('');
    }
  } catch (error) {
    console.log(`${colors.red}❌ Session Check Error:${colors.reset}`, error.message);
  }
}

// Function to test authentication endpoints
async function testAuthEndpoints() {
  const endpoints = [
    '/api/auth/session',
    '/api/auth/providers',
    '/check-access'
  ];

  for (const endpoint of endpoints) {
    await new Promise((resolve) => {
      https.get(`https://magazine.stepperslife.com${endpoint}`, (res) => {
        if (res.statusCode !== 200) {
          console.log(`${colors.yellow}⚠️  ${endpoint}: Status ${res.statusCode}${colors.reset}`);
        }
        resolve();
      }).on('error', (err) => {
        console.log(`${colors.red}❌ ${endpoint}: ${err.message}${colors.reset}`);
        resolve();
      });
    });
  }
}

// Main monitoring loop
async function monitor() {
  let iteration = 0;

  while (monitoring) {
    iteration++;

    // Show we're still monitoring
    if (iteration % 10 === 0) {
      console.log(`${colors.cyan}⏱️  Still monitoring... (${new Date().toLocaleTimeString()})${colors.reset}`);
    }

    // Check everything
    await Promise.all([
      checkUser(),
      checkSessions(),
      checkLogs(),
      iteration % 5 === 0 ? testAuthEndpoints() : Promise.resolve()
    ]);

    // Wait 2 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  monitoring = false;
  console.log('\n');
  console.log(`${colors.yellow}Stopping monitoring...${colors.reset}`);
  await prisma.$disconnect();
  process.exit(0);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error(`${colors.red}Uncaught Exception:${colors.reset}`, error);
  monitoring = false;
  prisma.$disconnect();
  process.exit(1);
});

// Start monitoring
monitor().catch((error) => {
  console.error(`${colors.red}Monitor Error:${colors.reset}`, error);
  monitoring = false;
  prisma.$disconnect();
  process.exit(1);
});