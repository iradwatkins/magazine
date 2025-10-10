/**
 * Comment Moderation Queue Page (Story 7.4)
 * Admin/Editor-only page for reviewing and moderating flagged comments
 */

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ModerationQueue } from '@/components/admin/moderation-queue'

export const metadata = {
  title: 'Comment Moderation | SteppersLife Magazine',
  description: 'Review and moderate flagged comments',
}

export default async function ModerationQueuePage() {
  const session = await auth()

  // Permission check: Only MAGAZINE_EDITOR and ADMIN can access
  const userRole = (session?.user as any)?.role || 'USER'
  if (!['MAGAZINE_EDITOR', 'ADMIN'].includes(userRole)) {
    redirect('/dashboard')
  }

  // Fetch flagged comments with all necessary relations
  const flaggedComments = await prisma.comment.findMany({
    where: {
      isFlagged: true,
      deletedAt: null, // Only show non-deleted comments
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      flags: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      flagCount: 'desc', // Most flagged first
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Comment Moderation Queue</h1>
        <p className="mt-2 text-muted-foreground">
          Review and moderate flagged comments from the community
        </p>
      </div>

      {flaggedComments.length === 0 ? (
        <div className="rounded-lg border border-muted bg-card p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-muted-foreground/50"
          >
            <path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          <h3 className="mb-2 text-xl font-semibold">No Flagged Comments</h3>
          <p className="text-sm text-muted-foreground">
            All comments are clear. Check back later for moderation requests.
          </p>
        </div>
      ) : (
        <ModerationQueue comments={flaggedComments} />
      )}
    </div>
  )
}
