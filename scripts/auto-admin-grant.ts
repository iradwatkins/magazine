#!/usr/bin/env npx tsx
/**
 * Auto Admin Grant Script
 * Automatically grants ADMIN role to specific emails when they sign in
 * This can be run periodically to ensure admins have proper access
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Emails that should automatically receive ADMIN role
const AUTO_ADMIN_EMAILS = [
  'ira@irawatkins.com',
  'iradwatkins@gmail.com',
  'bobbygwaatkins@gmail.com'
]

async function main() {
  console.log('🤖 Auto Admin Grant System')
  console.log('=' .repeat(60))
  console.log('Checking for admin accounts that need role updates...\n')

  let updated = 0
  let alreadyAdmin = 0
  let notFound = 0

  for (const email of AUTO_ADMIN_EMAILS) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (user) {
      if (user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' },
        })
        console.log(`✅ Updated: ${email} → ADMIN`)
        console.log(`   Previous role: ${user.role}`)
        updated++
      } else {
        console.log(`✓ Already admin: ${email}`)
        alreadyAdmin++
      }
    } else {
      console.log(`⏳ Not yet registered: ${email}`)
      console.log(`   Will be granted ADMIN on first sign-in`)
      notFound++
    }
  }

  console.log('\n' + '=' .repeat(60))
  console.log('📊 Summary:')
  console.log(`   Updated to ADMIN: ${updated}`)
  console.log(`   Already ADMIN: ${alreadyAdmin}`)
  console.log(`   Not yet registered: ${notFound}`)

  if (notFound > 0) {
    console.log('\n💡 Note: Users not yet registered will automatically')
    console.log('   receive ADMIN role when they first sign in if you')
    console.log('   add this check to your auth callback.')
  }

  console.log('=' .repeat(60))
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })