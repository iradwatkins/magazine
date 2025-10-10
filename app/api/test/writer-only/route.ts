/**
 * Test endpoint - requires MAGAZINE_WRITER role or higher
 */

import { NextResponse } from 'next/server'
import { withAnyRole } from '@/lib/auth-middleware'

export const GET = withAnyRole(
  ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'],
  async (req, session) => {
    return NextResponse.json({
      message: 'You have writer access!',
      user: {
        id: session.user.id,
        email: session.user.email,
        roles: session.user.roles,
      },
    })
  }
)
