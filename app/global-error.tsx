/**
 * Global Error Handler (Story 9.1)
 *
 * Catches errors in the root layout
 * This is a last-resort error boundary
 */

'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Critical Error
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#666' }}>
            A critical error occurred. Please refresh the page to try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#D4AF37',
              color: '#000',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto',
            }}>
              {error.message}
            </pre>
          )}
        </div>
      </body>
    </html>
  )
}
