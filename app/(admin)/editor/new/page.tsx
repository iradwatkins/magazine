/**
 * New Article Page
 *
 * Modern article creation page with template selection and enhanced UX
 *
 * @module app/(admin)/editor/new
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import NewArticleForm from '@/components/articles/new-article-form'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  // Check authentication
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  // Check permissions - user needs writer permissions
  const canWrite = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
  if (!canWrite) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need writer permissions to create articles.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Please contact an administrator to request writer access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <NewArticleForm />
    </div>
  )
}