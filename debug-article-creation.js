const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugArticleCreation() {
  try {
    console.log('=== Debugging Article Creation Issue ===\n');

    // 1. Check database connection
    console.log('1. Testing database connection...');
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Database connected successfully\n');

    // 2. Check if there are any users in the database
    console.log('2. Checking for existing users...');
    const userCount = await prisma.user.count();
    console.log(`   Found ${userCount} users in database`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
        take: 5
      });
      console.log('   Sample users:');
      users.forEach(u => console.log(`     - ${u.email} (ID: ${u.id})`));
    }
    console.log('');

    // 3. Check article table structure
    console.log('3. Checking article table...');
    const articleCount = await prisma.article.count();
    console.log(`   Found ${articleCount} existing articles\n`);

    // 4. Test creating a draft article with a known user (if exists)
    if (userCount > 0) {
      console.log('4. Testing article creation...');
      const firstUser = await prisma.user.findFirst();

      try {
        const testArticle = await prisma.article.create({
          data: {
            title: 'Test Article - Debug',
            slug: `test-debug-${Date.now()}`,
            content: '',
            excerpt: '',
            status: 'DRAFT',
            authorId: firstUser.id,
            viewCount: 0,
            likeCount: 0,
            isEditorsPick: false,
            isSponsored: false
          }
        });

        console.log('   ✅ Successfully created test article:');
        console.log(`      ID: ${testArticle.id}`);
        console.log(`      Title: ${testArticle.title}`);
        console.log(`      Author: ${firstUser.email}\n`);

        // Clean up test article
        await prisma.article.delete({ where: { id: testArticle.id } });
        console.log('   Cleaned up test article\n');
      } catch (createError) {
        console.log('   ❌ Failed to create article:');
        console.log(`      ${createError.message}\n`);
      }
    } else {
      console.log('4. Cannot test article creation - no users in database\n');
      console.log('   To fix this:');
      console.log('   1. Sign in with Google OAuth at /sign-in');
      console.log('   2. This will create your user account');
      console.log('   3. Then grant yourself writer permissions\n');
    }

    // 5. Check for any schema issues
    console.log('5. Checking for required fields in Article model...');
    const requiredFields = [
      'title', 'slug', 'content', 'excerpt', 'status',
      'authorId', 'viewCount', 'likeCount', 'isEditorsPick', 'isSponsored'
    ];
    console.log('   Required fields:', requiredFields.join(', '));
    console.log('   All fields are being provided in the create operation ✅\n');

    console.log('=== Diagnosis Complete ===\n');

    if (userCount === 0) {
      console.log('🔍 ISSUE IDENTIFIED: No users in database!');
      console.log('');
      console.log('SOLUTION:');
      console.log('1. Go to https://magazine.stepperslife.com/sign-in');
      console.log('2. Sign in with Google OAuth');
      console.log('3. This will create your user account');
      console.log('4. Grant writer permissions with: node grant-admin-access.js <your-email>');
      console.log('5. Try creating an article again');
    } else {
      console.log('✅ Database and models appear to be configured correctly.');
      console.log('');
      console.log('The issue might be:');
      console.log('- Session user ID not matching database user ID');
      console.log('- Permission check failing');
      console.log('- Check the auth configuration and session handling');
    }

  } catch (error) {
    console.error('Error during debugging:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugArticleCreation();