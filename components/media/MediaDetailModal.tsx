'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Media } from './MediaLibrary'

interface MediaDetailModalProps {
  media: Media | null
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

export function MediaDetailModal({ media, onClose, onUpdate, onDelete }: MediaDetailModalProps) {
  const [alt, setAlt] = useState(media?.alt || '')
  const [caption, setCaption] = useState(media?.caption || '')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!media) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/media/${media.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt, caption }),
      })

      if (response.ok) {
        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error('Failed to update media:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/media/${media.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete()
        onClose()
      }
    } catch (error) {
      console.error('Failed to delete media:', error)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.url)
    alert('URL copied to clipboard!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">Media Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Image Preview */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={media.url}
                alt={media.alt || media.filename}
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={handleCopyUrl}
              className="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Copy URL
            </button>
          </div>

          {/* Details & Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Filename</label>
              <p className="mt-1 text-sm text-gray-900">{media.filename}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Size</label>
              <p className="mt-1 text-sm text-gray-900">{formatFileSize(media.size)}</p>
            </div>

            {media.width && media.height && (
              <div>
                <label className="text-sm font-medium text-gray-700">Dimensions</label>
                <p className="mt-1 text-sm text-gray-900">
                  {media.width} × {media.height}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <p className="mt-1 text-sm text-gray-900">{media.mimeType}</p>
            </div>

            <div>
              <label htmlFor="alt" className="block text-sm font-medium text-gray-700">
                Alt Text
              </label>
              <input
                id="alt"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                Caption
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Add a caption"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="border-t bg-red-50 px-6 py-4">
            <p className="mb-4 text-sm text-red-900">
              Are you sure you want to delete this media? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
