/**
 * Share Buttons Component (Story 7.6)
 *
 * Social sharing functionality for articles
 * Features:
 * - Share on Twitter/X, Facebook, LinkedIn
 * - Copy link to clipboard
 * - Native share API for mobile devices
 * - Toast notifications for success
 * - Popup windows for social sharing (not new tabs)
 *
 * @module components/articles/share-buttons
 */

'use client'

import { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareButtonsProps {
  title: string
  slug: string
  excerpt?: string
}

export function ShareButtons({ title, slug, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Full article URL
  const articleUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/articles/${slug}`

  // Encode for URLs
  const encodedUrl = encodeURIComponent(articleUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(excerpt || title)

  // Check if native share is available
  const canShare = typeof navigator !== 'undefined' && navigator.share !== undefined

  // Native share (mobile)
  const handleNativeShare = async () => {
    if (!canShare) return

    try {
      await navigator.share({
        title,
        text: excerpt || title,
        url: articleUrl,
      })

      toast({
        title: 'Thanks for sharing!',
        description: 'Article shared successfully',
      })
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
    }
  }

  // Twitter/X share
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    openPopup(twitterUrl, 'Share on Twitter')
  }

  // Facebook share
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    openPopup(facebookUrl, 'Share on Facebook')
  }

  // LinkedIn share
  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    openPopup(linkedInUrl, 'Share on LinkedIn')
  }

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      setCopied(true)

      toast({
        title: 'Link copied!',
        description: 'Article link copied to clipboard',
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard',
        variant: 'destructive',
      })
    }
  }

  // Open popup window
  const openPopup = (url: string, title: string) => {
    const width = 600
    const height = 400
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this article</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Native share (mobile) */}
        {canShare && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share via...</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Twitter/X */}
        <DropdownMenuItem onClick={shareOnTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>

        {/* Facebook */}
        <DropdownMenuItem onClick={shareOnFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>

        {/* LinkedIn */}
        <DropdownMenuItem onClick={shareOnLinkedIn}>
          <Linkedin className="mr-2 h-4 w-4" />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Copy link */}
        <DropdownMenuItem onClick={copyLink}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <LinkIcon className="mr-2 h-4 w-4" />
          )}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
