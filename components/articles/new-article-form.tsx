/**
 * New Article Form Component
 *
 * Modern article creation form with validation, templates, and enhanced UX
 *
 * @module components/articles/new-article-form
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
import { useToast } from '@/hooks/use-toast'
import { Loader2, Sparkles, FileText, ChevronLeft } from 'lucide-react'
import { TemplateSelector } from './template-selector'
import { getTemplateById } from '@/lib/article-templates'
import { newArticleSchema, getFieldError } from '@/lib/validation/article-schema'
import type { z } from 'zod'
import Link from 'next/link'

interface NewArticleFormProps {
  onSuccess?: (articleId: string) => void
}

const ARTICLE_CATEGORIES = [
  { value: 'NEWS', label: 'News', description: 'Breaking news and announcements' },
  { value: 'EVENTS', label: 'Events', description: 'Event coverage and recaps' },
  { value: 'INTERVIEWS', label: 'Interviews', description: 'Q&A and conversations' },
  { value: 'HISTORY', label: 'History', description: 'Historical perspectives' },
  { value: 'TUTORIALS', label: 'Tutorials', description: 'How-to guides and tips' },
  { value: 'LIFESTYLE', label: 'Lifestyle', description: 'Culture and lifestyle' },
  { value: 'FASHION', label: 'Fashion', description: 'Style and trends' },
  { value: 'MUSIC', label: 'Music', description: 'Music and performances' },
  { value: 'COMMUNITY', label: 'Community', description: 'Community stories' },
  { value: 'OTHER', label: 'Other', description: 'Miscellaneous topics' },
]

type FormStep = 'basics' | 'template'

export default function NewArticleForm({ onSuccess }: NewArticleFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [step, setStep] = useState<FormStep>('basics')
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [templateId, setTemplateId] = useState('blank')
  const [errors, setErrors] = useState<z.ZodError | undefined>()
  const [slugPreview, setSlugPreview] = useState('')

  // Load saved draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('article-draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.title) setTitle(draft.title)
        if (draft.category) setCategory(draft.category)
        if (draft.excerpt) setExcerpt(draft.excerpt)
        if (draft.templateId) setTemplateId(draft.templateId)
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (title || category || excerpt) {
      const draft = { title, category, excerpt, templateId }
      localStorage.setItem('article-draft', JSON.stringify(draft))
    }
  }, [title, category, excerpt, templateId])

  // Generate slug preview
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlugPreview(slug || 'untitled')
    } else {
      setSlugPreview('')
    }
  }, [title])

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const result = newArticleSchema.safeParse({
      title,
      category,
      excerpt: excerpt || '',
      templateId,
    })

    if (!result.success) {
      setErrors(result.error)
      return false
    }

    setErrors(undefined)
    return true
  }

  /**
   * Handle form submission - create article
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before continuing',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Get template blocks
      const template = getTemplateById(templateId)
      const initialBlocks = template?.blocks || []

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          content: JSON.stringify(initialBlocks),
          excerpt: excerpt.trim() || template?.excerpt || '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article')
      }

      // Clear draft from localStorage
      localStorage.removeItem('article-draft')

      // Show success toast
      toast({
        title: 'Article created! ✨',
        description: 'Redirecting to editor...',
      })

      // Callback if provided
      if (onSuccess) {
        onSuccess(data.article.id)
      }

      // Redirect to editor
      router.push(`/editor/${data.article.id}`)
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
   * Handle field changes with validation reset
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (errors) setErrors(undefined)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    if (errors) setErrors(undefined)
  }

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExcerpt(e.target.value)
    if (errors) setErrors(undefined)
  }

  /**
   * Handle template selection
   */
  const handleTemplateSelect = (newTemplateId: string) => {
    setTemplateId(newTemplateId)
    const template = getTemplateById(newTemplateId)
    if (template && template.category && !category) {
      setCategory(template.category)
    }
  }

  /**
   * Navigate to next step
   */
  const goToNextStep = () => {
    if (!validateForm()) {
      return
    }
    setStep('template')
  }

  /**
   * Navigate to previous step
   */
  const goToPreviousStep = () => {
    setStep('basics')
  }

  /**
   * Clear draft and start over
   */
  const clearDraft = () => {
    setTitle('')
    setCategory('')
    setExcerpt('')
    setTemplateId('blank')
    setErrors(undefined)
    localStorage.removeItem('article-draft')
    toast({
      title: 'Draft cleared',
      description: 'Starting fresh!',
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Create New Article
            </h1>
            <p className="text-muted-foreground mt-2">
              {step === 'basics'
                ? 'Start by providing basic information about your article'
                : 'Choose a template to structure your content'}
            </p>
          </div>
          {(title || category || excerpt) && (
            <Button variant="ghost" size="sm" onClick={clearDraft}>
              Clear Draft
            </Button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step === 'basics' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'basics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className="font-medium">Basics</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === 'template' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'template' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className="font-medium">Template</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basics */}
        {step === 'basics' && (
          <div className="space-y-6 bg-white dark:bg-gray-900 rounded-lg border p-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Article Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter a compelling title..."
                maxLength={200}
                disabled={isLoading}
                className={getFieldError(errors, 'title') ? 'border-destructive' : ''}
                autoFocus
              />
              {getFieldError(errors, 'title') && (
                <p className="text-destructive text-sm">{getFieldError(errors, 'title')}</p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{title.length}/200 characters</span>
                {slugPreview && <span className="font-mono">Slug: {slugPreview}</span>}
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={handleCategoryChange} disabled={isLoading}>
                <SelectTrigger
                  id="category"
                  className={getFieldError(errors, 'category') ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{cat.label}</span>
                        <span className="text-xs text-muted-foreground">{cat.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError(errors, 'category') && (
                <p className="text-destructive text-sm">{getFieldError(errors, 'category')}</p>
              )}
            </div>

            {/* Excerpt Textarea */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Optional)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={handleExcerptChange}
                placeholder="Write a brief summary (shown in article previews and search results)..."
                maxLength={500}
                rows={4}
                disabled={isLoading}
                className={getFieldError(errors, 'excerpt') ? 'border-destructive' : ''}
              />
              {getFieldError(errors, 'excerpt') && (
                <p className="text-destructive text-sm">{getFieldError(errors, 'excerpt')}</p>
              )}
              <p className="text-xs text-muted-foreground">{excerpt.length}/500 characters</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                Cancel
              </Button>
              <Button type="button" onClick={goToNextStep} disabled={!title || !category}>
                Next: Choose Template
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 'template' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select a template to pre-structure your article content. You can customize everything in the
                editor.
              </p>
              <TemplateSelector selectedTemplateId={templateId} onSelect={handleTemplateSelect} />
            </div>

            {/* Actions */}
            <div className="flex justify-between bg-white dark:bg-gray-900 rounded-lg border p-6">
              <Button type="button" variant="outline" onClick={goToPreviousStep} disabled={isLoading}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating Article...' : 'Create & Open Editor'}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
