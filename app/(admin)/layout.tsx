/**
 * Admin Layout
 *
 * Layout for admin/protected pages with navigation sidebar and authentication checks
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Image,
  MessageSquare,
  Users,
  PenLine,
  Home,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  name: string
  href: string
  icon: any
  requiresEditor?: boolean
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Article', href: '/editor/new', icon: PenLine },
  { name: 'Articles', href: '/articles', icon: FileText },
  { name: 'Media', href: '/media', icon: Image },
  { name: 'Comments', href: '/comments/moderate', icon: MessageSquare, requiresEditor: true },
  { name: 'Writers', href: '/writers', icon: Users, requiresEditor: true },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/dashboard')
  }

  // Check if user has writer permissions
  const canWrite = await hasPermission(session.user.id, 'MAGAZINE_WRITER')
  const isEditor = await hasPermission(session.user.id, 'MAGAZINE_EDITOR')

  if (!canWrite) {
    // User is authenticated but doesn't have writer permissions
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="rounded-lg border bg-card p-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold">Writer Access Required</h1>
            <p className="text-muted-foreground">
              You need writer permissions to access the magazine dashboard and create articles.
            </p>
            <p className="text-sm text-muted-foreground">
              Signed in as: <strong>{session.user.email}</strong>
            </p>
            <div className="pt-4 space-y-2">
              <p className="text-sm font-medium">To get writer access:</p>
              <ol className="text-sm text-left text-muted-foreground list-decimal list-inside space-y-1">
                <li>Contact the magazine administrator</li>
                <li>Request MAGAZINE_WRITER role</li>
                <li>Sign in again after role is granted</li>
              </ol>
            </div>
            <div className="flex gap-2 pt-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/sign-out">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold">
                <span className="text-gold">Steppers</span>
                <span className="text-foreground">Life</span>
              </div>
            </Link>
            <span className="text-sm text-muted-foreground">Magazine Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">{session.user.name || session.user.email}</p>
              <p className="text-xs text-muted-foreground">
                {isEditor ? 'Editor' : 'Writer'}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-out">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-background min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              // Hide editor-only items from writers
              if (item.requiresEditor && !isEditor) {
                return null
              }

              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
