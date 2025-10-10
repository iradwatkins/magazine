'use client'

import { useState, useCallback } from 'react'

interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  result?: any
}

export function useMediaUpload() {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map())
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = useCallback(async (file: File): Promise<any> => {
    const fileId = `${file.name}-${Date.now()}`

    // Initialize upload state
    setUploads((prev) => {
      const next = new Map(prev)
      next.set(fileId, {
        file,
        progress: 0,
        status: 'uploading',
      })
      return next
    })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'content') // For general media library uploads

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()

      // Update to success
      setUploads((prev) => {
        const next = new Map(prev)
        next.set(fileId, {
          file,
          progress: 100,
          status: 'success',
          result,
        })
        return next
      })

      return result
    } catch (error) {
      // Update to error
      setUploads((prev) => {
        const next = new Map(prev)
        next.set(fileId, {
          file,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        })
        return next
      })

      throw error
    }
  }, [])

  const uploadFiles = useCallback(
    async (files: File[]): Promise<{ success: any[]; errors: any[] }> => {
      setIsUploading(true)

      const results = {
        success: [] as any[],
        errors: [] as any[],
      }

      // Upload files in batches of 3
      const batchSize = 3
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize)

        const batchResults = await Promise.allSettled(batch.map((file) => uploadFile(file)))

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.success.push(result.value)
          } else {
            results.errors.push({
              file: batch[index].name,
              error: result.reason,
            })
          }
        })
      }

      setIsUploading(false)
      return results
    },
    [uploadFile]
  )

  const clearUploads = useCallback(() => {
    setUploads(new Map())
  }, [])

  const retryUpload = useCallback(
    async (fileId: string) => {
      const upload = uploads.get(fileId)
      if (!upload) return

      await uploadFile(upload.file)
    },
    [uploads, uploadFile]
  )

  return {
    uploads: Array.from(uploads.values()),
    isUploading,
    uploadFiles,
    clearUploads,
    retryUpload,
  }
}
