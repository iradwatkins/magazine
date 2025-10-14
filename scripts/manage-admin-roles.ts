#!/usr/bin/env npx tsx
/**
 * Admin Role Management Script
 * Updates admin roles and provides management capabilities
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Primary admin emails that should have full ADMIN access
const PRIMARY_ADMINS = [
  'ira@irawatkins.com',
  'iradwatkins@gmail.com',
  'bobbygwaatkins@gmail.com'
]

async function main() {
  console.log('🔧 Admin Role Management System\n')
  console.log('=' .repeat(80))

  // Step 1: Update all primary admins
  console.log('📋 Updating Primary Admins:')
  console.log('-' .repeat(80))

  for (const email of PRIMARY_ADMINS) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (user) {
      if (user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' },
        })
        console.log(`✅ ${email}`)
        console.log(`   Previous role: ${user.role}`)
        console.log(`   New role: ADMIN`)
        console.log(`   Name: ${user.name || 'Not set'}`)
      } else {
        console.log(`✅ ${email} - Already ADMIN`)
        console.log(`   Name: ${user.name || 'Not set'}`)
      }
    } else {
      console.log(`⚠️  ${email} - User not found`)
      console.log(`   Action: User needs to sign in first`)
    }
    console.log('-' .repeat(80))
  }

  // Step 2: List all current users and their roles
  console.log('\n📊 All Users in System:')
  console.log('=' .repeat(80))

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: [
      { role: 'asc' },
      { createdAt: 'desc' }
    ],
  })

  // Group users by role
  const usersByRole = allUsers.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = []
    acc[user.role].push(user)
    return acc
  }, {} as Record<string, typeof allUsers>)

  // Display users by role
  const roleOrder = ['ADMIN', 'MAGAZINE_EDITOR', 'MAGAZINE_WRITER', 'USER']

  for (const role of roleOrder) {
    if (usersByRole[role]?.length > 0) {
      console.log(`\n${getRoleEmoji(role)} ${role} (${usersByRole[role].length} users):`)
      usersByRole[role].forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`)
        console.log(`      Name: ${user.name || 'Not set'}`)
        console.log(`      ID: ${user.id}`)
        console.log(`      Joined: ${user.createdAt.toLocaleDateString()}`)
      })
    }
  }

  // Display other roles if any
  for (const [role, users] of Object.entries(usersByRole)) {
    if (!roleOrder.includes(role) && users.length > 0) {
      console.log(`\n${getRoleEmoji(role)} ${role} (${users.length} users):`)
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`)
        console.log(`      Name: ${user.name || 'Not set'}`)
      })
    }
  }

  // Step 3: Summary and instructions
  console.log('\n' + '=' .repeat(80))
  console.log('📝 Summary:')
  console.log(`   Total Users: ${allUsers.length}`)
  console.log(`   Admins: ${usersByRole['ADMIN']?.length || 0}`)
  console.log(`   Editors: ${usersByRole['MAGAZINE_EDITOR']?.length || 0}`)
  console.log(`   Writers: ${usersByRole['MAGAZINE_WRITER']?.length || 0}`)
  console.log(`   Regular Users: ${usersByRole['USER']?.length || 0}`)

  console.log('\n🔑 Admin Capabilities:')
  console.log('   Admins can assign the following roles:')
  console.log('   • MAGAZINE_EDITOR - Can edit/publish all articles')
  console.log('   • MAGAZINE_WRITER - Can create and edit own articles')
  console.log('   • USER - Basic access (view only)')

  console.log('\n💡 To Grant Roles:')
  console.log('   1. Sign in as admin at: https://magazine.stepperslife.com/sign-in')
  console.log('   2. Navigate to: /writers (Writers Management)')
  console.log('   3. Use the role management interface')
  console.log('\n   Or use CLI: npx tsx scripts/grant-role.ts <email> <role>')

  console.log('\n✅ Primary Admin Accounts Ready:')
  for (const email of PRIMARY_ADMINS) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    })
    if (user?.role === 'ADMIN') {
      console.log(`   ✓ ${email}`)
    } else if (!user) {
      console.log(`   ⏳ ${email} (needs to sign in first)`)
    }
  }

  console.log('\n' + '=' .repeat(80))
}

function getRoleEmoji(role: string): string {
  const emojiMap: Record<string, string> = {
    'ADMIN': '👑',
    'MAGAZINE_EDITOR': '📝',
    'MAGAZINE_WRITER': '✍️',
    'USER': '👤',
    'STORE_OWNER': '🏪',
    'RESTAURANT_OWNER': '🍽️',
    'EVENT_ORGANIZER': '🎉',
    'INSTRUCTOR': '👨‍🏫',
    'SERVICE_PROVIDER': '🛠️',
  }
  return emojiMap[role] || '👤'
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })