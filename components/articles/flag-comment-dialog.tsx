'use client'

/**
 * Flag Comment Dialog (Story 7.4)
 *
 * Allows users to report inappropriate comments with a reason selection.
 * Prevents duplicate flags and validates input before submission.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { FlagIcon } from 'lucide-react'

interface FlagCommentDialogProps {
  commentId: string
  triggerClassName?: string
}

const FLAG_REASONS = [
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'off-topic', label: 'Off-topic or irrelevant' },
  { value: 'other', label: 'Other' },
]

export function FlagCommentDialog({ commentId, triggerClassName }: FlagCommentDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason) {
      toast({
        title: 'Error',
        description: 'Please select a reason',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/comments/${commentId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          details: details.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to flag comment')
      }

      toast({
        title: 'Success',
        description: 'Comment flagged for review. Thank you for helping keep our community safe.',
      })

      setOpen(false)
      setReason('')
      setDetails('')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to flag comment',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setReason('')
    setDetails('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={
            triggerClassName ||
            'flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'
          }
        >
          <FlagIcon className="h-3 w-3" />
          <span>Flag</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Flag Comment</DialogTitle>
            <DialogDescription>
              Help us maintain a respectful community by reporting inappropriate comments. Your
              report will be reviewed by our moderation team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reason Selection */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for flagging *</Label>
              <Select value={reason} onValueChange={setReason} disabled={isSubmitting}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {FLAG_REASONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any additional context that might help our moderators..."
                rows={4}
                maxLength={500}
                disabled={isSubmitting}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {500 - details.length} characters remaining
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
