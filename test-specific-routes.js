const https = require('https');

async function testRoute(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'magazine.stepperslife.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const status = res.statusCode;
        const hasError = data.includes('Something Went Wrong') ||
                        data.includes('An error occurred') ||
                        status === 500;

        console.log(`${description}:`);
        console.log(`  Status: ${status}`);
        console.log(`  Has Error: ${hasError ? '❌ YES' : '✅ NO'}`);

        if (hasError && data.length < 5000) {
          // Try to extract error info
          const errorMatch = data.match(/digest[^"]*"([^"]+)"/);
          if (errorMatch) {
            console.log(`  Error Digest: ${errorMatch[1]}`);
          }
        }
        console.log('');
        resolve({ path, status, hasError });
      });
    }).on('error', (err) => {
      console.log(`${description}: ❌ Request failed - ${err.message}\n`);
      resolve({ path, status: 0, hasError: true });
    });
  });
}

async function runTests() {
  console.log('========================================');
  console.log('TESTING SPECIFIC ROUTES FOR 500 ERRORS');
  console.log('========================================\n');

  const routes = [
    { path: '/', desc: 'Homepage' },
    { path: '/articles/soul-brothers-top-20-week-1', desc: 'Article Page' },
    { path: '/dashboard', desc: 'Dashboard (protected)' },
    { path: '/articles', desc: 'Articles Management' },
    { path: '/editor/new', desc: 'New Article Editor' },
    { path: '/media', desc: 'Media Library' },
    { path: '/search', desc: 'Search Page' },
    { path: '/category/lifestyle', desc: 'Category Page' },
    { path: '/author/cmgl4pz2p0000jxfcl7sv6571', desc: 'Author Page' },
    { path: '/sign-in', desc: 'Sign In Page' }
  ];

  const results = [];
  for (const route of routes) {
    const result = await testRoute(route.path, route.desc);
    results.push(result);
  }

  console.log('========================================');
  console.log('SUMMARY:');
  console.log('========================================\n');

  const errors = results.filter(r => r.hasError || r.status === 500);
  if (errors.length > 0) {
    console.log('Pages with errors:');
    errors.forEach(e => {
      console.log(`  ❌ ${e.path}`);
    });
  } else {
    console.log('✅ No 500 errors detected in tested routes');
  }

  const notFound = results.filter(r => r.status === 404);
  if (notFound.length > 0) {
    console.log('\nPages returning 404:');
    notFound.forEach(e => {
      console.log(`  ⚠️ ${e.path}`);
    });
  }
}

runTests();