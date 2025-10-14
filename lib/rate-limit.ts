/**
 * Rate Limiting Middleware
 * Uses Redis to track request counts and enforce rate limits
 */

import { redis } from './redis'
import { NextRequest } from 'next/server'

export interface RateLimitConfig {
  interval: number // Time window in seconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limiter using Redis
 * @param identifier - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`
  const now = Date.now()
  const windowStart = now - config.interval * 1000

  try {
    // Remove old entries outside the time window
    await redis.zremrangebyscore(key, 0, windowStart)

    // Count requests in current window
    const requestCount = await redis.zcard(key)

    if (requestCount >= config.uniqueTokenPerInterval) {
      // Get oldest request timestamp to calculate reset time
      const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES')
      const resetTime = oldestRequest[1]
        ? parseInt(oldestRequest[1] as string) + config.interval * 1000
        : now + config.interval * 1000

      return {
        success: false,
        limit: config.uniqueTokenPerInterval,
        remaining: 0,
        reset: resetTime,
      }
    }

    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`)

    // Set expiry on key
    await redis.expire(key, config.interval)

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - requestCount - 1,
      reset: now + config.interval * 1000,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // On Redis error, allow the request (fail open)
    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval,
      reset: now + config.interval * 1000,
    }
  }
}

/**
 * Get client identifier from request
 * Uses IP address or user ID if authenticated
 */
export function getClientIdentifier(req: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Get IP from headers (works with proxies)
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'

  return `ip:${ip}`
}

/**
 * Common rate limit configurations
 */
export const RATE_LIMITS = {
  // Strict limits for expensive operations
  ARTICLE_CREATE: {
    interval: 3600, // 1 hour
    uniqueTokenPerInterval: 10, // 10 articles per hour
  },
  MEDIA_UPLOAD: {
    interval: 3600, // 1 hour
    uniqueTokenPerInterval: 50, // 50 uploads per hour
  },
  // Moderate limits for regular operations
  API_DEFAULT: {
    interval: 60, // 1 minute
    uniqueTokenPerInterval: 60, // 60 requests per minute
  },
  // Strict limits for auth endpoints
  AUTH_LOGIN: {
    interval: 900, // 15 minutes
    uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
  },
  // Comment spam prevention
  COMMENT_CREATE: {
    interval: 300, // 5 minutes
    uniqueTokenPerInterval: 10, // 10 comments per 5 minutes
  },
}
