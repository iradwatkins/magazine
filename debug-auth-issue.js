const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAuthAndArticle() {
  try {
    console.log('=== Debugging Auth & Article Creation ===\n');

    // 1. Check if we have any sessions
    console.log('1. Checking active sessions...');
    const sessionCount = await prisma.session.count();
    console.log(`   Found ${sessionCount} sessions`);

    if (sessionCount > 0) {
      const recentSession = await prisma.session.findFirst({
        orderBy: { expires: 'desc' },
        include: { user: true }
      });

      if (recentSession) {
        console.log(`   Most recent session:`);
        console.log(`     User: ${recentSession.user?.email}`);
        console.log(`     Expires: ${recentSession.expires}`);
        console.log(`     Expired: ${new Date() > recentSession.expires ? 'YES' : 'NO'}`);
      }
    }
    console.log('');

    // 2. Check users with writer permissions
    console.log('2. Checking users with writer permissions...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      },
      take: 5
    });

    for (const user of users) {
      // Check if user has writer role
      const userRole = await prisma.userRole.findFirst({
        where: {
          userId: user.id,
          role: 'MAGAZINE_WRITER'
        }
      });

      console.log(`   ${user.email}: ${userRole ? '✅ Has writer access' : '❌ No writer access'}`);
    }
    console.log('');

    // 3. Test article creation with the first user
    console.log('3. Testing article creation...');
    const testUser = users[0];

    if (!testUser) {
      console.log('   ❌ No users found to test with');
      return;
    }

    console.log(`   Using user: ${testUser.email}`);

    try {
      // This is what /editor/new does
      const article = await prisma.article.create({
        data: {
          title: 'Debug Test Article',
          slug: `debug-test-${Date.now()}`,
          content: '',
          excerpt: '',
          status: 'DRAFT',
          category: 'OTHER',
          tags: [],
          authorId: testUser.id,
          authorName: testUser.name || testUser.email || 'Anonymous',
          authorPhoto: null,
          authorBio: '',
          viewCount: 0,
          likeCount: 0,
          shareCount: 0,
          isFeatured: false
        }
      });

      console.log('   ✅ Article created successfully!');
      console.log(`      ID: ${article.id}`);
      console.log(`      Slug: ${article.slug}`);

      // Clean up
      await prisma.article.delete({ where: { id: article.id } });
      console.log('   Cleaned up test article\n');

    } catch (createError) {
      console.log('   ❌ Failed to create article:');
      console.log(`      ${createError.message}\n`);
    }

    // 4. Check for any recent articles
    console.log('4. Recent articles in database:');
    const recentArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        authorName: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    if (recentArticles.length === 0) {
      console.log('   No articles found');
    } else {
      recentArticles.forEach(a => {
        console.log(`   - ${a.title} (${a.status}) by ${a.authorName}`);
        console.log(`     Created: ${a.createdAt}`);
      });
    }
    console.log('');

    console.log('=== Diagnosis Complete ===\n');
    console.log('If article creation works here but fails in the app, the issue might be:');
    console.log('1. Session/cookie problems (check NEXTAUTH_SECRET)');
    console.log('2. Permission checking failing');
    console.log('3. Client-side JavaScript errors');
    console.log('4. Middleware blocking the request');

  } catch (error) {
    console.error('Error during debugging:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuthAndArticle();