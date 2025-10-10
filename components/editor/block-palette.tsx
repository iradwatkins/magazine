/**
 * Block Palette Sidebar Component
 *
 * Displays all available block types that can be dragged onto the editor canvas.
 * Features:
 * - All 6 block types with icons and labels
 * - Draggable blocks using @dnd-kit
 * - Recently used blocks section
 * - Mobile responsive with collapsible sidebar
 * - Search input placeholder (disabled, coming soon)
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * <BlockPalette />
 * ```
 *
 * @module components/editor/block-palette
 */

'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Heading, Type, Image, Quote, List, Minus, Menu, X, Search } from 'lucide-react'
import { BlockType } from '@/types/blocks'
import { useEditorStore } from '@/lib/stores/editor-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface BlockPaletteItem {
  type: BlockType
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
}

/**
 * Available block types with their visual representation
 */
const blockPaletteItems: BlockPaletteItem[] = [
  {
    type: 'heading',
    icon: Heading,
    label: 'Heading',
    description: 'Add a heading (H1-H6)',
  },
  {
    type: 'paragraph',
    icon: Type,
    label: 'Paragraph',
    description: 'Add text content',
  },
  {
    type: 'image',
    icon: Image,
    label: 'Image',
    description: 'Add an image',
  },
  {
    type: 'quote',
    icon: Quote,
    label: 'Quote',
    description: 'Add a quote or pullquote',
  },
  {
    type: 'list',
    icon: List,
    label: 'List',
    description: 'Add a bullet or numbered list',
  },
  {
    type: 'divider',
    icon: Minus,
    label: 'Divider',
    description: 'Add a horizontal divider',
  },
]

/**
 * Draggable Block Item Component
 */
interface DraggableBlockProps extends BlockPaletteItem {
  isRecent?: boolean
}

function DraggableBlock({
  type,
  icon: Icon,
  label,
  description,
  isRecent = false,
}: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}-${isRecent ? 'recent' : 'all'}`,
    data: { blockType: type },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all',
        'cursor-grab hover:border-border hover:bg-accent',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
      role="button"
      tabIndex={0}
      aria-label={`Add ${label} block: ${description}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted group-hover:bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

/**
 * Block Palette Sidebar Component
 */
export default function BlockPalette() {
  const { recentBlocks, isSidebarCollapsed, toggleSidebar } = useEditorStore()

  // Get full block items for recent blocks
  const recentBlockItems = recentBlocks
    .map((type) => blockPaletteItems.find((item) => item.type === type))
    .filter((item): item is BlockPaletteItem => item !== undefined)

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? 'Open block palette' : 'Close block palette'}
        aria-expanded={!isSidebarCollapsed}
      >
        {isSidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-background transition-transform duration-300',
          'w-[240px] md:w-[280px]',
          'md:translate-x-0',
          isSidebarCollapsed && 'max-md:-translate-x-full'
        )}
        aria-label="Block palette sidebar"
      >
        {/* Header */}
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Blocks</h2>
          <p className="text-xs text-muted-foreground">Drag blocks to the canvas</p>
        </div>

        {/* Search Input (Placeholder) */}
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              disabled
              className="pl-9"
              title="Coming soon"
              aria-label="Search blocks (coming soon)"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">🚧 Search coming soon</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recently Used Section */}
          {recentBlockItems.length > 0 && (
            <div className="border-b p-4">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Recently Used</h3>
              <div className="space-y-2">
                {recentBlockItems.map((item) => (
                  <DraggableBlock key={item.type} {...item} isRecent />
                ))}
              </div>
            </div>
          )}

          {/* All Blocks Section */}
          <div className="p-4">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">All Blocks</h3>
            <div className="space-y-2">
              {blockPaletteItems.map((item) => (
                <DraggableBlock key={item.type} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            {blockPaletteItems.length} block types available
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  )
}
