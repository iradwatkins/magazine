/**
 * Editor Toolbar Component
 *
 * Top toolbar for article editor with title input, undo/redo, save status, and action buttons.
 *
 * Features:
 * - Article title editing (auto-save on blur)
 * - Undo/Redo buttons with disabled states
 * - Save status indicator
 * - Action buttons (Preview, Publish, Help)
 * - Keyboard shortcuts modal
 *
 * @example
 * ```tsx
 * <EditorToolbar
 *   article={article}
 *   saveStatus="saved"
 *   lastSaved={new Date()}
 *   onSave={triggerSave}
 * />
 * ```
 *
 * @module components/editor/editor-toolbar
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SaveStatusIndicator from './save-status-indicator'
import KeyboardShortcutsModal from './keyboard-shortcuts-modal'
import { ArticleSettingsForm } from './article-settings-form'
import { SaveStatus } from '@/hooks/useAutoSave'
import { useEditorStore } from '@/lib/stores/editor-store'
import { Undo, Redo, Eye, Upload, HelpCircle, Settings } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  category: string
  tags: string[]
  featuredImage?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  status: string
  isFeatured: boolean
}

interface EditorToolbarProps {
  /**
   * Article being edited
   */
  article: Article

  /**
   * Current save status
   */
  saveStatus: SaveStatus

  /**
   * Last saved timestamp
   */
  lastSaved: Date | null

  /**
   * Manual save trigger callback
   */
  onSave: () => void
}

export default function EditorToolbar({
  article,
  saveStatus,
  lastSaved,
  onSave,
}: EditorToolbarProps) {
  const { undo, redo, canUndo, canRedo } = useEditorStore()
  const [title, setTitle] = useState(article.title)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleTitleUpdate = async () => {
    if (title === article.title) return

    try {
      await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
    } catch (error) {
      console.error('Failed to update title:', error)
    }
  }

  return (
    <>
      <header className="border-b bg-background px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Article Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            className="flex-1 border-none text-2xl font-bold focus-visible:ring-0"
            placeholder="Untitled Article"
          />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-l pl-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo()}
              title="Undo (Cmd/Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo()}
              title="Redo (Cmd/Ctrl+Shift+Z)"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {/* Save Status */}
          <div className="border-l pl-4">
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} onRetry={onSave} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 border-l pl-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              title="Article Settings"
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/preview/${article.id}`, '_blank')}
              title="Preview Article"
            >
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button variant="default" size="sm" disabled title="Publish (Coming Soon)">
              <Upload className="mr-2 h-4 w-4" /> Publish
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(true)}
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <KeyboardShortcutsModal open={showHelp} onOpenChange={setShowHelp} />

      {/* Article Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Settings</DialogTitle>
            <DialogDescription>
              Manage article metadata, categorization, SEO settings, and more
            </DialogDescription>
          </DialogHeader>
          <ArticleSettingsForm article={article} onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
