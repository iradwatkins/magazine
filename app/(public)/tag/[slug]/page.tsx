/**
 * Tag Landing Page Placeholder
 *
 * Will display all articles with a specific tag
 *
 * @module app/(public)/tag/[slug]
 */

export default function TagPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">Tag: {params.slug}</h1>
      <p className="text-muted-foreground">
        This page will be implemented in a future story
      </p>
    </div>
  )
}
