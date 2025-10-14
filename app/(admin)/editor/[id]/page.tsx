/**
 * Article Editor Page (Story 5.12)
 *
 * Full article editor with drag-and-drop blocks, auto-save, undo/redo
 *
 * @module app/(admin)/articles/[id]/edit
 */

import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getArticleById } from '@/lib/articles'
import ArticleEditor from '@/components/editor/article-editor'

interface EditorPageProps {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params: paramsPromise }: EditorPageProps) {
  // Check authentication
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const params = await paramsPromise

  // Fetch article
  const article = await getArticleById(params.id)

  if (!article) {
    notFound()
  }

  // Check permissions (user must be author or have EDIT_ANY_ARTICLE permission)
  const { ArticlePermissions } = await import('@/lib/rbac')
  const { prisma } = await import('@/lib/db')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const userRoles = user?.role ? [user.role] : []
  const canEdit = ArticlePermissions.canEdit(userRoles, article.authorId, session.user.id)

  if (!canEdit) {
    redirect('/articles')
  }

  return <ArticleEditor article={article} />
}
