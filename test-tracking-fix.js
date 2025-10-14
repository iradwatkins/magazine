#!/usr/bin/env node

console.log('=== TESTING FIXED TRACKING API ===\n');

async function testTracking() {
  const BASE_URL = 'https://magazine.stepperslife.com';

  // Test 1: Send event to tracking API
  console.log('1. Testing POST to /api/debug/track...');
  try {
    const response = await fetch(`${BASE_URL}/api/debug/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'test',
        level: 'info',
        category: 'system',
        message: 'Testing fixed tracking API',
        timestamp: new Date().toISOString(),
        sessionId: 'test-session-' + Date.now()
      })
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(result)}`);

    if (result.success === true) {
      console.log('   ✅ Tracking API is now working!\n');
    } else {
      console.log('   ⚠️  Tracking API returned success: false\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 2: Get events from tracking API
  console.log('2. Testing GET from /api/debug/track...');
  try {
    const response = await fetch(`${BASE_URL}/api/debug/track?type=errors&limit=5`);
    const data = await response.json();

    console.log(`   Status: ${response.status}`);

    if (data.events) {
      console.log(`   ✅ Retrieved ${data.events.length} events`);
      if (data.events.length > 0 && data.events[0]) {
        console.log(`   Latest: ${data.events[0].message || 'No message'}`);
      }
    } else {
      console.log('   No events returned');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n=== SUMMARY ===');
  console.log('The tracking API should now be working.');
  console.log('Refresh the debug dashboard at: https://magazine.stepperslife.com/debug');
  console.log('The errors should stop appearing.');
}

testTracking().catch(console.error);