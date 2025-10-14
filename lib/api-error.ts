/**
 * API Error Handling Utilities (Story 9.1)
 *
 * Provides consistent error response format across all API endpoints
 */

import { NextResponse } from 'next/server'

export interface ApiError {
  message: string
  code: string
  details?: any
}

export class ApiErrorResponse extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message)
    this.name = 'ApiErrorResponse'
  }
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: any
) {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        details,
      },
    },
    { status: statusCode }
  )
}

/**
 * Common error responses
 */
export const ApiErrors = {
  notFound: (resource: string = 'Resource') =>
    errorResponse(`${resource} not found`, 404, 'NOT_FOUND'),

  unauthorized: (message: string = 'Authentication required') =>
    errorResponse(message, 401, 'UNAUTHORIZED'),

  forbidden: (message: string = 'You do not have permission to perform this action') =>
    errorResponse(message, 403, 'FORBIDDEN'),

  badRequest: (message: string, details?: any) =>
    errorResponse(message, 400, 'BAD_REQUEST', details),

  conflict: (message: string, details?: any) =>
    errorResponse(message, 409, 'CONFLICT', details),

  validationError: (errors: any) =>
    errorResponse('Validation failed', 400, 'VALIDATION_ERROR', errors),

  internalError: (message: string = 'An internal error occurred') =>
    errorResponse(message, 500, 'INTERNAL_ERROR'),

  serviceUnavailable: (message: string = 'Service temporarily unavailable') =>
    errorResponse(message, 503, 'SERVICE_UNAVAILABLE'),
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiErrorResponse) {
    return errorResponse(error.message, error.statusCode, error.code, error.details)
  }

  if (error instanceof Error) {
    // Log full error in development
    if (process.env.NODE_ENV === 'development') {
      return errorResponse(error.message, 500, 'INTERNAL_ERROR', {
        stack: error.stack,
      })
    }

    return errorResponse(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR'
    )
  }

  return errorResponse(
    'An unexpected error occurred',
    500,
    'INTERNAL_ERROR'
  )
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandling(
  handler: (...args: any[]) => Promise<Response>
) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
