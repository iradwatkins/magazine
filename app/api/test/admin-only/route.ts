/**
 * Test endpoint - requires ADMIN role
 */

import { NextResponse } from 'next/server'
import { withRole } from '@/lib/auth-middleware'

export const GET = withRole('ADMIN', async (req, session) => {
  return NextResponse.json({
    message: 'You have admin access!',
    user: {
      id: session.user.id,
      email: session.user.email,
      roles: session.user.roles,
    },
  })
})

export const POST = withRole('ADMIN', async (req, session) => {
  const body = await req.json()

  return NextResponse.json({
    message: 'Admin action completed',
    data: body,
    performedBy: session.user.email,
  })
})
