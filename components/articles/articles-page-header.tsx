/**
 * Articles Page Header Component
 *
 * Header section for articles page with title, description, and Create Article button
 * Manages the create article modal state
 *
 * @module components/articles/articles-page-header
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PenLine } from 'lucide-react'
import { CreateArticleModal } from './create-article-modal'

export function ArticlesPageHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
          <p className="text-muted-foreground">Manage and organize all your articles</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PenLine className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <CreateArticleModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  )
}
