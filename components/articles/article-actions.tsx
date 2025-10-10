/**
 * Article Actions Dropdown
 *
 * Dropdown menu with actions for each article row
 * (Edit, Preview, Duplicate, Delete)
 *
 * @module components/articles/article-actions
 */

'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Eye, Copy, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface ArticleActionsProps {
  articleId: string
  articleTitle: string
}

export function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/editor/${articleId}`)
  }

  const handlePreview = () => {
    window.open(`/preview/${articleId}`, '_blank')
  }

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}/duplicate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate article')
      }

      const data = await response.json()

      toast({
        title: 'Article duplicated',
        description: 'Redirecting to the new article...',
      })

      router.push(`/editor/${articleId}`)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate article',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      toast({
        title: 'Article deleted',
        description: 'The article has been moved to trash.',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePreview}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
