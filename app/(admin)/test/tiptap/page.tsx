'use client'

import { useState } from 'react'
import { TipTapEditor } from '@/components/editor/tiptap-editor'
import { JSONContent } from '@tiptap/react'

/**
 * TipTap Editor Test Page
 *
 * This page tests the TipTap editor component with various scenarios:
 * - Empty editor
 * - Pre-filled content
 * - JSON serialization/deserialization
 * - Keyboard shortcuts
 * - Formatting capabilities
 */
export default function TipTapTestPage() {
  const [content, setContent] = useState<JSONContent | undefined>()
  const [jsonOutput, setJsonOutput] = useState<string>('')
  const [jsonInput, setJsonInput] = useState<string>('')

  // Sample initial content for testing
  const sampleContent: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Welcome to TipTap Editor' }],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This is a ' },
          { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
          { type: 'text', text: ' and ' },
          { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
          { type: 'text', text: ' and ' },
          { type: 'text', marks: [{ type: 'underline' }], text: 'underlined' },
          { type: 'text', text: ' text.' },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Features' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Rich text formatting' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Keyboard shortcuts' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'JSON serialization' }],
              },
            ],
          },
        ],
      },
    ],
  }

  const handleChange = (newContent: JSONContent) => {
    setContent(newContent)
    setJsonOutput(JSON.stringify(newContent, null, 2))
  }

  const loadSampleContent = () => {
    setContent(sampleContent)
    setJsonOutput(JSON.stringify(sampleContent, null, 2))
  }

  const clearContent = () => {
    setContent(undefined)
    setJsonOutput('')
  }

  const loadFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setContent(parsed)
      setJsonOutput(jsonInput)
    } catch (error) {
      alert('Invalid JSON: ' + (error as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-8 text-3xl font-bold">TipTap Editor Test Page</h1>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Test Controls</h2>
        <div className="flex gap-4">
          <button
            onClick={loadSampleContent}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Load Sample Content
          </button>
          <button
            onClick={clearContent}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Clear Editor
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Editor</h2>
        <div className="mb-4 rounded-md bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">Keyboard Shortcuts:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <kbd className="rounded bg-blue-100 px-2 py-1">Cmd/Ctrl+B</kbd> - Bold
            </li>
            <li>
              <kbd className="rounded bg-blue-100 px-2 py-1">Cmd/Ctrl+I</kbd> - Italic
            </li>
            <li>
              <kbd className="rounded bg-blue-100 px-2 py-1">Cmd/Ctrl+U</kbd> - Underline
            </li>
            <li>
              <kbd className="rounded bg-blue-100 px-2 py-1">Cmd/Ctrl+K</kbd> - Link
            </li>
            <li>
              <kbd className="rounded bg-blue-100 px-2 py-1">#</kbd> + Space - Heading
            </li>
          </ul>
        </div>
        <TipTapEditor
          content={content}
          onChange={handleChange}
          placeholder="Start typing to test the editor... Try using keyboard shortcuts!"
          className="mb-4"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">JSON Output (Live)</h2>
          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
            {jsonOutput || 'No content yet...'}
          </pre>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Load from JSON</h2>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON content here..."
            className="mb-4 h-64 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={loadFromJson}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Load JSON into Editor
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-yellow-800">Test Checklist</h2>
        <ul className="space-y-2 text-yellow-900">
          <li>✓ Editor renders without errors</li>
          <li>✓ Placeholder text shows when empty</li>
          <li>✓ Text can be typed and edited</li>
          <li>✓ Bold (Cmd/Ctrl+B) works</li>
          <li>✓ Italic (Cmd/Ctrl+I) works</li>
          <li>✓ Underline (Cmd/Ctrl+U) works</li>
          <li>✓ Headings work (# + space)</li>
          <li>✓ Bullet lists work (- + space)</li>
          <li>✓ Numbered lists work (1. + space)</li>
          <li>✓ JSON output updates in real-time</li>
          <li>✓ JSON can be loaded back into editor</li>
          <li>✓ Character count displays</li>
          <li>✓ Editor is keyboard accessible</li>
        </ul>
      </div>
    </div>
  )
}
