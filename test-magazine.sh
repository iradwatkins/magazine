#!/bin/bash

# Comprehensive Magazine Website Testing Script
echo "=========================================="
echo "🧪 TESTING MAGAZINE.STEPPERSLIFE.COM"
echo "=========================================="
echo ""

BASE_URL="https://magazine.stepperslife.com"
PASS=0
FAIL=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_url() {
    local url=$1
    local description=$2
    local expected_code=${3:-200}

    echo -n "Testing: $description... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)

    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response)"
        ((FAIL++))
        return 1
    fi
}

# Test content presence
test_content() {
    local url=$1
    local search_text=$2
    local description=$3

    echo -n "Testing: $description... "

    response=$(curl -s "$url" 2>&1)

    if echo "$response" | grep -q "$search_text"; then
        echo -e "${GREEN}✓ PASS${NC} (Content found)"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Content not found)"
        ((FAIL++))
        return 1
    fi
}

echo "📄 TESTING MAIN PAGES"
echo "----------------------------------------"
test_url "$BASE_URL" "Home Page"
test_url "$BASE_URL/sign-in" "Sign In Page"
echo ""

echo "📁 TESTING CATEGORY PAGES"
echo "----------------------------------------"
test_url "$BASE_URL/category/lifestyle" "Lifestyle Category"
test_url "$BASE_URL/category/entertainment" "Entertainment Category"
test_url "$BASE_URL/category/politics" "Politics Category"
test_url "$BASE_URL/category/business" "Business Category"
test_url "$BASE_URL/category/sports" "Sports Category"
test_url "$BASE_URL/category/technology" "Technology Category"
echo ""

echo "📰 TESTING ARTICLE PAGES"
echo "----------------------------------------"
test_url "$BASE_URL/articles/soul-brothers-top-20-week-1" "Soul Brothers Article"
test_url "$BASE_URL/articles/census-2024-community-growth" "Census 2024 Article"
test_url "$BASE_URL/articles/spring-2024-fashion-trends" "Fashion Article"
test_url "$BASE_URL/articles/health-wellness-better-habits" "Health Article"
test_url "$BASE_URL/articles/politics-voices-that-matter" "Politics Article"
test_url "$BASE_URL/articles/dating-2024-modern-romance" "Dating Article"
test_url "$BASE_URL/articles/arts-cultural-movements-today" "Arts Article"
test_url "$BASE_URL/articles/travel-hidden-gems-black-america" "Travel Article"
test_url "$BASE_URL/articles/beauty-grooming-men-essentials" "Beauty Article"
test_url "$BASE_URL/articles/wealth-building-financial-freedom" "Wealth Article"
echo ""

echo "🔗 TESTING API ENDPOINTS"
echo "----------------------------------------"
test_url "$BASE_URL/api/public/articles" "Public Articles API"
test_url "$BASE_URL/api/public/articles?pageSize=5" "API with Pagination"
test_url "$BASE_URL/api/public/articles?category=LIFESTYLE" "API with Category Filter"
echo ""

echo "🔍 TESTING CONTENT PRESENCE"
echo "----------------------------------------"
test_content "$BASE_URL" "SteppersLife" "Home Page Brand"
test_content "$BASE_URL" "Latest Articles" "Home Page Articles Section"
test_content "$BASE_URL/category/lifestyle" "Lifestyle" "Category Header"
test_content "$BASE_URL/articles/soul-brothers-top-20-week-1" "Soul Brothers" "Article Title"
echo ""

echo "🌐 TESTING NAVIGATION LINKS"
echo "----------------------------------------"
# Get home page and check for navigation links
HOME_HTML=$(curl -s "$BASE_URL")

if echo "$HOME_HTML" | grep -q "/category/lifestyle"; then
    echo -e "Navigation link to Lifestyle: ${GREEN}✓ PASS${NC}"
    ((PASS++))
else
    echo -e "Navigation link to Lifestyle: ${RED}✗ FAIL${NC}"
    ((FAIL++))
fi

if echo "$HOME_HTML" | grep -q "/category/entertainment"; then
    echo -e "Navigation link to Entertainment: ${GREEN}✓ PASS${NC}"
    ((PASS++))
else
    echo -e "Navigation link to Entertainment: ${RED}✗ FAIL${NC}"
    ((FAIL++))
fi

if echo "$HOME_HTML" | grep -q "/sign-in"; then
    echo -e "Navigation link to Sign In: ${GREEN}✓ PASS${NC}"
    ((PASS++))
else
    echo -e "Navigation link to Sign In: ${RED}✗ FAIL${NC}"
    ((FAIL++))
fi

echo ""
echo "=========================================="
echo "📊 TEST RESULTS"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
TOTAL=$((PASS + FAIL))
echo "Total: $TOTAL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Website is 100% functional!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review.${NC}"
    exit 1
fi
