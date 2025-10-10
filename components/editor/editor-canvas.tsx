/**
 * Editor Canvas Component
 *
 * Main editing surface with drag-and-drop functionality for article blocks.
 * Features:
 * - DndContext wraps palette and canvas for drag-and-drop
 * - SortableContext manages block ordering
 * - Creates new blocks when dragged from palette
 * - Reorders blocks when dragged within canvas
 * - DragOverlay shows preview during drag
 * - Empty state with helpful placeholder
 *
 * @example
 * ```tsx
 * <EditorCanvas>
 *   <BlockPalette />
 * </EditorCanvas>
 * ```
 *
 * @module components/editor/editor-canvas
 */

'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEditorStore } from '@/lib/stores/editor-store'
import type { AnyBlock, BlockType } from '@/types/blocks'
import { MousePointer2 } from 'lucide-react'
import SortableBlock from './sortable-block'
import BlockRenderer from './block-renderer'

interface EditorCanvasProps {
  children?: React.ReactNode
}

/**
 * Create a new block with default data based on block type
 */
function createNewBlock(type: BlockType): AnyBlock {
  const id = crypto.randomUUID()
  const baseBlock = {
    id,
    type,
    order: 0, // Will be updated by store
  }

  switch (type) {
    case 'heading':
      return {
        ...baseBlock,
        type: 'heading',
        data: { level: 2, content: '', alignment: 'left' },
      } as AnyBlock

    case 'paragraph':
      return {
        ...baseBlock,
        type: 'paragraph',
        data: { content: '', alignment: 'left' },
      } as AnyBlock

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        data: {
          url: '',
          alt: '',
          caption: '',
          credit: '',
          layout: 'centered',
        },
      } as AnyBlock

    case 'quote':
      return {
        ...baseBlock,
        type: 'quote',
        data: {
          content: '',
          attribution: '',
          style: 'default',
        },
      } as AnyBlock

    case 'list':
      return {
        ...baseBlock,
        type: 'list',
        data: { items: [''], type: 'bullet' },
      } as AnyBlock

    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        data: { style: 'solid' },
      } as AnyBlock

    default:
      throw new Error(`Unknown block type: ${type}`)
  }
}

/**
 * Editor Canvas Component
 */
export default function EditorCanvas({ children }: EditorCanvasProps) {
  const { blocks, addBlock, updateBlockOrder, addRecentBlock } = useEditorStore()
  const [activeId, setActiveId] = useState<string | null>(null)

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragOver(_event: DragOverEvent) {
    // Can be used for visual feedback during drag
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    // Check if dragging from palette (has blockType in data)
    const blockType = active.data.current?.blockType as BlockType | undefined

    if (blockType) {
      // Creating new block from palette
      const newBlock = createNewBlock(blockType)
      addBlock(newBlock)
      addRecentBlock(blockType)
    } else {
      // Reordering existing blocks within canvas
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex)
        // Update order field for all blocks
        const blocksWithOrder = reorderedBlocks.map((b, i) => ({ ...b, order: i }))
        updateBlockOrder(blocksWithOrder)
      }
    }

    setActiveId(null)
  }

  // Get the active block for drag overlay
  const activeBlock = blocks.find((b) => b.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-screen">
        {/* Block Palette Sidebar (passed as children) */}
        {children}

        {/* Editor Canvas */}
        <main className="bg-muted/30 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[720px] px-4 py-8 md:px-6 md:py-12">
            {blocks.length === 0 ? (
              /* Empty State */
              <div className="border-muted-foreground/25 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-background p-12 text-center">
                <MousePointer2 className="text-muted-foreground/50 mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                  Start by dragging blocks from the left
                </h3>
                <p className="text-muted-foreground/75 text-sm">
                  Choose a block type and drag it onto the canvas to begin creating your article
                </p>
              </div>
            ) : (
              /* Blocks List */
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <SortableBlock key={block.id} block={block}>
                      <BlockRenderer block={block} />
                    </SortableBlock>
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </main>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeBlock ? (
          <div className="rounded-lg border bg-background p-4 opacity-50 shadow-lg">
            <div className="text-sm font-medium">{activeBlock.type} block</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
