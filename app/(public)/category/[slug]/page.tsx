import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ArticleCard } from '@/components/articles/article-card'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Badge } from '@/components/ui/badge'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

const VALID_CATEGORIES = {
  news: 'NEWS',
  events: 'EVENTS',
  interviews: 'INTERVIEWS',
  history: 'HISTORY',
  tutorials: 'TUTORIALS',
  lifestyle: 'LIFESTYLE',
  fashion: 'FASHION',
  music: 'MUSIC',
  community: 'COMMUNITY',
  other: 'OTHER',
} as const

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = VALID_CATEGORIES[params.slug as keyof typeof VALID_CATEGORIES]

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const displayName = category.charAt(0) + category.slice(1).toLowerCase()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magazine.stepperslife.com'
  const title = `${displayName} Articles - SteppersLife Magazine`
  const description = `Browse all ${displayName.toLowerCase()} articles on SteppersLife Magazine`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/category/${params.slug}`,
      siteName: 'SteppersLife Magazine',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/category/${params.slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = VALID_CATEGORIES[params.slug as keyof typeof VALID_CATEGORIES]

  if (!category) {
    notFound()
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      category,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })

  const displayName = category.charAt(0) + category.slice(1).toLowerCase()

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Category Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Category</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{displayName}</h1>
              <p className="text-lg text-muted-foreground">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <section className="container mx-auto px-4 py-12 lg:py-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : (
          <section className="container mx-auto px-4 py-20 text-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="text-6xl">📰</div>
              <h2 className="text-3xl font-bold">No Articles Yet</h2>
              <p className="text-lg text-muted-foreground">
                There are no published articles in this category yet. Check back soon!
              </p>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
