import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/rbac'
import { minioClient, BUCKET_NAME } from '@/lib/minio'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasMediaPermission = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
    if (!hasMediaPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { alt, caption, credit } = body

    const media = await prisma.media.update({
      where: { id },
      data: {
        alt: alt || null,
        caption: caption || null,
        credit: credit || null,
      },
    })

    return NextResponse.json({ media })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasMediaPermission = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
    if (!hasMediaPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // Get media record
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete from MinIO
    try {
      await minioClient.removeObject(BUCKET_NAME, media.bucketKey)
      // Also delete thumbnail if exists
      if (media.thumbnailUrl) {
        const thumbnailKey = media.bucketKey.replace('images/', 'thumbnails/')
        await minioClient.removeObject(BUCKET_NAME, thumbnailKey)
      }
    } catch (minioError) {
      // Continue with database deletion even if MinIO fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
