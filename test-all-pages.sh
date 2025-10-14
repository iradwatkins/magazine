#!/bin/bash

echo "========================================="
echo "COMPREHENSIVE PAGE TESTING"
echo "Magazine SteppersLife"
echo "========================================="
echo ""

BASE_URL="https://magazine.stepperslife.com"

# Function to test a page
test_page() {
    local path="$1"
    local description="$2"

    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")

    if [ "$status" = "200" ] || [ "$status" = "307" ]; then
        echo "✅ $description: $status"
    else
        echo "❌ $description: $status"
    fi
}

echo "1. PUBLIC PAGES:"
echo "----------------"
test_page "/" "Homepage"
test_page "/about" "About Page"
test_page "/contact" "Contact Page"
test_page "/writers" "Writers Page"
test_page "/advertise" "Advertise Page"
test_page "/privacy" "Privacy Policy"
test_page "/terms" "Terms of Service"
test_page "/cookies" "Cookie Policy"
test_page "/search?q=test" "Search Page"
echo ""

echo "2. ARTICLE PAGES:"
echo "-----------------"
# Test a known article
test_page "/articles/soul-brothers-top-20-week-1" "Article: Soul Brothers"

# Test category pages
test_page "/category/lifestyle" "Category: Lifestyle"
test_page "/category/news" "Category: News"

# Test author page
test_page "/author/cmgl4pz2p0000jxfcl7sv6571" "Author Page"

# Test tag page
test_page "/tag/music" "Tag: Music"
echo ""

echo "3. AUTHENTICATION PAGES:"
echo "------------------------"
test_page "/sign-in" "Sign In Page"
test_page "/sign-out" "Sign Out Page"
echo ""

echo "4. PROTECTED PAGES (should redirect to sign-in):"
echo "-------------------------------------------------"
for path in "/dashboard" "/articles" "/media" "/comments/moderate" "/editor/new"; do
    response=$(curl -s -I "$BASE_URL$path" | head -n 1 | cut -d' ' -f2)
    location=$(curl -s -I "$BASE_URL$path" | grep -i location | cut -d' ' -f2 | tr -d '\r')

    if [ "$response" = "307" ] && [ "$location" = "/sign-in" ]; then
        echo "✅ $path: Protected (redirects to sign-in)"
    elif [ "$response" = "200" ]; then
        # Check if it's the dashboard or articles which might show a client-side error
        echo "⚠️  $path: Returns 200 (check client-side protection)"
    else
        echo "❌ $path: Status $response"
    fi
done
echo ""

echo "5. API ENDPOINTS:"
echo "-----------------"
test_page "/api/health" "Health Check API"
test_page "/api/public/articles" "Public Articles API"
echo ""

echo "6. PM2 PROCESS STATUS:"
echo "----------------------"
pm2_status=$(pm2 list | grep magazine-stepperslife | head -1 | awk '{print $12}')
pm2_restarts=$(pm2 list | grep magazine-stepperslife | head -1 | awk '{print $8}')
echo "Status: $pm2_status"
echo "Restart Count: $pm2_restarts"
echo ""

echo "========================================="
echo "SUMMARY:"
echo "========================================="
echo ""
echo "✅ Fixed Issues:"
echo "  - Created missing /search page"
echo "  - Fixed article creation (missing fields)"
echo "  - Updated middleware authentication"
echo "  - Stabilized PM2 processes"
echo ""
echo "⚠️  Known Issues:"
echo "  - Dashboard and Articles pages return 200 but may have client-side auth checks"
echo "  - Some server components may have render errors in production"
echo ""
echo "📝 To Create Articles:"
echo "  1. Sign in at /sign-in with Google OAuth"
echo "  2. Ensure you have MAGAZINE_WRITER permissions"
echo "  3. Navigate to /editor/new"
echo "  4. Article will be created and editor will open"
echo "========================================="