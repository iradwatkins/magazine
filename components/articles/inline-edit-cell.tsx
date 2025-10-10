/**
 * Inline Edit Cell Component
 *
 * Reusable component for inline editing cells in article table
 * Handles edit state, keyboard shortcuts, and validation
 *
 * @module components/articles/inline-edit-cell
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface InlineEditCellProps {
  value: string
  type: 'text' | 'select'
  options?: { value: string; label: string }[]
  onSave: (newValue: string) => Promise<void>
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  renderDisplay?: (value: string) => React.ReactNode
  placeholder?: string
  className?: string
  maxLength?: number
}

export function InlineEditCell({
  value,
  type,
  options = [],
  onSave,
  isEditing,
  onStartEdit,
  onCancelEdit,
  renderDisplay,
  placeholder = 'Enter value',
  className = '',
  maxLength,
}: InlineEditCellProps) {
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLButtonElement>(null)

  // Update edit value when value prop changes
  useEffect(() => {
    setEditValue(value)
  }, [value])

  // Focus input/select when editing starts
  useEffect(() => {
    if (isEditing) {
      if (type === 'text') {
        inputRef.current?.focus()
        inputRef.current?.select()
      } else {
        selectRef.current?.focus()
      }
    }
  }, [isEditing, type])

  const handleSave = async () => {
    // Don't save if value hasn't changed
    if (editValue === value) {
      onCancelEdit()
      return
    }

    // Validate text input
    if (type === 'text' && !editValue.trim()) {
      onCancelEdit()
      setEditValue(value) // Reset to original
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue)
      onCancelEdit()
    } catch (error) {
      // Error handling is done in parent, just revert value
      setEditValue(value)
      onCancelEdit()
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value) // Reset to original value
    onCancelEdit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleBlur = () => {
    // Save on blur (clicking outside)
    if (!isSaving) {
      handleSave()
    }
  }

  // Render editing state
  if (isEditing) {
    if (type === 'text') {
      return (
        <div className={`relative ${className}`}>
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={isSaving}
            placeholder={placeholder}
            maxLength={maxLength}
            className="h-8 text-sm"
          />
          {isSaving && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div className={`relative ${className}`}>
          <Select
            value={editValue}
            onValueChange={(newValue) => {
              setEditValue(newValue)
              // Auto-save when selection changes
              setTimeout(async () => {
                if (newValue !== value) {
                  setIsSaving(true)
                  try {
                    await onSave(newValue)
                    onCancelEdit()
                  } catch (error) {
                    setEditValue(value)
                    onCancelEdit()
                  } finally {
                    setIsSaving(false)
                  }
                }
              }, 0)
            }}
            disabled={isSaving}
          >
            <SelectTrigger ref={selectRef} className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isSaving && (
            <div className="absolute inset-y-0 right-8 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )
    }
  }

  // Render display state
  return (
    <div
      onClick={onStartEdit}
      className={`hover:bg-muted/50 cursor-pointer rounded px-2 py-1 transition-colors ${className}`}
      title="Click to edit"
    >
      {renderDisplay ? renderDisplay(value) : value}
    </div>
  )
}
