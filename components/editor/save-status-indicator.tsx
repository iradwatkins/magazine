/**
 * Save Status Indicator Component
 *
 * Displays the current save status and last saved time in the editor toolbar.
 *
 * Statuses:
 * - idle: No indication (nothing shown)
 * - saving: "Saving..." with spinner
 * - saved: "Saved" with checkmark + timestamp
 * - error: "Error saving" with error icon + retry button
 *
 * @example
 * ```tsx
 * <SaveStatusIndicator
 *   status="saved"
 *   lastSaved={new Date()}
 *   onRetry={() => triggerSave()}
 * />
 * ```
 *
 * @module components/editor/save-status-indicator
 */

'use client'

import { SaveStatus } from '@/hooks/useAutoSave'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface SaveStatusIndicatorProps {
  /**
   * Current save status
   */
  status: SaveStatus

  /**
   * Last saved timestamp
   */
  lastSaved: Date | null

  /**
   * Callback for retry button (shown on error)
   */
  onRetry?: () => void

  /**
   * Optional className for styling
   */
  className?: string
}

/**
 * Format the last saved time relative to now
 */
function formatLastSaved(date: Date): string {
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'a moment ago'
  }
}

export default function SaveStatusIndicator({
  status,
  lastSaved,
  onRetry,
  className,
}: SaveStatusIndicatorProps) {
  if (status === 'idle' && !lastSaved) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {/* Saving state */}
      {status === 'saving' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}

      {/* Saved state */}
      {status === 'saved' && lastSaved && (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-muted-foreground">Saved {formatLastSaved(lastSaved)}</span>
        </>
      )}

      {/* Idle state with last saved time */}
      {status === 'idle' && lastSaved && (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-muted-foreground">Last saved {formatLastSaved(lastSaved)}</span>
        </>
      )}

      {/* Error state */}
      {status === 'error' && (
        <>
          <AlertCircle className="text-destructive h-4 w-4" />
          <span className="text-destructive">Error saving</span>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry} className="h-7 px-2">
              Retry
            </Button>
          )}
        </>
      )}
    </div>
  )
}
