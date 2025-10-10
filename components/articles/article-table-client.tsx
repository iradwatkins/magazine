/**
 * Article Table Client Component
 *
 * Client-side wrapper for article table with selection state management
 *
 * @module components/articles/article-table-client
 */

'use client'

import { useState } from 'react'
import { ArticleTable } from './article-table'
import { ArticlePagination } from './article-pagination'
import { BulkActionsBar } from './bulk-actions-bar'

interface Article {
  id: string
  title: string
  slug: string
  status: string
  category: string
  viewCount: number
  featuredImageUrl: string | null
  updatedAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ArticleTableClientProps {
  articles: Article[]
  pagination: Pagination
  categories: string[]
}

export function ArticleTableClient({ articles, pagination, categories }: ArticleTableClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(articles.map((article) => article.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        categories={categories}
      />

      {/* Table */}
      <ArticleTable
        articles={articles}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ArticlePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
        />
      )}
    </div>
  )
}
