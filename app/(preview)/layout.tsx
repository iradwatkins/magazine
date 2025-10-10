/**
 * Preview Layout
 *
 * Separate layout for article preview pages
 * Provides minimal UI without admin navigation
 *
 * @module app/(preview)/layout
 */

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}
