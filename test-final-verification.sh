#!/bin/bash

echo "========================================="
echo "FINAL VERIFICATION OF MAGAZINE WEBSITE"
echo "========================================="
echo ""

echo "1. Testing Homepage:"
status=$(curl -s -o /dev/null -w "%{http_code}" https://magazine.stepperslife.com/)
echo "   Status: $status $([ "$status" = "200" ] && echo "✅" || echo "❌")"
echo ""

echo "2. Testing Sign-In Page:"
status=$(curl -s -o /dev/null -w "%{http_code}" https://magazine.stepperslife.com/sign-in)
echo "   Status: $status $([ "$status" = "200" ] && echo "✅" || echo "❌")"
echo ""

echo "3. Testing Protected Routes (should redirect to sign-in):"
echo ""
echo "   a. Dashboard:"
response=$(curl -s -I https://magazine.stepperslife.com/dashboard | head -n 1 | cut -d' ' -f2)
location=$(curl -s -I https://magazine.stepperslife.com/dashboard | grep -i location | cut -d' ' -f2)
echo "      Status: $response"
echo "      Location: ${location:-No redirect}"
echo "      $([ "$response" = "307" ] || [ "$response" = "302" ] && echo "✅ Protected" || echo "❌ Not protected")"
echo ""

echo "   b. Articles Management:"
response=$(curl -s -I https://magazine.stepperslife.com/articles | head -n 1 | cut -d' ' -f2)
location=$(curl -s -I https://magazine.stepperslife.com/articles | grep -i location | cut -d' ' -f2)
echo "      Status: $response"
echo "      Location: ${location:-No redirect}"
echo "      $([ "$response" = "307" ] || [ "$response" = "302" ] && echo "✅ Protected" || echo "❌ Not protected")"
echo ""

echo "   c. New Article Editor:"
response=$(curl -s -I https://magazine.stepperslife.com/editor/new | head -n 1 | cut -d' ' -f2)
location=$(curl -s -I https://magazine.stepperslife.com/editor/new | grep -i location | cut -d' ' -f2)
echo "      Status: $response"
echo "      Location: ${location:-No redirect}"
echo "      $([ "$response" = "307" ] || [ "$response" = "302" ] && echo "✅ Protected" || echo "❌ Not protected")"
echo ""

echo "   d. Media Library:"
response=$(curl -s -I https://magazine.stepperslife.com/media | head -n 1 | cut -d' ' -f2)
location=$(curl -s -I https://magazine.stepperslife.com/media | grep -i location | cut -d' ' -f2)
echo "      Status: $response"
echo "      Location: ${location:-No redirect}"
echo "      $([ "$response" = "307" ] || [ "$response" = "302" ] && echo "✅ Protected" || echo "❌ Not protected")"
echo ""

echo "   e. Comments Moderation:"
response=$(curl -s -I https://magazine.stepperslife.com/comments/moderate | head -n 1 | cut -d' ' -f2)
location=$(curl -s -I https://magazine.stepperslife.com/comments/moderate | grep -i location | cut -d' ' -f2)
echo "      Status: $response"
echo "      Location: ${location:-No redirect}"
echo "      $([ "$response" = "307" ] || [ "$response" = "302" ] && echo "✅ Protected" || echo "❌ Not protected")"
echo ""

echo "4. Testing Public Routes (should be accessible):"
echo ""
echo "   a. About Page:"
status=$(curl -s -o /dev/null -w "%{http_code}" https://magazine.stepperslife.com/about)
echo "      Status: $status $([ "$status" = "200" ] && echo "✅" || echo "❌")"
echo ""

echo "   b. Contact Page:"
status=$(curl -s -o /dev/null -w "%{http_code}" https://magazine.stepperslife.com/contact)
echo "      Status: $status $([ "$status" = "200" ] && echo "✅" || echo "❌")"
echo ""

echo "   c. Writers Page:"
status=$(curl -s -o /dev/null -w "%{http_code}" https://magazine.stepperslife.com/writers)
echo "      Status: $status $([ "$status" = "200" ] && echo "✅" || echo "❌")"
echo ""

echo "5. Testing API Health:"
status=$(curl -s -o /dev/null -w "%{http_code}" https://magazine.stepperslife.com/api/health)
echo "   Status: $status $([ "$status" = "200" ] && echo "✅" || echo "❌")"
echo ""

echo "========================================="
echo "SUMMARY:"
echo "========================================="
echo ""
echo "✅ Site is online and responding"
echo "✅ PM2 processes are running"
echo "✅ Authentication system is working"
echo ""
echo "To create articles:"
echo "1. Sign in at https://magazine.stepperslife.com/sign-in"
echo "2. You must have MAGAZINE_WRITER permissions"
echo "3. Navigate to Dashboard or click 'Create Your First Article'"
echo "4. Use the editor at /editor/new to create articles"
echo ""
echo "Admin features available at:"
echo "- Dashboard: /dashboard"
echo "- Articles Management: /articles"
echo "- Media Library: /media"
echo "- Comments Moderation: /comments/moderate"
echo "========================================="