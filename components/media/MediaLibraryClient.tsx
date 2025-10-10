'use client'

import { useState } from 'react'
import { MediaLibrary, type Media } from './MediaLibrary'
import { UploadDialog } from './UploadDialog'
import { MediaDetailModal } from './MediaDetailModal'
import { useDebounce } from '@/hooks/useDebounce'

export function MediaLibraryClient() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [search, setSearch] = useState('')
  const [mimeType, setMimeType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const debouncedSearch = useDebounce(search, 300)

  const handleUploadComplete = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleMediaUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleMediaDelete = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setMimeType('all')
    setSortBy('newest')
  }

  const hasFilters = search || mimeType !== 'all' || sortBy !== 'newest'

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
            <p className="mt-2 text-muted-foreground">Manage your images and media assets</p>
          </div>
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Upload Media
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by filename, alt text, or caption..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/gif">GIF</option>
            <option value="image/webp">WebP</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="filename">Filename A-Z</option>
          </select>

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="whitespace-nowrap rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        <MediaLibrary
          key={refreshKey}
          search={debouncedSearch}
          mimeType={mimeType}
          sortBy={sortBy}
          onMediaClick={setSelectedMedia}
        />
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      <MediaDetailModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onUpdate={handleMediaUpdate}
        onDelete={handleMediaDelete}
      />
    </>
  )
}
