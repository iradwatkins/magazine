/**
 * Create Article Modal Component
 *
 * Modal dialog for creating new articles with title and category selection
 * Redirects to editor upon successful creation
 *
 * @module components/articles/create-article-modal
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface CreateArticleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ARTICLE_CATEGORIES = [
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

export function CreateArticleModal({ open, onOpenChange }: CreateArticleModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>('')
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({})

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: { title?: string; category?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less'
    }

    if (!category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission - create article and redirect to editor
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          content: JSON.stringify([]), // Empty content blocks array
          excerpt: '', // Empty excerpt initially
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article')
      }

      // Show success toast
      toast({
        title: 'Article created',
        description: 'Redirecting to editor...',
      })

      // Reset form
      setTitle('')
      setCategory('')
      setErrors({})

      // Close modal
      onOpenChange(false)

      // Redirect to editor
      router.push(`/editor/${articleId}`)
      router.refresh()
    } catch (error) {
      console.error('Failed to create article:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create article',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle modal close - reset form state
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle('')
      setCategory('')
      setErrors({})
    }
    onOpenChange(open)
  }

  /**
   * Handle title change with validation reset
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }))
    }
  }

  /**
   * Handle category change with validation reset
   */
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
            <DialogDescription>
              Enter the article title and select a category. You'll be redirected to the editor to
              add content.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter article title..."
                maxLength={200}
                disabled={isLoading}
                className={errors.title ? 'border-destructive' : ''}
                autoFocus
              />
              {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
              <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
            </div>

            {/* Category Select */}
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={handleCategoryChange} disabled={isLoading}>
                <SelectTrigger
                  id="category"
                  className={errors.category ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-destructive text-sm">{errors.category}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating...' : 'Create Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
