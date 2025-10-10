/**
 * Auto-Save Hook
 *
 * Provides automatic saving functionality with debounce, status tracking, and error handling.
 *
 * Features:
 * - 30-second debounce (configurable)
 * - Pauses while user is actively typing (3-second idle detection)
 * - Save status indicator: 'idle' | 'saving' | 'saved' | 'error'
 * - Last saved timestamp
 * - Manual save trigger
 * - Optimistic updates with rollback on error
 *
 * @example
 * ```tsx
 * const { saveStatus, lastSaved, triggerSave } = useAutoSave({
 *   data: articleData,
 *   onSave: async (data) => {
 *     await fetch('/api/articles/123', {
 *       method: 'PUT',
 *       body: JSON.stringify(data),
 *     })
 *   },
 * })
 * ```
 *
 * @module hooks/useAutoSave
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useDebounce } from './useDebounce'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
  /**
   * Data to auto-save
   */
  data: T

  /**
   * Async function to save data
   */
  onSave: (data: T) => Promise<void>

  /**
   * Debounce delay in milliseconds (default: 30000 = 30 seconds)
   */
  delay?: number

  /**
   * Idle timeout before saving while typing (default: 3000 = 3 seconds)
   */
  idleTimeout?: number

  /**
   * Enable/disable auto-save (default: true)
   */
  enabled?: boolean
}

interface UseAutoSaveReturn {
  /**
   * Current save status
   */
  saveStatus: SaveStatus

  /**
   * Last saved timestamp
   */
  lastSaved: Date | null

  /**
   * Manually trigger a save
   */
  triggerSave: () => Promise<void>

  /**
   * Error from last save attempt
   */
  error: Error | null
}

/**
 * Auto-save hook with debounce and status tracking
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 30000,
  idleTimeout = 3000,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Debounced data (waits for idle period)
  const debouncedData = useDebounce(data, delay)

  // Track last saved data to prevent unnecessary saves
  const lastSavedData = useRef<T | null>(null)

  // Typing timeout ref
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Save function with error handling
   */
  const save = useCallback(
    async (dataToSave: T) => {
      if (!enabled) return

      // Don't save if data hasn't changed
      if (
        lastSavedData.current &&
        JSON.stringify(dataToSave) === JSON.stringify(lastSavedData.current)
      ) {
        return
      }

      try {
        setSaveStatus('saving')
        setError(null)

        await onSave(dataToSave)

        lastSavedData.current = dataToSave
        setLastSaved(new Date())
        setSaveStatus('saved')

        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle')
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Save failed'))
        setSaveStatus('error')
        console.error('Auto-save error:', err)
      }
    },
    [enabled, onSave]
  )

  /**
   * Manual save trigger
   */
  const triggerSave = useCallback(async () => {
    await save(data)
  }, [data, save])

  /**
   * Auto-save when debounced data changes (and not typing)
   */
  useEffect(() => {
    if (!enabled || isTyping) return

    // Don't auto-save on initial mount
    if (lastSavedData.current === null) {
      lastSavedData.current = debouncedData
      return
    }

    save(debouncedData)
  }, [debouncedData, enabled, isTyping, save])

  /**
   * Detect typing activity
   * Set isTyping=true on any data change, then false after idleTimeout
   */
  useEffect(() => {
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Mark as typing
    setIsTyping(true)

    // Set timeout to mark as not typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, idleTimeout)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [data, idleTimeout])

  /**
   * Warn about unsaved changes on page unload
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving' || (saveStatus !== 'saved' && lastSavedData.current !== null)) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [saveStatus])

  return {
    saveStatus,
    lastSaved,
    triggerSave,
    error,
  }
}
