'use client'

/**
 * CommentForm Component (Story 7.3)
 *
 * Form for creating new comments or replies.
 * Features:
 * - Textarea input with character counter (max 1000 chars)
 * - Loading state during submission
 * - Validation feedback
 * - Toast notifications for success/error
 * - Optional reply mode with visual indicator
 * - Cancel button for replies
 *
 * @module components/articles/comment-form
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface CommentFormProps {
  articleId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
  isReply?: boolean
  placeholder?: string
}

export function CommentForm({
  articleId,
  parentId,
  onSuccess,
  onCancel,
  isReply = false,
  placeholder = 'Share your thoughts...',
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const maxLength = 1000
  const remainingChars = maxLength - content.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          content: content.trim(),
          parentId: parentId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to post comment')
      }

      toast({
        title: 'Success',
        description: isReply ? 'Reply posted!' : 'Comment posted!',
      })

      setContent('')
      router.refresh()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to post comment',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={isReply ? 3 : 4}
        disabled={isSubmitting}
        className="resize-none"
      />

      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-sm',
            remainingChars < 100 ? 'text-orange-500' : 'text-muted-foreground'
          )}
        >
          {remainingChars} characters remaining
        </span>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </form>
  )
}
