/**
 * Template Selector Component
 *
 * Displays available article templates as cards for selection
 *
 * @module components/articles/template-selector
 */

'use client'

import { getAllTemplates, ArticleTemplate } from '@/lib/article-templates'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface TemplateSelectorProps {
  selectedTemplateId?: string
  onSelect: (templateId: string) => void
}

export function TemplateSelector({ selectedTemplateId, onSelect }: TemplateSelectorProps) {
  const templates = getAllTemplates()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={selectedTemplateId === template.id}
          onClick={() => onSelect(template.id)}
        />
      ))}
    </div>
  )
}

interface TemplateCardProps {
  template: ArticleTemplate
  isSelected: boolean
  onClick: () => void
}

function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  return (
    <Card
      className={`relative cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'hover:border-gray-400'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}

        {/* Template Icon */}
        <div className="text-4xl mb-3">{template.icon}</div>

        {/* Template Name */}
        <h3 className="text-lg font-semibold mb-2">{template.name}</h3>

        {/* Template Description */}
        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

        {/* Template Category Badge */}
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          {template.category}
        </div>

        {/* Block Count */}
        <div className="mt-3 text-xs text-muted-foreground">
          {template.blocks.length} content blocks
        </div>
      </div>
    </Card>
  )
}
