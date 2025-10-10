/**
 * Sortable Table Header Component
 *
 * Clickable table header with sort indicators
 *
 * @module components/articles/sortable-header
 */

'use client'

import { TableHead } from '@/components/ui/table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SortableHeaderProps {
  /**
   * Column identifier for sorting
   */
  sortKey: string

  /**
   * Display label for the column
   */
  children: React.ReactNode

  /**
   * Optional className
   */
  className?: string

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right'
}

export function SortableHeader({
  sortKey,
  children,
  className,
  align = 'left',
}: SortableHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'updatedAt'
  const currentOrder = searchParams.get('order') || 'desc'

  const isActive = currentSort === sortKey
  const isAscending = isActive && currentOrder === 'asc'
  const isDescending = isActive && currentOrder === 'desc'

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString())

    // If already sorting by this column, toggle order
    if (isActive) {
      const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'
      params.set('order', newOrder)
    } else {
      // New column, default to descending (newest/highest first)
      params.set('sort', sortKey)
      params.set('order', 'desc')
    }

    router.push(`?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSort()
    }
  }

  return (
    <TableHead
      className={cn(
        'cursor-pointer select-none hover:bg-accent',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
      onClick={handleSort}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-sort={isActive ? (isAscending ? 'ascending' : 'descending') : 'none'}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          align === 'right' && 'justify-end',
          align === 'center' && 'justify-center'
        )}
      >
        <span>{children}</span>
        {isActive ? (
          isAscending ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  )
}
