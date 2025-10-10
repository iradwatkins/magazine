'use client'

/**
 * CommentsList Component (Story 7.2 + 7.3)
 *
 * Displays a list of approved comments for an article.
 * Features:
 * - Comment count display
 * - Only shows approved comments (isApproved: true)
 * - Organizes comments hierarchically (parent comments with nested replies)
 * - Authentication-aware UI (shows "Sign in to comment" for guests)
 * - Comment form for authenticated users (Story 7.3)
 * - Empty state when no comments exist
 *
 * @module components/articles/comments-list
 */

import Link from 'next/link'
import { CommentItem } from './comment-item'
import { CommentForm } from './comment-form'
import { Button } from '@/components/ui/button'

interface Comment {
  id: string
  content: string
  userName: string
  userPhoto?: string | null
  userId: string
  createdAt: Date | string
  updatedAt: Date | string
  parentId?: string | null
  replies?: Comment[]
}

interface CommentsListProps {
  articleId: string
  comments: Comment[]
  isAuthenticated: boolean
  currentUserId?: string | null
  currentUserRole?: string | null
}

/**
 * Organize flat comments array into hierarchical structure
 * Parent comments will have their replies nested
 */
function organizeComments(comments: Comment[]): Comment[] {
  // Create a map for quick lookup
  const commentMap = new Map<string, Comment & { replies: Comment[] }>()

  // First pass: create map entries with empty replies array
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Second pass: organize into hierarchy
  const rootComments: Comment[] = []

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!

    if (comment.parentId) {
      // This is a reply, add it to parent's replies
      const parent = commentMap.get(comment.parentId)
      if (parent) {
        parent.replies.push(commentWithReplies)
      }
    } else {
      // This is a root comment
      rootComments.push(commentWithReplies)
    }
  })

  return rootComments
}

export function CommentsList({
  articleId,
  comments,
  isAuthenticated,
  currentUserId,
  currentUserRole,
}: CommentsListProps) {
  // Organize comments into hierarchical structure
  const organizedComments = organizeComments(comments)

  // Count total comments (including replies)
  const totalComments = comments.length

  return (
    <div className="mt-12 border-t pt-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          Comments {totalComments > 0 && `(${totalComments})`}
        </h3>
      </div>

      {/* Authentication Check - Show Sign In CTA for Guests */}
      {!isAuthenticated && (
        <div className="mb-6 rounded-lg border border-muted bg-muted/30 p-6 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            Join the conversation! Sign in to leave a comment.
          </p>
          <Link href="/sign-in">
            <Button variant="default">Sign in to comment</Button>
          </Link>
        </div>
      )}

      {/* Comment Form for Authenticated Users (Story 7.3) */}
      {isAuthenticated && (
        <div className="mb-8 rounded-lg border border-muted bg-card p-6">
          <h4 className="mb-4 text-sm font-semibold">Leave a comment</h4>
          <CommentForm articleId={articleId} />
        </div>
      )}

      {/* Comments List */}
      {totalComments === 0 ? (
        // Empty State
        <div className="py-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-muted-foreground/50"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h4 className="mb-2 text-lg font-semibold">No comments yet</h4>
          <p className="text-sm text-muted-foreground">
            Be the first to share your thoughts on this article!
          </p>
        </div>
      ) : (
        // Comments Display
        <div className="divide-y divide-border">
          {organizedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
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
