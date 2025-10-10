/**
 * Type Tests for Block System
 *
 * This file demonstrates and validates the block type system.
 * It serves as both documentation and verification that types work correctly.
 */

import {
  // Types
  type AnyBlock,
  type HeadingBlock,
  type ParagraphBlock,
  type ImageBlock,
  type QuoteBlock,
  type ListBlock,
  type DividerBlock,
  type BlockType,
  type HeadingBlockData,
  type ParagraphBlockData,
  type ImageBlockData,
  type QuoteBlockData,
  type ListBlockData,
  type DividerBlockData,
  // Type Guards
  isHeadingBlock,
  isParagraphBlock,
  isImageBlock,
  isQuoteBlock,
  isListBlock,
  isDividerBlock,
  // Schemas
  BlockSchema,
  BlockArraySchema,
  HeadingBlockDataSchema,
  ParagraphBlockDataSchema,
  ImageBlockDataSchema,
  QuoteBlockDataSchema,
  ListBlockDataSchema,
  DividerBlockDataSchema,
} from '../blocks'

// =============================================================================
// SAMPLE DATA FOR TESTING
// =============================================================================

const sampleHeadingBlock: HeadingBlock = {
  id: 'block_heading_1',
  type: 'heading',
  data: {
    level: 1,
    content: 'Article Title',
    alignment: 'center',
  },
  order: 0,
}

const sampleParagraphBlock: ParagraphBlock = {
  id: 'block_para_1',
  type: 'paragraph',
  data: {
    content: '<p>This is a paragraph with <strong>bold</strong> text.</p>',
    alignment: 'justify',
  },
  order: 1,
}

const sampleImageBlock: ImageBlock = {
  id: 'block_img_1',
  type: 'image',
  data: {
    url: 'https://example.com/image.jpg',
    alt: 'A beautiful landscape',
    caption: 'Sunset over the mountains',
    credit: 'Photo by John Doe',
    layout: 'centered',
  },
  order: 2,
}

const sampleQuoteBlock: QuoteBlock = {
  id: 'block_quote_1',
  type: 'quote',
  data: {
    content: 'To be or not to be, that is the question.',
    attribution: 'William Shakespeare',
    style: 'pullquote',
  },
  order: 3,
}

const sampleListBlock: ListBlock = {
  id: 'block_list_1',
  type: 'list',
  data: {
    items: ['First item', 'Second item', 'Third item'],
    type: 'bullet',
  },
  order: 4,
}

const sampleDividerBlock: DividerBlock = {
  id: 'block_div_1',
  type: 'divider',
  data: {
    style: 'dashed',
  },
  order: 5,
}

// =============================================================================
// TYPE SYSTEM TESTS
// =============================================================================

describe('Block Type System', () => {
  describe('TypeScript Type Checking', () => {
    test('Block types are properly defined', () => {
      // This test passes if TypeScript compiles without errors
      const blockType: BlockType = 'heading'
      expect(['heading', 'paragraph', 'image', 'quote', 'list', 'divider']).toContain(blockType)
    })

    test('Block data interfaces have correct fields', () => {
      const headingData: HeadingBlockData = {
        level: 2,
        content: 'Test',
        alignment: 'left',
      }
      expect(headingData.level).toBe(2)

      const paragraphData: ParagraphBlockData = {
        content: 'Test content',
        alignment: 'justify',
      }
      expect(paragraphData.alignment).toBe('justify')
    })

    test('Discriminated union works correctly', () => {
      const blocks: AnyBlock[] = [
        sampleHeadingBlock,
        sampleParagraphBlock,
        sampleImageBlock,
        sampleQuoteBlock,
        sampleListBlock,
        sampleDividerBlock,
      ]

      expect(blocks).toHaveLength(6)
    })
  })

  describe('Type Guards', () => {
    test('isHeadingBlock correctly identifies heading blocks', () => {
      expect(isHeadingBlock(sampleHeadingBlock)).toBe(true)
      expect(isHeadingBlock(sampleParagraphBlock)).toBe(false)
    })

    test('isParagraphBlock correctly identifies paragraph blocks', () => {
      expect(isParagraphBlock(sampleParagraphBlock)).toBe(true)
      expect(isParagraphBlock(sampleImageBlock)).toBe(false)
    })

    test('isImageBlock correctly identifies image blocks', () => {
      expect(isImageBlock(sampleImageBlock)).toBe(true)
      expect(isImageBlock(sampleQuoteBlock)).toBe(false)
    })

    test('isQuoteBlock correctly identifies quote blocks', () => {
      expect(isQuoteBlock(sampleQuoteBlock)).toBe(true)
      expect(isQuoteBlock(sampleListBlock)).toBe(false)
    })

    test('isListBlock correctly identifies list blocks', () => {
      expect(isListBlock(sampleListBlock)).toBe(true)
      expect(isListBlock(sampleDividerBlock)).toBe(false)
    })

    test('isDividerBlock correctly identifies divider blocks', () => {
      expect(isDividerBlock(sampleDividerBlock)).toBe(true)
      expect(isDividerBlock(sampleHeadingBlock)).toBe(false)
    })

    test('Type guards enable type-safe data access', () => {
      const block: AnyBlock = sampleHeadingBlock

      if (isHeadingBlock(block)) {
        // TypeScript knows block.data is HeadingBlockData
        expect(block.data.level).toBe(1)
        expect(block.data.content).toBe('Article Title')
      }
    })
  })

  describe('Zod Schema Validation', () => {
    test('HeadingBlockDataSchema validates correct data', () => {
      const result = HeadingBlockDataSchema.safeParse(sampleHeadingBlock.data)
      expect(result.success).toBe(true)
    })

    test('HeadingBlockDataSchema rejects invalid level', () => {
      const invalidData = { level: 7, content: 'Test', alignment: 'left' }
      const result = HeadingBlockDataSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    test('ParagraphBlockDataSchema validates correct data', () => {
      const result = ParagraphBlockDataSchema.safeParse(sampleParagraphBlock.data)
      expect(result.success).toBe(true)
    })

    test('ImageBlockDataSchema validates URLs', () => {
      const validData = { ...sampleImageBlock.data }
      const result = ImageBlockDataSchema.safeParse(validData)
      expect(result.success).toBe(true)

      const invalidData = { ...validData, url: 'not-a-url' }
      const invalidResult = ImageBlockDataSchema.safeParse(invalidData)
      expect(invalidResult.success).toBe(false)
    })

    test('ImageBlockDataSchema allows optional fields', () => {
      const minimalData = {
        url: 'https://example.com/image.jpg',
        alt: 'Alt text',
        layout: 'centered',
      }
      const result = ImageBlockDataSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })

    test('QuoteBlockDataSchema validates correct data', () => {
      const result = QuoteBlockDataSchema.safeParse(sampleQuoteBlock.data)
      expect(result.success).toBe(true)
    })

    test('ListBlockDataSchema validates correct data', () => {
      const result = ListBlockDataSchema.safeParse(sampleListBlock.data)
      expect(result.success).toBe(true)
    })

    test('DividerBlockDataSchema validates correct data', () => {
      const result = DividerBlockDataSchema.safeParse(sampleDividerBlock.data)
      expect(result.success).toBe(true)
    })

    test('BlockSchema validates complete blocks with discriminated union', () => {
      const headingResult = BlockSchema.safeParse(sampleHeadingBlock)
      expect(headingResult.success).toBe(true)

      const paragraphResult = BlockSchema.safeParse(sampleParagraphBlock)
      expect(paragraphResult.success).toBe(true)

      const imageResult = BlockSchema.safeParse(sampleImageBlock)
      expect(imageResult.success).toBe(true)
    })

    test('BlockSchema rejects invalid block types', () => {
      const invalidBlock = {
        id: 'block_1',
        type: 'invalid',
        data: {},
        order: 0,
      }
      const result = BlockSchema.safeParse(invalidBlock)
      expect(result.success).toBe(false)
    })

    test('BlockArraySchema validates arrays of blocks', () => {
      const blocks = [
        sampleHeadingBlock,
        sampleParagraphBlock,
        sampleImageBlock,
        sampleQuoteBlock,
        sampleListBlock,
        sampleDividerBlock,
      ]
      const result = BlockArraySchema.safeParse(blocks)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveLength(6)
      }
    })
  })

  describe('Practical Usage Examples', () => {
    test('Rendering blocks with type-safe data access', () => {
      const blocks: AnyBlock[] = [sampleHeadingBlock, sampleParagraphBlock, sampleImageBlock]

      const rendered = blocks.map((block) => {
        if (isHeadingBlock(block)) {
          return `<h${block.data.level}>${block.data.content}</h${block.data.level}>`
        }
        if (isParagraphBlock(block)) {
          return block.data.content
        }
        if (isImageBlock(block)) {
          return `<img src="${block.data.url}" alt="${block.data.alt}" />`
        }
        return ''
      })

      expect(rendered).toHaveLength(3)
      expect(rendered[0]).toContain('<h1>')
      expect(rendered[1]).toContain('<strong>')
      expect(rendered[2]).toContain('<img')
    })

    test('Validating API input', () => {
      // Simulating API input
      const apiInput = {
        id: 'new_block',
        type: 'heading',
        data: {
          level: 2,
          content: 'New Section',
          alignment: 'left',
        },
        order: 10,
      }

      const result = BlockSchema.safeParse(apiInput)
      expect(result.success).toBe(true)

      if (result.success) {
        const block: AnyBlock = result.data
        expect(block.type).toBe('heading')
      }
    })

    test('Creating new blocks with type safety', () => {
      const createHeadingBlock = (
        content: string,
        level: 1 | 2 | 3 | 4 | 5 | 6 = 2
      ): HeadingBlock => {
        return {
          id: `block_${Date.now()}`,
          type: 'heading',
          data: {
            level,
            content,
            alignment: 'left',
          },
          order: 0,
        }
      }

      const newBlock = createHeadingBlock('My Heading', 3)
      expect(newBlock.data.level).toBe(3)
      expect(isHeadingBlock(newBlock)).toBe(true)
    })
  })
})
