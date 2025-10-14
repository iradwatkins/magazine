/**
 * Article Table Component
 *
 * Displays articles in a table with columns for checkbox, thumbnail,
 * title, author, category, status, views, updated date, and actions
 *
 * Supports inline editing for title, status, and category
 *
 * @module components/articles/article-table
 */

'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArticleActions } from './article-actions'
import { SortableHeader } from './sortable-header'
import { InlineEditCell } from './inline-edit-cell'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

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

interface ArticleTableProps {
  articles: Article[]
  selectedIds: string[]
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
}

// Status and category options for inline editing
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const CATEGORY_OPTIONS = [
  { value: 'NEWS', label: 'News' },
  { value: 'EVENTS', label: 'Events' },
  { value: 'INTERVIEWS', label: 'Interviews' },
  { value: 'HISTORY', label: 'History' },
  { value: 'TUTORIALS', label: 'Tutorials' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'COMMUNITY', label: 'Community' },
  { value: 'OTHER', label: 'Other' },
]

export function ArticleTable({
  articles,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: ArticleTableProps) {
  const router = useRouter()
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, Partial<Article>>>({})

  const allSelected =
    articles.length > 0 && articles.every((article) => selectedIds.includes(article.id))

  /**
   * Update article field via PATCH API
   */
  const updateArticleField = async (
    articleId: string,
    field: 'title' | 'status' | 'category',
    value: string
  ) => {
    // Store original value for rollback
    const article = articles.find((a) => a.id === articleId)
    if (!article) return

    const originalValue = article[field]

    try {
      // Optimistic update
      setOptimisticUpdates((prev) => ({
        ...prev,
        [articleId]: { ...prev[articleId], [field]: value },
      }))

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update article')
      }

      // Success toast
      toast({
        title: 'Article updated',
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated successfully.`,
      })

      // Refresh data
      router.refresh()
    } catch (error) {
      // Rollback optimistic update
      setOptimisticUpdates((prev) => ({
        ...prev,
        [articleId]: { ...prev[articleId], [field]: originalValue },
      }))

      // Error toast
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update article',
        variant: 'destructive',
      })

      throw error
    } finally {
      // Clear optimistic update after a delay
      setTimeout(() => {
        setOptimisticUpdates((prev) => {
          const { [articleId]: _, ...rest } = prev
          return rest
        })
      }, 1000)
    }
  }

  /**
   * Get article value with optimistic updates applied
   */
  const getArticleValue = (article: Article, field: keyof Article) => {
    const optimistic = optimisticUpdates[article.id]
    if (optimistic && field in optimistic) {
      return optimistic[field] as string
    }
    return article[field] as string
  }

  const handleStartEdit = (cellId: string) => {
    setEditingCell(cellId)
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">Thumbnail</TableHead>
              <SortableHeader sortKey="title">Title</SortableHeader>
              <SortableHeader sortKey="author" className="w-[150px]">
                Author
              </SortableHeader>
              <SortableHeader sortKey="category" className="w-[120px]">
                Category
              </SortableHeader>
              <SortableHeader sortKey="status" className="w-[100px]">
                Status
              </SortableHeader>
              <SortableHeader sortKey="viewCount" className="w-[80px]" align="right">
                Views
              </SortableHeader>
              <SortableHeader sortKey="updatedAt" className="w-[120px]">
                Updated
              </SortableHeader>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <FileText className="mb-2 h-12 w-12 opacity-50" />
                    <p className="text-sm">No articles found</p>
                    <p className="text-xs">Create your first article to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(article.id)}
                      onCheckedChange={(checked) => onSelectOne(article.id, checked as boolean)}
                      aria-label={`Select ${article.title}`}
                    />
                  </TableCell>

                  {/* Thumbnail */}
                  <TableCell>
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                      {article.featuredImageUrl ? (
                        <Image
                          src={article.featuredImageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Title - Inline Editable */}
                  <TableCell>
                    <InlineEditCell
                      value={getArticleValue(article, 'title')}
                      type="text"
                      isEditing={editingCell === `${article.id}-title`}
                      onStartEdit={() => handleStartEdit(`${article.id}-title`)}
                      onCancelEdit={handleCancelEdit}
                      onSave={(newValue) => updateArticleField(article.id, 'title', newValue)}
                      renderDisplay={(value) => (
                        <Link
                          href={`/editor/${article.id}`}
                          className="font-medium hover:underline"
                          onClick={(e) => {
                            if (editingCell === `${article.id}-title`) {
                              e.preventDefault()
                            }
                          }}
                        >
                          {value}
                        </Link>
                      )}
                      placeholder="Enter title"
                      maxLength={200}
                    />
                  </TableCell>

                  {/* Author */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={article.author.image || undefined}
                          alt={article.author.name || ''}
                        />
                        <AvatarFallback>
                          {article.author.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{article.author.name || 'Unknown'}</span>
                    </div>
                  </TableCell>

                  {/* Category - Inline Editable */}
                  <TableCell>
                    <InlineEditCell
                      value={getArticleValue(article, 'category')}
                      type="select"
                      options={CATEGORY_OPTIONS}
                      isEditing={editingCell === `${article.id}-category`}
                      onStartEdit={() => handleStartEdit(`${article.id}-category`)}
                      onCancelEdit={handleCancelEdit}
                      onSave={(newValue) => updateArticleField(article.id, 'category', newValue)}
                      renderDisplay={(value) => <Badge variant="outline">{value}</Badge>}
                    />
                  </TableCell>

                  {/* Status - Inline Editable */}
                  <TableCell>
                    <InlineEditCell
                      value={getArticleValue(article, 'status')}
                      type="select"
                      options={STATUS_OPTIONS}
                      isEditing={editingCell === `${article.id}-status`}
                      onStartEdit={() => handleStartEdit(`${article.id}-status`)}
                      onCancelEdit={handleCancelEdit}
                      onSave={(newValue) => updateArticleField(article.id, 'status', newValue)}
                      renderDisplay={(value) => (
                        <Badge variant={value === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {value}
                        </Badge>
                      )}
                    />
                  </TableCell>

                  {/* Views */}
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {article.viewCount.toLocaleString()}
                  </TableCell>

                  {/* Updated */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <ArticleActions articleId={article.id} articleTitle={article.title} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
