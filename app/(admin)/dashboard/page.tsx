import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import DashboardClient from './client-page'

export default async function DashboardPage() {
  // Check authentication
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  // Check permissions - at minimum user needs to be a writer
  const canWrite = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
  if (!canWrite) {
    // User is authenticated but doesn't have writer permissions
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need writer permissions to access the dashboard.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Please contact an administrator to request writer access.
          </p>
        </div>
      </div>
    )
  }

  // Render the client component with authentication confirmed
  return <DashboardClient />
}