/**
 * Inspector Panel Component
 *
 * Shows settings and customization options for the currently selected block.
 * Positioned on right side (desktop) or bottom drawer (mobile).
 *
 * Block-specific settings:
 * - Heading: Level, alignment, custom color
 * - Paragraph: Alignment, font family, line height
 * - Image: Layout, width, border, shadow
 * - Quote: Style, background color, font size
 * - List: Type, marker style
 * - Divider: Style, color, thickness
 *
 * @example
 * ```tsx
 * <InspectorPanel />
 * ```
 *
 * @module components/editor/inspector-panel
 */

'use client'

import { useEditorStore } from '@/lib/stores/editor-store'
import { AnyBlock } from '@/types/blocks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronRight, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function InspectorPanel() {
  const { selectedBlockId, blocks, updateBlock, isPanelCollapsed, togglePanel } = useEditorStore()

  // Find the selected block
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  return (
    <>
      {/* Desktop Panel */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-30 flex h-full flex-col border-l bg-background transition-transform duration-300',
          'hidden md:flex',
          'w-[320px]',
          isPanelCollapsed && 'translate-x-full'
        )}
        aria-label="Block settings inspector"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePanel}
            aria-label="Close inspector panel"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedBlock ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="text-sm text-muted-foreground">
                <Settings className="mx-auto mb-2 h-8 w-8 opacity-20" />
                <p>Select a block to view its settings</p>
              </div>
            </div>
          ) : (
            <BlockSettings block={selectedBlock} updateBlock={updateBlock} />
          )}
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 md:hidden"
        onClick={togglePanel}
        aria-label={isPanelCollapsed ? 'Open settings panel' : 'Close settings panel'}
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Mobile Drawer */}
      {!isPanelCollapsed && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={togglePanel}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[60vh] overflow-y-auto rounded-t-lg border-t bg-background md:hidden">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <h2 className="text-lg font-semibold">Settings</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={togglePanel}>
                Close
              </Button>
            </div>

            {/* Mobile Content */}
            <div className="p-4">
              {!selectedBlock ? (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Select a block to view its settings</p>
                </div>
              ) : (
                <BlockSettings block={selectedBlock} updateBlock={updateBlock} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

/**
 * Block Settings Component
 * Renders settings specific to the block type
 */
function BlockSettings({
  block,
  updateBlock,
}: {
  block: AnyBlock
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  switch (block.type) {
    case 'heading':
      return <HeadingSettings block={block} updateBlock={updateBlock} />
    case 'paragraph':
      return <ParagraphSettings block={block} updateBlock={updateBlock} />
    case 'image':
      return <ImageSettings block={block} updateBlock={updateBlock} />
    case 'quote':
      return <QuoteSettings block={block} updateBlock={updateBlock} />
    case 'list':
      return <ListSettings block={block} updateBlock={updateBlock} />
    case 'divider':
      return <DividerSettings block={block} updateBlock={updateBlock} />
    default:
      return <div className="text-sm text-muted-foreground">No settings available</div>
  }
}

/**
 * Heading Block Settings
 */
function HeadingSettings({
  block,
  updateBlock,
}: {
  block: Extract<AnyBlock, { type: 'heading' }>
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  const { level, alignment, color } = block.data

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Heading Level</label>
        <Select
          value={level.toString()}
          onValueChange={(val) =>
            updateBlock(block.id, { level: parseInt(val) as 1 | 2 | 3 | 4 | 5 | 6 })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Heading 1 (Largest)</SelectItem>
            <SelectItem value="2">Heading 2</SelectItem>
            <SelectItem value="3">Heading 3</SelectItem>
            <SelectItem value="4">Heading 4</SelectItem>
            <SelectItem value="5">Heading 5</SelectItem>
            <SelectItem value="6">Heading 6 (Smallest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Text Alignment</label>
        <Select
          value={alignment}
          onValueChange={(val) => updateBlock(block.id, { alignment: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Custom Color (Optional)</label>
        <Input
          type="color"
          value={color || '#000000'}
          onChange={(e) => updateBlock(block.id, { color: e.target.value })}
          className="h-10 w-full"
        />
      </div>
    </div>
  )
}

/**
 * Paragraph Block Settings
 */
function ParagraphSettings({
  block,
  updateBlock,
}: {
  block: Extract<AnyBlock, { type: 'paragraph' }>
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  const { alignment, fontFamily, lineHeight } = block.data

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Text Alignment</label>
        <Select
          value={alignment}
          onValueChange={(val) => updateBlock(block.id, { alignment: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="justify">Justify</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Font Family</label>
        <Select
          value={fontFamily || 'sans'}
          onValueChange={(val) => updateBlock(block.id, { fontFamily: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans">Sans Serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Line Height</label>
        <Select
          value={lineHeight || 'normal'}
          onValueChange={(val) => updateBlock(block.id, { lineHeight: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tight">Tight</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="relaxed">Relaxed</SelectItem>
            <SelectItem value="loose">Loose</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

/**
 * Image Block Settings
 */
function ImageSettings({
  block,
  updateBlock,
}: {
  block: Extract<AnyBlock, { type: 'image' }>
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  const { layout, width, border, shadow } = block.data

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Layout</label>
        <Select value={layout} onValueChange={(val) => updateBlock(block.id, { layout: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="centered">Centered</SelectItem>
            <SelectItem value="float-left">Float Left</SelectItem>
            <SelectItem value="float-right">Float Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Width (%)</label>
        <Input
          type="number"
          min="20"
          max="100"
          value={width || 100}
          onChange={(e) => updateBlock(block.id, { width: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={border || false}
            onChange={(e) => updateBlock(block.id, { border: e.target.checked })}
            className="h-4 w-4"
          />
          Show Border
        </label>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={shadow || false}
            onChange={(e) => updateBlock(block.id, { shadow: e.target.checked })}
            className="h-4 w-4"
          />
          Show Shadow
        </label>
      </div>
    </div>
  )
}

/**
 * Quote Block Settings
 */
function QuoteSettings({
  block,
  updateBlock,
}: {
  block: Extract<AnyBlock, { type: 'quote' }>
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  const { style, backgroundColor, fontSize } = block.data

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Quote Style</label>
        <Select value={style} onValueChange={(val) => updateBlock(block.id, { style: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="pullquote">Pullquote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Background Color (Optional)</label>
        <Input
          type="color"
          value={backgroundColor || '#f3f4f6'}
          onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
          className="h-10 w-full"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Font Size</label>
        <Select
          value={fontSize || 'normal'}
          onValueChange={(val) => updateBlock(block.id, { fontSize: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

/**
 * List Block Settings
 */
function ListSettings({
  block,
  updateBlock,
}: {
  block: Extract<AnyBlock, { type: 'list' }>
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  const { type, markerStyle } = block.data

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">List Type</label>
        <Select value={type} onValueChange={(val) => updateBlock(block.id, { type: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bullet">Bullet List</SelectItem>
            <SelectItem value="numbered">Numbered List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Marker Style</label>
        <Select
          value={markerStyle || 'default'}
          onValueChange={(val) => updateBlock(block.id, { markerStyle: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {type === 'bullet' ? (
              <>
                <SelectItem value="default">Disc</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="default">Decimal</SelectItem>
                <SelectItem value="roman">Roman Numerals</SelectItem>
                <SelectItem value="alpha">Alphabetic</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

/**
 * Divider Block Settings
 */
function DividerSettings({
  block,
  updateBlock,
}: {
  block: Extract<AnyBlock, { type: 'divider' }>
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void
}) {
  const { style, color, thickness } = block.data

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Divider Style</label>
        <Select value={style} onValueChange={(val) => updateBlock(block.id, { style: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Color</label>
        <Input
          type="color"
          value={color || '#d1d5db'}
          onChange={(e) => updateBlock(block.id, { color: e.target.value })}
          className="h-10 w-full"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Thickness (px)</label>
        <Input
          type="number"
          min="1"
          max="10"
          value={thickness || 1}
          onChange={(e) => updateBlock(block.id, { thickness: parseInt(e.target.value) })}
        />
      </div>
    </div>
  )
}
