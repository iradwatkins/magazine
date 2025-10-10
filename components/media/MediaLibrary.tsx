'use client'

import { useState, useEffect } from 'react'
import { MediaGrid } from './MediaGrid'
import { MediaGridSkeleton } from './MediaGridSkeleton'
import { EmptyMediaState } from './EmptyMediaState'

export interface Media {
  id: string
  url: string
  thumbnailUrl?: string
  filename: string
  size: number
  width?: number
  height?: number
  mimeType: string
  alt?: string
  caption?: string
  uploadedAt: string
}

interface MediaLibraryProps {
  search?: string
  mimeType?: string
  sortBy?: string
  onMediaClick?: (media: Media) => void
}

export function MediaLibrary({
  search = '',
  mimeType = 'all',
  sortBy = 'newest',
  onMediaClick,
}: MediaLibraryProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    // Reset when filters change
    setMedia([])
    setPage(1)
    setHasMore(true)
  }, [search, mimeType, sortBy])

  useEffect(() => {
    fetchMedia()
  }, [page, search, mimeType, sortBy])

  async function fetchMedia() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '24',
      })

      if (search) params.set('search', search)
      if (mimeType && mimeType !== 'all') params.set('mimeType', mimeType)
      if (sortBy) params.set('sortBy', sortBy)

      const response = await fetch(`/api/media?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch media')
      }

      const data = await response.json()
      setMedia((prev) => (page === 1 ? data.media : [...prev, ...data.media]))
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && page === 1) {
    return <MediaGridSkeleton />
  }

  if (media.length === 0) {
    return <EmptyMediaState />
  }

  return (
    <div>
      <MediaGrid media={media} onMediaClick={onMediaClick || (() => {})} />

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
