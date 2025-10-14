/**
 * Articles List Page
 *
 * Displays all articles in a table with selection, actions, and pagination
 *
 * @module app/(admin)/articles
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
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

// Force dynamic rendering to ensure auth is checked at request time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      redirect('/sign-in')
    }

    // Check if user has author+ role (MAGAZINE_WRITER or higher)
    const { hasPermission } = await import('@/lib/rbac')
    const hasAccess = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
    if (!hasAccess) {
      console.error('User does not have MAGAZINE_WRITER permission:', session.user.email)
      redirect('/')
    }

  const params = searchParams
  const page = parseInt(params.page || '1', 10)
  const limit = 20

  // Build filters object
  const filters: any = {}
  if (params.search) filters.search = params.search
  if (params.status) filters.status = params.status
  if (params.category) filters.category = params.category
  if (params.author) filters.authorId = params.author

  // Add sort parameters (default: updatedAt desc)
  const sortBy = params.sort || 'updatedAt'
  const sortOrder = (params.order || 'desc') as 'asc' | 'desc'

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
  } catch (error) {
    console.error('Articles page error:', error)

    return (
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Articles Page Error</h1>
          <p className="text-muted-foreground">
            There was an error loading the articles page.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign In Again
            </Link>
            <Link
              href="/"
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
