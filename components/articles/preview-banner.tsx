/**
 * Preview Banner Component
 *
 * Banner displayed at the top of article preview pages
 * Indicates that user is viewing a draft/unpublished article
 *
 * @module components/articles/preview-banner
 */

'use client'

import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PreviewBannerProps {
  articleId: string
  status: string
}

export function PreviewBanner({ articleId, status }: PreviewBannerProps) {
  const router = useRouter()

  const handleEdit = () => {
    window.close() // Try to close preview tab
    // If can't close (not opened by script), navigate to editor
    setTimeout(() => {
      router.push(`/editor/${articleId}`)
    }, 100)
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-yellow-50 dark:bg-yellow-950">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Preview Mode</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              You are previewing a {status.toLowerCase()} article - This is not publicly visible
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Edit Article
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
