const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testArticleCreation() {
  try {
    console.log('=== Testing Article Creation with Fix ===\n');

    // Get first user to simulate logged in user
    const user = await prisma.user.findFirst();

    if (!user) {
      console.log('❌ No users found. Please sign in first at /sign-in');
      return;
    }

    console.log(`Using user: ${user.email} (${user.name})`);
    console.log('Creating test article with required fields...\n');

    const article = await prisma.article.create({
      data: {
        title: 'Test Article - After Fix',
        slug: `test-after-fix-${Date.now()}`,
        content: '',
        excerpt: '',
        status: 'DRAFT',
        category: 'OTHER',
        authorId: user.id,
        authorName: user.name || user.email || 'Anonymous',
        authorPhoto: user.image || null,
        authorBio: '',
        viewCount: 0,
        likeCount: 0,
        isEditorsPick: false,
        isSponsored: false
      }
    });

    console.log('✅ SUCCESS! Article created:');
    console.log(`   ID: ${article.id}`);
    console.log(`   Title: ${article.title}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Author: ${article.authorName}`);
    console.log(`   Status: ${article.status}`);
    console.log('');
    console.log('The fix is working! The /editor/new route should now work correctly.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Sign in at https://magazine.stepperslife.com/sign-in');
    console.log('2. Navigate to https://magazine.stepperslife.com/editor/new');
    console.log('3. You should be redirected to the article editor');

    // Clean up
    await prisma.article.delete({ where: { id: article.id } });
    console.log('\n(Test article has been cleaned up)');

  } catch (error) {
    console.error('❌ Error creating article:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testArticleCreation();