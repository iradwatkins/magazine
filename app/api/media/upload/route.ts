/**
 * Media Upload API
 * POST /api/media/upload - Upload image files
 */

import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import {
  uploadArticleFeaturedImage,
  uploadArticleContentImage,
  uploadProfileImage,
} from '@/lib/media'
import { prisma } from '@/lib/db'
import { uploadImage } from '@/lib/media'
import sharp from 'sharp'

export const POST = withAuth(async (req, session) => {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'featured', 'content', 'profile'
    const articleId = formData.get('articleId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Upload type is required (featured, content, or profile)' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'featured':
        result = await uploadArticleFeaturedImage(file, session.user.id, articleId || undefined)
        break

      case 'content':
        // Upload to MinIO and save to database
        const uploadResult = await uploadImage(file, {
          originalName: file.name,
          uploadedBy: session.user.id,
        })

        // Get image dimensions
        const buffer = Buffer.from(await file.arrayBuffer())
        const metadata = await sharp(buffer).metadata()

        // Create thumbnail
        const thumbnailBuffer = await sharp(buffer).resize(400, 300, { fit: 'cover' }).toBuffer()

        // Upload thumbnail
        const thumbnailKey = `thumbnails/${uploadResult.key.split('/').pop()}`
        const thumbnailResult = await uploadImage(
          new File([thumbnailBuffer], `thumb_${file.name}`, { type: file.type }),
          {
            originalName: `thumb_${file.name}`,
            uploadedBy: session.user.id,
          },
          'thumbnails'
        )

        // Save to database
        const media = await prisma.media.create({
          data: {
            filename: file.name,
            originalName: file.name,
            url: uploadResult.url,
            thumbnailUrl: thumbnailResult.url,
            mimeType: file.type,
            size: file.size,
            width: metadata.width || null,
            height: metadata.height || null,
            bucketKey: uploadResult.key,
            uploadedById: session.user.id,
          },
        })

        result = {
          ...uploadResult,
          id: media.id,
          thumbnailUrl: media.thumbnailUrl,
          width: media.width,
          height: media.height,
        }
        break

      case 'profile':
        result = await uploadProfileImage(file, session.user.id)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid upload type. Must be featured, content, or profile' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: result,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
})

// Set max file size for uploads
export const config = {
  api: {
    bodyParser: false,
  },
}
