/**
 * Role-Based Access Control (RBAC) Utilities
 * Provides authorization checks and role management
 */

import { UserRole } from '@prisma/client'

// Role hierarchy - higher number = more permissions
const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 0,
  MAGAZINE_WRITER: 10,
  MAGAZINE_EDITOR: 20,
  ADMIN: 100,
}

/**
 * Check if a user has a specific role
 */
export function hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  return userRoles.includes(requiredRole)
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  return requiredRoles.some((role) => userRoles.includes(role))
}

/**
 * Check if a user has all of the specified roles
 */
export function hasAllRoles(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  return requiredRoles.every((role) => userRoles.includes(role))
}

/**
 * Check if a user has at least the minimum role level
 * Uses role hierarchy to determine if user has sufficient permissions
 */
export function hasMinimumRole(userRoles: UserRole[], minimumRole: UserRole): boolean {
  const minimumLevel = ROLE_HIERARCHY[minimumRole]
  return userRoles.some((role) => ROLE_HIERARCHY[role] >= minimumLevel)
}

/**
 * Check if a user is an admin
 */
export function isAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, 'ADMIN')
}

/**
 * Check if a user is a magazine writer
 */
export function isWriter(userRoles: UserRole[]): boolean {
  return hasAnyRole(userRoles, ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'])
}

/**
 * Check if a user is a magazine editor
 */
export function isEditor(userRoles: UserRole[]): boolean {
  return hasAnyRole(userRoles, ['MAGAZINE_EDITOR', 'ADMIN'])
}

/**
 * Get the highest role level for a user
 */
export function getHighestRoleLevel(userRoles: UserRole[]): number {
  return Math.max(...userRoles.map((role) => ROLE_HIERARCHY[role]))
}

/**
 * Get the highest role name for a user
 */
export function getHighestRole(userRoles: UserRole[]): UserRole {
  let highestRole: UserRole = 'USER'
  let highestLevel = 0

  for (const role of userRoles) {
    const level = ROLE_HIERARCHY[role]
    if (level > highestLevel) {
      highestLevel = level
      highestRole = role
    }
  }

  return highestRole
}

/**
 * Article permission checks
 */
export const ArticlePermissions = {
  /**
   * Can user create articles?
   */
  canCreate(userRoles: UserRole[]): boolean {
    return isWriter(userRoles)
  },

  /**
   * Can user edit this article?
   * Writers can edit their own articles, editors and admins can edit any article
   */
  canEdit(userRoles: UserRole[], articleAuthorId: string, userId: string): boolean {
    // Editors and admins can edit any article
    if (isEditor(userRoles)) {
      return true
    }

    // Writers can edit their own articles
    if (isWriter(userRoles) && articleAuthorId === userId) {
      return true
    }

    return false
  },

  /**
   * Can user delete this article?
   * Only editors and admins can delete articles
   */
  canDelete(userRoles: UserRole[]): boolean {
    return isEditor(userRoles)
  },

  /**
   * Can user publish/unpublish articles?
   */
  canPublish(userRoles: UserRole[]): boolean {
    return isEditor(userRoles)
  },

  /**
   * Can user review/approve articles?
   */
  canReview(userRoles: UserRole[]): boolean {
    return isEditor(userRoles)
  },
}

/**
 * User management permission checks
 */
export const UserPermissions = {
  /**
   * Can user view other user profiles?
   */
  canViewProfiles(userRoles: UserRole[]): boolean {
    return isEditor(userRoles)
  },

  /**
   * Can user edit other user profiles?
   */
  canEditProfiles(userRoles: UserRole[]): boolean {
    return isAdmin(userRoles)
  },

  /**
   * Can user manage roles?
   */
  canManageRoles(userRoles: UserRole[]): boolean {
    return isAdmin(userRoles)
  },

  /**
   * Can user delete users?
   */
  canDeleteUsers(userRoles: UserRole[]): boolean {
    return isAdmin(userRoles)
  },
}

/**
 * Comment permission checks
 */
export const CommentPermissions = {
  /**
   * Can user create comments?
   */
  canCreate(userRoles: UserRole[]): boolean {
    // All authenticated users can comment
    return userRoles.length > 0
  },

  /**
   * Can user edit this comment?
   */
  canEdit(userRoles: UserRole[], commentAuthorId: string, userId: string): boolean {
    // Admins and editors can edit any comment
    if (isEditor(userRoles)) {
      return true
    }

    // Users can edit their own comments
    return commentAuthorId === userId
  },

  /**
   * Can user delete this comment?
   */
  canDelete(userRoles: UserRole[], commentAuthorId: string, userId: string): boolean {
    // Admins and editors can delete any comment
    if (isEditor(userRoles)) {
      return true
    }

    // Users can delete their own comments
    return commentAuthorId === userId
  },

  /**
   * Can user moderate comments (approve/reject)?
   */
  canModerate(userRoles: UserRole[]): boolean {
    return isEditor(userRoles)
  },
}

/**
 * Error class for authorization failures
 */
export class AuthorizationError extends Error {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

/**
 * Throw error if user doesn't have required role
 */
export function requireRole(userRoles: UserRole[], requiredRole: UserRole): void {
  if (!hasRole(userRoles, requiredRole)) {
    throw new AuthorizationError(`This action requires the ${requiredRole} role`)
  }
}

/**
 * Throw error if user doesn't have any of the required roles
 */
export function requireAnyRole(userRoles: UserRole[], requiredRoles: UserRole[]): void {
  if (!hasAnyRole(userRoles, requiredRoles)) {
    throw new AuthorizationError(
      `This action requires one of the following roles: ${requiredRoles.join(', ')}`
    )
  }
}

/**
 * Throw error if user doesn't have minimum role level
 */
export function requireMinimumRole(userRoles: UserRole[], minimumRole: UserRole): void {
  if (!hasMinimumRole(userRoles, minimumRole)) {
    throw new AuthorizationError(`This action requires at least ${minimumRole} role`)
  }
}
