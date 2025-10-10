/**
 * Test endpoint - requires authentication
 */

import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'

export const GET = withAuth(async (req, session) => {
  return NextResponse.json({
    message: 'You are authenticated!',
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      roles: session.user.roles,
    },
  })
})
