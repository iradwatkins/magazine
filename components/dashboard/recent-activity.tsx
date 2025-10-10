/**
 * Recent Activity Component
 *
 * Displays a feed of recent article activity (created, updated, published)
 *
 * @module components/dashboard/recent-activity
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Clock } from 'lucide-react'
import Link from 'next/link'

interface RecentActivityItem {
  id: string
  title: string
  status: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface RecentActivityProps {
  activities: RecentActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest article updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/editor/${articleId}`}
                className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={activity.author.image || undefined}
                    alt={activity.author.name || ''}
                  />
                  <AvatarFallback>
                    {activity.author.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={activity.status === 'PUBLISHED' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      by {activity.author.name || 'Unknown'}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Updated {formatDistanceToNow(new Date(activity.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
