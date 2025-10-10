import {
  getCache,
  setCache,
  deleteCache,
  cacheExists,
  getCacheTTL,
  incrementCounter,
} from '../lib/redis'

async function testRedis() {
  console.log('🧪 Testing Redis Connection...\n')

  try {
    const testKey = 'test-key'
    const testData = { message: 'Hello Magazine!', timestamp: Date.now() }

    // Test 1: Set cache
    console.log('1️⃣ Testing cache set...')
    await setCache(testKey, testData, 60)
    console.log('✅ Cache set successfully!\n')

    // Test 2: Get cache
    console.log('2️⃣ Testing cache get...')
    const cached = await getCache<typeof testData>(testKey)
    console.log('✅ Cache retrieved:', cached, '\n')

    // Test 3: Check cache exists
    console.log('3️⃣ Testing cache existence...')
    const exists = await cacheExists(testKey)
    console.log(`✅ Cache exists: ${exists}\n`)

    // Test 4: Get TTL
    console.log('4️⃣ Testing TTL...')
    const ttl = await getCacheTTL(testKey)
    console.log(`✅ Remaining TTL: ${ttl} seconds\n`)

    // Test 5: Increment counter
    console.log('5️⃣ Testing counter increment...')
    const counter1 = await incrementCounter('test-counter', 5)
    const counter2 = await incrementCounter('test-counter', 3)
    console.log(`✅ Counter value: ${counter1} → ${counter2}\n`)

    // Test 6: Delete cache
    console.log('6️⃣ Testing cache deletion...')
    await deleteCache(testKey)
    await deleteCache('test-counter')
    const existsAfter = await cacheExists(testKey)
    console.log(`✅ Cache exists after deletion: ${existsAfter}\n`)

    console.log('🎉 All Redis tests passed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Redis test failed:', error)
    process.exit(1)
  }
}

testRedis()
