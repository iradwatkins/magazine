#!/usr/bin/env tsx
/**
 * List Users Script
 *
 * Lists all users in the database with their roles
 *
 * Usage:
 *   npx tsx scripts/list-users.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    console.log('\n📋 Fetching all users...\n')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (users.length === 0) {
      console.log('❌ No users found in database')
      console.log('\n💡 Tip: Users must sign in at least once to appear here')
      process.exit(0)
    }

    console.log(`✅ Found ${users.length} user(s):\n`)

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Articles: ${user._count.articles}`)
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
      console.log('')
    })

    console.log('💡 To grant writer role to a user:')
    console.log('   npx tsx scripts/grant-writer-role.ts <email>\n')
  } catch (error) {
    console.error('❌ Error listing users:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
