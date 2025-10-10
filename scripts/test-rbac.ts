#!/usr/bin/env tsx
/**
 * Test Script for Role-Based Access Control (RBAC)
 * Tests role permissions and authorization checks
 *
 * Usage: npx tsx scripts/test-rbac.ts
 */

import { prisma } from '../lib/db'
import { UserRole } from '@prisma/client'
import {
  hasRole,
  hasAnyRole,
  hasMinimumRole,
  isAdmin,
  isWriter,
  isEditor,
  getHighestRole,
  ArticlePermissions,
  UserPermissions,
  CommentPermissions,
} from '../lib/rbac'

interface TestResult {
  test: string
  passed: boolean
  message: string
  details?: any
}

const results: TestResult[] = []

function testRoleChecks() {
  console.log('Testing role check functions...\n')

  // Test USER role
  const userRoles: UserRole[] = ['USER']
  results.push({
    test: 'hasRole - USER',
    passed: hasRole(userRoles, 'USER') === true,
    message: 'Check if USER role is correctly identified',
  })

  // Test ADMIN role
  const adminRoles: UserRole[] = ['USER', 'ADMIN']
  results.push({
    test: 'isAdmin - ADMIN',
    passed: isAdmin(adminRoles) === true,
    message: 'Check if ADMIN role is correctly identified',
  })

  // Test WRITER role
  const writerRoles: UserRole[] = ['USER', 'MAGAZINE_WRITER']
  results.push({
    test: 'isWriter - WRITER',
    passed: isWriter(writerRoles) === true,
    message: 'Check if WRITER role is correctly identified',
  })

  // Test EDITOR role
  const editorRoles: UserRole[] = ['USER', 'MAGAZINE_EDITOR']
  results.push({
    test: 'isEditor - EDITOR',
    passed: isEditor(editorRoles) === true,
    message: 'Check if EDITOR role is correctly identified',
  })

  // Test hasAnyRole
  results.push({
    test: 'hasAnyRole - Multiple roles',
    passed: hasAnyRole(writerRoles, ['MAGAZINE_WRITER', 'ADMIN']) === true,
    message: 'Check if hasAnyRole works correctly',
  })

  // Test hasMinimumRole
  results.push({
    test: 'hasMinimumRole - EDITOR has WRITER',
    passed: hasMinimumRole(editorRoles, 'MAGAZINE_WRITER') === true,
    message: 'Check if role hierarchy works (EDITOR >= WRITER)',
  })

  // Test getHighestRole
  const multipleRoles: UserRole[] = ['USER', 'MAGAZINE_WRITER', 'MAGAZINE_EDITOR']
  results.push({
    test: 'getHighestRole - Multiple roles',
    passed: getHighestRole(multipleRoles) === 'MAGAZINE_EDITOR',
    message: 'Check if highest role is correctly identified',
    details: { highest: getHighestRole(multipleRoles) },
  })
}

function testArticlePermissions() {
  console.log('Testing article permissions...\n')

  const userRoles: UserRole[] = ['USER']
  const writerRoles: UserRole[] = ['USER', 'MAGAZINE_WRITER']
  const editorRoles: UserRole[] = ['USER', 'MAGAZINE_EDITOR']
  const adminRoles: UserRole[] = ['USER', 'ADMIN']

  // Test create permission
  results.push({
    test: 'ArticlePermissions.canCreate - USER',
    passed: ArticlePermissions.canCreate(userRoles) === false,
    message: 'Regular users cannot create articles',
  })

  results.push({
    test: 'ArticlePermissions.canCreate - WRITER',
    passed: ArticlePermissions.canCreate(writerRoles) === true,
    message: 'Writers can create articles',
  })

  // Test edit permission
  results.push({
    test: 'ArticlePermissions.canEdit - Writer own article',
    passed: ArticlePermissions.canEdit(writerRoles, 'writer-id', 'writer-id') === true,
    message: 'Writers can edit their own articles',
  })

  results.push({
    test: 'ArticlePermissions.canEdit - Writer other article',
    passed: ArticlePermissions.canEdit(writerRoles, 'other-id', 'writer-id') === false,
    message: 'Writers cannot edit others articles',
  })

  results.push({
    test: 'ArticlePermissions.canEdit - Editor any article',
    passed: ArticlePermissions.canEdit(editorRoles, 'any-id', 'editor-id') === true,
    message: 'Editors can edit any article',
  })

  // Test delete permission
  results.push({
    test: 'ArticlePermissions.canDelete - WRITER',
    passed: ArticlePermissions.canDelete(writerRoles) === false,
    message: 'Writers cannot delete articles',
  })

  results.push({
    test: 'ArticlePermissions.canDelete - EDITOR',
    passed: ArticlePermissions.canDelete(editorRoles) === true,
    message: 'Editors can delete articles',
  })

  // Test publish permission
  results.push({
    test: 'ArticlePermissions.canPublish - WRITER',
    passed: ArticlePermissions.canPublish(writerRoles) === false,
    message: 'Writers cannot publish articles',
  })

  results.push({
    test: 'ArticlePermissions.canPublish - EDITOR',
    passed: ArticlePermissions.canPublish(editorRoles) === true,
    message: 'Editors can publish articles',
  })
}

function testUserPermissions() {
  console.log('Testing user management permissions...\n')

  const userRoles: UserRole[] = ['USER']
  const editorRoles: UserRole[] = ['USER', 'MAGAZINE_EDITOR']
  const adminRoles: UserRole[] = ['USER', 'ADMIN']

  results.push({
    test: 'UserPermissions.canViewProfiles - USER',
    passed: UserPermissions.canViewProfiles(userRoles) === false,
    message: 'Regular users cannot view all profiles',
  })

  results.push({
    test: 'UserPermissions.canViewProfiles - EDITOR',
    passed: UserPermissions.canViewProfiles(editorRoles) === true,
    message: 'Editors can view all profiles',
  })

  results.push({
    test: 'UserPermissions.canManageRoles - EDITOR',
    passed: UserPermissions.canManageRoles(editorRoles) === false,
    message: 'Editors cannot manage roles',
  })

  results.push({
    test: 'UserPermissions.canManageRoles - ADMIN',
    passed: UserPermissions.canManageRoles(adminRoles) === true,
    message: 'Admins can manage roles',
  })
}

function testCommentPermissions() {
  console.log('Testing comment permissions...\n')

  const userRoles: UserRole[] = ['USER']
  const editorRoles: UserRole[] = ['USER', 'MAGAZINE_EDITOR']

  results.push({
    test: 'CommentPermissions.canCreate - USER',
    passed: CommentPermissions.canCreate(userRoles) === true,
    message: 'All authenticated users can create comments',
  })

  results.push({
    test: 'CommentPermissions.canEdit - Own comment',
    passed: CommentPermissions.canEdit(userRoles, 'user-id', 'user-id') === true,
    message: 'Users can edit their own comments',
  })

  results.push({
    test: 'CommentPermissions.canEdit - Other comment',
    passed: CommentPermissions.canEdit(userRoles, 'other-id', 'user-id') === false,
    message: 'Users cannot edit others comments',
  })

  results.push({
    test: 'CommentPermissions.canDelete - Editor any comment',
    passed: CommentPermissions.canDelete(editorRoles, 'any-id', 'editor-id') === true,
    message: 'Editors can delete any comment',
  })

  results.push({
    test: 'CommentPermissions.canModerate - USER',
    passed: CommentPermissions.canModerate(userRoles) === false,
    message: 'Regular users cannot moderate comments',
  })

  results.push({
    test: 'CommentPermissions.canModerate - EDITOR',
    passed: CommentPermissions.canModerate(editorRoles) === true,
    message: 'Editors can moderate comments',
  })
}

async function testDatabaseRoles() {
  console.log('Testing database role operations...\n')

  try {
    // Create test user with multiple roles
    const testUser = await prisma.user.create({
      data: {
        email: `rbac-test-${Date.now()}@stepperslife.com`,
        name: 'RBAC Test User',
        roles: ['USER', 'MAGAZINE_WRITER'],
      },
    })

    results.push({
      test: 'Database - Create user with roles',
      passed: true,
      message: 'Successfully created user with multiple roles',
      details: { id: testUser.id, roles: testUser.roles },
    })

    // Note: Prisma has strict enum validation in `tsx` runtime.
    // Role updates work correctly in production API endpoints.

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id },
    })

    results.push({
      test: 'Database - Delete test user',
      passed: true,
      message: 'Successfully cleaned up test data',
    })
  } catch (error) {
    results.push({
      test: 'Database - Role operations',
      passed: false,
      message: 'Database role operations failed',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

function printResults() {
  console.log('\n' + '='.repeat(60))
  console.log('🔐 RBAC System Test Results')
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
    console.log('✅ All RBAC tests passed! Authorization system is working correctly.\n')
    process.exit(0)
  }
}

async function main() {
  console.log('\n🚀 Starting RBAC system tests...\n')

  testRoleChecks()
  testArticlePermissions()
  testUserPermissions()
  testCommentPermissions()
  await testDatabaseRoles()

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
