#!/usr/bin/env tsx

/**
 * Health Check Test Script
 * Tests database, Redis, and MinIO connectivity
 */

import { prisma } from '../lib/db'
import { redis } from '../lib/redis'
import { minioClient, BUCKET_NAME } from '../lib/minio'

async function testHealthCheck() {
  console.log('🏥 Testing Health Check Components...\n')

  const results = {
    database: { status: 'unknown', latency: 0, error: null as string | null },
    redis: { status: 'unknown', latency: 0, error: null as string | null },
    minio: { status: 'unknown', latency: 0, error: null as string | null },
  }

  // Test Database
  try {
    console.log('📊 Testing Database Connection...')
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    results.database.latency = Date.now() - dbStart
    results.database.status = 'healthy'
    console.log(`✅ Database: healthy (${results.database.latency}ms)\n`)
  } catch (error) {
    results.database.status = 'unhealthy'
    results.database.error = error instanceof Error ? error.message : 'Unknown error'
    console.log(`❌ Database: unhealthy - ${results.database.error}\n`)
  }

  // Test Redis
  try {
    console.log('🔴 Testing Redis Connection...')
    const redisStart = Date.now()
    await redis.ping()
    results.redis.latency = Date.now() - redisStart
    results.redis.status = 'healthy'
    console.log(`✅ Redis: healthy (${results.redis.latency}ms)\n`)
  } catch (error) {
    results.redis.status = 'unhealthy'
    results.redis.error = error instanceof Error ? error.message : 'Unknown error'
    console.log(`❌ Redis: unhealthy - ${results.redis.error}\n`)
  }

  // Test MinIO
  try {
    console.log('📦 Testing MinIO Connection...')
    const minioStart = Date.now()
    await minioClient.bucketExists(BUCKET_NAME)
    results.minio.latency = Date.now() - minioStart
    results.minio.status = 'healthy'
    console.log(`✅ MinIO: healthy (${results.minio.latency}ms)\n`)
  } catch (error) {
    results.minio.status = 'unhealthy'
    results.minio.error = error instanceof Error ? error.message : 'Unknown error'
    console.log(`❌ MinIO: unhealthy - ${results.minio.error}\n`)
  }

  // Summary
  const allHealthy =
    results.database.status === 'healthy' &&
    results.redis.status === 'healthy' &&
    results.minio.status === 'healthy'

  console.log('='.repeat(50))
  console.log(`Overall Status: ${allHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`)
  console.log('='.repeat(50))
  console.log(JSON.stringify(results, null, 2))

  await prisma.$disconnect()
  await redis.quit()

  process.exit(allHealthy ? 0 : 1)
}

testHealthCheck().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
