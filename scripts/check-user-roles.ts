#!/usr/bin/env npx tsx
/**
 * Check and update user roles in the database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking user roles...\n')

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (users.length === 0) {
    console.log('❌ No users found in the database')
    console.log('Please sign in first at: https://magazine.stepperslife.com/sign-in')
    return
  }

  console.log('📊 Current Users:')
  console.log('='.repeat(80))

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email || 'No email'}`)
    console.log(`   Name: ${user.name || 'Not set'}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Created: ${user.createdAt.toISOString()}`)
    console.log('-'.repeat(80))
  })

  // Check for admin users
  const adminUsers = users.filter(u => u.role === 'ADMIN')
  const writerUsers = users.filter(u => u.role === 'MAGAZINE_WRITER')
  const editorUsers = users.filter(u => u.role === 'MAGAZINE_EDITOR')

  console.log('\n📈 Role Summary:')
  console.log(`   Admins: ${adminUsers.length}`)
  console.log(`   Editors: ${editorUsers.length}`)
  console.log(`   Writers: ${writerUsers.length}`)
  console.log(`   Regular Users: ${users.filter(u => u.role === 'USER').length}`)

  // Grant admin role to ira@irawatkins.com if exists
  const iraEmail = 'ira@irawatkins.com'
  const iraUser = users.find(u => u.email === iraEmail)

  if (iraUser) {
    if (iraUser.role !== 'ADMIN') {
      console.log(`\n🔧 Granting ADMIN role to ${iraEmail}...`)
      await prisma.user.update({
        where: { id: iraUser.id },
        data: { role: 'ADMIN' },
      })
      console.log(`✅ Successfully granted ADMIN role to ${iraEmail}`)
    } else {
      console.log(`\n✅ ${iraEmail} already has ADMIN role`)
    }
  } else {
    console.log(`\n⚠️  User ${iraEmail} not found. Please sign in first.`)
  }

  // Optionally grant writer role to any user without permissions
  const usersNeedingRoles = users.filter(u => u.role === 'USER' && u.email)
  if (usersNeedingRoles.length > 0) {
    console.log('\n📝 Users without writer permissions:')
    usersNeedingRoles.forEach(u => {
      console.log(`   - ${u.email}`)
    })
    console.log('\nTo grant writer permissions, run:')
    console.log('   npx tsx scripts/grant-writer-role.ts <email>')
  }
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })