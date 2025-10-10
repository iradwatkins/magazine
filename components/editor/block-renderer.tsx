/**
 * Block Renderer Component
 *
 * Renders all block types with proper styling and formatting.
 * Provides accurate WYSIWYG preview of article content.
 *
 * Block types:
 * - Heading: H1-H6 with alignment and typography scale
 * - Paragraph: Rich text with TipTap (read-only initially)
 * - Image: Next.js Image with layouts (full, centered, float)
 * - Quote: Blockquote with attribution and style variations
 * - List: Bullet/numbered lists with items
 * - Divider: Horizontal line with style variations
 *
 * @example
 * ```tsx
 * <BlockRenderer block={block} />
 * ```
 *
 * @module components/editor/block-renderer
 */

'use client'

import Image from 'next/image'
import type { AnyBlock } from '@/types/blocks'
import { Quote, ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/lib/stores/editor-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BlockRendererProps {
  block: AnyBlock
}

/**
 * BlockRenderer Component
 *
 * Main component that switches on block type and renders appropriate sub-component
 */
export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} />

    case 'paragraph':
      return <ParagraphBlock block={block} />

    case 'image':
      return <ImageBlock block={block} />

    case 'quote':
      return <QuoteBlock block={block} />

    case 'list':
      return <ListBlock block={block} />

    case 'divider':
      return <DividerBlock block={block} />

    default:
      // Exhaustive type checking - should never reach here
      return (
        <div className="bg-destructive/10 text-destructive rounded-md p-4">
          Unknown block type: {(block as { type: string }).type}
        </div>
      )
  }
}

/**
 * Heading Block Renderer (Editable)
 *
 * Renders H1-H6 with level selector, editable text, and alignment controls
 */
function HeadingBlock({ block }: { block: Extract<AnyBlock, { type: 'heading' }> }) {
  const { level, content, alignment } = block.data
  const { updateBlock } = useEditorStore()
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment]

  const sizeClass = {
    1: 'text-4xl font-bold leading-tight',
    2: 'text-3xl font-bold leading-tight',
    3: 'text-2xl font-semibold leading-snug',
    4: 'text-xl font-semibold leading-snug',
    5: 'text-lg font-medium leading-normal',
    6: 'text-base font-medium leading-normal',
  }[level]

  return (
    <div className="space-y-2">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <Select
          value={level.toString()}
          onValueChange={(val) =>
            updateBlock(block.id, { level: parseInt(val) as 1 | 2 | 3 | 4 | 5 | 6 })
          }
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          <Button
            variant={alignment === 'left' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => updateBlock(block.id, { alignment: 'left' })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === 'center' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => updateBlock(block.id, { alignment: 'center' })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === 'right' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => updateBlock(block.id, { alignment: 'right' })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editable Heading */}
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.textContent || '' })}
        className={cn(
          sizeClass,
          alignmentClass,
          'focus:ring-primary/20 min-h-[1em] rounded px-1 outline-none focus:ring-2',
          !content && 'text-muted-foreground'
        )}
      >
        {content || 'Enter heading...'}
      </Tag>
    </div>
  )
}

/**
 * Paragraph Block Renderer (Editable)
 *
 * Renders editable paragraph text with alignment controls
 */
function ParagraphBlock({ block }: { block: Extract<AnyBlock, { type: 'paragraph' }> }) {
  const { content, alignment } = block.data
  const { updateBlock } = useEditorStore()

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[alignment]

  return (
    <div className="space-y-2">
      {/* Alignment Controls */}
      <div className="flex gap-1">
        <Button
          variant={alignment === 'left' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { alignment: 'left' })}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={alignment === 'center' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { alignment: 'center' })}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={alignment === 'right' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { alignment: 'right' })}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Editable Paragraph */}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.textContent || '' })}
        className={cn(
          'prose prose-sm focus:ring-primary/20 min-h-[3em] max-w-none rounded px-1 leading-relaxed outline-none focus:ring-2',
          alignmentClass,
          !content && 'text-muted-foreground'
        )}
      >
        {content || 'Type your paragraph...'}
      </div>
    </div>
  )
}

/**
 * Image Block Renderer (Editable)
 *
 * Renders image with URL input, layout selector, and caption/credit inputs
 */
function ImageBlock({ block }: { block: Extract<AnyBlock, { type: 'image' }> }) {
  const { url, alt, caption, credit, layout } = block.data
  const { updateBlock } = useEditorStore()

  const layoutClass = {
    full: 'w-full',
    centered: 'mx-auto max-w-2xl',
    'float-left': 'float-left mr-4 mb-4 max-w-xs',
    'float-right': 'float-right ml-4 mb-4 max-w-xs',
  }[layout]

  return (
    <div className="space-y-3">
      {/* Image URL Input */}
      <Input
        placeholder="Image URL"
        value={url}
        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
      />

      {/* Layout Selector */}
      <Select
        value={layout}
        onValueChange={(val) => updateBlock(block.id, { layout: val as typeof layout })}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="full">Full Width</SelectItem>
          <SelectItem value="centered">Centered</SelectItem>
          <SelectItem value="float-left">Float Left</SelectItem>
          <SelectItem value="float-right">Float Right</SelectItem>
        </SelectContent>
      </Select>

      {/* Image Preview */}
      {url ? (
        <figure className={cn(layoutClass, 'my-2')}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <Image
              src={url}
              alt={alt || 'Article image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </figure>
      ) : (
        <div className="border-muted-foreground/25 bg-muted/30 flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
          <ImageIcon className="text-muted-foreground/50 h-12 w-12" />
        </div>
      )}

      {/* Caption & Credit */}
      <Input
        placeholder="Alt text"
        value={alt}
        onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
      />
      <Input
        placeholder="Caption (optional)"
        value={caption || ''}
        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
      />
      <Input
        placeholder="Photo credit (optional)"
        value={credit || ''}
        onChange={(e) => updateBlock(block.id, { credit: e.target.value })}
      />
    </div>
  )
}

/**
 * Quote Block Renderer (Editable)
 *
 * Renders editable blockquote with attribution and style toggle
 */
function QuoteBlock({ block }: { block: Extract<AnyBlock, { type: 'quote' }> }) {
  const { content, attribution, style } = block.data
  const { updateBlock } = useEditorStore()

  return (
    <div className="space-y-2">
      {/* Style Toggle */}
      <div className="flex gap-2">
        <Button
          variant={style === 'default' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { style: 'default' })}
        >
          Default
        </Button>
        <Button
          variant={style === 'pullquote' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { style: 'pullquote' })}
        >
          Pullquote
        </Button>
      </div>

      {/* Quote Content */}
      {style === 'default' ? (
        <blockquote className="bg-muted/30 border-l-4 border-primary py-4 pl-6 pr-4">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.textContent || '' })}
            className={cn(
              'focus:ring-primary/20 min-h-[2em] rounded px-1 text-lg italic leading-relaxed outline-none focus:ring-2',
              !content && 'text-muted-foreground'
            )}
          >
            {content || 'Enter quote...'}
          </div>
          <Input
            placeholder="Attribution (optional)"
            value={attribution || ''}
            onChange={(e) => updateBlock(block.id, { attribution: e.target.value })}
            className="mt-2 text-sm"
          />
        </blockquote>
      ) : (
        <blockquote className="text-center">
          <Quote className="text-primary/40 mx-auto mb-4 h-8 w-8" />
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.textContent || '' })}
            className={cn(
              'focus:ring-primary/20 min-h-[2em] rounded px-1 text-2xl font-semibold leading-tight outline-none focus:ring-2',
              !content && 'italic text-muted-foreground'
            )}
          >
            {content || 'Enter quote...'}
          </div>
          <Input
            placeholder="Attribution (optional)"
            value={attribution || ''}
            onChange={(e) => updateBlock(block.id, { attribution: e.target.value })}
            className="mx-auto mt-4 max-w-xs text-center"
          />
        </blockquote>
      )}
    </div>
  )
}

/**
 * List Block Renderer (Editable)
 *
 * Renders editable bullet or numbered lists with add/remove items
 */
function ListBlock({ block }: { block: Extract<AnyBlock, { type: 'list' }> }) {
  const { items, type } = block.data
  const { updateBlock } = useEditorStore()

  const updateItem = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    updateBlock(block.id, { items: newItems })
  }

  const addItem = () => {
    updateBlock(block.id, { items: [...items, ''] })
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    updateBlock(block.id, { items: newItems.length > 0 ? newItems : [''] })
  }

  return (
    <div className="space-y-3">
      {/* List Type Toggle */}
      <div className="flex gap-2">
        <Button
          variant={type === 'bullet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { type: 'bullet' })}
        >
          Bullet List
        </Button>
        <Button
          variant={type === 'numbered' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { type: 'numbered' })}
        >
          Numbered List
        </Button>
      </div>

      {/* List Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`Item ${index + 1}`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1"
            />
            {items.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                ✕
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        + Add Item
      </Button>
    </div>
  )
}

/**
 * Divider Block Renderer (Editable)
 *
 * Renders horizontal line with style selector
 */
function DividerBlock({ block }: { block: Extract<AnyBlock, { type: 'divider' }> }) {
  const { style } = block.data
  const { updateBlock } = useEditorStore()

  const styleClass = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }[style]

  return (
    <div className="space-y-3">
      {/* Style Selector */}
      <div className="flex gap-2">
        <Button
          variant={style === 'solid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { style: 'solid' })}
        >
          Solid
        </Button>
        <Button
          variant={style === 'dashed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { style: 'dashed' })}
        >
          Dashed
        </Button>
        <Button
          variant={style === 'dotted' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateBlock(block.id, { style: 'dotted' })}
        >
          Dotted
        </Button>
      </div>

      {/* Divider Preview */}
      <hr className={cn('border-muted-foreground/30 my-4', styleClass)} />
    </div>
  )
}
