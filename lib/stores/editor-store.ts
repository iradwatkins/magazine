/**
 * Editor Store - Zustand state management for the article editor
 *
 * Manages editor state including:
 * - Recently used blocks
 * - Selected block
 * - Editor UI state
 * - Article blocks array
 *
 * @module lib/stores/editor-store
 */

import { create } from 'zustand'
import { BlockType, AnyBlock } from '@/types/blocks'

interface EditorState {
  /**
   * Recently used block types (max 3)
   */
  recentBlocks: BlockType[]

  /**
   * Currently selected block ID
   */
  selectedBlockId: string | null

  /**
   * Mobile sidebar collapsed state
   */
  isSidebarCollapsed: boolean

  /**
   * Inspector panel collapsed state
   */
  isPanelCollapsed: boolean

  /**
   * Article blocks array
   */
  blocks: AnyBlock[]

  /**
   * History stack for undo (max 50 snapshots)
   */
  history: AnyBlock[][]

  /**
   * Current position in history
   */
  historyIndex: number

  /**
   * Add a block type to the recent blocks list
   * Moves it to the front if already present, maintains max 3 items
   */
  addRecentBlock: (type: BlockType) => void

  /**
   * Get the recent blocks list (max 3)
   */
  getRecentBlocks: () => BlockType[]

  /**
   * Set the currently selected block
   */
  setSelectedBlock: (blockId: string | null) => void

  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar: () => void

  /**
   * Set sidebar collapsed state
   */
  setSidebarCollapsed: (collapsed: boolean) => void

  /**
   * Toggle inspector panel collapsed state
   */
  togglePanel: () => void

  /**
   * Set inspector panel collapsed state
   */
  setPanelCollapsed: (collapsed: boolean) => void

  /**
   * Add a new block to the canvas
   * Automatically assigns order based on current blocks length
   */
  addBlock: (block: AnyBlock) => void

  /**
   * Update the blocks array (used for reordering)
   */
  updateBlockOrder: (blocks: AnyBlock[]) => void

  /**
   * Delete a block by ID
   * Automatically updates order for remaining blocks
   */
  deleteBlock: (id: string) => void

  /**
   * Update a block's data
   */
  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => void

  /**
   * Undo the last action
   */
  undo: () => void

  /**
   * Redo the last undone action
   */
  redo: () => void

  /**
   * Check if undo is available
   */
  canUndo: () => boolean

  /**
   * Check if redo is available
   */
  canRedo: () => boolean

  /**
   * Save current state to history
   */
  saveToHistory: () => void
}

/**
 * Editor store hook
 *
 * @example
 * ```tsx
 * const { recentBlocks, addRecentBlock } = useEditorStore()
 *
 * // Add a block to recent list
 * addRecentBlock('heading')
 * ```
 */
const MAX_HISTORY = 50

export const useEditorStore = create<EditorState>((set, get) => ({
  recentBlocks: [],
  selectedBlockId: null,
  isSidebarCollapsed: false,
  isPanelCollapsed: false,
  blocks: [],
  history: [],
  historyIndex: -1,

  addRecentBlock: (type: BlockType) =>
    set((state) => ({
      recentBlocks: [type, ...state.recentBlocks.filter((t) => t !== type)].slice(0, 3),
    })),

  getRecentBlocks: () => get().recentBlocks,

  setSelectedBlock: (blockId: string | null) => set({ selectedBlockId: blockId }),

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),

  togglePanel: () => set((state) => ({ isPanelCollapsed: !state.isPanelCollapsed })),

  setPanelCollapsed: (collapsed: boolean) => set({ isPanelCollapsed: collapsed }),

  addBlock: (block: AnyBlock) => {
    set((state) => ({
      blocks: [...state.blocks, block].map((b, i) => ({ ...b, order: i })),
    }))
    get().saveToHistory()
  },

  updateBlockOrder: (blocks: AnyBlock[]) => {
    set({ blocks })
    get().saveToHistory()
  },

  deleteBlock: (id: string) => {
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })),
    }))
    get().saveToHistory()
  },

  updateBlock: (id: string, data: Partial<AnyBlock['data']>) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)),
    }))
    get().saveToHistory()
  },

  saveToHistory: () =>
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(state.blocks)))

      // Limit history to MAX_HISTORY
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        }
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state

      const newIndex = state.historyIndex - 1
      return {
        blocks: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      }
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state

      const newIndex = state.historyIndex + 1
      return {
        blocks: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      }
    }),

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },
}))
