#!/usr/bin/env tsx
/**
 * Check Articles Script
 *
 * Lists all articles in the database with their details
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkArticles() {
  try {
    console.log('\n📋 Checking articles in database...\n')

    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (articles.length === 0) {
      console.log('❌ No articles found in database')
      console.log('\n💡 Tip: Run seed script to create sample articles')
      process.exit(0)
    }

    console.log(`✅ Found ${articles.length} article(s):\n`)

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`)
      console.log(`   Status: ${article.status}`)
      console.log(`   Category: ${article.category}`)
      console.log(`   Author: ${article.author.name || article.author.email}`)
      console.log(`   Slug: ${article.slug}`)
      console.log(`   Views: ${article.viewCount}`)
      console.log(`   Created: ${article.createdAt.toLocaleDateString()}`)
      if (article.publishedAt) {
        console.log(`   Published: ${article.publishedAt.toLocaleDateString()}`)
      }
      console.log('')
    })

    // Count by status
    const statusCounts = articles.reduce((acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('📊 Status breakdown:')
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`)
    })
    console.log('')
  } catch (error) {
    console.error('❌ Error checking articles:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkArticles()
