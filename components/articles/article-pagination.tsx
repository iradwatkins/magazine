/**
 * Article Pagination Component
 *
 * Displays pagination controls for article list
 *
 * @module components/articles/article-pagination
 */

'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ArticlePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function ArticlePagination({ currentPage, totalPages, totalItems }: ArticlePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const startItem = (currentPage - 1) * 20 + 1
  const endItem = Math.min(currentPage * 20, totalItems)

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} articles
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first page, last page, current page, and adjacent pages
              return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
            })
            .map((page, index, array) => {
              // Add ellipsis if there's a gap
              const prevPage = array[index - 1]
              const showEllipsis = prevPage && page - prevPage > 1

              return (
                <div key={page} className="flex items-center gap-1">
                  {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                  <Button
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-9"
                  >
                    {page}
                  </Button>
                </div>
              )
            })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
