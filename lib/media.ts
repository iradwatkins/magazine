/**
 * Media Management Service
 * Handles file uploads, storage, and retrieval via MinIO
 */

import { minioClient, BUCKET_NAME, ensureBucketExists } from './minio'
import crypto from 'crypto'
import path from 'path'

export interface UploadResult {
  url: string
  key: string
  bucket: string
  size: number
  contentType: string
}

export interface MediaMetadata {
  originalName: string
  uploadedBy: string
  width?: number
  height?: number
  tags?: string[]
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Generate unique filename with timestamp and random hash
 */
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const hash = crypto.randomBytes(8).toString('hex')
  const timestamp = Date.now()
  return `${timestamp}-${hash}${ext}`
}

/**
 * Validate image file
 */
function validateImageFile(file: File): void {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Check filename
  if (!file.name || file.name.length > 255) {
    throw new Error('Invalid filename')
  }
}

/**
 * Upload image to MinIO
 */
export async function uploadImage(
  file: File,
  metadata: MediaMetadata,
  folder: string = 'images'
): Promise<UploadResult> {
  // Validate file
  validateImageFile(file)

  // Ensure bucket exists
  await ensureBucketExists()

  // Generate unique filename
  const filename = generateUniqueFilename(file.name)
  const key = `${folder}/${filename}`

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Prepare metadata
  const minioMetadata = {
    'Content-Type': file.type,
    'X-Original-Name': metadata.originalName,
    'X-Uploaded-By': metadata.uploadedBy,
    'X-Upload-Date': new Date().toISOString(),
  }

  if (metadata.tags && metadata.tags.length > 0) {
    minioMetadata['X-Tags'] = metadata.tags.join(',')
  }

  // Upload to MinIO
  await minioClient.putObject(BUCKET_NAME, key, buffer, buffer.length, minioMetadata)

  // Generate public URL
  const publicUrl = `${process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${key}`

  return {
    url: publicUrl,
    key,
    bucket: BUCKET_NAME,
    size: file.size,
    contentType: file.type,
  }
}

/**
 * Upload article featured image
 */
export async function uploadArticleFeaturedImage(
  file: File,
  userId: string,
  articleId?: string
): Promise<UploadResult> {
  return uploadImage(
    file,
    {
      originalName: file.name,
      uploadedBy: userId,
      tags: articleId ? ['article', articleId] : ['article'],
    },
    'articles/featured'
  )
}

/**
 * Upload article content image
 */
export async function uploadArticleContentImage(
  file: File,
  userId: string,
  articleId?: string
): Promise<UploadResult> {
  return uploadImage(
    file,
    {
      originalName: file.name,
      uploadedBy: userId,
      tags: articleId ? ['article', 'content', articleId] : ['article', 'content'],
    },
    'articles/content'
  )
}

/**
 * Upload user profile image
 */
export async function uploadProfileImage(file: File, userId: string): Promise<UploadResult> {
  return uploadImage(
    file,
    {
      originalName: file.name,
      uploadedBy: userId,
      tags: ['profile', userId],
    },
    'profiles'
  )
}

/**
 * Delete file from MinIO
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, key)
  } catch (_error) {
    console.error('Error deleting file:', error)
    throw new Error('Failed to delete file')
  }
}

/**
 * Check if file exists
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    await minioClient.statObject(BUCKET_NAME, key)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(key: string) {
  try {
    const stat = await minioClient.statObject(BUCKET_NAME, key)
    return {
      size: stat.size,
      contentType: stat.metaData['content-type'],
      lastModified: stat.lastModified,
      metadata: stat.metaData,
    }
  } catch (_error) {
    console.error('Error getting file metadata:', error)
    throw new Error('File not found')
  }
}

/**
 * List files in a folder
 */
export async function listFiles(folder: string = '', limit: number = 100) {
  return new Promise((resolve, reject) => {
    const files: unknown[] = []
    const stream = minioClient.listObjects(BUCKET_NAME, folder, true)

    stream.on('data', (obj) => {
      if (files.length < limit) {
        files.push({
          key: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          url: `${process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${obj.name}`,
        })
      }
    })

    stream.on('end', () => resolve(files))
    stream.on('error', (err) => reject(err))
  })
}

/**
 * Generate presigned URL for temporary access
 */
export async function generatePresignedUrl(
  key: string,
  expirySeconds: number = 3600
): Promise<string> {
  try {
    const url = await minioClient.presignedGetObject(BUCKET_NAME, key, expirySeconds)
    return url
  } catch (_error) {
    console.error('Error generating presigned URL:', error)
    throw new Error('Failed to generate presigned URL')
  }
}

/**
 * Copy file within bucket
 */
export async function copyFile(sourceKey: string, destKey: string): Promise<void> {
  try {
    await minioClient.copyObject(BUCKET_NAME, destKey, `/${BUCKET_NAME}/${sourceKey}`, null)
  } catch (_error) {
    console.error('Error copying file:', error)
    throw new Error('Failed to copy file')
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats() {
  try {
    const files = (await listFiles('', 10000)) as any[]

    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
    const fileCount = files.length

    const byFolder = files.reduce(
      (acc, file) => {
        const folder = file.key.split('/')[0] || 'root'
        if (!acc[folder]) {
          acc[folder] = { count: 0, size: 0 }
        }
        acc[folder].count++
        acc[folder].size += file.size || 0
        return acc
      },
      {} as Record<string, { count: number; size: number }>
    )

    return {
      totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      fileCount,
      byFolder,
    }
  } catch (_error) {
    console.error('Error getting storage stats:', error)
    throw new Error('Failed to get storage statistics')
  }
}
