/**
 * Article Editor Component
 *
 * Main client component that integrates all editor components.
 * Manages state initialization, auto-save, and keyboard shortcuts.
 *
 * @example
 * ```tsx
 * <ArticleEditor article={article} />
 * ```
 *
 * @module components/editor/article-editor
 */

'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/lib/stores/editor-store'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useEditorKeyboardShortcuts } from '@/hooks/useEditorKeyboardShortcuts'
import { AnyBlock } from '@/types/blocks'
import EditorToolbar from './editor-toolbar'
import BlockPalette from './block-palette'
import EditorCanvas from './editor-canvas'
import InspectorPanel from './inspector-panel'

interface Article {
  id: string
  title: string
  blocks: string | null // JSON string
}

interface ArticleEditorProps {
  article: Article
}

export default function ArticleEditor({ article }: ArticleEditorProps) {
  const { blocks, addBlock, saveToHistory } = useEditorStore()

  // Initialize store with article blocks
  useEffect(() => {
    // Parse blocks from JSON
    const initialBlocks: AnyBlock[] = article.blocks ? JSON.parse(article.blocks) : []

    // Load blocks into store
    initialBlocks.forEach((block) => {
      addBlock(block)
    })

    // Save initial state to history
    saveToHistory()
  }, [article.blocks, addBlock, saveToHistory])

  // Auto-save setup
  const { saveStatus, lastSaved, triggerSave } = useAutoSave({
    data: blocks,
    onSave: async (blocks) => {
      const response = await fetch(`/api/articles/${article.id}/blocks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
      })

      if (!response.ok) {
        throw new Error('Failed to save blocks')
      }
    },
    delay: 30000, // 30 seconds
    idleTimeout: 3000, // 3 seconds
  })

  // Keyboard shortcuts
  useEditorKeyboardShortcuts({ onSave: triggerSave })

  return (
    <div className="flex h-screen flex-col">
      <EditorToolbar
        article={article}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        onSave={triggerSave}
      />

      <div className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <EditorCanvas />
        <InspectorPanel />
      </div>
    </div>
  )
}
