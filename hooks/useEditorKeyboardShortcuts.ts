/**
 * Editor Keyboard Shortcuts Hook
 *
 * Registers global keyboard shortcuts for the article editor.
 *
 * Shortcuts:
 * - Cmd/Ctrl + Z → Undo
 * - Cmd/Ctrl + Shift + Z → Redo
 * - Cmd/Ctrl + S → Manual save
 *
 * @example
 * ```tsx
 * useEditorKeyboardShortcuts({ onSave: triggerSave })
 * ```
 *
 * @module hooks/useEditorKeyboardShortcuts
 */

'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/lib/stores/editor-store'
import { toast } from '@/hooks/use-toast'

interface UseEditorKeyboardShortcutsOptions {
  /**
   * Callback for manual save (Cmd/Ctrl+S)
   */
  onSave?: () => void
}

/**
 * Register keyboard shortcuts for editor
 */
export function useEditorKeyboardShortcuts({ onSave }: UseEditorKeyboardShortcutsOptions = {}) {
  const { undo, redo, canUndo, canRedo } = useEditorStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect platform (Mac vs Windows/Linux)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      // Ignore if user is typing in input/textarea/contentEditable
      // EXCEPT for Cmd/Ctrl+Z which should work everywhere
      const target = e.target as HTMLElement
      const isEditing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Cmd/Ctrl + Z (Undo)
      if (modifier && e.key === 'z' && !e.shiftKey) {
        if (canUndo()) {
          e.preventDefault()
          undo()
          toast({
            title: 'Undo',
            description: 'Action undone',
            duration: 1500,
          })
        }
        return
      }

      // Cmd/Ctrl + Shift + Z (Redo)
      if (modifier && e.key === 'z' && e.shiftKey) {
        if (canRedo()) {
          e.preventDefault()
          redo()
          toast({
            title: 'Redo',
            description: 'Action redone',
            duration: 1500,
          })
        }
        return
      }

      // Don't handle other shortcuts if user is editing
      if (isEditing) {
        return
      }

      // Cmd/Ctrl + S (Manual Save)
      if (modifier && e.key === 's') {
        e.preventDefault()
        if (onSave) {
          onSave()
          toast({
            title: 'Saving...',
            description: 'Your changes are being saved',
            duration: 2000,
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo, onSave])
}
