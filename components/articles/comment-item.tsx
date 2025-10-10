'use client'

/**
 * CommentItem Component (Story 7.2 + 7.3)
 *
 * Displays a single comment with support for nested replies (up to 2 levels deep).
 * Features:
 * - Author avatar and name
 * - Post date (relative time format)
 * - Comment content
 * - Edit functionality (own comments, within 15 min window)
 * - Reply functionality (all comments, if authenticated)
 * - "Edited" badge if comment was edited
 * - Recursive rendering for nested replies with visual indentation
 *
 * @module components/articles/comment-item
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { formatRelativeTime } from '@/utils/date'
import { CommentForm } from './comment-form'
import { FlagCommentDialog } from './flag-comment-dialog'
import { cn } from '@/lib/utils'
import { Trash2Icon } from 'lucide-react'

interface Comment {
  id: string
  content: string
  userName: string
  userPhoto?: string | null
  userId: string
  createdAt: Date | string
  updatedAt: Date | string
  replies?: Comment[]
  deletedAt?: Date | string | null
}

interface CommentItemProps {
  comment: Comment
  depth?: number // 0 for parent, 1-2 for replies
  currentUserId?: string | null
  currentUserRole?: string | null
  articleId: string
  isAuthenticated: boolean
}

/**
 * Get initials from a name for avatar fallback
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/**
 * Check if comment is within 15 minute edit window
 */
function isWithinEditWindow(createdAt: Date | string): boolean {
  const commentDate = new Date(createdAt)
  const now = new Date()
  const fifteenMinutes = 15 * 60 * 1000
  return now.getTime() - commentDate.getTime() < fifteenMinutes
}

/**
 * Check if comment was edited
 */
function wasEdited(createdAt: Date | string, updatedAt: Date | string): boolean {
  const created = new Date(createdAt).getTime()
  const updated = new Date(updatedAt).getTime()
  // Allow 1 second tolerance for database timestamp precision
  return updated - created > 1000
}

export function CommentItem({
  comment,
  depth = 0,
  currentUserId,
  currentUserRole,
  articleId,
  isAuthenticated,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const maxDepth = 2
  const hasReplies = comment.replies && comment.replies.length > 0 && depth < maxDepth
  const marginLeft = depth > 0 ? `${depth * 2.5}rem` : '0'

  const isOwnComment = currentUserId === comment.userId
  const canEdit = isOwnComment && isWithinEditWindow(comment.createdAt) && !comment.deletedAt
  const isEdited = wasEdited(comment.createdAt, comment.updatedAt)
  const isDeleted = !!comment.deletedAt

  // Moderation permissions
  const canModerate = ['MAGAZINE_EDITOR', 'ADMIN'].includes(currentUserRole || '')
  const canDelete = (isOwnComment || canModerate) && !isDeleted
  const canFlag = isAuthenticated && !isOwnComment && !isDeleted

  const maxLength = 1000
  const remainingChars = maxLength - editContent.length

  useEffect(() => {
    setEditContent(comment.content)
  }, [comment.content])

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editContent.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update comment')
      }

      toast({
        title: 'Success',
        description: 'Comment updated successfully!',
      })

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update comment',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  const handleReplySuccess = () => {
    setIsReplying(false)
  }

  const handleReplyCancel = () => {
    setIsReplying(false)
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete this comment? This action cannot be undone.'
    )
    if (!confirmed) return

    setIsSubmitting(true)

    try {
      const endpoint =
        canModerate && !isOwnComment
          ? `/api/comments/${comment.id}/moderate`
          : `/api/comments/${comment.id}`

      const response = await fetch(endpoint, { method: 'DELETE' })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete comment')
      }

      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete comment',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If comment is deleted, show placeholder
  if (isDeleted) {
    return (
      <div style={{ marginLeft }} className="group">
        <div className="flex gap-3 py-4">
          <Avatar className="h-10 w-10 flex-shrink-0 opacity-50">
            <AvatarFallback className="bg-muted text-sm">
              <Trash2Icon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm italic text-muted-foreground">
              This comment has been deleted
            </p>
          </div>
        </div>

        {/* Show nested replies even if parent is deleted */}
        {hasReplies && (
          <div className="border-l-2 border-muted pl-0">
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                articleId={articleId}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ marginLeft }} className="group">
      {/* Main Comment */}
      <div className="flex gap-3 py-4">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={comment.userPhoto || undefined} alt={comment.userName} />
          <AvatarFallback className="bg-primary/10 text-sm">
            {getInitials(comment.userName)}
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 space-y-1">
          {/* Author and Date */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {isEdited && (
              <span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                Edited
              </span>
            )}
          </div>

          {/* Comment Text or Edit Form */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-3 pt-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={maxLength}
                rows={3}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" size="sm" disabled={isSubmitting || !editContent.trim()}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center gap-4 pt-1">
                {/* Like button (display only, no interaction) */}
                <button
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  disabled
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>Like</span>
                </button>

                {/* Reply button */}
                {isAuthenticated && !isReplying && (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setIsReplying(true)}
                  >
                    Reply
                  </button>
                )}

                {/* Edit button (own comments only, within 15 min window) */}
                {canEdit && !isEditing && (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}

                {/* Delete button (own comments or moderators) */}
                {canDelete && (
                  <button
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    <Trash2Icon className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                )}

                {/* Flag button (authenticated users, not own comment) */}
                {canFlag && <FlagCommentDialog commentId={comment.id} />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-[3.25rem] mb-4 rounded-lg border border-muted bg-muted/30 p-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Replying to <span className="font-semibold">{comment.userName}</span>
          </p>
          <CommentForm
            articleId={articleId}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={handleReplyCancel}
            isReply={true}
            placeholder="Write your reply..."
          />
        </div>
      )}

      {/* Nested Replies */}
      {hasReplies && (
        <div className="border-l-2 border-muted pl-0">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              articleId={articleId}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
