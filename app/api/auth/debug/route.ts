import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    let userDetails = null
    if (session?.user?.email) {
      userDetails = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: {
              provider: true,
              type: true,
              providerAccountId: true,
            }
          },
          sessions: {
            where: {
              expires: { gte: new Date() }
            },
            select: {
              id: true,
              expires: true,
              sessionToken: true,
            },
            take: 5
          }
        }
      })
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      database: userDetails,
      permissions: {
        hasSession: !!session,
        isAuthenticated: !!(session?.user?.id),
        userRole: userDetails?.role || 'none',
        canAccessDashboard: userDetails?.role && ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(userDetails.role),
        canAccessArticles: userDetails?.role && ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(userDetails.role),
      },
      debug: {
        sessionCookie: session ? 'present' : 'missing',
        userIdInSession: session?.user?.id || 'none',
        emailInSession: session?.user?.email || 'none',
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}