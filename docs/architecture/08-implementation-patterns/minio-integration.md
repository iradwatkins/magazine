# MinIO Integration

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [← Previous: Image Processing](image-processing.md)

---

## S3 Client Configuration

MinIO is S3-compatible, so we use the AWS SDK to interact with it:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT, // http://magazine-minio:9000
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
})
```

**Important Configuration:**

- `forcePathStyle: true` is required for MinIO (bucket in path, not subdomain)
- Use internal container URL for server-side uploads: `http://magazine-minio:9000`
- Use public URL for client access: `https://media.magazine.stepperslife.com`

## Upload to MinIO

Upload a file buffer to MinIO:

```typescript
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function uploadToMinIO(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<void> {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const key = `${year}/${month}/${filename}`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: 'magazine-media',
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    })
  )
}
```

## Presigned URL for Direct Upload

For large files, generate presigned URLs to allow direct client-to-MinIO uploads:

```typescript
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function generatePresignedUploadUrl(
  filename: string,
  mimeType: string
): Promise<{ uploadUrl: string; key: string }> {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const key = `${year}/${month}/${filename}`

  const command = new PutObjectCommand({
    Bucket: 'magazine-media',
    Key: key,
    ContentType: mimeType,
    ACL: 'public-read',
  })

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  })

  return { uploadUrl, key }
}
```

## Client-Side Direct Upload

Use the presigned URL from the client:

```typescript
'use client'

export async function uploadFileDirectly(file: File) {
  // Get presigned URL from server
  const res = await fetch('/api/media/presigned-url', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type,
    }),
  })

  const { uploadUrl, key } = await res.json()

  // Upload directly to MinIO
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  // Create media record in database
  await fetch('/api/media', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      key,
      mimeType: file.type,
      size: file.size,
    }),
  })
}
```

## MinIO Storage Structure

```
magazine-minio:/magazine-media/
  ├── 2025/
  │   ├── 10/
  │   │   ├── cm1x...original.jpg
  │   │   ├── cm1x...1200w.webp
  │   │   ├── cm1x...800w.webp
  │   │   └── cm1x...400w.webp
  │   └── 11/
  │       └── ...
  └── 2026/
      └── ...
```

**Benefits:**

- Organized by year/month for easy browsing
- Multiple variants stored together
- Predictable URL structure

## Public Access Configuration

Set bucket policy for public read access:

```bash
# In docker-compose.yml initialization
mc anonymous set public magazineminio/magazine-media
```

Or programmatically:

```typescript
import { PutBucketPolicyCommand } from '@aws-sdk/client-s3'

const policy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Action: ['s3:GetObject'],
      Resource: ['arn:aws:s3:::magazine-media/*'],
    },
  ],
}

await s3Client.send(
  new PutBucketPolicyCommand({
    Bucket: 'magazine-media',
    Policy: JSON.stringify(policy),
  })
)
```

---

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [← Previous: Image Processing](image-processing.md)
