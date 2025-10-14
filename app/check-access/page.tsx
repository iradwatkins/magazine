import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CheckAccessPage() {
  const session = await auth()

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Not Signed In</h1>
          <p>Please sign in to check your access</p>
          <Link href="/sign-in" className="text-blue-500 underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Get fresh user data from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    }
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">User Not Found</h1>
          <p>Your user account could not be found in the database</p>
        </div>
      </div>
    )
  }

  const hasAccess = ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(user.role)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Access Check Page</h1>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Your Account Details</h2>
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt className="font-medium">Email:</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Name:</dt>
              <dd>{user.name || 'Not set'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Role:</dt>
              <dd className={`font-bold ${hasAccess ? 'text-green-600' : 'text-red-600'}`}>
                {user.role}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">User ID:</dt>
              <dd className="text-xs font-mono">{user.id}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Access Status</h2>
          {hasAccess ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">You have admin access!</span>
              </div>
              <p>Your role <strong>{user.role}</strong> grants you access to:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Dashboard - Article statistics and overview</li>
                <li>Articles Management - Create, edit, and manage articles</li>
                <li>Media Library - Upload and manage images</li>
                <li>Article Editor - Rich text editing tools</li>
                {user.role === 'MAGAZINE_EDITOR' && (
                  <>
                    <li>Comment Moderation - Manage user comments</li>
                    <li>Article Approval - Approve/reject submissions</li>
                  </>
                )}
              </ul>

              <div className="pt-4 space-y-2">
                <p className="font-semibold">Quick Links:</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/articles"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Manage Articles
                  </Link>
                  <Link
                    href="/media"
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Media Library
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">No admin access</span>
              </div>
              <p>Your current role <strong>{user.role}</strong> does not have access to admin features.</p>
              <p className="text-sm text-muted-foreground">
                Admin access requires one of these roles: MAGAZINE_WRITER, MAGAZINE_EDITOR, or ADMIN
              </p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-4">
          <p className="text-sm">
            <strong>Note:</strong> If you recently had your role updated, you may need to{' '}
            <Link href="/api/auth/signout" className="text-blue-500 underline">
              sign out
            </Link>{' '}
            and sign back in for changes to take effect in your session.
          </p>
        </div>
      </div>
    </div>
  )
}