const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function grantAdminAccess() {
  console.log('🔐 Granting Admin Access');
  console.log('========================================');

  try {
    // Update user role to MAGAZINE_EDITOR (highest magazine role)
    const user = await prisma.user.update({
      where: { email: 'iradwatkins@gmail.com' },
      data: { role: 'MAGAZINE_EDITOR' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    console.log('✅ User role successfully updated!');
    console.log('');
    console.log('👤 User Details:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   New Role:', user.role);
    console.log('');
    console.log('✅ Access Granted to:');
    console.log('   • Dashboard (/dashboard)');
    console.log('   • Articles Management (/articles)');
    console.log('   • Media Library (/media)');
    console.log('   • Article Editor (/editor/[id])');
    console.log('   • Comment Moderation');
    console.log('   • All magazine admin features');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('   1. Go to https://magazine.stepperslife.com/dashboard');
    console.log('   2. You should now have full access');
    console.log('   3. If still redirecting, try signing out and back in');
    console.log('');

    // Also check if there's a session that needs updating
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expires: { gte: new Date() }
      },
      select: {
        id: true,
        expires: true,
      }
    });

    if (sessions.length > 0) {
      console.log('📊 Active Sessions:');
      sessions.forEach(s => {
        console.log(`   • Session ${s.id.substring(0, 8)}... expires ${s.expires}`);
      });
      console.log('');
      console.log('⚠️  Note: You may need to sign out and sign in again');
      console.log('   for the new role to take effect in your session.');
    }

  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

grantAdminAccess();