/**
 * Authentication & Authorization Middleware
 * Provides utilities for protecting API routes and pages
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'
import { UserRole } from '@prisma/client'
import { hasRole, hasAnyRole, hasMinimumRole } from './rbac'

/**
 * Get the current session from the request
 */
export async function getSession() {
  return await auth()
}

/**
 * Require authentication - throws if no user is logged in
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session?.user) {
    throw new AuthError('You must be logged in to access this resource')
  }

  return session
}

/**
 * Require specific role - throws if user doesn't have the role
 */
export async function requireRoleAuth(requiredRole: UserRole) {
  const session = await requireAuth()
  const userRoles = (session.user.roles || ['USER']) as UserRole[]

  if (!hasRole(userRoles, requiredRole)) {
    throw new AuthorizationError(`This action requires the ${requiredRole} role`)
  }

  return session
}

/**
 * Require any of the specified roles - throws if user doesn't have any role
 */
export async function requireAnyRoleAuth(requiredRoles: UserRole[]) {
  const session = await requireAuth()
  const userRoles = (session.user.roles || ['USER']) as UserRole[]

  if (!hasAnyRole(userRoles, requiredRoles)) {
    throw new AuthorizationError(`This action requires one of: ${requiredRoles.join(', ')}`)
  }

  return session
}

/**
 * Require minimum role level - throws if user doesn't meet minimum role
 */
export async function requireMinimumRoleAuth(minimumRole: UserRole) {
  const session = await requireAuth()
  const userRoles = (session.user.roles || ['USER']) as UserRole[]

  if (!hasMinimumRole(userRoles, minimumRole)) {
    throw new AuthorizationError(`This action requires at least ${minimumRole} role`)
  }

  return session
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return await requireRoleAuth('ADMIN')
}

/**
 * Require writer role (MAGAZINE_WRITER or higher)
 */
export async function requireWriter() {
  return await requireAnyRoleAuth(['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'])
}

/**
 * Require editor role (MAGAZINE_EDITOR or ADMIN)
 */
export async function requireEditor() {
  return await requireAnyRoleAuth(['MAGAZINE_EDITOR', 'ADMIN'])
}

/**
 * Custom authentication error
 */
export class AuthError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Custom authorization error
 */
export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

/**
 * Handle authentication/authorization errors in API routes
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }

  // Generic error
  console.error('Unexpected error:', error)
  return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
}

/**
 * Wrapper for API route handlers with authentication
 *
 * Usage:
 * export const GET = withAuth(async (req, session) => {
 *   // Handler code with authenticated session
 * })
 */
export function withAuth(
  handler: (req: NextRequest, session: Awaited<ReturnType<typeof auth>>) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await requireAuth()
      return await handler(req, session)
    } catch (error) {
      return handleAuthError(error)
    }
  }
}

/**
 * Wrapper for API route handlers with role check
 *
 * Usage:
 * export const POST = withRole('ADMIN', async (req, session) => {
 *   // Handler code with admin access
 * })
 */
export function withRole(
  requiredRole: UserRole,
  handler: (req: NextRequest, session: Awaited<ReturnType<typeof auth>>) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await requireRoleAuth(requiredRole)
      return await handler(req, session)
    } catch (error) {
      return handleAuthError(error)
    }
  }
}

/**
 * Wrapper for API route handlers with any role check
 *
 * Usage:
 * export const POST = withAnyRole(['MAGAZINE_EDITOR', 'ADMIN'], async (req, session) => {
 *   // Handler code
 * })
 */
export function withAnyRole(
  requiredRoles: UserRole[],
  handler: (req: NextRequest, session: Awaited<ReturnType<typeof auth>>) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await requireAnyRoleAuth(requiredRoles)
      return await handler(req, session)
    } catch (error) {
      return handleAuthError(error)
    }
  }
}

/**
 * Wrapper for API route handlers with minimum role check
 *
 * Usage:
 * export const GET = withMinimumRole('MAGAZINE_WRITER', async (req, session) => {
 *   // Handler code
 * })
 */
export function withMinimumRole(
  minimumRole: UserRole,
  handler: (req: NextRequest, session: Awaited<ReturnType<typeof auth>>) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const session = await requireMinimumRoleAuth(minimumRole)
      return await handler(req, session)
    } catch (error) {
      return handleAuthError(error)
    }
  }
}
