'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TrackingEvent {
  id: string
  timestamp: string
  type: string
  level: string
  category: string
  message: string
  details?: any
  url?: string
  method?: string
  status?: number
  userId?: string
  sessionId?: string
}

export default function DebugDashboard() {
  const [events, setEvents] = useState<TrackingEvent[]>([])
  const [errors, setErrors] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/track?limit=100')
      const data = await response.json()

      if (data.events) {
        setEvents(data.events.reverse())
        // Filter errors
        setErrors(data.events.filter((e: TrackingEvent) => e.level === 'error'))
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch errors specifically
  const fetchErrors = async () => {
    try {
      const response = await fetch('/api/debug/track?type=errors&limit=50')
      const data = await response.json()
      if (data.events) {
        setErrors(data.events)
      }
    } catch (error) {
      console.error('Failed to fetch errors:', error)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchEvents()
    fetchErrors()
  }, [])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchEvents()
      fetchErrors()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Export events as JSON
  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `debug-log-${new Date().toISOString()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Get color for level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500'
      case 'warning': return 'text-yellow-500'
      case 'success': return 'text-green-500'
      default: return 'text-blue-500'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Debug Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor user actions, errors, and API calls in real-time
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={fetchEvents}
                disabled={loading}
                size="sm"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
              >
                Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              <Button onClick={exportEvents} variant="outline" size="sm">
                Export JSON
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {events.length} events | {errors.length} errors
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Summary */}
      {errors.length > 0 && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Recent Errors</CardTitle>
            <CardDescription>{errors.length} errors detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {errors.slice(0, 5).map((error) => (
                <div key={error.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-red-700">{error.message}</p>
                      {error.url && (
                        <p className="text-xs text-red-600 mt-1">{error.url}</p>
                      )}
                    </div>
                    <span className="text-xs text-red-500">{formatTime(error.timestamp)}</span>
                  </div>
                  {error.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer">View details</summary>
                      <pre className="mt-1 text-xs bg-white p-2 rounded overflow-x-auto">
                        {typeof error.details === 'string' ? error.details : JSON.stringify(error.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Event Timeline</CardTitle>
          <CardDescription>All tracked events in chronological order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${getLevelColor(event.level)}`}>
                      {event.level.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.type} / {event.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{event.message}</p>
                  {event.url && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.method} {event.url} {event.status && `- ${event.status}`}
                    </p>
                  )}
                  {event.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View details
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}