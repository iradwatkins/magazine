'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Media } from './MediaLibrary'

interface MediaCardProps {
  media: Media
  onClick: (media: Media) => void
}

export function MediaCard({ media, onClick }: MediaCardProps) {
  const [showMetadata, setShowMetadata] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
      onMouseEnter={() => setShowMetadata(true)}
      onMouseLeave={() => setShowMetadata(false)}
      onClick={() => onClick(media)}
    >
      {/* Image */}
      <div className="relative aspect-square w-full bg-gray-100">
        <Image
          src={media.thumbnailUrl || media.url}
          alt={media.alt || media.filename}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Metadata Overlay on Hover */}
      {showMetadata && (
        <div className="absolute inset-0 bg-black/60 p-4 text-white transition-opacity">
          <div className="flex h-full flex-col justify-between text-sm">
            <div>
              {media.alt && (
                <p className="mb-2 font-medium">
                  <span className="text-gray-300">Alt:</span> {media.alt}
                </p>
              )}
              {media.width && media.height && (
                <p className="mb-2">
                  <span className="text-gray-300">Dimensions:</span> {media.width} × {media.height}
                </p>
              )}
              {media.caption && (
                <p className="mb-2">
                  <span className="text-gray-300">Caption:</span> {media.caption}
                </p>
              )}
            </div>
            <div className="mt-auto">
              <p className="text-xs text-gray-300">Click to view details</p>
            </div>
          </div>
        </div>
      )}

      {/* File Info */}
      <div className="p-3">
        <p className="truncate text-sm font-medium text-gray-900">{media.filename}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(media.size)}</span>
          <span>{formatDate(media.uploadedAt)}</span>
        </div>
      </div>
    </div>
  )
}
