#!/usr/bin/env node

/**
 * Test login flow and debug monitoring
 */

const BASE_URL = 'https://magazine.stepperslife.com';

console.log('=== TESTING LOGIN AND DEBUG MONITORING ===\n');
console.log('Time:', new Date().toISOString());
console.log('URL:', BASE_URL);
console.log('=====================================\n');

async function testDebugPage() {
  console.log('1. Testing Debug Page Access...');
  try {
    const response = await fetch(`${BASE_URL}/debug`, {
      redirect: 'manual'
    });

    console.log(`   Status: ${response.status}`);

    if (response.status === 200) {
      const html = await response.text();
      if (html.includes('Debug Dashboard')) {
        console.log('   ✅ Debug page is now accessible!');
        console.log('   You can visit: https://magazine.stepperslife.com/debug\n');
      } else {
        console.log('   ⚠️  Debug page returned HTML but no dashboard\n');
      }
    } else if (response.status === 307) {
      console.log('   ❌ Debug page still redirects to login');
      console.log('   Location:', response.headers.get('location'), '\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
}

async function testAuthFlow() {
  console.log('2. Testing Authentication Flow...');

  // Get CSRF token
  console.log('   Getting CSRF token...');
  try {
    const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    if (csrfToken) {
      console.log(`   ✅ CSRF token obtained: ${csrfToken.substring(0, 10)}...`);
    } else {
      console.log('   ❌ No CSRF token received');
      return;
    }

    // Try email signin
    console.log('\n   Testing email signin with magic link...');
    const emailResponse = await fetch(`${BASE_URL}/api/auth/signin/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        csrfToken: csrfToken,
        callbackUrl: '/dashboard',
        json: true
      })
    });

    console.log(`   Email signin status: ${emailResponse.status}`);

    if (emailResponse.ok) {
      const result = await emailResponse.json();
      console.log('   Response:', JSON.stringify(result, null, 2));
    } else {
      const text = await emailResponse.text();
      console.log('   Response:', text.substring(0, 200));
    }

  } catch (error) {
    console.log(`   ❌ Auth error: ${error.message}`);
  }
}

async function checkLoginErrors() {
  console.log('\n3. Checking Recent Login Errors...');

  try {
    // Try to get recent events from debug API
    const response = await fetch(`${BASE_URL}/api/debug/track?type=errors&limit=5`);

    if (response.ok) {
      const data = await response.json();

      if (data.events && data.events.length > 0) {
        console.log(`   Found ${data.events.length} recent errors:\n`);

        data.events.forEach((event, i) => {
          console.log(`   Error ${i + 1}:`);
          console.log(`     Message: ${event.message}`);
          console.log(`     Time: ${new Date(event.timestamp).toLocaleTimeString()}`);
          if (event.url) console.log(`     URL: ${event.url}`);
          if (event.details) {
            console.log(`     Details: ${JSON.stringify(event.details).substring(0, 100)}...`);
          }
          console.log();
        });
      } else {
        console.log('   No recent errors found in tracking system');
      }
    } else {
      console.log('   Debug API not returning JSON, checking if it returns HTML...');
      const text = await response.text();
      if (text.includes('<!DOCTYPE')) {
        console.log('   ⚠️  Debug API returning HTML instead of JSON');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error checking debug API: ${error.message}`);
  }
}

async function getAuthProviders() {
  console.log('\n4. Checking Auth Providers...');

  try {
    const response = await fetch(`${BASE_URL}/api/auth/providers`);
    const providers = await response.json();

    console.log('   Available providers:');
    Object.entries(providers).forEach(([id, info]) => {
      console.log(`     - ${id}: ${info.name}`);
    });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function simulateGoogleLogin() {
  console.log('\n5. Simulating Google OAuth Flow...');

  try {
    // Check Google signin endpoint
    const response = await fetch(`${BASE_URL}/api/auth/signin/google`, {
      redirect: 'manual'
    });

    console.log(`   Google signin endpoint status: ${response.status}`);

    if (response.status === 302 || response.status === 307) {
      const location = response.headers.get('location');
      console.log('   Redirects to:', location?.substring(0, 100) + '...');

      if (location && location.includes('accounts.google.com')) {
        console.log('   ✅ Google OAuth is properly configured');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

// Run all tests
(async () => {
  await testDebugPage();
  await testAuthFlow();
  await checkLoginErrors();
  await getAuthProviders();
  await simulateGoogleLogin();

  console.log('\n=== SUMMARY ===');
  console.log('\nTo see what\'s happening when you login:');
  console.log('1. Open: https://magazine.stepperslife.com/debug');
  console.log('2. Try to login at: https://magazine.stepperslife.com/sign-in');
  console.log('3. Watch the debug dashboard for errors');
  console.log('\nThe debug page should now be accessible without login!');
})();