# Image Processing

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [← Previous: Backend Patterns](backend-patterns.md) | [Next: MinIO Integration →](minio-integration.md)

---

## Sharp Image Processing

Sharp is a high-performance Node.js image processing library used to optimize and transform images before uploading to MinIO.

## Multi-Format Image Generation

Generate multiple image variants for responsive design:

```typescript
import sharp from 'sharp'

export async function processImage(buffer: Buffer) {
  // Original optimized JPEG
  const optimized = await sharp(buffer).jpeg({ quality: 85 }).toBuffer()

  // WebP variant - 1200w (desktop)
  const webp_1200 = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  // WebP variant - 800w (tablet)
  const webp_800 = await sharp(buffer)
    .resize(800, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  // WebP variant - 400w (mobile)
  const webp_400 = await sharp(buffer)
    .resize(400, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  return {
    optimized,
    webp_1200,
    webp_800,
    webp_400,
  }
}
```

## Complete Upload Pipeline

Full implementation including image processing and MinIO upload:

```typescript
import sharp from 'sharp'
import { uploadToMinIO } from '@/lib/minio'
import { prisma } from '@/lib/prisma'

export async function uploadImage(file: File, uploaderId: string): Promise<Media> {
  // Convert file to buffer
  const buffer = Buffer.from(await file.arrayBuffer())

  // Get image metadata
  const metadata = await sharp(buffer).metadata()
  const { width, height } = metadata

  // Process image into multiple variants
  const variants = await processImage(buffer)

  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const baseName = `${timestamp}-${Math.random().toString(36).substring(7)}`

  // Upload all variants to MinIO
  const uploadPromises = [
    uploadToMinIO(variants.optimized, `${baseName}.${extension}`, file.type),
    uploadToMinIO(variants.webp_1200, `${baseName}-1200w.webp`, 'image/webp'),
    uploadToMinIO(variants.webp_800, `${baseName}-800w.webp`, 'image/webp'),
    uploadToMinIO(variants.webp_400, `${baseName}-400w.webp`, 'image/webp'),
  ]

  await Promise.all(uploadPromises)

  // Create media record in database
  const media = await prisma.media.create({
    data: {
      filename: `${baseName}.${extension}`,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      bucket: 'magazine-media',
      key: `2025/10/${baseName}.${extension}`,
      url: `https://media.magazine.stepperslife.com/2025/10/${baseName}.${extension}`,
      width,
      height,
      uploaderId,
    },
  })

  return media
}
```

## Image Optimization Best Practices

1. **Quality Settings:**
   - JPEG: 85% quality (good balance)
   - WebP: 80% quality (smaller with same visual quality)

2. **Responsive Variants:**
   - 1200w for desktop
   - 800w for tablet
   - 400w for mobile

3. **Format Strategy:**
   - Keep original as JPEG fallback
   - Generate WebP for modern browsers
   - Use `<picture>` element with multiple sources

4. **Performance:**
   - Process images server-side before upload
   - Use `withoutEnlargement: true` to prevent upscaling
   - Upload variants in parallel with `Promise.all()`

---

[← Back to Implementation Patterns](index.md) | [← Back to Main Index](../index.md) | [← Previous: Backend Patterns](backend-patterns.md) | [Next: MinIO Integration →](minio-integration.md)
