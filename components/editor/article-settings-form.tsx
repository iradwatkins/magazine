/**
 * Article Settings Form Component
 *
 * Form for managing article metadata, categorization, SEO, and publishing settings.
 * Includes: featured image, category, tags, status, SEO fields, excerpt.
 *
 * @module components/editor/article-settings-form
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  articleSettingsSchema,
  type ArticleSettingsInput,
} from '@/lib/validations/article-settings'
import { z } from 'zod'

interface ArticleSettingsFormProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    category: string
    tags: string[]
    featuredImage?: string | null
    metaTitle?: string | null
    metaDescription?: string | null
    status: string
    isFeatured: boolean
  }
  onClose?: () => void
}

const CATEGORIES = [
  'NEWS',
  'EVENTS',
  'INTERVIEWS',
  'HISTORY',
  'TUTORIALS',
  'LIFESTYLE',
  'FASHION',
  'MUSIC',
  'COMMUNITY',
  'OTHER',
]

const STATUSES = ['DRAFT', 'SUBMITTED', 'APPROVED', 'PUBLISHED', 'REJECTED', 'ARCHIVED']

export function ArticleSettingsForm({ article, onClose }: ArticleSettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(article.featuredImage || null)
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof ArticleSettingsInput, string>>>({})

  // Form state
  const [formData, setFormData] = useState({
    slug: article.slug,
    excerpt: article.excerpt || '',
    category: article.category,
    tags: article.tags,
    featuredImage: article.featuredImage || '',
    metaTitle: article.metaTitle || '',
    metaDescription: article.metaDescription || '',
    status: article.status,
    isFeatured: article.isFeatured,
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!formData.slug && article.title) {
      const generatedSlug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [article.title, formData.slug])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      })
      return
    }

    // Create preview immediately for better UX
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to MinIO via media API
    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'featured') // Mark as featured image

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()

      // Update form with the MinIO URL
      setFormData((prev) => ({ ...prev, featuredImage: result.media.url }))
      setImagePreview(result.media.url)

      toast({
        title: 'Image uploaded',
        description: 'Featured image uploaded successfully',
      })
    } catch (error) {
      // Revert preview on error
      setImagePreview(article.featuredImage || null)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, featuredImage: '' }))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()

      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }))
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      // Validate form data
      const validatedData = articleSettingsSchema.parse(formData)

      const response = await fetch(`/api/articles/${article.id}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update article settings')
      }

      toast({
        title: 'Settings saved',
        description: 'Article settings updated successfully',
      })

      router.refresh()

      // Close modal after successful save
      if (onClose) {
        onClose()
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof ArticleSettingsInput, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ArticleSettingsInput] = err.message
          }
        })
        setErrors(fieldErrors)

        toast({
          title: 'Validation error',
          description: 'Please check the form for errors',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to save article settings',
          variant: 'destructive',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Featured Image */}
      <div className="space-y-2">
        <Label>Featured Image</Label>
        {imagePreview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img src={imagePreview} alt="Featured" className="h-full w-full object-cover" />
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemoveImage}
              disabled={isUploadingImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            className={`flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed ${
              isUploadingImage ? 'cursor-wait' : 'cursor-pointer hover:bg-accent'
            }`}
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">Click to upload image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isLoading || isUploadingImage}
            />
          </label>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          disabled={isLoading}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="space-y-2">
          <Input
            id="tags"
            placeholder="Type a tag and press Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={isLoading}
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Publish Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          disabled={isLoading}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="featured">Featured Article</Label>
        <Switch
          id="featured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked }))}
          disabled={isLoading}
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="Brief summary of the article..."
          value={formData.excerpt}
          onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
          rows={3}
          disabled={isLoading}
          className={errors.excerpt ? 'border-destructive' : ''}
        />
        {errors.excerpt && <p className="text-destructive text-sm">{errors.excerpt}</p>}
      </div>

      {/* SEO Section */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">SEO Settings</h3>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            placeholder="article-url-slug"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            disabled={isLoading}
            className={errors.slug ? 'border-destructive' : ''}
          />
          {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            placeholder="SEO title (60 characters recommended)"
            value={formData.metaTitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
            maxLength={60}
            disabled={isLoading}
            className={errors.metaTitle ? 'border-destructive' : ''}
          />
          <span className="text-xs text-muted-foreground">{formData.metaTitle.length}/60</span>
          {errors.metaTitle && <p className="text-destructive text-sm">{errors.metaTitle}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            placeholder="SEO description (160 characters recommended)"
            value={formData.metaDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
            maxLength={160}
            rows={3}
            disabled={isLoading}
            className={errors.metaDescription ? 'border-destructive' : ''}
          />
          <span className="text-xs text-muted-foreground">
            {formData.metaDescription.length}/160
          </span>
          {errors.metaDescription && (
            <p className="text-destructive text-sm">{errors.metaDescription}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  )
}
