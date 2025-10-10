'use client'

import { MediaCard } from './MediaCard'
import type { Media } from './MediaLibrary'

interface MediaGridProps {
  media: Media[]
  onMediaClick: (media: Media) => void
}

export function MediaGrid({ media, onMediaClick }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {media.map((item) => (
        <MediaCard key={item.id} media={item} onClick={onMediaClick} />
      ))}
    </div>
  )
}
