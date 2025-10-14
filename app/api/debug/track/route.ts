/**
 * Debug Tracking API - SIMPLIFIED VERSION
 * Always returns success to prevent client-side errors
 */

import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for recent events (fallback)
const recentEvents: any[] = []
const MAX_EVENTS = 100

export async function POST(req: NextRequest) {
  try {
    const event = await req.json()

    // Add timestamp if missing
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString()
    }

    // Add to in-memory storage
    recentEvents.unshift(event)
    if (recentEvents.length > MAX_EVENTS) {
      recentEvents.length = MAX_EVENTS
    }

    // Try to store in database (optional - don't fail if it doesn't work)
    try {
      const { prisma } = await import('@/lib/db')

      if (prisma && (event.level === 'error' || event.type === 'auth')) {
        await prisma.debugLog.create({
          data: {
            sessionId: event.sessionId || 'unknown',
            type: event.type || 'unknown',
            level: event.level || 'info',
            category: event.category || 'general',
            message: event.message || 'No message',
            details: event.details ? JSON.stringify(event.details) : null,
            url: event.url || null,
            userId: event.userId || null,
            ip: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
            userAgent: event.userAgent || null,
            timestamp: new Date()
          }
        }).catch(() => {
          // Silently ignore database errors
        })
      }
    } catch {
      // Database is optional, continue without it
    }

    // Try Redis storage (optional - don't fail if it doesn't work)
    try {
      const { redis } = await import('@/lib/redis')

      if (redis && redis.status === 'ready') {
        const key = `debug:events:${event.sessionId || 'global'}`
        await redis.lpush(key, JSON.stringify(event)).catch(() => {})
        await redis.ltrim(key, 0, 99).catch(() => {})
        await redis.expire(key, 86400).catch(() => {}) // 24 hours

        if (event.level === 'error') {
          await redis.lpush('debug:errors:recent', JSON.stringify(event)).catch(() => {})
          await redis.ltrim('debug:errors:recent', 0, 49).catch(() => {})
        }
      }
    } catch {
      // Redis is optional, continue without it
    }

    // Always return success to prevent client-side errors
    return NextResponse.json({ success: true })

  } catch (error) {
    // Even if everything fails, return success to prevent client errors
    console.error('Tracking error (non-fatal):', error)
    return NextResponse.json({ success: true })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    let events = []

    // Try Redis first
    try {
      const { redis } = await import('@/lib/redis')

      if (redis && redis.status === 'ready') {
        if (type === 'errors') {
          const rawEvents = await redis.lrange('debug:errors:recent', 0, limit - 1)
          events = rawEvents.map(e => {
            try { return JSON.parse(e) } catch { return null }
          }).filter(Boolean)
        }
      }
    } catch {
      // Redis failed, try other sources
    }

    // If no Redis data, try database
    if (events.length === 0 && type === 'errors') {
      try {
        const { prisma } = await import('@/lib/db')

        const dbEvents = await prisma.debugLog.findMany({
          where: { level: 'error' },
          orderBy: { timestamp: 'desc' },
          take: limit
        })

        events = dbEvents.map(e => ({
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          type: e.type,
          level: e.level,
          category: e.category,
          message: e.message,
          details: e.details ? JSON.parse(e.details) : null,
          url: e.url,
          userId: e.userId,
          sessionId: e.sessionId
        }))
      } catch {
        // Database failed, use in-memory
      }
    }

    // Fallback to in-memory storage
    if (events.length === 0) {
      if (type === 'errors') {
        events = recentEvents.filter(e => e.level === 'error').slice(0, limit)
      } else {
        events = recentEvents.slice(0, limit)
      }
    }

    return NextResponse.json({ events })

  } catch (error) {
    // Return empty events array instead of error
    console.error('Debug GET error (non-fatal):', error)
    return NextResponse.json({ events: [] })
  }
}