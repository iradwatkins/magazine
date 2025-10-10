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
  params: { id: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  // Check authentication
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Fetch article
  const article = await getArticleById(params.id)

  if (!article) {
    notFound()
  }

  // TODO: Check permissions (user must be author or have EDIT_ANY_ARTICLE permission)
  // For now, allow any authenticated user
  // const userRole = (session.user as any)?.role || 'USER'
  // const canEdit = article.authorId === session.user.id || userRole === 'ADMIN' || userRole === 'MAGAZINE_EDITOR'
  // if (!canEdit) {
  //   redirect('/articles')
  // }

  return <ArticleEditor article={article} />
}
