/**
 * Custom session check endpoint to avoid HTTP2 stream errors
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Cache control headers to reduce polling
const cacheHeaders = {
  'Cache-Control': 'private, max-age=10, must-revalidate',
}

export async function GET(req: NextRequest) {
  try {
    // Get session using server-side auth
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null
        },
        {
          status: 200,
          headers: cacheHeaders
        }
      )
    }

    // Return session data
    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
          role: (session.user as any)?.role || 'USER'
        },
        expires: session.expires
      },
      {
        status: 200,
        headers: cacheHeaders
      }
    )
  } catch (error) {
    // Don't expose internal errors
    console.error('Session check error:', error)

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: 'Session check failed'
      },
      {
        status: 200, // Return 200 even on error to prevent client retries
        headers: cacheHeaders
      }
    )
  }
}