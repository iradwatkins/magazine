/**
 * Grant Writer Role API
 * Temporary endpoint to grant MAGAZINE_WRITER role to authenticated user
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Update user role to MAGAZINE_WRITER
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'MAGAZINE_WRITER' },
    })

    return NextResponse.json({
      message: 'Role granted successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error('Error granting role:', error)
    return NextResponse.json({ error: 'Failed to grant role' }, { status: 500 })
  }
}
