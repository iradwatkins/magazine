#!/usr/bin/env tsx
/**
 * Test Script for Magic Link & Google OAuth Authentication
 * Tests NextAuth configuration with Email provider and Google OAuth
 *
 * Usage: npx tsx scripts/test-auth.ts
 */

import { prisma } from '../lib/db'

interface TestResult {
  test: string
  passed: boolean
  message: string
  details?: any
}

const results: TestResult[] = []

async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    results.push({
      test: 'Database Connection',
      passed: true,
      message: 'Successfully connected to PostgreSQL database',
    })
    return true
  } catch (error) {
    results.push({
      test: 'Database Connection',
      passed: false,
      message: 'Failed to connect to database',
      details: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

async function testUserSchema() {
  try {
    // Test creating a user with default role
    const testEmail = `test-${Date.now()}@stepperslife.com`
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test User',
        roles: ['USER'],
      },
    })

    results.push({
      test: 'User Schema - Create User',
      passed: true,
      message: 'Successfully created user with default USER role',
      details: { id: user.id, email: user.email, roles: user.roles },
    })

    // Test reading user
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        accounts: true,
        sessions: true,
      },
    })

    if (!foundUser) {
      results.push({
        test: 'User Schema - Read User',
        passed: false,
        message: 'Failed to find created user',
      })
      return false
    }

    results.push({
      test: 'User Schema - Read User',
      passed: true,
      message: 'Successfully read user from database',
      details: { id: foundUser.id, accountsCount: foundUser.accounts.length },
    })

    // Clean up test user
    await prisma.user.delete({
      where: { id: user.id },
    })

    return true
  } catch (error) {
    results.push({
      test: 'User Schema',
      passed: false,
      message: 'User schema validation failed',
      details: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

async function testVerificationTokenSchema() {
  try {
    // Test that verification token table exists (used for magic links)
    const testToken = await prisma.verificationToken.create({
      data: {
        identifier: `test-${Date.now()}@stepperslife.com`,
        token: `test-token-${Date.now()}`,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    })

    results.push({
      test: 'Verification Token Schema',
      passed: true,
      message: 'Successfully created verification token (for magic links)',
      details: { identifier: testToken.identifier },
    })

    // Clean up
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: testToken.identifier,
          token: testToken.token,
        },
      },
    })

    return true
  } catch (error) {
    results.push({
      test: 'Verification Token Schema',
      passed: false,
      message: 'Verification token schema validation failed',
      details: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

async function testEnvironmentVariables() {
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'RESEND_API_KEY',
    'EMAIL_FROM',
  ]

  const missing: string[] = []
  const placeholder: string[] = []

  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value) {
      missing.push(varName)
    } else if (value.startsWith('your-') || value.startsWith('your_')) {
      placeholder.push(varName)
    }
  }

  if (missing.length > 0) {
    results.push({
      test: 'Environment Variables',
      passed: false,
      message: 'Missing required environment variables',
      details: { missing },
    })
    return false
  }

  if (placeholder.length > 0) {
    results.push({
      test: 'Environment Variables',
      passed: false,
      message: 'Environment variables contain placeholder values (need real credentials)',
      details: { placeholders: placeholder },
    })
    return false
  }

  results.push({
    test: 'Environment Variables',
    passed: true,
    message: 'All required environment variables are set',
  })
  return true
}

async function testAuthEndpoints() {
  try {
    const response = await fetch('http://localhost:3007/api/auth/providers')

    if (!response.ok) {
      results.push({
        test: 'NextAuth Endpoints',
        passed: false,
        message: `Auth providers endpoint returned ${response.status}`,
        details: await response.text(),
      })
      return false
    }

    const providers = await response.json()

    const hasEmail = 'email' in providers || 'nodemailer' in providers
    const hasGoogle = 'google' in providers

    if (!hasEmail || !hasGoogle) {
      results.push({
        test: 'NextAuth Endpoints',
        passed: false,
        message: 'Missing required providers',
        details: {
          hasEmail,
          hasGoogle,
          providers: Object.keys(providers),
        },
      })
      return false
    }

    results.push({
      test: 'NextAuth Endpoints',
      passed: true,
      message: 'Auth endpoints working correctly',
      details: {
        providers: Object.keys(providers),
        emailProvider: hasEmail,
        googleProvider: hasGoogle,
      },
    })
    return true
  } catch (error) {
    results.push({
      test: 'NextAuth Endpoints',
      passed: false,
      message: 'Failed to connect to auth endpoints (is dev server running?)',
      details: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

function printResults() {
  console.log('\n' + '='.repeat(60))
  console.log('🔐 NextAuth Magic Link + Google OAuth Test Results')
  console.log('='.repeat(60) + '\n')

  let passed = 0
  let failed = 0

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.test}`)
    console.log(`   ${result.message}`)
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
    }
    console.log()

    if (result.passed) passed++
    else failed++
  }

  console.log('='.repeat(60))
  console.log(`Total: ${results.length} tests | Passed: ${passed} | Failed: ${failed}`)
  console.log('='.repeat(60) + '\n')

  if (failed > 0) {
    console.log('❌ Some tests failed. Please fix the issues above.\n')
    process.exit(1)
  } else {
    console.log('✅ All tests passed! Authentication is ready.\n')
    process.exit(0)
  }
}

async function main() {
  console.log('\n🚀 Starting authentication tests...\n')

  // Run tests sequentially
  await testEnvironmentVariables()
  const dbConnected = await testDatabaseConnection()

  if (dbConnected) {
    await testUserSchema()
    await testVerificationTokenSchema()
  }

  await testAuthEndpoints()

  // Print results
  printResults()
}

main()
  .catch((error) => {
    console.error('❌ Test suite failed with error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
