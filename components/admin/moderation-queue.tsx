'use client'

/**
 * Moderation Queue Component (Story 7.4)
 *
 * Displays flagged comments in a table format with moderation actions.
 * Features:
 * - View all flagged comments with flag count and reasons
 * - Link to article where comment appears
 * - Delete comment action
 * - Approve (unflag) comment action
 * - View flag details (reporter, reason, timestamp)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2Icon, CheckCircleIcon, FlagIcon, ExternalLinkIcon } from 'lucide-react'
import { formatRelativeTime } from '@/utils/date'

interface CommentFlag {
  id: string
  reason: string
  details?: string | null
  createdAt: Date | string
  user: {
    id: string
    name: string | null
  }
}

interface FlaggedComment {
  id: string
  content: string
  flagCount: number
  createdAt: Date | string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  article: {
    id: string
    title: string
    slug: string
  }
  flags: CommentFlag[]
}

interface ModerationQueueProps {
  comments: FlaggedComment[]
}

function getInitials(name: string | null): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam',
  harassment: 'Harassment',
  inappropriate: 'Inappropriate',
  'off-topic': 'Off-topic',
  other: 'Other',
}

export function ModerationQueue({ comments }: ModerationQueueProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId)

    try {
      const response = await fetch(`/api/comments/${commentId}/moderate`, {
        method: 'DELETE',
      })

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
      setDeletingId(null)
    }
  }

  const handleApprove = async (commentId: string) => {
    setApprovingId(commentId)

    try {
      // Clear all flags and update isFlagged status
      const response = await fetch(`/api/comments/${commentId}/unflag`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to approve comment')
      }

      toast({
        title: 'Success',
        description: 'Comment approved and flags cleared',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve comment',
        variant: 'destructive',
      })
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="rounded-lg border border-muted bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Flags</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Article</TableHead>
            <TableHead>Flagged</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              {/* Flag Count */}
              <TableCell>
                <Badge variant="destructive" className="font-bold">
                  {comment.flagCount}
                </Badge>
              </TableCell>

              {/* Comment Content */}
              <TableCell className="max-w-md">
                <p className="line-clamp-2 text-sm">{comment.content}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      View details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Comment Details</DialogTitle>
                      <DialogDescription>
                        Posted {formatRelativeTime(comment.createdAt)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">Comment</h4>
                        <p className="rounded-lg border bg-muted/30 p-3 text-sm">
                          {comment.content}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">
                          Flags ({comment.flags.length})
                        </h4>
                        <div className="space-y-2">
                          {comment.flags.map((flag) => (
                            <div key={flag.id} className="rounded-lg border bg-muted/30 p-3">
                              <div className="mb-1 flex items-center justify-between">
                                <Badge variant="outline">
                                  {REASON_LABELS[flag.reason] || flag.reason}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  by {flag.user.name || 'Unknown'} •{' '}
                                  {formatRelativeTime(flag.createdAt)}
                                </span>
                              </div>
                              {flag.details && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {flag.details}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>

              {/* Author */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{comment.user.name || 'Unknown'}</span>
                </div>
              </TableCell>

              {/* Article */}
              <TableCell>
                <Link
                  href={`/articles/${comment.article.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <span className="line-clamp-1">{comment.article.title}</span>
                  <ExternalLinkIcon className="h-3 w-3 flex-shrink-0" />
                </Link>
              </TableCell>

              {/* Flagged Time */}
              <TableCell className="text-sm text-muted-foreground">
                {formatRelativeTime(comment.flags[0]?.createdAt || comment.createdAt)}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Approve Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(comment.id)}
                    disabled={approvingId === comment.id}
                  >
                    <CheckCircleIcon className="mr-1 h-4 w-4" />
                    {approvingId === comment.id ? 'Approving...' : 'Approve'}
                  </Button>

                  {/* Delete Button with Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === comment.id}
                      >
                        <Trash2Icon className="mr-1 h-4 w-4" />
                        {deletingId === comment.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the comment and all its flags. This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(comment.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
