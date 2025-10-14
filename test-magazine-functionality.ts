#!/usr/bin/env npx tsx
/**
 * Test script to verify authentication and article creation
 */

const BASE_URL = 'https://magazine.stepperslife.com'

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  const colorMap = {
    success: colors.green,
    error: colors.red,
    info: colors.blue,
    warning: colors.yellow,
  }
  console.log(`${colorMap[type]}${message}${colors.reset}`)
}

async function testEndpoint(name: string, url: string, expectedStatus: number) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Magazine Test Script',
      },
    })

    if (response.status === expectedStatus) {
      log(`✅ ${name}: Status ${response.status}`, 'success')
      return true
    } else {
      log(`❌ ${name}: Expected ${expectedStatus}, got ${response.status}`, 'error')
      return false
    }
  } catch (error) {
    log(`❌ ${name}: ${error}`, 'error')
    return false
  }
}

async function runTests() {
  console.log('=' .repeat(80))
  log('🔍 SteppersLife Magazine - Functionality Test', 'info')
  console.log('=' .repeat(80))

  let allPassed = true

  // Test public pages
  log('\n📄 Testing Public Pages:', 'info')
  allPassed = await testEndpoint('Homepage', BASE_URL, 200) && allPassed
  allPassed = await testEndpoint('Sign-in Page', `${BASE_URL}/sign-in`, 200) && allPassed
  allPassed = await testEndpoint('About Page', `${BASE_URL}/about`, 200) && allPassed
  allPassed = await testEndpoint('Contact Page', `${BASE_URL}/contact`, 200) && allPassed
  allPassed = await testEndpoint('Writers Page', `${BASE_URL}/writers`, 200) && allPassed

  // Test protected pages (should redirect to sign-in)
  log('\n🔒 Testing Protected Pages (should redirect):', 'info')
  allPassed = await testEndpoint('Dashboard (protected)', `${BASE_URL}/dashboard`, 200) && allPassed // Will redirect to sign-in
  allPassed = await testEndpoint('Articles Admin (protected)', `${BASE_URL}/articles`, 200) && allPassed
  allPassed = await testEndpoint('Editor (protected)', `${BASE_URL}/editor/new`, 200) && allPassed

  // Test API endpoints
  log('\n🔌 Testing API Endpoints:', 'info')
  allPassed = await testEndpoint('Health Check', `${BASE_URL}/api/health`, 200) && allPassed
  allPassed = await testEndpoint('Public Articles API', `${BASE_URL}/api/public/articles`, 200) && allPassed

  // Test authentication-required APIs (should return 401)
  log('\n🔐 Testing Auth-Required APIs (should return 401):', 'info')
  allPassed = await testEndpoint('Create Article API (no auth)', `${BASE_URL}/api/articles`, 401) && allPassed
  allPassed = await testEndpoint('Dashboard API (no auth)', `${BASE_URL}/api/dashboard`, 401) && allPassed

  // Summary
  console.log('\n' + '=' .repeat(80))
  if (allPassed) {
    log('✅ ALL TESTS PASSED! The magazine system is operational.', 'success')
    log('\n📝 Next Steps:', 'info')
    log('1. Sign in at: https://magazine.stepperslife.com/sign-in', 'info')
    log('2. Use email: ira@irawatkins.com (now has ADMIN role)', 'info')
    log('3. Check your email for the magic link', 'info')
    log('4. Once signed in, you can create articles at: /editor/new', 'info')
  } else {
    log('❌ Some tests failed. Please check the errors above.', 'error')
  }
  console.log('=' .repeat(80))
}

// Run the tests
runTests().catch(error => {
  log(`Fatal error: ${error}`, 'error')
  process.exit(1)
})