/**
 * Public Site Layout
 *
 * Layout for public-facing pages (articles, categories, authors)
 * Includes public navigation header and footer
 *
 * @module app/(public)/layout
 */

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Public Navigation will be added in Story 7.6 */}
      <div className="min-h-screen">
        {children}
      </div>
      {/* Public Footer will be added in Story 7.7 */}
    </>
  )
}
