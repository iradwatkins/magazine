/**
 * Magazine Seed Data
 * Populates database with sample articles for Steppers Life Magazine
 */

import { PrismaClient, ArticleStatus, ArticleCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Steppers Life Magazine...')

  // Create test users
  const writer = await prisma.user.upsert({
    where: { email: 'ira@irawatkins.com' },
    update: {},
    create: {
      email: 'ira@irawatkins.com',
      name: 'Ira Watkins',
      role: 'MAGAZINE_WRITER',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ira',
    },
  })

  // Create sample commenters
  const commenter1 = await prisma.user.upsert({
    where: { email: 'maria.garcia@example.com' },
    update: {},
    create: {
      email: 'maria.garcia@example.com',
      name: 'Maria Garcia',
      role: 'USER',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
  })

  const commenter2 = await prisma.user.upsert({
    where: { email: 'james.williams@example.com' },
    update: {},
    create: {
      email: 'james.williams@example.com',
      name: 'James Williams',
      role: 'USER',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
  })

  const commenter3 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@example.com' },
    update: {},
    create: {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      role: 'USER',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  })

  const commenter4 = await prisma.user.upsert({
    where: { email: 'david.brown@example.com' },
    update: {},
    create: {
      email: 'david.brown@example.com',
      name: 'David Brown',
      role: 'USER',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
  })

  console.log('✅ Created users:', writer.email)
  console.log('✅ Created commenters:', commenter1.email, commenter2.email, commenter3.email, commenter4.email)

  // Sample articles data
  const articles = [
    {
      title: 'Soul Brothers Top 20: The Hottest Tracks This Week',
      slug: 'soul-brothers-top-20-week-1',
      excerpt:
        'From classic Motown to modern R&B, discover the 20 tracks keeping dance floors packed this week.',
      category: 'MUSIC' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      tags: ['Music', 'Soul Brothers', 'Charts', 'R&B'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: {
            level: 1,
            content: "Soul Brothers Top 20: This Week's Hottest Tracks",
            alignment: 'left',
          },
        },
        {
          id: 'block-2',
          type: 'paragraph',
          order: 1,
          data: {
            content:
              'The charts are in, and this week brings some unexpected movers and shakers. From classic Motown revivals to fresh R&B heat, here are the 20 tracks keeping our dance floors packed.',
            alignment: 'left',
          },
        },
        {
          id: 'block-3',
          type: 'heading',
          order: 2,
          data: { level: 2, content: 'Top 5 Countdown', alignment: 'left' },
        },
        {
          id: 'block-4',
          type: 'list',
          order: 3,
          data: {
            type: 'numbered',
            items: [
              '"Midnight Groove" - The Velvet Voices',
              '"Summer Love" - Destiny Williams',
              '"Keep Dancing" - Soul Syndicate',
              '"Back to You" - Marcus & The Melody Makers',
              '"City Lights" - The Urban Kings',
            ],
          },
        },
      ]),
    },
    {
      title: "Census 2024: Understanding Our Community's Growth",
      slug: 'census-2024-community-growth',
      excerpt:
        'A deep dive into the latest population statistics and what they mean for our neighborhoods.',
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      tags: ['Census', 'Population', 'Community', 'Statistics'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: {
            level: 1,
            content: 'Census 2024: Our Community Grows Stronger',
            alignment: 'left',
          },
        },
        {
          id: 'block-2',
          type: 'paragraph',
          order: 1,
          data: {
            content:
              "The 2024 census reveals fascinating insights about our community's evolution. Population growth, demographic shifts, and economic indicators paint a picture of vibrant, thriving neighborhoods.",
            alignment: 'left',
          },
        },
      ]),
    },
    {
      title: 'Fashion Forward: Spring 2024 Trends',
      slug: 'spring-2024-fashion-trends',
      excerpt:
        "Bold colors, classic silhouettes, and cultural pride dominate this season's runways.",
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
      tags: ['Fashion', 'Trends', 'Style', 'Spring 2024'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: {
            level: 1,
            content: 'Spring 2024: Fashion Takes a Bold Turn',
            alignment: 'center',
          },
        },
        {
          id: 'block-2',
          type: 'quote',
          order: 1,
          data: {
            content: 'Fashion is about expressing who you are without having to speak.',
            attribution: 'Rachel Zoe',
            style: 'pullquote',
          },
        },
      ]),
    },
    {
      title: 'Health & Wellness: Building Better Habits',
      slug: 'health-wellness-better-habits',
      excerpt: 'Simple daily practices that lead to lasting health improvements.',
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      tags: ['Health', 'Wellness', 'Fitness', 'Diet'],
      status: 'DRAFT' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: { level: 1, content: 'Building Better Health Habits', alignment: 'left' },
        },
        {
          id: 'block-2',
          type: 'paragraph',
          order: 1,
          data: {
            content:
              "Transforming your health doesn't require drastic changes. Small, consistent habits compound into remarkable results over time.",
            alignment: 'left',
          },
        },
      ]),
    },
    {
      title: 'Politics & Power: Voices That Matter',
      slug: 'politics-voices-that-matter',
      excerpt: 'Community leaders discuss the issues shaping our future.',
      category: 'NEWS' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620',
      tags: ['Politics', 'Community', 'Leadership', 'Activism'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: {
            level: 1,
            content: 'Voices That Matter: Our Political Landscape',
            alignment: 'left',
          },
        },
      ]),
    },
    {
      title: 'Dating in 2024: Modern Romance Advice',
      slug: 'dating-2024-modern-romance',
      excerpt: 'Navigating love and relationships in the digital age.',
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
      tags: ['Dating', 'Relationships', 'Love', 'Romance'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: { level: 1, content: 'Modern Romance: Dating in 2024', alignment: 'center' },
        },
        {
          id: 'block-2',
          type: 'paragraph',
          order: 1,
          data: {
            content:
              "Finding love has never been more complex—or more exciting. From apps to real-life connections, here's how to navigate modern dating with confidence and authenticity.",
            alignment: 'left',
          },
        },
      ]),
    },
    {
      title: 'The Arts: Cultural Movements Shaping Today',
      slug: 'arts-cultural-movements-today',
      excerpt: 'From galleries to street art, explore the creative revolution.',
      category: 'MUSIC' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
      tags: ['Arts', 'Culture', 'Gallery', 'Street Art'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: {
            level: 1,
            content: 'The Arts: Cultural Movements Shaping Today',
            alignment: 'left',
          },
        },
      ]),
    },
    {
      title: 'Travel Guide: Hidden Gems in Black America',
      slug: 'travel-hidden-gems-black-america',
      excerpt: 'Discover historic sites and vibrant communities worth visiting.',
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
      tags: ['Travel', 'Tourism', 'History', 'Culture'],
      status: 'DRAFT' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: { level: 1, content: 'Hidden Gems: A Travel Guide', alignment: 'center' },
        },
        {
          id: 'block-2',
          type: 'paragraph',
          order: 1,
          data: {
            content:
              "Beyond the tourist traps lie communities rich with history, culture, and soul. Pack your bags for a journey through Black America's hidden treasures.",
            alignment: 'left',
          },
        },
      ]),
    },
    {
      title: 'Beauty & Grooming: Essential Tips for Men',
      slug: 'beauty-grooming-men-essentials',
      excerpt: 'From skincare to style, elevate your grooming game.',
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1621607512214-68297480165e',
      tags: ['Grooming', 'Beauty', 'Skincare', 'Men'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: { level: 1, content: 'Grooming Essentials: Level Up Your Look', alignment: 'left' },
        },
      ]),
    },
    {
      title: 'Wealth Building: Financial Freedom Strategies',
      slug: 'wealth-building-financial-freedom',
      excerpt: 'Practical advice for building generational wealth.',
      category: 'LIFESTYLE' as ArticleCategory,
      featuredImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
      tags: ['Finance', 'Wealth', 'Investment', 'Money'],
      status: 'PUBLISHED' as ArticleStatus,
      content: JSON.stringify([
        {
          id: 'block-1',
          type: 'heading',
          order: 0,
          data: {
            level: 1,
            content: 'Building Wealth: Your Path to Financial Freedom',
            alignment: 'left',
          },
        },
        {
          id: 'block-2',
          type: 'paragraph',
          order: 1,
          data: {
            content:
              'Generational wealth starts with smart decisions today. Learn the strategies successful entrepreneurs use to build lasting financial security.',
            alignment: 'left',
          },
        },
      ]),
    },
  ]

  // Create or update articles and store their IDs
  const createdArticles: { id: string; title: string; slug: string }[] = []
  for (const article of articles) {
    const created = await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        ...article,
        authorId: writer.id,
        authorName: writer.name || 'Ira Watkins',
        authorPhoto: writer.image,
      },
      create: {
        ...article,
        authorId: writer.id,
        authorName: writer.name || 'Ira Watkins',
        authorPhoto: writer.image,
      },
    })
    createdArticles.push({ id: created.id, title: created.title, slug: created.slug })
    console.log(`✅ Upserted article: "${created.title}" (${created.slug})`)
  }

  // Add comments to published articles
  console.log('\n💬 Adding sample comments...')

  // Delete existing comments to avoid duplicates (for re-runs)
  await prisma.comment.deleteMany({})
  console.log('   🗑️ Cleared existing comments')

  // Find published articles to add comments to
  const publishedArticles = createdArticles.filter((_, index) => {
    const articleData = articles[index]
    return articleData.status === 'PUBLISHED'
  })

  // Add comments to first 3 published articles
  if (publishedArticles.length > 0) {
    // Article 1: Soul Brothers Top 20 (multiple comments with nested replies)
    const article1 = publishedArticles[0]

    const comment1 = await prisma.comment.create({
      data: {
        articleId: article1.id,
        userId: commenter1.id,
        userName: commenter1.name || 'Maria Garcia',
        userPhoto: commenter1.image,
        content: 'Love this playlist! "Midnight Groove" has been on repeat all week. The Soul Brothers never disappoint!',
        isApproved: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    })

    // Reply to comment1
    await prisma.comment.create({
      data: {
        articleId: article1.id,
        userId: commenter2.id,
        userName: commenter2.name || 'James Williams',
        userPhoto: commenter2.image,
        content: 'Same here! That track is fire. Have you heard their live version?',
        parentId: comment1.id,
        isApproved: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    })

    // Second-level reply
    await prisma.comment.create({
      data: {
        articleId: article1.id,
        userId: commenter1.id,
        userName: commenter1.name || 'Maria Garcia',
        userPhoto: commenter1.image,
        content: 'Yes! The live version is even better. They did it at the Chicago show last month.',
        parentId: comment1.id,
        isApproved: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    })

    const comment2 = await prisma.comment.create({
      data: {
        articleId: article1.id,
        userId: commenter3.id,
        userName: commenter3.name || 'Sarah Johnson',
        userPhoto: commenter3.image,
        content: 'Great list! I would add "Steppin\' Out" by The Groove Masters. That song is a classic on every dance floor I visit.',
        isApproved: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    })

    await prisma.comment.create({
      data: {
        articleId: article1.id,
        userId: commenter4.id,
        userName: commenter4.name || 'David Brown',
        userPhoto: commenter4.image,
        content: 'Finally, a list that gets it right! City Lights in the top 5 is exactly where it belongs.',
        isApproved: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
    })

    console.log(`   ✅ Added 5 comments (with nested replies) to "${article1.title}"`)
  }

  if (publishedArticles.length > 1) {
    // Article 2: Census 2024 (fewer comments)
    const article2 = publishedArticles[1]

    await prisma.comment.create({
      data: {
        articleId: article2.id,
        userId: commenter2.id,
        userName: commenter2.name || 'James Williams',
        userPhoto: commenter2.image,
        content: 'Really insightful analysis. The demographic shifts you mentioned are exactly what I\'ve been observing in my neighborhood.',
        isApproved: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    })

    await prisma.comment.create({
      data: {
        articleId: article2.id,
        userId: commenter3.id,
        userName: commenter3.name || 'Sarah Johnson',
        userPhoto: commenter3.image,
        content: 'Would love to see more articles like this! Understanding our community growth is so important.',
        isApproved: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    })

    console.log(`   ✅ Added 2 comments to "${article2.title}"`)
  }

  if (publishedArticles.length > 2) {
    // Article 3: Politics & Power (with discussion)
    const article3 = publishedArticles[4] // Index 4 is Politics article

    const parentComment = await prisma.comment.create({
      data: {
        articleId: article3.id,
        userId: commenter1.id,
        userName: commenter1.name || 'Maria Garcia',
        userPhoto: commenter1.image,
        content: 'This is exactly the kind of political coverage we need. Thank you for amplifying these voices!',
        isApproved: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    })

    await prisma.comment.create({
      data: {
        articleId: article3.id,
        userId: commenter4.id,
        userName: commenter4.name || 'David Brown',
        userPhoto: commenter4.image,
        content: 'Agreed! More outlets should focus on local leadership like this.',
        parentId: parentComment.id,
        isApproved: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
    })

    console.log(`   ✅ Added 2 comments (with reply) to "${article3.title}"`)
  }

  console.log('\n🎉 Seed complete! Created:')
  console.log(`   - 5 user accounts (1 writer + 4 commenters)`)
  console.log(`   - ${articles.length} sample articles`)
  console.log(`   - 9 comments with nested replies`)
  console.log('\n📝 Test the magazine at:')
  console.log('   http://magazine.stepperslife.com/articles/{slug}')
  console.log('\n📝 Test the editor at:')
  console.log('   http://magazine.stepperslife.com/articles/{article-id}/edit')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
