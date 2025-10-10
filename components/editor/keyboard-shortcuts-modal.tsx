/**
 * Keyboard Shortcuts Modal Component
 *
 * Displays all available keyboard shortcuts in a help modal.
 * Automatically detects platform (Mac vs Windows) and shows appropriate modifier keys.
 *
 * @example
 * ```tsx
 * const [showHelp, setShowHelp] = useState(false)
 *
 * <KeyboardShortcutsModal
 *   open={showHelp}
 *   onOpenChange={setShowHelp}
 * />
 * ```
 *
 * @module components/editor/keyboard-shortcuts-modal
 */

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'

interface KeyboardShortcutsModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean

  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void
}

interface Shortcut {
  keys: string
  action: string
}

export default function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  const [isMac, setIsMac] = useState(false)

  // Detect platform on mount
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  const modifier = isMac ? '⌘' : 'Ctrl'

  const shortcuts: Shortcut[] = [
    { keys: `${modifier} + Z`, action: 'Undo last action' },
    { keys: `${modifier} + Shift + Z`, action: 'Redo last action' },
    { keys: `${modifier} + S`, action: 'Save manually' },
    { keys: '?', action: 'Show this help dialog' },
    { keys: 'Esc', action: 'Close dialogs' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to speed up your editing workflow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              <kbd className="rounded border bg-muted px-2.5 py-1.5 font-mono text-sm font-semibold">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">?</kbd> anytime to
          reopen this dialog
        </div>
      </DialogContent>
    </Dialog>
  )
}
