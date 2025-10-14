/**
 * Publish all articles - set them all to PUBLISHED status
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get all articles to check their current status
  const allArticles = await prisma.article.findMany({
    select: { id: true, title: true, status: true, slug: true }
  })

  console.log(`\n📊 Total articles: ${allArticles.length}\n`)

  // Update each article individually to PUBLISHED
  let publishedCount = 0

  for (const article of allArticles) {
    console.log(`Processing: ${article.title} (status: ${article.status || 'NULL'})`)

    await prisma.article.update({
      where: { id: article.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: article.status === 'PUBLISHED' ? undefined : new Date()
      }
    })

    publishedCount++
  }

  console.log(`\n✅ Successfully published ${publishedCount} articles!`)
  console.log(`\nTest URLs:`)
  allArticles.slice(0, 3).forEach(article => {
    console.log(`  - https://magazine.stepperslife.com/articles/${article.slug}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
