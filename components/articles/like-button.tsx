/**
 * Like Button Component (Story 7.5)
 *
 * Interactive button for liking/unliking articles
 * Features:
 * - Heart icon (filled when liked, outline when not)
 * - Displays current like count
 * - Optimistic UI updates for instant feedback
 * - Redirects unauthenticated users to sign-in
 * - Toast notifications for success/error
 * - Disabled state during API calls
 *
 * @module components/articles/like-button
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  articleId: string
  initialLikeCount: number
  initialIsLiked: boolean
  isAuthenticated: boolean
}

export function LikeButton({
  articleId,
  initialLikeCount,
  initialIsLiked,
  isAuthenticated,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleClick = async () => {
    if (!isAuthenticated) {
      // Redirect to sign-in with callback to return to this article
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Optimistic update for instant feedback
    const previousLikeCount = likeCount
    const previousIsLiked = isLiked

    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle like')
      }

      const data = await response.json()

      toast({
        title: data.liked ? 'Article liked!' : 'Article unliked',
        description: data.liked
          ? 'Added to your liked articles'
          : 'Removed from your liked articles',
      })

      // Refresh to get accurate count from server
      router.refresh()
    } catch (error) {
      // Rollback optimistic update on error
      setIsLiked(previousIsLiked)
      setLikeCount(previousLikeCount)

      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'gap-2',
        isLiked && 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5',
          isLiked && 'fill-red-500 text-red-500'
        )}
      />
      <span className="font-semibold">
        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </span>
    </Button>
  )
}
