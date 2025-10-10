import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { MediaLibraryClient } from '@/components/media/MediaLibraryClient'

export default async function MediaLibraryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Check if user has MAGAZINE_WRITER role or higher
  const canAccessMedia = await hasPermission(session.user.id, 'MAGAZINE_WRITER')

  if (!canAccessMedia) {
    redirect('/')
  }

  return <MediaLibraryClient />
}
