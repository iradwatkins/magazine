/**
 * Stat Card Component
 *
 * Displays a single statistic with icon, label, and value
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Articles"
 *   value={125}
 *   icon={<FileText className="h-4 w-4" />}
 *   trend={{ value: 12, isPositive: true }}
 * />
 * ```
 *
 * @module components/dashboard/stat-card
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  /**
   * Card title/label
   */
  title: string

  /**
   * Statistic value to display
   */
  value: number | string

  /**
   * Icon component
   */
  icon: React.ReactNode

  /**
   * Optional description
   */
  description?: string

  /**
   * Optional trend data
   */
  trend?: {
    value: number
    isPositive: boolean
  }

  /**
   * Optional className
   */
  className?: string
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={cn('mt-1 text-xs', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
            {trend.isPositive ? '+' : ''}
            {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
