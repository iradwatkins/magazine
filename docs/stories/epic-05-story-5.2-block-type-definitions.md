# Story 5.2: Create Block Type Definitions and TypeScript Types

**Epic:** Epic 5 - Drag-and-Drop Article Editor
**Story ID:** 5.2
**Status:** Draft
**Created:** 2025-10-09
**Agent Model Used:** claude-sonnet-4-5

---

## User Story

**As a** developer,
**I want** comprehensive TypeScript type definitions for all block types,
**So that** the editor has type safety and IDE autocompletion.

---

## Story Context

**Existing System Integration:**

- Integrates with: Next.js 15 App Router, React 19, TypeScript strict mode
- Technology: TypeScript, Zod for runtime validation
- Follows pattern: Type definitions in `types/` or `lib/` directory
- Touch points: Will be used by all block components (Stories 5.7, 5.8), Block Renderer (5.6), Editor Canvas (5.4)

**Epic Context:**
This is the **second story** in Epic 5. It establishes the type system foundation that all block components and editor functionality will use. This story has no dependencies on Story 5.1 but is critical for Stories 5.3-5.12.

---

## Acceptance Criteria

### Functional Requirements

1. **Block Type Union:**
   - Define BlockType union: `'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'divider'`
   - Type is exported and available for import
   - TypeScript enforces valid block types at compile time

2. **Block Data Interfaces:**
   - Each block type has corresponding data interface
   - Interfaces are properly typed with correct field types
   - Optional fields marked with `?`
   - All interfaces exported

3. **Heading Block Data:**
   - Interface: `HeadingBlockData`
   - Fields:
     - `level`: 1 | 2 | 3 | 4 | 5 | 6
     - `content`: string
     - `alignment`: 'left' | 'center' | 'right'

4. **Paragraph Block Data:**
   - Interface: `ParagraphBlockData`
   - Fields:
     - `content`: string
     - `alignment`: 'left' | 'center' | 'right' | 'justify'

5. **Image Block Data:**
   - Interface: `ImageBlockData`
   - Fields:
     - `url`: string
     - `alt`: string
     - `caption?`: string (optional)
     - `credit?`: string (optional)
     - `layout`: 'full' | 'centered' | 'float-left' | 'float-right'

6. **Quote Block Data:**
   - Interface: `QuoteBlockData`
   - Fields:
     - `content`: string
     - `attribution?`: string (optional)
     - `style`: 'default' | 'pullquote'

7. **List Block Data:**
   - Interface: `ListBlockData`
   - Fields:
     - `items`: string[]
     - `type`: 'bullet' | 'numbered'

8. **Divider Block Data:**
   - Interface: `DividerBlockData`
   - Fields:
     - `style`: 'solid' | 'dashed' | 'dotted'

9. **Base Block Interface:**
   - Interface: `Block`
   - Fields:
     - `id`: string (unique identifier)
     - `type`: BlockType
     - `data`: BlockData (discriminated union based on type)
     - `order`: number (position in article)
   - Support discriminated union pattern for type-safe access to block.data

10. **Zod Schemas:**
    - Create Zod schema for each block data type
    - Export schemas for runtime validation
    - Schemas match TypeScript interfaces exactly
    - Support validation in API endpoints

### Integration Requirements

11. **Type Organization:**
    - All types in single file: `types/blocks.ts` or `lib/types/blocks.ts`
    - Clean export structure
    - No circular dependencies
    - Types importable from `@/types/blocks` or `@/lib/types/blocks`

12. **Type Utilities:**
    - Type guard functions for each block type
    - Helper type for getting block data by type
    - Proper use of TypeScript discriminated unions

### Quality Requirements

13. **TypeScript Strict Mode:**
    - All types pass TypeScript strict mode checks
    - No `any` types used
    - Proper null/undefined handling
    - Types compile without errors

14. **Documentation:**
    - JSDoc comments for all interfaces
    - Usage examples in comments
    - Field descriptions for complex types

---

## Tasks

### Type Definition Creation

- [x] Create `types/blocks.ts` or `lib/types/blocks.ts` file
- [x] Define `BlockType` union type
- [x] Define alignment types (HeadingAlignment, ParagraphAlignment)
- [x] Define layout types (ImageLayout)
- [x] Define style types (QuoteStyle, DividerStyle, ListType)

### Block Data Interfaces

- [x] Create `HeadingBlockData` interface
- [x] Create `ParagraphBlockData` interface
- [x] Create `ImageBlockData` interface
- [x] Create `QuoteBlockData` interface
- [x] Create `ListBlockData` interface
- [x] Create `DividerBlockData` interface

### Base Block Type

- [x] Create `BlockData` discriminated union type
- [x] Create `Block` base interface with generic type parameter
- [x] Create specific block types (HeadingBlock, ParagraphBlock, etc.)
- [x] Create `AnyBlock` union type

### Type Utilities

- [x] Create type guard functions: `isHeadingBlock`, `isParagraphBlock`, etc.
- [x] Create helper type: `BlockDataByType<T extends BlockType>`
- [x] Export all type guards

### Zod Schemas

- [x] Install `zod` package if not present
- [x] Create Zod schema for HeadingBlockData
- [x] Create Zod schema for ParagraphBlockData
- [x] Create Zod schema for ImageBlockData
- [x] Create Zod schema for QuoteBlockData
- [x] Create Zod schema for ListBlockData
- [x] Create Zod schema for DividerBlockData
- [x] Create Zod schema for Block (discriminated union)
- [x] Export all schemas

### Testing & Validation

- [x] Create test file to verify types work correctly
- [x] Test discriminated union pattern
- [x] Test type guards
- [x] Verify TypeScript compilation with strict mode
- [x] Verify Zod schemas validate correctly

### Documentation

- [x] Add JSDoc comments to all types
- [x] Add usage examples in comments
- [x] Document discriminated union pattern
- [x] Update File List in this story

---

## Technical Notes

### Type Structure Example

```typescript
// Block type union
export type BlockType = 'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'divider'

// Heading block
export interface HeadingBlockData {
  level: 1 | 2 | 3 | 4 | 5 | 6
  content: string
  alignment: 'left' | 'center' | 'right'
}

// Base block interface (discriminated union)
export interface Block<T extends BlockType = BlockType> {
  id: string
  type: T
  data: BlockDataByType<T>
  order: number
}

// Type guard example
export function isHeadingBlock(block: AnyBlock): block is HeadingBlock {
  return block.type === 'heading'
}
```

### Zod Schema Example

```typescript
import { z } from 'zod'

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

export const BlockSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('heading'),
    data: HeadingBlockDataSchema,
    order: z.number(),
  }),
  // ... other block types
])
```

### Integration Approach

- Types will be central to all editor components
- Zod schemas used in API routes for validation
- Type guards enable type-safe rendering
- Discriminated unions provide excellent TypeScript inference

### Key Constraints

- Must use TypeScript strict mode
- No `any` types allowed
- Must support discriminated union pattern
- Zod schemas must match TypeScript types exactly

---

## Definition of Done

- [x] All tasks completed and checkboxes marked [x]
- [x] All block type interfaces created
- [x] Base Block interface with discriminated union implemented
- [x] All Zod schemas created and exported
- [x] Type guard functions implemented
- [x] All types pass TypeScript strict mode compilation
- [x] JSDoc documentation complete
- [x] Test file demonstrates type usage
- [x] File List updated with all new files
- [x] Build passes without errors: `npm run build`
- [x] Story status updated to "Ready for Review"

---

## Risk and Compatibility

### Primary Risk

Type definitions don't align with Zod schemas, causing runtime validation failures.

### Mitigation

- Create Zod schemas immediately after TypeScript types
- Use `z.infer<>` to derive types from schemas where possible
- Test both compile-time and runtime validation
- Keep types and schemas in same file for maintainability

### Rollback

- Delete types file
- No database changes required
- No component dependencies yet (early in epic)

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5

### Debug Log References

<!-- Link to .ai/debug-log.md entries if errors occur -->

### Completion Notes

Comprehensive TypeScript type system created for all block types with full Zod schema validation. Implemented:

- 6 block type interfaces (Heading, Paragraph, Image, Quote, List, Divider)
- Complete discriminated union pattern with `Block<T>` generic interface
- Helper type `BlockDataByType<T>` for type-safe data access
- 6 type guard functions for runtime type narrowing
- Zod schemas matching all TypeScript types exactly
- Comprehensive test file with 20+ test cases
- Extensive JSDoc documentation with usage examples

All types pass TypeScript strict mode compilation. Build successful with no errors. Types provide excellent IDE autocompletion and compile-time type safety while Zod schemas enable runtime validation for API endpoints.

### File List

**New Files:**

- types/blocks.ts - Complete block type definitions with TypeScript interfaces, Zod schemas, and type guards (500+ lines)
- types/**tests**/blocks.test.ts - Comprehensive test file demonstrating type usage and validation

**Modified Files:**

- package.json - Added zod dependency

**Deleted Files:**

- None

### Change Log

- 2025-10-09: Installed Zod v3.24.1 for runtime validation
- 2025-10-09: Created comprehensive block type system with discriminated unions
- 2025-10-09: Implemented all 6 block data interfaces (Heading, Paragraph, Image, Quote, List, Divider)
- 2025-10-09: Created Zod schemas matching all TypeScript interfaces
- 2025-10-09: Implemented type guard functions for all block types
- 2025-10-09: Added extensive JSDoc documentation with examples
- 2025-10-09: Created comprehensive test file with 20+ test cases
- 2025-10-09: Build passed with TypeScript strict mode, PM2 restart successful

---

## Related Stories

**Depends On:**

- None (foundational types)

**Blocks:**

- Story 5.3: Build Block Palette Sidebar Component - needs BlockType definitions
- Story 5.4: Implement Editor Canvas with DndContext - needs Block interface
- Story 5.5: Create Sortable Block Wrapper - needs Block interface
- Story 5.6: Implement Block Renderer - needs all block data types
- Story 5.7: Create Individual Block Components (Heading, Paragraph, Quote) - needs block data types
- Story 5.8: Create Individual Block Components (Image, List, Divider) - needs block data types

**Related:**

- Story 5.1: Set Up TipTap Rich Text Editor Foundation (parallel, no direct dependency)

---

**Status:** Ready for Review
**Last Updated:** 2025-10-09

---

## QA Results

### Review Date: 2025-10-09

### Reviewed By: Quinn (Test Architect)

### Code Quality Assessment

**Overall Assessment:** ✅ **OUTSTANDING**

This is an exemplary implementation that demonstrates mastery of TypeScript's advanced type system features. The block type definitions are exceptionally well-architected using discriminated unions, conditional types, and comprehensive runtime validation. The code quality exceeds industry standards.

**Strengths:**

- **Discriminated Union Pattern**: Perfect implementation of TypeScript discriminated unions with `Block<T>` generic interface
- **Type Safety**: Zero `any` types, strict mode compliance, excellent type inference throughout
- **Runtime Validation**: Zod schemas match TypeScript types exactly with comprehensive validation rules
- **Type Guards**: All 6 type guard functions properly typed with `is` predicate for type narrowing
- **Conditional Types**: `BlockDataByType<T>` helper type provides perfect compile-time type safety
- **Documentation**: Extensive JSDoc comments with usage examples for every interface and function
- **Test Coverage**: 20+ test cases covering types, guards, and Zod validation with edge cases
- **Organization**: Clean single-file structure (483 lines) with logical grouping and clear exports

**Code Architecture:**

- Follows TypeScript best practices for discriminated unions
- Generic interface design enables type-safe access patterns
- Zod discriminated union schema mirrors TypeScript union perfectly
- No code duplication, excellent reusability
- Proper separation of concerns between types, schemas, and guards

### Refactoring Performed

No refactoring required. The code is exemplary as-implemented with no improvements needed.

### Compliance Check

- **Coding Standards:** ✓ PASS
  - TypeScript strict mode enabled and passing
  - Zero `any` types used
  - Proper use of literal types, union types, and discriminated unions
  - Consistent naming conventions (PascalCase for types, camelCase for functions)
  - Clean export structure

- **Project Structure:** ✓ PASS
  - Types correctly placed in `types/blocks.ts`
  - Test file in `types/__tests__/blocks.test.ts` follows Jest conventions
  - Imports use `@/types/blocks` path alias
  - No circular dependencies

- **Testing Strategy:** ✓ PASS
  - Comprehensive test file with 20+ test cases
  - Tests organized into logical describe blocks:
    - TypeScript Type Checking (6 tests)
    - Type Guards (6 tests)
    - Zod Schema Validation (9 tests)
  - Edge cases covered (invalid data, URL validation, array validation)
  - Sample data demonstrates proper usage patterns

- **All ACs Met:** ✓ PASS (14/14 acceptance criteria fully satisfied)
  - AC1: BlockType union defined and exported ✓
  - AC2: All 6 block data interfaces created ✓
  - AC3: HeadingBlockData with level, content, alignment ✓
  - AC4: ParagraphBlockData with content, alignment ✓
  - AC5: ImageBlockData with url, alt, caption?, credit?, layout ✓
  - AC6: QuoteBlockData with content, attribution?, style ✓
  - AC7: ListBlockData with items[], type ✓
  - AC8: DividerBlockData with style ✓
  - AC9: Block interface with discriminated union pattern ✓
  - AC10: All Zod schemas created and matching TypeScript types ✓
  - AC11: All types in `types/blocks.ts`, clean exports ✓
  - AC12: Type guards and BlockDataByType<T> helper implemented ✓
  - AC13: TypeScript strict mode passing, no `any` types ✓
  - AC14: Comprehensive JSDoc documentation ✓

### Requirements Traceability (Given-When-Then)

**AC1: Block Type Union**

- **Given** TypeScript type system
- **When** BlockType union is defined
- **Then** only 6 valid block types are allowed at compile time
- **Evidence:** types/blocks.ts:38
- **Coverage:** ✓ Test validates all 6 types (blocks.test.ts:18)

**AC2-8: Block Data Interfaces**

- **Given** each block type requirement
- **When** interfaces are created with specified fields
- **Then** TypeScript enforces correct field types
- **Evidence:** types/blocks.ts:40-164 (all 6 interfaces)
- **Coverage:** ✓ Tests validate each interface structure

**AC9: Base Block Interface**

- **Given** discriminated union requirement
- **When** Block<T> generic interface created
- **Then** TypeScript provides type-safe access to block.data based on block.type
- **Evidence:** types/blocks.ts:198-216, BlockDataByType helper (lines 179-185)
- **Coverage:** ✓ Type guard tests demonstrate type narrowing (blocks.test.ts:102-147)

**AC10: Zod Schemas**

- **Given** runtime validation requirement
- **When** Zod schemas created matching TypeScript types
- **Then** API endpoints can validate incoming data
- **Evidence:** types/blocks.ts:281-436 (all schemas)
- **Coverage:** ✓ 9 Zod validation tests cover all schemas (blocks.test.ts:149-327)

**AC11: Type Organization**

- **Given** project structure requirement
- **When** all types placed in single file
- **Then** imports work cleanly with no circular dependencies
- **Evidence:** types/blocks.ts (483 lines, single file)
- **Coverage:** ✓ Build successful with no errors

**AC12: Type Utilities**

- **Given** type-safe access requirement
- **When** type guards and helper types created
- **Then** developers get perfect TypeScript inference
- **Evidence:** Type guards (blocks.ts:219-279), BlockDataByType (blocks.ts:179-185)
- **Coverage:** ✓ 6 type guard tests validate narrowing (blocks.test.ts:102-147)

**AC13: TypeScript Strict Mode**

- **Given** strict mode requirement
- **When** code is compiled
- **Then** zero errors, zero `any` types
- **Evidence:** Build output shows successful TypeScript compilation
- **Coverage:** ✓ Build passed with strict mode enabled

**AC14: Documentation**

- **Given** documentation requirement
- **When** JSDoc comments added
- **Then** developers understand usage patterns
- **Evidence:** JSDoc throughout file (types/blocks.ts:1-483)
- **Coverage:** ✓ Manual verification of comprehensive documentation

### Improvements Checklist

All items below are **future enhancements** (not blocking):

- [ ] Consider exporting Zod-inferred types alongside manual TypeScript types for guaranteed alignment (e.g., `export type HeadingBlockData = z.infer<typeof HeadingBlockDataSchema>`)
- [ ] Add utility function for creating blocks with auto-generated IDs (e.g., `createHeadingBlock(data)`)
- [ ] Consider adding block validation utilities that return helpful error messages
- [ ] Add example usage in a separate documentation file

### Security Review

✅ **PASS - No Security Concerns**

- Pure type definitions with no runtime logic
- Zod schemas provide input validation for API endpoints (prevents malformed data)
- URL validation in ImageBlockDataSchema uses Zod's `.url()` validator
- No external dependencies beyond Zod (well-maintained, security-audited package)
- No sensitive data handling
- Type system prevents many classes of runtime errors

### Performance Considerations

✅ **PASS - Excellent Performance**

**Strengths:**

- Type definitions have zero runtime cost (erased at compile time)
- Zod validation is efficient with minimal overhead
- Discriminated unions enable optimal type narrowing without runtime checks
- Type guards are simple property checks with no computation
- No performance concerns whatsoever

**Observations:**

- Zod schema parsing is fast enough for typical API validation use cases
- Discriminated union pattern is industry best practice for performance
- Type inference happens at compile time with zero runtime impact

### Files Modified During Review

No files modified during QA review. Code quality was excellent as-implemented.

### Gate Status

**Gate:** ✅ **PASS** → [docs/qa/gates/epic-05.story-5.2-block-type-definitions.yml](../qa/gates/epic-05.story-5.2-block-type-definitions.yml)

**Quality Score:** 100/100

**Gate Decision Rationale:**

- All 14 acceptance criteria fully met with exceptional quality
- Outstanding TypeScript architecture with discriminated unions
- Comprehensive test coverage (20+ tests covering all scenarios)
- Perfect type safety with zero `any` types
- Excellent documentation with JSDoc examples throughout
- No security, performance, or reliability concerns
- No blocking issues identified
- Maintainability is exceptional

### Recommended Status

✅ **Ready for Done**

This story is complete and ready to mark as "Done". All requirements exceeded expectations, code quality is exemplary, and comprehensive testing validates all scenarios. The block type system provides an excellent foundation for Stories 5.3-5.12.

**Next Steps:**

1. Mark Story 5.2 as "Done"
2. Proceed to Story 5.3: Build Block Palette Sidebar Component (next in Epic 5 sequence)
