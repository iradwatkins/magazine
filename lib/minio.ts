import { Client } from 'minio'

// MinIO client configuration
const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9007'
const endpointParts = endpoint.replace('http://', '').replace('https://', '').split(':')

const minioClient = new Client({
  endPoint: endpointParts[0],
  port: parseInt(endpointParts[1] || '9000'),
  useSSL: endpoint.startsWith('https://'),
  accessKey: process.env.MINIO_ACCESS_KEY || 'magazine_minio_admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'magazine_minio_secret_2025',
})

const BUCKET_NAME = process.env.MINIO_BUCKET || 'stepperslife-magazine'
const PUBLIC_URL = process.env.MINIO_PUBLIC_URL || 'http://localhost:9007'

/**
 * Ensure the bucket exists and is configured
 */
export async function ensureBucketExists(): Promise<void> {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME)
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      // Set bucket policy to public read
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      }
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error)
    throw error
  }
}

/**
 * Upload a file to MinIO
 * @param fileName - Name of the file to upload
 * @param fileBuffer - File buffer
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  try {
    // Ensure bucket exists
    await ensureBucketExists()

    // Upload file
    await minioClient.putObject(BUCKET_NAME, fileName, fileBuffer, fileBuffer.length, {
      'Content-Type': contentType,
    })

    // Return public URL
    return `${PUBLIC_URL}/${BUCKET_NAME}/${fileName}`
  } catch (error) {
    console.error('Error uploading file to MinIO:', error)
    throw new Error('Failed to upload file')
  }
}

/**
 * Delete a file from MinIO
 * @param fileName - Name of the file to delete
 */
export async function deleteFile(fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, fileName)
  } catch (error) {
    console.error('Error deleting file from MinIO:', error)
    throw new Error('Failed to delete file')
  }
}

/**
 * Get a presigned URL for temporary access to a file
 * @param fileName - Name of the file
 * @param expirySeconds - Expiry time in seconds (default: 7 days)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  fileName: string,
  expirySeconds: number = 7 * 24 * 60 * 60
): Promise<string> {
  try {
    return await minioClient.presignedGetObject(BUCKET_NAME, fileName, expirySeconds)
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    throw new Error('Failed to generate presigned URL')
  }
}

/**
 * Check if a file exists in MinIO
 * @param fileName - Name of the file to check
 * @returns True if file exists, false otherwise
 */
export async function fileExists(fileName: string): Promise<boolean> {
  try {
    await minioClient.statObject(BUCKET_NAME, fileName)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * List all files in the bucket
 * @param prefix - Optional prefix to filter files
 * @returns Array of file names
 */
export async function listFiles(prefix?: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const files: string[] = []
    const stream = minioClient.listObjects(BUCKET_NAME, prefix, true)

    stream.on('data', (obj) => {
      if (obj.name) files.push(obj.name)
    })

    stream.on('error', (err) => {
      console.error('Error listing files from MinIO:', err)
      reject(err)
    })

    stream.on('end', () => {
      resolve(files)
    })
  })
}

export { minioClient, BUCKET_NAME }
