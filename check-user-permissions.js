const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserPermissions() {
  console.log('🔍 Checking User Permissions');
  console.log('========================================');

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'iradwatkins@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        accounts: {
          select: {
            provider: true,
            type: true,
          }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found: iradwatkins@gmail.com');
      console.log('\n📝 Creating user with MAGAZINE_ADMIN role...');

      const newUser = await prisma.user.create({
        data: {
          email: 'iradwatkins@gmail.com',
          name: 'Ira D Watkins',
          role: 'MAGAZINE_ADMIN',
        }
      });

      console.log('✅ User created with MAGAZINE_ADMIN role');
      console.log('   ID:', newUser.id);
      console.log('   Email:', newUser.email);
      console.log('   Role:', newUser.role);
    } else {
      console.log('✅ User found:');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Name:', user.name);
      console.log('   Role:', user.role);
      console.log('   Created:', user.createdAt);
      console.log('   Auth Providers:', user.accounts.map(a => a.provider).join(', ') || 'None');

      // Check if user has the right role
      const validRoles = ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'MAGAZINE_ADMIN'];

      if (!validRoles.includes(user.role)) {
        console.log('\n⚠️  User does not have a valid role for accessing admin pages');
        console.log('   Current role:', user.role);
        console.log('   Required roles:', validRoles.join(', '));

        console.log('\n📝 Updating user role to MAGAZINE_ADMIN...');

        const updated = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'MAGAZINE_ADMIN' }
        });

        console.log('✅ User role updated to:', updated.role);
      } else {
        console.log('\n✅ User has valid role:', user.role);
        console.log('   This role should allow access to:');
        console.log('   • Dashboard (/dashboard)');
        console.log('   • Articles Management (/articles)');
        console.log('   • Media Library (/media)');
        console.log('   • Article Editor (/editor/[id])');
      }
    }

    // List all users with admin roles for reference
    console.log('\n📊 All Users with Admin Access:');
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'MAGAZINE_ADMIN']
        }
      },
      select: {
        email: true,
        name: true,
        role: true
      }
    });

    adminUsers.forEach(u => {
      console.log(`   • ${u.email} - ${u.role}`);
    });

  } catch (error) {
    console.error('Error checking permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserPermissions();