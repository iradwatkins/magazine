/**
 * Article Filters Component
 *
 * Search and filter controls for article list
 * - Search by title, subtitle, excerpt
 * - Filter by status, category, author
 * - Clear filters button
 * - URL query parameter sync
 *
 * @module components/articles/article-filters
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface ArticleFiltersProps {
  categories: string[]
  authors: Array<{ id: string; name: string | null }>
}

export function ArticleFilters({ categories, authors }: ArticleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [author, setAuthor] = useState(searchParams.get('author') || 'all')

  // Debounce search input
  const debouncedSearch = useDebounce(search, 300)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update search param
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }

    // Update status param
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    // Update category param
    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    // Update author param
    if (author && author !== 'all') {
      params.set('author', author)
    } else {
      params.delete('author')
    }

    // Reset to page 1 when filters change
    params.delete('page')

    // Update URL
    router.push(`?${params.toString()}`)
  }, [debouncedSearch, status, category, author, router, searchParams])

  const handleClearFilters = () => {
    setSearch('')
    setStatus('all')
    setCategory('all')
    setAuthor('all')
    router.push('/articles')
  }

  const hasActiveFilters = search || status !== 'all' || category !== 'all' || author !== 'all'

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles by title, subtitle, or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Author Filter */}
        <Select value={author} onValueChange={setAuthor}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {authors.map((auth) => (
              <SelectItem key={auth.id} value={auth.id}>
                {auth.name || 'Unknown'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing filtered results
          {search && ` matching "${search}"`}
          {status !== 'all' && ` • ${status}`}
          {category !== 'all' && ` • ${category}`}
          {author !== 'all' && ` • by ${authors.find((a) => a.id === author)?.name || 'Unknown'}`}
        </div>
      )}
    </div>
  )
}
