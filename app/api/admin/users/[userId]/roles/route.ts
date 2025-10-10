/**
 * User Role Management API
 * Admin-only endpoint for managing user roles
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

/**
 * GET /api/admin/users/:userId/roles
 * Get user roles
 */
export const GET = withRole('ADMIN', async (req, { params }) => {
  const userId = (await params).userId

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      roles: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
})

/**
 * PUT /api/admin/users/:userId/roles
 * Update user roles
 */
export const PUT = withRole('ADMIN', async (req, { params }) => {
  const userId = (await params).userId
  const body = await req.json()
  const { roles } = body

  // Validate roles
  if (!Array.isArray(roles)) {
    return NextResponse.json({ error: 'Roles must be an array' }, { status: 400 })
  }

  const validRoles: UserRole[] = ['USER', 'MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN']
  const invalidRoles = roles.filter((role: string) => !validRoles.includes(role as UserRole))

  if (invalidRoles.length > 0) {
    return NextResponse.json(
      { error: `Invalid roles: ${invalidRoles.join(', ')}` },
      { status: 400 }
    )
  }

  // Ensure USER role is always present
  const updatedRoles = Array.from(new Set([...roles, 'USER'])) as UserRole[]

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { roles: updatedRoles },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
      },
    })

    return NextResponse.json({
      message: 'User roles updated successfully',
      user,
    })
  } catch (_error) {
    console.error('Error updating user roles:', error)
    return NextResponse.json({ error: 'Failed to update user roles' }, { status: 500 })
  }
})

/**
 * POST /api/admin/users/:userId/roles/add
 * Add a role to user
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  return withRole('ADMIN', async (req, session) => {
    const userId = (await params).userId
    const body = await req.json()
    const { role } = body

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const validRoles: UserRole[] = ['USER', 'MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN']
    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { roles: true },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Add role if not already present
      const updatedRoles = Array.from(new Set([...user.roles, role])) as UserRole[]

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { roles: updatedRoles },
        select: {
          id: true,
          email: true,
          name: true,
          roles: true,
        },
      })

      return NextResponse.json({
        message: `Role ${role} added successfully`,
        user: updatedUser,
      })
    } catch (_error) {
      console.error('Error adding role:', error)
      return NextResponse.json({ error: 'Failed to add role' }, { status: 500 })
    }
  })(req)
}
