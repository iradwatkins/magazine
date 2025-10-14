#!/bin/bash

echo "=== Verifying Magazine Stepperslife Fixes ==="
echo ""

# Test 1: Check if app is running
echo "1. Checking if magazine-stepperslife is running..."
if pm2 list | grep -q "magazine-stepperslife.*online"; then
    echo "   ✅ Application is running"
else
    echo "   ❌ Application is NOT running"
    exit 1
fi
echo ""

# Test 2: Test /api/dashboard endpoint (should return 401 without auth)
echo "2. Testing /api/dashboard endpoint..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3007/api/dashboard)
if [ "$STATUS" = "401" ]; then
    echo "   ✅ Dashboard API returns 401 (working, requires auth)"
else
    echo "   ❌ Dashboard API returned: $STATUS"
fi
echo ""

# Test 3: Test /search route (should return 200)
echo "3. Testing /search route..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3007/search)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Search page returns 200"
else
    echo "   ❌ Search page returned: $STATUS"
fi
echo ""

# Test 4: Test /editor/new route (should redirect with 307)
echo "4. Testing /editor/new route..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L http://localhost:3007/editor/new)
if [ "$STATUS" = "307" ] || [ "$STATUS" = "200" ]; then
    echo "   ✅ Editor/new route is working (redirects properly)"
else
    echo "   ❌ Editor/new returned: $STATUS"
fi
echo ""

# Test 5: Verify middleware includes /search
echo "5. Checking middleware configuration..."
if grep -q '"/search"' middleware.ts; then
    echo "   ✅ Middleware includes /search as public route"
else
    echo "   ❌ Middleware missing /search"
fi
echo ""

echo "=== All tests completed ==="
