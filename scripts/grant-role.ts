#!/usr/bin/env npx tsx
/**
 * Grant Role CLI Tool
 * Usage: npx tsx scripts/grant-role.ts <email> <role>
 *
 * Available roles:
 * - ADMIN: Full system access
 * - MAGAZINE_EDITOR: Can edit/publish all articles
 * - MAGAZINE_WRITER: Can create and edit own articles
 * - USER: Basic viewing access
 */

import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

// Valid magazine roles
const VALID_ROLES: UserRole[] = [
  'ADMIN',
  'MAGAZINE_EDITOR',
  'MAGAZINE_WRITER',
  'USER',
]

async function main() {
  const args = process.argv.slice(2)

  if (args.length !== 2) {
    console.log('❌ Invalid usage!')
    console.log('\n📖 Usage: npx tsx scripts/grant-role.ts <email> <role>')
    console.log('\n📋 Available roles:')
    console.log('   • ADMIN - Full system access')
    console.log('   • MAGAZINE_EDITOR - Can edit/publish all articles')
    console.log('   • MAGAZINE_WRITER - Can create and edit own articles')
    console.log('   • USER - Basic viewing access')
    console.log('\n💡 Example: npx tsx scripts/grant-role.ts john@example.com MAGAZINE_WRITER')
    process.exit(1)
  }

  const [email, role] = args
  const upperRole = role.toUpperCase() as UserRole

  // Validate role
  if (!VALID_ROLES.includes(upperRole)) {
    console.log(`❌ Invalid role: ${role}`)
    console.log(`   Valid roles: ${VALID_ROLES.join(', ')}`)
    process.exit(1)
  }

  console.log('🔧 Role Grant System\n')
  console.log('=' .repeat(60))
  console.log(`📧 Email: ${email}`)
  console.log(`🎯 Target Role: ${upperRole}`)
  console.log('=' .repeat(60))

  // Find the user
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

  if (!user) {
    console.log('\n❌ User not found!')
    console.log(`   Email: ${email}`)
    console.log('\n💡 The user needs to sign in at least once before roles can be assigned.')
    console.log('   Direct them to: https://magazine.stepperslife.com/sign-in')
    process.exit(1)
  }

  // Check if already has this role
  if (user.role === upperRole) {
    console.log(`\n✅ User already has ${upperRole} role`)
    console.log(`   Name: ${user.name || 'Not set'}`)
    console.log(`   ID: ${user.id}`)
    process.exit(0)
  }

  // Update the role
  console.log('\n🔄 Updating role...')
  console.log(`   Previous role: ${user.role}`)
  console.log(`   New role: ${upperRole}`)

  await prisma.user.update({
    where: { id: user.id },
    data: { role: upperRole },
  })

  console.log('\n✅ Role successfully updated!')
  console.log(`   User: ${user.email}`)
  console.log(`   Name: ${user.name || 'Not set'}`)
  console.log(`   New Role: ${upperRole}`)

  // Role-specific messages
  console.log('\n📋 User Capabilities:')
  switch (upperRole) {
    case 'ADMIN':
      console.log('   ✓ Full system access')
      console.log('   ✓ Can manage all users and roles')
      console.log('   ✓ Can edit/publish/delete all content')
      console.log('   ✓ Access to all admin panels')
      break
    case 'MAGAZINE_EDITOR':
      console.log('   ✓ Can edit and publish all articles')
      console.log('   ✓ Can moderate comments')
      console.log('   ✓ Can manage writer profiles')
      console.log('   ✓ Access to editorial dashboard')
      break
    case 'MAGAZINE_WRITER':
      console.log('   ✓ Can create new articles')
      console.log('   ✓ Can edit own articles')
      console.log('   ✓ Can submit articles for review')
      console.log('   ✓ Access to writer dashboard')
      break
    case 'USER':
      console.log('   ✓ Can view published articles')
      console.log('   ✓ Can comment on articles')
      console.log('   ✓ Basic account access')
      break
  }

  console.log('\n💡 The user should sign out and sign in again for changes to take effect.')
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