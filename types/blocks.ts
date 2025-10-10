/**
 * Block Type Definitions for Drag-and-Drop Article Editor
 *
 * This file contains all TypeScript type definitions and Zod schemas
 * for the article editor's block system. It provides:
 * - Type-safe block definitions with discriminated unions
 * - Runtime validation via Zod schemas
 * - Type guard functions for narrowing
 * - Helper types for type-safe block data access
 *
 * @module types/blocks
 */

import { z } from 'zod'

// =============================================================================
// BLOCK TYPE UNION
// =============================================================================

/**
 * All available block types in the editor
 *
 * @example
 * ```typescript
 * const blockType: BlockType = 'heading'
 * ```
 */
export type BlockType = 'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'divider'

// =============================================================================
// ALIGNMENT & STYLE TYPES
// =============================================================================

/**
 * Text alignment options for heading blocks
 */
export type HeadingAlignment = 'left' | 'center' | 'right'

/**
 * Text alignment options for paragraph blocks (includes justify)
 */
export type ParagraphAlignment = 'left' | 'center' | 'right' | 'justify'

/**
 * Image layout options for positioning and sizing
 */
export type ImageLayout = 'full' | 'centered' | 'float-left' | 'float-right'

/**
 * Quote block visual styles
 */
export type QuoteStyle = 'default' | 'pullquote'

/**
 * List type options
 */
export type ListType = 'bullet' | 'numbered'

/**
 * Divider visual styles
 */
export type DividerStyle = 'solid' | 'dashed' | 'dotted'

// =============================================================================
// BLOCK DATA INTERFACES
// =============================================================================

/**
 * Data for heading blocks (H1-H6)
 *
 * @interface HeadingBlockData
 * @property {1|2|3|4|5|6} level - Heading level (H1-H6)
 * @property {string} content - Text content of the heading
 * @property {HeadingAlignment} alignment - Text alignment
 *
 * @example
 * ```typescript
 * const headingData: HeadingBlockData = {
 *   level: 2,
 *   content: 'Article Title',
 *   alignment: 'center'
 * }
 * ```
 */
export interface HeadingBlockData {
  level: 1 | 2 | 3 | 4 | 5 | 6
  content: string
  alignment: HeadingAlignment
}

/**
 * Data for paragraph blocks with rich text
 *
 * @interface ParagraphBlockData
 * @property {string} content - Rich text content (TipTap JSON or HTML)
 * @property {ParagraphAlignment} alignment - Text alignment including justify
 *
 * @example
 * ```typescript
 * const paragraphData: ParagraphBlockData = {
 *   content: '<p>This is a paragraph with <strong>bold</strong> text.</p>',
 *   alignment: 'justify'
 * }
 * ```
 */
export interface ParagraphBlockData {
  content: string
  alignment: ParagraphAlignment
}

/**
 * Data for image blocks
 *
 * @interface ImageBlockData
 * @property {string} url - Image URL (from MinIO or external)
 * @property {string} alt - Alt text for accessibility (required)
 * @property {string} [caption] - Optional image caption
 * @property {string} [credit] - Optional photo credit/attribution
 * @property {ImageLayout} layout - Image layout/positioning
 *
 * @example
 * ```typescript
 * const imageData: ImageBlockData = {
 *   url: 'https://example.com/image.jpg',
 *   alt: 'Description of image',
 *   caption: 'A beautiful sunset',
 *   credit: 'Photo by Jane Doe',
 *   layout: 'centered'
 * }
 * ```
 */
export interface ImageBlockData {
  url: string
  alt: string
  caption?: string
  credit?: string
  layout: ImageLayout
}

/**
 * Data for quote/blockquote blocks
 *
 * @interface QuoteBlockData
 * @property {string} content - Quote text content
 * @property {string} [attribution] - Optional quote attribution (author/source)
 * @property {QuoteStyle} style - Visual style (default or pullquote)
 *
 * @example
 * ```typescript
 * const quoteData: QuoteBlockData = {
 *   content: 'To be or not to be, that is the question.',
 *   attribution: 'William Shakespeare',
 *   style: 'pullquote'
 * }
 * ```
 */
export interface QuoteBlockData {
  content: string
  attribution?: string
  style: QuoteStyle
}

/**
 * Data for list blocks (bullet or numbered)
 *
 * @interface ListBlockData
 * @property {string[]} items - Array of list item text
 * @property {ListType} type - List type (bullet or numbered)
 *
 * @example
 * ```typescript
 * const listData: ListBlockData = {
 *   items: ['First item', 'Second item', 'Third item'],
 *   type: 'bullet'
 * }
 * ```
 */
export interface ListBlockData {
  items: string[]
  type: ListType
}

/**
 * Data for divider/separator blocks
 *
 * @interface DividerBlockData
 * @property {DividerStyle} style - Visual style of the divider line
 *
 * @example
 * ```typescript
 * const dividerData: DividerBlockData = {
 *   style: 'dashed'
 * }
 * ```
 */
export interface DividerBlockData {
  style: DividerStyle
}

// =============================================================================
// ZOD SCHEMAS FOR RUNTIME VALIDATION
// =============================================================================

/**
 * Zod schema for HeadingBlockData
 */
export const HeadingBlockDataSchema = z.object({
  level: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
  content: z.string(),
  alignment: z.enum(['left', 'center', 'right']),
})

/**
 * Zod schema for ParagraphBlockData
 */
export const ParagraphBlockDataSchema = z.object({
  content: z.string(),
  alignment: z.enum(['left', 'center', 'right', 'justify']),
})

/**
 * Zod schema for ImageBlockData
 */
export const ImageBlockDataSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  layout: z.enum(['full', 'centered', 'float-left', 'float-right']),
})

/**
 * Zod schema for QuoteBlockData
 */
export const QuoteBlockDataSchema = z.object({
  content: z.string(),
  attribution: z.string().optional(),
  style: z.enum(['default', 'pullquote']),
})

/**
 * Zod schema for ListBlockData
 */
export const ListBlockDataSchema = z.object({
  items: z.array(z.string()),
  type: z.enum(['bullet', 'numbered']),
})

/**
 * Zod schema for DividerBlockData
 */
export const DividerBlockDataSchema = z.object({
  style: z.enum(['solid', 'dashed', 'dotted']),
})

// =============================================================================
// DISCRIMINATED UNION TYPES
// =============================================================================

/**
 * Helper type to get block data type by block type
 * Enables type-safe access to block.data based on block.type
 *
 * @example
 * ```typescript
 * type HeadingData = BlockDataByType<'heading'> // HeadingBlockData
 * ```
 */
export type BlockDataByType<T extends BlockType> = T extends 'heading'
  ? HeadingBlockData
  : T extends 'paragraph'
    ? ParagraphBlockData
    : T extends 'image'
      ? ImageBlockData
      : T extends 'quote'
        ? QuoteBlockData
        : T extends 'list'
          ? ListBlockData
          : T extends 'divider'
            ? DividerBlockData
            : never

/**
 * Base block interface with discriminated union support
 *
 * @interface Block
 * @template T - Block type for type-safe data access
 * @property {string} id - Unique block identifier (e.g., cuid)
 * @property {T} type - Block type discriminator
 * @property {BlockDataByType<T>} data - Type-safe block data
 * @property {number} order - Display order in article (0-indexed)
 *
 * @example
 * ```typescript
 * const headingBlock: Block<'heading'> = {
 *   id: 'block_123',
 *   type: 'heading',
 *   data: { level: 1, content: 'Title', alignment: 'center' },
 *   order: 0
 * }
 * ```
 */
export interface Block<T extends BlockType = BlockType> {
  id: string
  type: T
  data: BlockDataByType<T>
  order: number
}

// =============================================================================
// SPECIFIC BLOCK TYPES
// =============================================================================

/**
 * Heading block (H1-H6)
 */
export type HeadingBlock = Block<'heading'>

/**
 * Paragraph block with rich text
 */
export type ParagraphBlock = Block<'paragraph'>

/**
 * Image block
 */
export type ImageBlock = Block<'image'>

/**
 * Quote/blockquote block
 */
export type QuoteBlock = Block<'quote'>

/**
 * List block (bullet or numbered)
 */
export type ListBlock = Block<'list'>

/**
 * Divider/separator block
 */
export type DividerBlock = Block<'divider'>

/**
 * Union of all specific block types
 * Use this when you need to work with any block type
 *
 * @example
 * ```typescript
 * function renderBlock(block: AnyBlock) {
 *   if (isHeadingBlock(block)) {
 *     // TypeScript knows block.data is HeadingBlockData
 *     return <h1>{block.data.content}</h1>
 *   }
 * }
 * ```
 */
export type AnyBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock

// =============================================================================
// TYPE GUARD FUNCTIONS
// =============================================================================

/**
 * Type guard for heading blocks
 */
export function isHeadingBlock(block: AnyBlock): block is HeadingBlock {
  return block.type === 'heading'
}

/**
 * Type guard for paragraph blocks
 */
export function isParagraphBlock(block: AnyBlock): block is ParagraphBlock {
  return block.type === 'paragraph'
}

/**
 * Type guard for image blocks
 */
export function isImageBlock(block: AnyBlock): block is ImageBlock {
  return block.type === 'image'
}

/**
 * Type guard for quote blocks
 */
export function isQuoteBlock(block: AnyBlock): block is QuoteBlock {
  return block.type === 'quote'
}

/**
 * Type guard for list blocks
 */
export function isListBlock(block: AnyBlock): block is ListBlock {
  return block.type === 'list'
}

/**
 * Type guard for divider blocks
 */
export function isDividerBlock(block: AnyBlock): block is DividerBlock {
  return block.type === 'divider'
}

// =============================================================================
// ZOD SCHEMA FOR COMPLETE BLOCK (DISCRIMINATED UNION)
// =============================================================================

/**
 * Complete Zod schema for blocks using discriminated union
 * Provides runtime validation for entire block structure
 *
 * @example
 * ```typescript
 * const result = BlockSchema.safeParse(unknownData)
 * if (result.success) {
 *   const block: AnyBlock = result.data
 * }
 * ```
 */
export const BlockSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('heading'),
    data: HeadingBlockDataSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('paragraph'),
    data: ParagraphBlockDataSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('image'),
    data: ImageBlockDataSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('quote'),
    data: QuoteBlockDataSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('list'),
    data: ListBlockDataSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('divider'),
    data: DividerBlockDataSchema,
    order: z.number(),
  }),
])

/**
 * Schema for array of blocks
 */
export const BlockArraySchema = z.array(BlockSchema)

/**
 * Infer TypeScript type from Zod schema (should match AnyBlock)
 */
export type BlockSchemaType = z.infer<typeof BlockSchema>
