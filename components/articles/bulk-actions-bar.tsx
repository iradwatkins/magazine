/**
 * Bulk Actions Bar Component
 *
 * Action bar that appears when articles are selected
 * Provides bulk operations: Publish, Unpublish, Delete, Change Category
 *
 * @module components/articles/bulk-actions-bar
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle, XCircle, Trash2, FolderEdit, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface BulkActionsBarProps {
  selectedIds: string[]
  onClearSelection: () => void
  categories: string[]
}

export function BulkActionsBar({ selectedIds, onClearSelection, categories }: BulkActionsBarProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  if (selectedIds.length === 0) {
    return null
  }

  const handleBulkPublish = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/articles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          articleIds: selectedIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish articles')
      }

      toast({
        title: 'Articles published',
        description: `${selectedIds.length} article${selectedIds.length > 1 ? 's' : ''} published successfully`,
      })

      onClearSelection()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish articles',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkUnpublish = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/articles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unpublish',
          articleIds: selectedIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to unpublish articles')
      }

      toast({
        title: 'Articles unpublished',
        description: `${selectedIds.length} article${selectedIds.length > 1 ? 's' : ''} unpublished successfully`,
      })

      onClearSelection()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish articles',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} article${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`
      )
    ) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/articles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          articleIds: selectedIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete articles')
      }

      toast({
        title: 'Articles deleted',
        description: `${selectedIds.length} article${selectedIds.length > 1 ? 's' : ''} deleted successfully`,
      })

      onClearSelection()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete articles',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkChangeCategory = async () => {
    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/articles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-category',
          articleIds: selectedIds,
          category: selectedCategory,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to change category')
      }

      toast({
        title: 'Category updated',
        description: `${selectedIds.length} article${selectedIds.length > 1 ? 's' : ''} moved to ${selectedCategory}`,
      })

      setShowCategoryDialog(false)
      setSelectedCategory('')
      onClearSelection()
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change category',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-md bg-muted px-4 py-2">
        <span className="text-sm font-medium">
          {selectedIds.length} article{selectedIds.length > 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBulkPublish}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBulkUnpublish}>
                <XCircle className="mr-2 h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowCategoryDialog(true)}>
                <FolderEdit className="mr-2 h-4 w-4" />
                Change Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={onClearSelection} disabled={isLoading}>
            Clear selection
          </Button>
        </div>
      </div>

      {/* Change Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Category</DialogTitle>
            <DialogDescription>
              Select a new category for {selectedIds.length} selected article
              {selectedIds.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCategoryDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkChangeCategory} disabled={isLoading || !selectedCategory}>
              {isLoading ? 'Updating...' : 'Update Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
