/**
 * Article Editor Page
 *
 * Server component that loads article data and renders the editor.
 *
 * Route: /articles/{id}/edit
 *
 * @module app/articles/[id]/edit
 */

import { getArticle } from '@/lib/articles'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ArticleEditor from '@/components/editor/article-editor'

interface EditArticlePageProps {
  params: { id: string }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  const article = await getArticle(params.id)

  if (!article) {
    redirect('/articles')
  }

  // TODO: Check user has edit permission for this article
  // if (article.authorId !== session.user.id && !hasPermission(session.user, 'EDIT_ANY_ARTICLE')) {
  //   redirect('/articles')
  // }

  return <ArticleEditor article={article} />
}
