#!/usr/bin/env tsx
/**
 * Grant Writer Role Script
 *
 * Grants MAGAZINE_WRITER or MAGAZINE_EDITOR role to a user by email
 *
 * Usage:
 *   npx tsx scripts/grant-writer-role.ts <email> [role]
 *
 * Examples:
 *   npx tsx scripts/grant-writer-role.ts ira@irawatkins.com
 *   npx tsx scripts/grant-writer-role.ts user@example.com MAGAZINE_EDITOR
 */

import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function grantWriterRole(email: string, role: UserRole = 'MAGAZINE_WRITER') {
  try {
    console.log(`\n🔍 Looking for user: ${email}`)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      console.log('\n💡 Tip: User must sign in at least once before roles can be assigned')
      process.exit(1)
    }

    console.log(`\n✅ User found:`)
    console.log(`   Name: ${user.name || 'Not set'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Current Role: ${user.role}`)

    // Check if user already has the role
    if (user.role === role) {
      console.log(`\n✅ User already has role: ${role}`)
      process.exit(0)
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    console.log(`\n✅ Role updated successfully!`)
    console.log(`   Previous Role: ${user.role}`)
    console.log(`   New Role: ${updatedUser.role}`)
    console.log(`\n✨ User can now access the magazine dashboard and create articles`)
  } catch (error) {
    console.error('❌ Error granting writer role:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const email = process.argv[2]
const roleArg = process.argv[3]

if (!email) {
  console.error('❌ Error: Email is required')
  console.log('\nUsage:')
  console.log('  npx tsx scripts/grant-writer-role.ts <email> [role]')
  console.log('\nExamples:')
  console.log('  npx tsx scripts/grant-writer-role.ts ira@irawatkins.com')
  console.log('  npx tsx scripts/grant-writer-role.ts user@example.com MAGAZINE_EDITOR')
  console.log('\nAvailable roles:')
  console.log('  - MAGAZINE_WRITER (default)')
  console.log('  - MAGAZINE_EDITOR')
  console.log('  - ADMIN')
  process.exit(1)
}

// Validate role if provided
const validRoles: UserRole[] = ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN']
let role: UserRole = 'MAGAZINE_WRITER'

if (roleArg) {
  if (!validRoles.includes(roleArg as UserRole)) {
    console.error(`❌ Error: Invalid role "${roleArg}"`)
    console.log('\nValid roles: MAGAZINE_WRITER, MAGAZINE_EDITOR, ADMIN')
    process.exit(1)
  }
  role = roleArg as UserRole
}

// Execute
grantWriterRole(email, role)
