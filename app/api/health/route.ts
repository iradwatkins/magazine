import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { redis } from '@/lib/redis'
import { minioClient, BUCKET_NAME } from '@/lib/minio'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'unknown', latency: 0, error: null },
      redis: { status: 'unknown', latency: 0, error: null },
      minio: { status: 'unknown', latency: 0, error: null },
    },
  }

  let overallHealthy = true

  // Check Database
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    checks.services.database.latency = Date.now() - dbStart
    checks.services.database.status = 'healthy'
  } catch (error) {
    checks.services.database.status = 'unhealthy'
    checks.services.database.error = error instanceof Error ? error.message : 'Unknown error'
    overallHealthy = false
  }

  // Check Redis
  try {
    const redisStart = Date.now()
    await redis.ping()
    checks.services.redis.latency = Date.now() - redisStart
    checks.services.redis.status = 'healthy'
  } catch (error) {
    checks.services.redis.status = 'unhealthy'
    checks.services.redis.error = error instanceof Error ? error.message : 'Unknown error'
    overallHealthy = false
  }

  // Check MinIO
  try {
    const minioStart = Date.now()
    await minioClient.bucketExists(BUCKET_NAME)
    checks.services.minio.latency = Date.now() - minioStart
    checks.services.minio.status = 'healthy'
  } catch (error) {
    checks.services.minio.status = 'unhealthy'
    checks.services.minio.error = error instanceof Error ? error.message : 'Unknown error'
    overallHealthy = false
  }

  checks.status = overallHealthy ? 'healthy' : 'unhealthy'

  return NextResponse.json(checks, {
    status: overallHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
