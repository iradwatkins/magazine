'use client'

import { useState, useEffect } from 'react'
import { FileText, Eye, PenLine, Users, CheckCircle, Clock, Grid3x3, List, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Simple stat card component
function StatCard({ title, value, description, icon: Icon }: {
  title: string
  value: string | number
  description: string
  icon: any
}) {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </div>
    </div>
  )
}

// Article card component for grid view
function ArticleCard({ article, viewMode }: { article: any; viewMode: 'grid' | 'list' }) {
  const statusColors = {
    PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="font-semibold text-lg line-clamp-1">{article.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusColors[article.status]}`}>
              {article.status}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/editor/${article.id}`}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border rounded-md hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          Edit
        </Link>
      </div>
    )
  }

  // Grid view
  return (
    <div className="group relative rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {/* Status badge */}
        <span className={`absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusColors[article.status]}`}>
          {article.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2">{article.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Link
          href={`/editor/${article.id}`}
          className="mt-3 block w-full text-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border rounded-md hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          Edit Article
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalComments: 0
  })
  const [recentArticles, setRecentArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch dashboard data from API
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats || {
            totalArticles: 0,
            publishedArticles: 0,
            draftArticles: 0,
            totalViews: 0,
            totalComments: 0
          })
          setRecentArticles(data.recentArticles || [])
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/editor/new"
            className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            <PenLine className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Articles"
          value={stats.totalArticles}
          description="All articles in the system"
          icon={FileText}
        />
        <StatCard
          title="Published"
          value={stats.publishedArticles}
          description="Live articles"
          icon={CheckCircle}
        />
        <StatCard
          title="Drafts"
          value={stats.draftArticles}
          description="Work in progress"
          icon={Clock}
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          description="All time views"
          icon={Eye}
        />
      </div>

      {/* Recent Articles Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Articles</h3>
          {/* View mode toggle */}
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
              title="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Articles Display */}
        {recentArticles.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} viewMode="list" />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-muted-foreground mb-4">No articles yet.</p>
            <Link
              href="/editor/new"
              className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Create Your First Article
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/articles"
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div>
            <p className="font-medium">Manage Articles</p>
            <p className="text-sm text-muted-foreground">View and edit all articles</p>
          </div>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link
          href="/media"
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div>
            <p className="font-medium">Media Library</p>
            <p className="text-sm text-muted-foreground">Manage images and files</p>
          </div>
          <Eye className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link
          href="/comments/moderate"
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div>
            <p className="font-medium">Comments</p>
            <p className="text-sm text-muted-foreground">{stats.totalComments} total comments</p>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}