import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/auth/error', '/about', '/contact']

  if (
    publicRoutes.some((route) => path === route) ||
    path.startsWith('/api/auth') ||
    path.startsWith('/restaurants') ||
    path.startsWith('/events') ||
    path.startsWith('/store') ||
    path.startsWith('/classes') ||
    path.startsWith('/services') ||
    path.startsWith('/magazine')
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
