/**
 * Dashboard Page
 *
 * Admin/Editor dashboard showing key metrics, recent activity,
 * popular articles, and top contributors.
 *
 * @module app/(admin)/dashboard
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { FileText, Eye, PenLine, Users } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { PopularArticles } from '@/components/dashboard/popular-articles'
import { TopContributors } from '@/components/dashboard/top-contributors'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getDashboardData() {
  const { prisma } = await import('@/lib/db')

  // Get article counts by status
  const [totalArticles, publishedArticles, draftArticles] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
  ])

  // Get total views
  const viewsResult = await prisma.article.aggregate({
    _sum: { viewCount: true },
  })
  const totalViews = viewsResult._sum.viewCount || 0

  // Get recent activity
  const recentActivity = await prisma.article.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  // Get popular articles - top 5 by view count (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const popularArticles = await prisma.article.findMany({
    take: 5,
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: { viewCount: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      viewCount: true,
      featuredImageUrl: true,
      category: true,
    },
  })

  // Get top contributors
  const topContributors = await prisma.user.findMany({
    take: 5,
    where: {
      articles: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
  })

  return {
    stats: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
    },
    recentActivity,
    popularArticles,
    topContributors,
  }
}

// Force dynamic rendering to ensure auth is checked at request time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  // Check if user has author+ role (MAGAZINE_WRITER or higher)
  try {
    const { hasPermission } = await import('@/lib/rbac')
    const hasAccess = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
    if (!hasAccess) {
      console.error('User does not have MAGAZINE_WRITER permission:', session.user.email)
      redirect('/')
    }
  } catch (error) {
    console.error('Permission check error:', error)
    redirect('/')
  }

  const data = await getDashboardData()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || 'there'}! Here's what's happening with your content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/articles/new">
              <PenLine className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/media">View Media</Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Articles"
          value={data.stats.totalArticles}
          icon={<FileText className="h-4 w-4" />}
          description="All articles in the system"
        />
        <StatCard
          title="Published"
          value={data.stats.publishedArticles}
          icon={<Eye className="h-4 w-4" />}
          description="Live on the site"
        />
        <StatCard
          title="Drafts"
          value={data.stats.draftArticles}
          icon={<PenLine className="h-4 w-4" />}
          description="In progress"
        />
        <StatCard
          title="Total Views"
          value={data.stats.totalViews}
          icon={<Users className="h-4 w-4" />}
          description="Across all articles"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full lg:col-span-4">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div className="col-span-full space-y-4 md:col-span-1 lg:col-span-3">
          <PopularArticles articles={data.popularArticles} />
          <TopContributors contributors={data.topContributors} />
        </div>
      </div>
    </div>
  )
}
