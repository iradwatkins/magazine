import { uploadFile, deleteFile, fileExists, listFiles } from '../lib/minio'

async function testMinIO() {
  console.log('🧪 Testing MinIO Connection...\n')

  try {
    // Test 1: Upload a test file
    console.log('1️⃣ Testing file upload...')
    const testContent = Buffer.from('Hello from Magazine SteppersLife! 🎉')
    const fileName = `test-${Date.now()}.txt`
    const url = await uploadFile(fileName, testContent, 'text/plain')
    console.log('✅ File uploaded successfully!')
    console.log(`   URL: ${url}\n`)

    // Test 2: Check if file exists
    console.log('2️⃣ Testing file existence check...')
    const exists = await fileExists(fileName)
    console.log(`✅ File exists: ${exists}\n`)

    // Test 3: List files
    console.log('3️⃣ Testing file listing...')
    const files = await listFiles()
    console.log(`✅ Found ${files.length} file(s) in bucket:`)
    files.slice(0, 5).forEach((file) => console.log(`   - ${file}`))
    if (files.length > 5) console.log(`   ... and ${files.length - 5} more`)
    console.log('')

    // Test 4: Delete the test file
    console.log('4️⃣ Testing file deletion...')
    await deleteFile(fileName)
    console.log('✅ File deleted successfully!\n')

    // Test 5: Verify deletion
    console.log('5️⃣ Verifying deletion...')
    const stillExists = await fileExists(fileName)
    console.log(`✅ File exists after deletion: ${stillExists}\n`)

    console.log('🎉 All MinIO tests passed!')
  } catch (error) {
    console.error('❌ MinIO test failed:', error)
    process.exit(1)
  }
}

testMinIO()
