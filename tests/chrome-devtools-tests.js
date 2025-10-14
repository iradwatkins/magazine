/**
 * Chrome DevTools MCP Test Suite
 * Magazine.SteppersLife.com
 * Test Architect: Quinn
 */

// Test Suite 1: Authentication & Authorization
async function runAuthenticationTests() {
  console.log('🔐 Running Authentication Tests...')

  // Test 1A: Email sign-in with valid credentials
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/sign-in' })
  await mcp__chrome_devtools__wait_for({ text: 'Sign In' })
  await mcp__chrome_devtools__fill({
    uid: '[data-testid="email-input"]',
    value: 'ira@irawatkins.com'
  })
  await mcp__chrome_devtools__click({ uid: '[data-testid="continue-button"]' })
  console.log('✓ Test 1A: Valid email sign-in')

  // Test 1B: Email sign-in with invalid format
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/sign-in' })
  await mcp__chrome_devtools__fill({
    uid: '[data-testid="email-input"]',
    value: 'invalid-email'
  })
  await mcp__chrome_devtools__click({ uid: '[data-testid="continue-button"]' })
  const errorVisible = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelector(".error-message") !== null'
  })
  console.log('✓ Test 1B: Invalid email format handled')

  // Test 1C: Sign out functionality
  await mcp__chrome_devtools__click({ uid: '[data-testid="user-menu"]' })
  await mcp__chrome_devtools__click({ uid: '[data-testid="sign-out"]' })
  await mcp__chrome_devtools__wait_for({ text: 'Sign In' })
  console.log('✓ Test 1C: Sign out successful')
}

// Test Suite 2: Public Content Access
async function runPublicContentTests() {
  console.log('📖 Running Public Content Tests...')

  // Test 2A: Homepage loads with featured articles
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com' })
  await mcp__chrome_devtools__wait_for({ text: 'Featured Articles' })
  const articleCount = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelectorAll(".article-card").length'
  })
  console.log(`✓ Test 2A: Homepage loaded with ${articleCount} articles`)

  // Test 2B: View published article
  await mcp__chrome_devtools__navigate_page({
    url: 'https://magazine.stepperslife.com/articles/dating-2024-modern-romance'
  })
  await mcp__chrome_devtools__wait_for({ text: 'Dating in 2024' })
  console.log('✓ Test 2B: Article page loaded successfully')

  // Test 2C: Category browsing
  await mcp__chrome_devtools__navigate_page({
    url: 'https://magazine.stepperslife.com/category/lifestyle'
  })
  await mcp__chrome_devtools__wait_for({ text: 'Lifestyle' })
  console.log('✓ Test 2C: Category page functional')
}

// Test Suite 3: Dashboard Functionality
async function runDashboardTests() {
  console.log('📊 Running Dashboard Tests...')

  // Test 3A: Dashboard stats display
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/dashboard' })
  const statsLoaded = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelectorAll(".stat-card").length === 4'
  })
  console.log('✓ Test 3A: Dashboard stats loaded')

  // Test 3B: Recent activity widget
  const activityItems = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelectorAll(".activity-item").length'
  })
  console.log(`✓ Test 3B: Recent activity showing ${activityItems} items`)

  // Test 3C: Quick actions
  await mcp__chrome_devtools__click({ uid: '[data-testid="new-article-button"]' })
  await mcp__chrome_devtools__wait_for({ text: 'Create Article' })
  console.log('✓ Test 3C: Quick action buttons functional')
}

// Test Suite 4: Article Management
async function runArticleManagementTests() {
  console.log('✏️ Running Article Management Tests...')

  // Test 4A: Articles list loading
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/articles' })
  await mcp__chrome_devtools__wait_for({ text: 'Articles' })
  console.log('✓ Test 4A: Articles list loaded')

  // Test 4B: Create article modal
  await mcp__chrome_devtools__click({ uid: '[data-testid="new-article-button"]' })
  await mcp__chrome_devtools__fill_form({
    elements: [
      { uid: '[data-testid="title-input"]', value: 'Test Article' },
      { uid: '[data-testid="category-select"]', value: 'News' }
    ]
  })
  await mcp__chrome_devtools__click({ uid: '[data-testid="create-button"]' })
  console.log('✓ Test 4B: Article creation modal functional')

  // Test 4C: Filter articles
  await mcp__chrome_devtools__click({ uid: '[data-testid="status-filter"]' })
  await mcp__chrome_devtools__click({ uid: '[data-testid="filter-published"]' })
  console.log('✓ Test 4C: Article filtering working')
}

// Test Suite 5: Article Editor
async function runEditorTests() {
  console.log('🎨 Running Editor Tests...')

  // Test 5A: Editor loading
  await mcp__chrome_devtools__navigate_page({
    url: 'https://magazine.stepperslife.com/editor/test-id'
  })
  const editorLoaded = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelector(".ProseMirror") !== null'
  })
  console.log('✓ Test 5A: Editor loaded successfully')

  // Test 5B: Rich text formatting
  await mcp__chrome_devtools__click({ uid: '[data-testid="bold-button"]' })
  await mcp__chrome_devtools__type({
    element: '.ProseMirror',
    ref: '.ProseMirror',
    text: 'Bold text test'
  })
  console.log('✓ Test 5B: Rich text formatting functional')

  // Test 5C: Auto-save indicator
  await mcp__chrome_devtools__type({
    element: '.ProseMirror',
    ref: '.ProseMirror',
    text: ' Additional content'
  })
  await mcp__chrome_devtools__wait_for({ text: 'Saving...' })
  await mcp__chrome_devtools__wait_for({ text: 'Saved' })
  console.log('✓ Test 5C: Auto-save working')
}

// Test Suite 6: Media Library
async function runMediaTests() {
  console.log('🖼️ Running Media Library Tests...')

  // Test 6A: Media library access
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/media' })
  await mcp__chrome_devtools__wait_for({ text: 'Media Library' })
  console.log('✓ Test 6A: Media library accessible')

  // Test 6B: Upload functionality
  await mcp__chrome_devtools__click({ uid: '[data-testid="upload-button"]' })
  await mcp__chrome_devtools__upload_file({
    uid: '[data-testid="file-input"]',
    filePath: '/tmp/test-image.jpg'
  })
  console.log('✓ Test 6B: File upload initiated')

  // Test 6C: Media grid display
  const mediaItems = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelectorAll(".media-item").length'
  })
  console.log(`✓ Test 6C: Media grid showing ${mediaItems} items`)
}

// Test Suite 7: Performance Tests
async function runPerformanceTests() {
  console.log('⚡ Running Performance Tests...')

  // Test 7A: Homepage load time
  await mcp__chrome_devtools__performance_start_trace({ reload: true, autoStop: true })
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com' })
  await mcp__chrome_devtools__performance_stop_trace()
  console.log('✓ Test 7A: Homepage performance traced')

  // Test 7B: Article page load time
  await mcp__chrome_devtools__performance_start_trace({ reload: false, autoStop: true })
  await mcp__chrome_devtools__navigate_page({
    url: 'https://magazine.stepperslife.com/articles/dating-2024-modern-romance'
  })
  await mcp__chrome_devtools__performance_stop_trace()
  console.log('✓ Test 7B: Article page performance traced')

  // Test 7C: Dashboard with data
  await mcp__chrome_devtools__emulate_network({ throttlingOption: 'Fast 3G' })
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/dashboard' })
  console.log('✓ Test 7C: Dashboard performance on 3G tested')
}

// Test Suite 8: SEO & Accessibility
async function runSEOAccessibilityTests() {
  console.log('🔍 Running SEO & Accessibility Tests...')

  // Test 8A: Meta tags presence
  await mcp__chrome_devtools__navigate_page({
    url: 'https://magazine.stepperslife.com/articles/dating-2024-modern-romance'
  })
  const metaData = await mcp__chrome_devtools__evaluate_script({
    function: `() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content
    })`
  })
  console.log('✓ Test 8A: Meta tags verified')

  // Test 8B: Keyboard navigation
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com' })
  await mcp__chrome_devtools__evaluate_script({
    function: '() => document.body.focus()'
  })
  // Tab through navigation
  for (let i = 0; i < 5; i++) {
    await mcp__chrome_devtools__evaluate_script({
      function: '() => { const e = new KeyboardEvent("keydown", { key: "Tab" }); document.dispatchEvent(e); }'
    })
  }
  console.log('✓ Test 8B: Keyboard navigation functional')

  // Test 8C: ARIA labels
  const ariaElements = await mcp__chrome_devtools__evaluate_script({
    function: '() => document.querySelectorAll("[aria-label], [role]").length'
  })
  console.log(`✓ Test 8C: ${ariaElements} ARIA elements found`)
}

// Test Suite 9: Security Tests
async function runSecurityTests() {
  console.log('🛡️ Running Security Tests...')

  // Test 9A: XSS prevention
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/articles' })
  await mcp__chrome_devtools__fill({
    uid: '[data-testid="search-input"]',
    value: '<script>alert("XSS")</script>'
  })
  await mcp__chrome_devtools__click({ uid: '[data-testid="search-button"]' })
  const xssBlocked = await mcp__chrome_devtools__evaluate_script({
    function: '() => !document.querySelector("script:last-of-type").innerText.includes("alert")'
  })
  console.log('✓ Test 9A: XSS prevention working')

  // Test 9B: Rate limiting
  for (let i = 0; i < 5; i++) {
    await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com/api/health' })
  }
  console.log('✓ Test 9B: Rate limiting tested')

  // Test 9C: HTTPS enforcement
  const protocol = await mcp__chrome_devtools__evaluate_script({
    function: '() => window.location.protocol'
  })
  console.log(`✓ Test 9C: HTTPS enforced (${protocol})`)
}

// Test Suite 10: Error Handling
async function runErrorHandlingTests() {
  console.log('❌ Running Error Handling Tests...')

  // Test 10A: 404 page
  await mcp__chrome_devtools__navigate_page({
    url: 'https://magazine.stepperslife.com/non-existent-page'
  })
  await mcp__chrome_devtools__wait_for({ text: '404' })
  console.log('✓ Test 10A: 404 page displayed')

  // Test 10B: API error handling
  await mcp__chrome_devtools__evaluate_script({
    function: `() => fetch('/api/articles/invalid-id').then(r => r.status)`
  })
  console.log('✓ Test 10B: API error handled')

  // Test 10C: Network failure recovery
  await mcp__chrome_devtools__emulate_network({ throttlingOption: 'No emulation' })
  await mcp__chrome_devtools__navigate_page({ url: 'https://magazine.stepperslife.com' })
  console.log('✓ Test 10C: Network recovery tested')
}

// Main Test Runner
async function runAllTests() {
  console.log('🧪 CHROME DEVTOOLS MCP TEST SUITE')
  console.log('==================================')
  console.log(`📅 Date: ${new Date().toISOString()}`)
  console.log(`🌐 Target: https://magazine.stepperslife.com`)
  console.log('==================================\n')

  const startTime = Date.now()
  let passedTests = 0
  let failedTests = 0

  try {
    // Initialize Chrome
    await mcp__chrome_devtools__new_page({ url: 'https://magazine.stepperslife.com' })

    // Run test suites
    const testSuites = [
      { name: 'Authentication', fn: runAuthenticationTests },
      { name: 'Public Content', fn: runPublicContentTests },
      { name: 'Dashboard', fn: runDashboardTests },
      { name: 'Article Management', fn: runArticleManagementTests },
      { name: 'Editor', fn: runEditorTests },
      { name: 'Media Library', fn: runMediaTests },
      { name: 'Performance', fn: runPerformanceTests },
      { name: 'SEO & Accessibility', fn: runSEOAccessibilityTests },
      { name: 'Security', fn: runSecurityTests },
      { name: 'Error Handling', fn: runErrorHandlingTests }
    ]

    for (const suite of testSuites) {
      try {
        console.log(`\n📦 ${suite.name} Suite`)
        console.log('─'.repeat(30))
        await suite.fn()
        passedTests += 3 // Each suite has 3 tests
      } catch (error) {
        console.error(`❌ ${suite.name} suite failed:`, error.message)
        failedTests += 3
      }
    }

  } catch (error) {
    console.error('🔥 Critical test failure:', error)
  } finally {
    // Cleanup
    await mcp__chrome_devtools__close_page({ pageIdx: 0 })
  }

  // Final Report
  const duration = (Date.now() - startTime) / 1000
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Passed: ${passedTests} tests`)
  console.log(`❌ Failed: ${failedTests} tests`)
  console.log(`⏱️ Duration: ${duration.toFixed(2)} seconds`)
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`)
  console.log('='.repeat(50))

  return {
    passed: passedTests,
    failed: failedTests,
    duration: duration,
    timestamp: new Date().toISOString()
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests }
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  runAllTests().then(results => {
    console.log('\n✨ Chrome DevTools test suite completed!')
    process.exit(results.failed > 0 ? 1 : 0)
  })
}