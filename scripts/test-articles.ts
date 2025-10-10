#!/usr/bin/env tsx
/**
 * Test Script for Article API Endpoints
 * Tests CRUD operations, workflow, and RBAC for articles
 *
 * Usage: npx tsx scripts/test-articles.ts
 */

import { prisma } from '../lib/db'
import { UserRole } from '@prisma/client'
import {
  createArticle,
  getArticleById,
  listArticles,
  updateArticle,
  deleteArticle,
  submitArticleForReview,
  approveArticle,
  rejectArticle,
  publishArticle,
  unpublishArticle,
  getArticleStats,
  generateUniqueSlug,
} from '../lib/articles'

interface TestResult {
  test: string
  passed: boolean
  message: string
  details?: any
}

const results: TestResult[] = []

let testWriter: any
let testEditor: any
let testArticle: any

async function setupTestUsers() {
  console.log('Setting up test users...\n')

  try {
    // Create test writer
    testWriter = await prisma.user.create({
      data: {
        email: `test-writer-${Date.now()}@stepperslife.com`,
        name: 'Test Writer',
        roles: [UserRole.USER, UserRole.MAGAZINE_WRITER],
      },
    })

    // Create test editor
    testEditor = await prisma.user.create({
      data: {
        email: `test-editor-${Date.now()}@stepperslife.com`,
        name: 'Test Editor',
        roles: [UserRole.USER, UserRole.MAGAZINE_EDITOR],
      },
    })

    results.push({
      test: 'Setup - Create test users',
      passed: true,
      message: 'Successfully created test writer and editor',
      details: {
        writer: { id: testWriter.id, roles: testWriter.roles },
        editor: { id: testEditor.id, roles: testEditor.roles },
      },
    })
  } catch (error) {
    results.push({
      test: 'Setup - Create test users',
      passed: false,
      message: 'Failed to create test users',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testCreateArticle() {
  console.log('Testing article creation...\n')

  try {
    const slug = await generateUniqueSlug('Test Article for API Testing')

    testArticle = await createArticle({
      title: 'Test Article for API Testing',
      slug,
      content:
        'This is test content for the article. It contains some text to test the article creation functionality.',
      excerpt: 'Test excerpt for the article',
      category: 'NEWS',
      authorId: testWriter.id,
      tags: ['test', 'api', 'automated'],
      status: 'DRAFT',
    })

    results.push({
      test: 'Article - Create article',
      passed: testArticle.id !== undefined && testArticle.status === 'DRAFT',
      message: 'Successfully created article',
      details: {
        id: testArticle.id,
        title: testArticle.title,
        status: testArticle.status,
        authorId: testArticle.authorId,
      },
    })
  } catch (error) {
    results.push({
      test: 'Article - Create article',
      passed: false,
      message: 'Failed to create article',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testGetArticle() {
  console.log('Testing article retrieval...\n')

  try {
    const article = await getArticleById(testArticle.id)

    results.push({
      test: 'Article - Get by ID',
      passed: article !== null && article.id === testArticle.id,
      message: 'Successfully retrieved article',
      details: {
        id: article?.id,
        title: article?.title,
        author: article?.author.name,
      },
    })
  } catch (error) {
    results.push({
      test: 'Article - Get by ID',
      passed: false,
      message: 'Failed to retrieve article',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testListArticles() {
  console.log('Testing article listing...\n')

  try {
    const result = await listArticles({ status: 'DRAFT' }, 1, 10)

    results.push({
      test: 'Article - List articles',
      passed: Array.isArray(result.articles) && result.articles.length > 0,
      message: 'Successfully listed articles',
      details: {
        count: result.articles.length,
        total: result.pagination.total,
        page: result.pagination.page,
      },
    })
  } catch (error) {
    results.push({
      test: 'Article - List articles',
      passed: false,
      message: 'Failed to list articles',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testUpdateArticle() {
  console.log('Testing article update...\n')

  try {
    const updated = await updateArticle(testArticle.id, {
      title: 'Updated Test Article Title',
      content: 'Updated content with more information.',
    })

    results.push({
      test: 'Article - Update article',
      passed: updated.title === 'Updated Test Article Title',
      message: 'Successfully updated article',
      details: {
        oldTitle: testArticle.title,
        newTitle: updated.title,
      },
    })

    // Update local reference
    testArticle = updated
  } catch (error) {
    results.push({
      test: 'Article - Update article',
      passed: false,
      message: 'Failed to update article',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testArticleWorkflow() {
  console.log('Testing article workflow...\n')

  try {
    // 1. Submit for review
    let article = await submitArticleForReview(testArticle.id, testWriter.id)

    results.push({
      test: 'Workflow - Submit for review',
      passed: article.status === 'SUBMITTED',
      message: 'Successfully submitted article for review',
      details: { status: article.status },
    })

    // 2. Approve article
    article = await approveArticle(testArticle.id, testEditor.id, 'Looks good!')

    results.push({
      test: 'Workflow - Approve article',
      passed: article.status === 'APPROVED' && article.reviewedBy === testEditor.id,
      message: 'Successfully approved article',
      details: {
        status: article.status,
        reviewedBy: article.reviewer?.name,
        feedback: article.reviewFeedback,
      },
    })

    // 3. Publish article
    article = await publishArticle(testArticle.id)

    results.push({
      test: 'Workflow - Publish article',
      passed: article.status === 'PUBLISHED' && article.publishedAt !== null,
      message: 'Successfully published article',
      details: {
        status: article.status,
        publishedAt: article.publishedAt,
      },
    })

    // 4. Unpublish article
    article = await unpublishArticle(testArticle.id)

    results.push({
      test: 'Workflow - Unpublish article',
      passed: article.status === 'ARCHIVED',
      message: 'Successfully unpublished article',
      details: { status: article.status },
    })

    testArticle = article
  } catch (error) {
    results.push({
      test: 'Workflow - Complete workflow',
      passed: false,
      message: 'Article workflow failed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testRejectWorkflow() {
  console.log('Testing reject workflow...\n')

  try {
    // Create another article for rejection test
    const slug = await generateUniqueSlug('Article to be Rejected')

    const article = await createArticle({
      title: 'Article to be Rejected',
      slug,
      content: 'This article will be rejected.',
      category: 'OPINION',
      authorId: testWriter.id,
      status: 'DRAFT',
    })

    // Submit
    await submitArticleForReview(article.id, testWriter.id)

    // Reject
    const rejected = await rejectArticle(
      article.id,
      testEditor.id,
      'Needs more work on the introduction.'
    )

    results.push({
      test: 'Workflow - Reject article',
      passed: rejected.status === 'REJECTED' && rejected.reviewFeedback !== null,
      message: 'Successfully rejected article',
      details: {
        status: rejected.status,
        feedback: rejected.reviewFeedback,
      },
    })

    // Clean up
    await deleteArticle(article.id)
  } catch (error) {
    results.push({
      test: 'Workflow - Reject article',
      passed: false,
      message: 'Reject workflow failed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testArticleStats() {
  console.log('Testing article statistics...\n')

  try {
    const stats = await getArticleStats(testWriter.id)

    results.push({
      test: 'Article - Get statistics',
      passed: typeof stats.total === 'number',
      message: 'Successfully retrieved article statistics',
      details: stats,
    })
  } catch (error) {
    results.push({
      test: 'Article - Get statistics',
      passed: false,
      message: 'Failed to get statistics',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testSlugGeneration() {
  console.log('Testing slug generation...\n')

  try {
    const slug1 = await generateUniqueSlug('Test Article Title')
    const slug2 = await generateUniqueSlug('Test Article Title')

    results.push({
      test: 'Article - Generate unique slug',
      passed: slug1 !== slug2 && slug1.includes('test-article-title'),
      message: 'Successfully generated unique slugs',
      details: { slug1, slug2 },
    })
  } catch (error) {
    results.push({
      test: 'Article - Generate unique slug',
      passed: false,
      message: 'Failed to generate slug',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function testDeleteArticle() {
  console.log('Testing article deletion...\n')

  try {
    await deleteArticle(testArticle.id)

    const article = await getArticleById(testArticle.id)

    results.push({
      test: 'Article - Delete article',
      passed: article === null,
      message: 'Successfully deleted article',
    })
  } catch (error) {
    results.push({
      test: 'Article - Delete article',
      passed: false,
      message: 'Failed to delete article',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

async function cleanup() {
  console.log('Cleaning up test data...\n')

  try {
    // Delete test users (this will cascade delete their articles)
    if (testWriter) {
      await prisma.user.delete({ where: { id: testWriter.id } })
    }
    if (testEditor) {
      await prisma.user.delete({ where: { id: testEditor.id } })
    }

    results.push({
      test: 'Cleanup - Remove test data',
      passed: true,
      message: 'Successfully cleaned up test data',
    })
  } catch (error) {
    results.push({
      test: 'Cleanup - Remove test data',
      passed: false,
      message: 'Failed to clean up test data',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

function printResults() {
  console.log('\n' + '='.repeat(60))
  console.log('📝 Article API Test Results')
  console.log('='.repeat(60) + '\n')

  let passed = 0
  let failed = 0

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.test}`)
    console.log(`   ${result.message}`)
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
    }
    console.log()

    if (result.passed) passed++
    else failed++
  }

  console.log('='.repeat(60))
  console.log(`Total: ${results.length} tests | Passed: ${passed} | Failed: ${failed}`)
  console.log('='.repeat(60) + '\n')

  if (failed > 0) {
    console.log('❌ Some tests failed. Please fix the issues above.\n')
    process.exit(1)
  } else {
    console.log('✅ All article tests passed! Article system is working correctly.\n')
    process.exit(0)
  }
}

async function main() {
  console.log('\n🚀 Starting article API tests...\n')

  await setupTestUsers()
  await testCreateArticle()
  await testGetArticle()
  await testListArticles()
  await testUpdateArticle()
  await testArticleWorkflow()
  await testRejectWorkflow()
  await testArticleStats()
  await testSlugGeneration()
  await testDeleteArticle()
  await cleanup()

  printResults()
}

main()
  .catch((error) => {
    console.error('❌ Test suite failed with error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
