/**
 * Top Contributors Widget
 *
 * Displays top authors by article count
 *
 * @module components/dashboard/top-contributors
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, FileText } from 'lucide-react'

interface TopContributor {
  id: string
  name: string | null
  image: string | null
  _count: {
    articles: number
  }
}

interface TopContributorsProps {
  contributors: TopContributor[]
}

export function TopContributors({ contributors }: TopContributorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top Contributors
        </CardTitle>
        <CardDescription>Most active writers on your team</CardDescription>
      </CardHeader>
      <CardContent>
        {contributors.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Users className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No contributors yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contributor.image || undefined} alt={contributor.name || ''} />
                  <AvatarFallback>
                    {contributor.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {contributor.name || 'Unknown'}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {contributor._count.articles}{' '}
                    {contributor._count.articles === 1 ? 'article' : 'articles'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
