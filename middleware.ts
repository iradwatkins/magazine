/**
 * SIMPLIFIED MIDDLEWARE
 *
 * Keep it simple:
 * - Public routes: accessible to everyone
 * - Protected routes: require authentication
 * - No complex role checking here (handle in pages)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public routes (accessible without authentication)
  const publicPaths = [
    '/',
    '/sign-in',
    '/auth/error',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/advertise',
    '/debug', // Made public for testing
    '/test-login', // Test page for debugging login
  ]

  // Check if it's a public path
  const isPublicPath = publicPaths.some(p => path === p)

  // Public article viewing paths (starts with these)
  const isPublicArticlePath =
    path.startsWith('/articles/') || // Individual articles
    path.startsWith('/category/') ||
    path.startsWith('/tag/') ||
    path.startsWith('/author/')

  // API routes that are public
  const isPublicAPI =
    path.startsWith('/api/auth') ||
    path.startsWith('/api/public') ||
    path.startsWith('/api/health') ||
    path.startsWith('/api/debug') // Made public for testing

  // Static files and Next.js internals
  const isStaticOrInternal =
    path.startsWith('/_next') ||
    path.includes('.')

  // If it's public, allow access
  if (isPublicPath || isPublicArticlePath || isPublicAPI || isStaticOrInternal) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    })

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'production') {
      console.log('[Middleware] Path:', path, 'Token exists:', !!token)
    }

    // No token = redirect to sign-in
    if (!token) {
      // Don't redirect if already on callback route
      if (path.startsWith('/api/auth/callback')) {
        return NextResponse.next()
      }

      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(signInUrl)
    }

    // User is authenticated, allow access
    return NextResponse.next()
  } catch (error) {
    console.error('[Middleware] Error checking token:', error)
    // On error, allow the request (fail open for auth routes)
    if (path.startsWith('/api/auth')) {
      return NextResponse.next()
    }
    // For other routes, redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public/).*)',
  ],
}