#!/usr/bin/env npx tsx
/**
 * Test Authentication Configuration
 */

console.log('🔐 Authentication Configuration Test\n')
console.log('=' .repeat(70))

// Test environment variables
console.log('📋 Environment Variables:')
console.log('-' .repeat(70))

const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'AUTH_TRUST_HOST',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL',
]

const envStatus: Record<string, boolean> = {}

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar]
  const isSet = !!value
  envStatus[envVar] = isSet

  if (isSet) {
    if (envVar.includes('SECRET') || envVar.includes('PASSWORD')) {
      console.log(`✅ ${envVar}: [REDACTED]`)
    } else if (envVar === 'DATABASE_URL') {
      console.log(`✅ ${envVar}: [DATABASE CONNECTION]`)
    } else {
      console.log(`✅ ${envVar}: ${value}`)
    }
  } else {
    console.log(`❌ ${envVar}: NOT SET`)
  }
}

console.log('\n📌 Google OAuth Callback URLs:')
console.log('-' .repeat(70))
console.log('Add these to Google Cloud Console:')
console.log(`1. Authorized JavaScript origins:`)
console.log(`   - https://magazine.stepperslife.com`)
console.log(`   - http://localhost:3007 (for development)`)
console.log(`\n2. Authorized redirect URIs:`)
console.log(`   - https://magazine.stepperslife.com/api/auth/callback/google`)
console.log(`   - http://localhost:3007/api/auth/callback/google (for development)`)

console.log('\n🔍 Configuration Status:')
console.log('-' .repeat(70))

const allSet = Object.values(envStatus).every(status => status)
if (allSet) {
  console.log('✅ All required environment variables are configured')
} else {
  console.log('❌ Some environment variables are missing')
  console.log('\n⚠️  Missing variables:')
  for (const [key, value] of Object.entries(envStatus)) {
    if (!value) {
      console.log(`   - ${key}`)
    }
  }
}

console.log('\n📝 Test Authentication URLs:')
console.log('-' .repeat(70))
console.log(`Sign In: https://magazine.stepperslife.com/sign-in`)
console.log(`API Auth: https://magazine.stepperslife.com/api/auth/providers`)
console.log(`Google OAuth: https://magazine.stepperslife.com/api/auth/signin/google`)

console.log('\n💡 Debugging Tips:')
console.log('-' .repeat(70))
console.log('1. Check browser console for errors')
console.log('2. Check PM2 logs: pm2 logs magazine-stepperslife --lines 100')
console.log('3. Test providers endpoint: curl https://magazine.stepperslife.com/api/auth/providers')
console.log('4. Verify Google OAuth consent screen is configured')
console.log('5. Ensure app is in production mode in Google Cloud Console')

console.log('\n' + '=' .repeat(70))

// Test database connection
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('\n🗄️  Testing Database Connection...')
  console.log('-' .repeat(70))

  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)

    const sessionCount = await prisma.session.count()
    console.log(`📊 Active sessions: ${sessionCount}`)

  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase().then(() => {
  console.log('\n' + '=' .repeat(70))
  console.log('✅ Configuration test complete')
  console.log('=' .repeat(70))
})