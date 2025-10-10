/**
 * Articles List Page
 *
 * Displays all articles in a table with selection, actions, and pagination
 *
 * @module app/(admin)/articles
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { listArticles } from '@/lib/articles'
import { prisma } from '@/lib/db'
import { ArticleTableClient } from '@/components/articles/article-table-client'
import { ArticleFilters } from '@/components/articles/article-filters'
import { ArticlesPageHeader } from '@/components/articles/articles-page-header'

interface ArticlesPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
    category?: string
    author?: string
    sort?: string
    order?: string
  }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  // TODO: Check if user has author+ role
  // const hasAccess = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
  // if (!hasAccess) {
  //   redirect('/')
  // }

  const page = parseInt(searchParams.page || '1', 10)
  const limit = 20

  // Build filters object
  const filters: any = {}
  if (searchParams.search) filters.search = searchParams.search
  if (searchParams.status) filters.status = searchParams.status
  if (searchParams.category) filters.category = searchParams.category
  if (searchParams.author) filters.authorId = searchParams.author

  // Add sort parameters (default: updatedAt desc)
  const sortBy = searchParams.sort || 'updatedAt'
  const sortOrder = (searchParams.order || 'desc') as 'asc' | 'desc'

  const { articles, pagination } = await listArticles(filters, page, limit, sortBy, sortOrder)

  // Get unique categories and authors for filter dropdowns
  const [categories, authors] = await Promise.all([
    prisma.article.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    }),
    prisma.user.findMany({
      where: {
        articles: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <ArticlesPageHeader />

      {/* Filters */}
      <ArticleFilters categories={categories.map((c) => c.category)} authors={authors} />

      {/* Article Table */}
      <ArticleTableClient
        articles={articles}
        pagination={pagination}
        categories={categories.map((c) => c.category)}
      />
    </div>
  )
}
