import Redis from 'ioredis'

// Redis client configuration
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6407/0', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  reconnectOnError(err) {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      // Reconnect when encountering READONLY error
      return true
    }
    return false
  },
})

redis.on('connect', () => {
  console.log('✅ Redis connected successfully')
})

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err)
})

// Namespace prefix for magazine keys
const KEY_PREFIX = 'magazine:'

/**
 * Get a value from Redis cache
 * @param key - Cache key
 * @returns Cached value or null
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(`${KEY_PREFIX}${key}`)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Error getting cache:', error)
    return null
  }
}

/**
 * Set a value in Redis cache
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttlSeconds - Time to live in seconds (default: 1 hour)
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
  try {
    await redis.setex(`${KEY_PREFIX}${key}`, ttlSeconds, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting cache:', error)
  }
}

/**
 * Delete a value from Redis cache
 * @param key - Cache key
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(`${KEY_PREFIX}${key}`)
  } catch (error) {
    console.error('Error deleting cache:', error)
  }
}

/**
 * Delete multiple cache keys matching a pattern
 * @param pattern - Pattern to match (e.g., "articles:*")
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(`${KEY_PREFIX}${pattern}`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Error deleting cache pattern:', error)
  }
}

/**
 * Check if a key exists in Redis cache
 * @param key - Cache key
 * @returns True if key exists, false otherwise
 */
export async function cacheExists(key: string): Promise<boolean> {
  try {
    const result = await redis.exists(`${KEY_PREFIX}${key}`)
    return result === 1
  } catch (error) {
    console.error('Error checking cache existence:', error)
    return false
  }
}

/**
 * Get remaining TTL for a key
 * @param key - Cache key
 * @returns Remaining TTL in seconds, or -1 if key doesn't exist, -2 if no expiry
 */
export async function getCacheTTL(key: string): Promise<number> {
  try {
    return await redis.ttl(`${KEY_PREFIX}${key}`)
  } catch (error) {
    console.error('Error getting cache TTL:', error)
    return -1
  }
}

/**
 * Increment a counter in Redis
 * @param key - Counter key
 * @param amount - Amount to increment (default: 1)
 * @returns New value after increment
 */
export async function incrementCounter(key: string, amount: number = 1): Promise<number> {
  try {
    return await redis.incrby(`${KEY_PREFIX}${key}`, amount)
  } catch (error) {
    console.error('Error incrementing counter:', error)
    return 0
  }
}

/**
 * Set expiry on an existing key
 * @param key - Cache key
 * @param ttlSeconds - Time to live in seconds
 */
export async function setExpiry(key: string, ttlSeconds: number): Promise<void> {
  try {
    await redis.expire(`${KEY_PREFIX}${key}`, ttlSeconds)
  } catch (error) {
    console.error('Error setting expiry:', error)
  }
}

export { redis }
