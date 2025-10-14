#!/usr/bin/env node

/**
 * Dashboard Fix Test Script
 * Tests the actual dashboard behavior
 */

const https = require('https');

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function testDashboard() {
  console.log('========================================');
  console.log('🔍 DASHBOARD ACCESS TEST');
  console.log('========================================\n');

  // Test 1: Dashboard without session
  console.log('1. Testing dashboard without authentication:');
  const dashboardResponse = await fetchPage('https://magazine.stepperslife.com/dashboard');

  console.log('   Status Code:', dashboardResponse.status);
  console.log('   Location Header:', dashboardResponse.headers.location || 'None');

  // Check what content is actually returned
  if (dashboardResponse.body.includes('sign-in')) {
    console.log('   ✅ Contains sign-in redirect');
  } else if (dashboardResponse.body.includes('Dashboard')) {
    console.log('   ❌ Shows Dashboard content (should redirect)');
  } else if (dashboardResponse.body.includes('animate-pulse')) {
    console.log('   ❌ Shows loading skeleton (stuck in loading state)');
  } else {
    console.log('   ❓ Unknown response');
  }

  // Test 2: Articles page
  console.log('\n2. Testing articles page without authentication:');
  const articlesResponse = await fetchPage('https://magazine.stepperslife.com/articles');

  console.log('   Status Code:', articlesResponse.status);

  if (articlesResponse.body.includes('animate-pulse')) {
    console.log('   ❌ Shows loading skeleton');
  } else if (articlesResponse.body.includes('Articles')) {
    console.log('   ✅ Shows Articles content');
  } else {
    console.log('   ❓ Unknown response');
  }

  // Test 3: Sign-in page
  console.log('\n3. Testing sign-in page:');
  const signinResponse = await fetchPage('https://magazine.stepperslife.com/sign-in');

  console.log('   Status Code:', signinResponse.status);

  if (signinResponse.body.includes('Continue with Google')) {
    console.log('   ✅ Sign-in page loads correctly');
  } else {
    console.log('   ❌ Sign-in page not loading');
  }

  console.log('\n========================================');
  console.log('📊 ANALYSIS');
  console.log('========================================');

  if (dashboardResponse.body.includes('animate-pulse')) {
    console.log('\n❌ PROBLEM IDENTIFIED:');
    console.log('   The dashboard is stuck showing the loading skeleton');
    console.log('   instead of redirecting to sign-in when not authenticated.');
    console.log('\n   This happens because the page is being statically');
    console.log('   generated at build time without a session context.');
    console.log('\n   SOLUTION: Force dynamic rendering has been applied');
    console.log('   but may need cache clearing or further debugging.');
  }

  console.log('\n========================================');
}

testDashboard().catch(console.error);