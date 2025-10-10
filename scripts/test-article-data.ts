/**
 * Test script to check article data
 */

import { prisma } from '../lib/db'

async function main() {
  console.log('Checking for published articles...\n')

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      viewCount: true,
      likeCount: true,
    },
    take: 5,
  })

  if (articles.length === 0) {
    console.log('No published articles found.')
    console.log('Checking all articles...\n')

    const allArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
      take: 5,
    })

    console.log(`Total articles: ${allArticles.length}`)
    allArticles.forEach((a) => {
      console.log(`  - ${a.title} (${a.slug}) - Status: ${a.status}`)
    })
  } else {
    console.log(`Found ${articles.length} published article(s):\n`)
    articles.forEach((a) => {
      console.log(`  - ${a.title}`)
      console.log(`    URL: /articles/${a.slug}`)
      console.log(`    Views: ${a.viewCount}, Likes: ${a.likeCount}\n`)
    })
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
