'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'

/**
 * TipTap Editor Props Interface
 *
 * @interface TipTapEditorProps
 * @property {JSONContent} [content] - Initial content in TipTap JSON format
 * @property {function} [onChange] - Callback fired when editor content changes
 * @property {string} [placeholder] - Placeholder text shown when editor is empty
 * @property {boolean} [editable] - Whether the editor is editable (default: true)
 * @property {string} [className] - Additional CSS classes for the editor container
 *
 * @example
 * ```tsx
 * <TipTapEditor
 *   content={initialContent}
 *   onChange={(json) => console.log(json)}
 *   placeholder="Start typing..."
 *   editable={true}
 * />
 * ```
 */
export interface TipTapEditorProps {
  content?: JSONContent
  onChange?: (content: JSONContent) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

/**
 * TipTap Rich Text Editor Component
 *
 * A flexible, extensible rich text editor built on TipTap v3.
 * Supports bold, italic, underline, headings (H1-H6), lists, and links.
 * Content is serialized to/from JSON format for database storage.
 *
 * Features:
 * - Rich text formatting (bold, italic, underline)
 * - Headings (H1-H6)
 * - Bullet and numbered lists
 * - Link insertion
 * - Placeholder text
 * - Character count tracking
 * - Keyboard shortcuts (Cmd/Ctrl+B, I, U, K)
 * - JSON serialization
 * - Accessible (keyboard navigation, ARIA labels)
 *
 * @component
 * @param {TipTapEditorProps} props - Component props
 * @returns {JSX.Element} The TipTap editor component
 */
export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  editable = true,
  className = '',
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.getJSON()
      // Only update if content actually changed to avoid infinite loops
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content)
      }
    }
  }, [content, editor])

  // Update editable state when prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
  }, [editable, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`tiptap-editor ${className}`}>
      <EditorContent
        editor={editor}
        className="rounded-lg border border-gray-300 p-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
      />
      {editor.storage.characterCount && (
        <div className="mt-2 text-sm text-gray-500">
          {editor.storage.characterCount.characters()} characters
        </div>
      )}
    </div>
  )
}

/**
 * Hook to access editor instance and helper methods
 *
 * @example
 * ```tsx
 * const { editor, getJSON, setContent } = useTipTapEditor({
 *   content: initialContent,
 *   onChange: handleChange
 * })
 * ```
 */
export function useTipTapEditor(props: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: props.placeholder || 'Start typing...',
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content: props.content,
    editable: props.editable !== false,
    onUpdate: ({ editor }) => {
      props.onChange?.(editor.getJSON())
    },
  })

  return {
    editor,
    getJSON: () => editor?.getJSON(),
    setContent: (content: JSONContent) => editor?.commands.setContent(content),
    getCharacterCount: () => editor?.storage.characterCount?.characters() || 0,
  }
}
