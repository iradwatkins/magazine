/**
 * Sortable Block Wrapper Component
 *
 * Wraps individual blocks to provide drag-and-drop, selection, and action functionality.
 * Features:
 * - Drag handle (visible on hover, desktop only)
 * - Block selection with visual highlight
 * - Action buttons: Settings, Duplicate, Delete
 * - Delete confirmation dialog
 * - Keyboard accessibility
 * - Touch device optimization
 *
 * @example
 * ```tsx
 * <SortableBlock block={block}>
 *   <BlockRenderer block={block} />
 * </SortableBlock>
 * ```
 *
 * @module components/editor/sortable-block
 */

'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEditorStore } from '@/lib/stores/editor-store'
import { GripVertical, Settings, Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { AnyBlock } from '@/types/blocks'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

interface SortableBlockProps {
  block: AnyBlock
  children: React.ReactNode
}

/**
 * SortableBlock Component
 *
 * Wraps a block to make it draggable, selectable, and provide actions
 */
export default function SortableBlock({ block, children }: SortableBlockProps) {
  const { selectedBlockId, setSelectedBlock, deleteBlock, addBlock } = useEditorStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Configure sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  // Apply transform and transition styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isSelected = selectedBlockId === block.id

  /**
   * Handle block selection
   */
  function handleSelect() {
    if (!isDragging) {
      setSelectedBlock(block.id)
    }
  }

  /**
   * Handle keyboard selection
   */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !isDragging) {
      setSelectedBlock(block.id)
    }
  }

  /**
   * Duplicate the current block
   * Creates a copy with a new unique ID and inserts after current block
   */
  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation()

    const duplicatedBlock: AnyBlock = {
      ...block,
      id: crypto.randomUUID(),
      order: block.order + 1,
    }

    addBlock(duplicatedBlock)
  }

  /**
   * Delete the current block after confirmation
   */
  function handleDelete() {
    deleteBlock(block.id)
    setShowDeleteDialog(false)
    setSelectedBlock(null)
  }

  /**
   * Open delete confirmation dialog
   */
  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  /**
   * Open settings inspector (placeholder for Story 5.9)
   */
  function handleSettings(e: React.MouseEvent) {
    e.stopPropagation()
    // TODO: Implement in Story 5.9 - Block Settings Inspector Panel
    console.log('Settings clicked for block:', block.id)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${block.type} block`}
        className={cn(
          'group relative rounded-lg border bg-background p-4 transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isSelected && 'ring-primary/20 border-primary ring-2',
          !isSelected && 'hover:border-muted-foreground/50 border-border'
        )}
      >
        {/* Drag Handle - Desktop Only */}
        <button
          {...attributes}
          {...listeners}
          type="button"
          className={cn(
            'absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2',
            'cursor-grab rounded-md bg-background p-1.5 shadow-md',
            'opacity-0 transition-opacity group-hover:opacity-100',
            'sm:block',
            'active:cursor-grabbing',
            'hover:bg-muted',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label="Drag to reorder block"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Block Content */}
        <div className="min-h-[40px]">{children}</div>

        {/* Action Buttons - Visible on Hover */}
        <div
          className={cn(
            'absolute right-2 top-2 flex gap-1',
            'opacity-0 transition-opacity group-hover:opacity-100',
            isSelected && 'opacity-100'
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSettings}
            className="h-8 w-8"
            aria-label="Block settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDuplicate}
            className="h-8 w-8"
            aria-label="Duplicate block"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDeleteClick}
            className="hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
            aria-label="Delete block"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Block?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {block.type} block? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
