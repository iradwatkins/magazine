/**
 * SIMPLIFIED AUTH MIDDLEWARE HELPERS
 *
 * Keep it simple - JWT sessions have the user info
 */

import { auth } from './auth'

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
    throw new Error('Authentication required')
  }

  return session
}

/**
 * Check if user has admin role
 */
export async function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

/**
 * Check if user can write articles
 */
export async function canWriteArticles(session: any) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MAGAZINE_WRITER' || role === 'MAGAZINE_EDITOR'
}

/**
 * Check if user can edit articles
 */
export async function canEditArticles(session: any) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MAGAZINE_EDITOR'
}