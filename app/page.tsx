import { prisma } from '@/lib/db'
import { ArticleCard } from '@/components/articles/article-card'
import { FeaturedArticle } from '@/components/articles/featured-article'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SteppersLife Magazine - Premier Digital Magazine for Stepping Culture',
  description:
    'Your premier digital magazine covering stepping culture, lifestyle, fashion, music, events, and community stories.',
  openGraph: {
    title: 'SteppersLife Magazine',
    description:
      'Your premier digital magazine covering stepping culture, lifestyle, fashion, music, events, and community stories.',
    url: 'https://magazine.stepperslife.com',
    siteName: 'SteppersLife Magazine',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SteppersLife Magazine',
    description:
      'Your premier digital magazine covering stepping culture, lifestyle, fashion, music, events, and community stories.',
  },
}

export default async function HomePage() {
  // Fetch published articles
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
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
    take: 10,
  })

  const [featuredArticle, ...latestArticles] = articles

  // Generate JSON-LD structured data for homepage (Story 9.8)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magazine.stepperslife.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SteppersLife Magazine',
    url: siteUrl,
    description:
      'Your premier digital magazine covering stepping culture, lifestyle, fashion, music, events, and community stories.',
    publisher: {
      '@type': 'Organization',
      name: 'SteppersLife Magazine',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
      sameAs: [
        'https://facebook.com/stepperslife',
        'https://twitter.com/stepperslife',
        'https://instagram.com/stepperslife',
      ],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/articles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Group articles by category for category sections
  const articlesByCategory = latestArticles.reduce((acc, article) => {
    const category = article.category
    if (!acc[category]) {
      acc[category] = []
    }
    if (acc[category].length < 3) {
      acc[category].push(article)
    }
    return acc
  }, {} as Record<string, typeof latestArticles>)

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      {/* Hero/Featured Article Section */}
      {featuredArticle ? (
        <FeaturedArticle article={featuredArticle} />
      ) : (
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="space-y-4">
            <Badge className="bg-gold px-4 py-1 text-sm font-bold text-black">
              SteppersLife Property
            </Badge>
            <h1 className="text-5xl font-bold">Magazine</h1>
            <p className="text-xl text-muted-foreground">
              Your premier digital magazine for stepping culture and lifestyle
            </p>
            <div className="pt-6">
              <Link href="/sign-in">
                <Button size="lg" className="bg-gold font-bold text-black hover:bg-gold/90">
                  Sign In to Create Content
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Grid */}
      {latestArticles.length > 0 && (
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold lg:text-4xl">Latest Articles</h2>
            <Link href="/articles">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {latestArticles.length > 6 && (
            <div className="mt-8 text-center">
              <Link href="/articles">
                <Button size="lg" variant="outline">
                  View All Articles
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Category Sections (Optional) */}
      {Object.keys(articlesByCategory).length > 0 && (
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold lg:text-4xl">
              Browse by Category
            </h2>

            <div className="space-y-12">
              {Object.entries(articlesByCategory)
                .slice(0, 3)
                .map(([category, categoryArticles]) => (
                  <div key={category}>
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-bold capitalize">
                        {category.toLowerCase().replace('_', ' ')}
                      </h3>
                      <Link href={`/articles?category=${category}`}>
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {categoryArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {articles.length === 0 && (
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-6xl">📰</div>
            <h2 className="text-3xl font-bold">No Published Articles Yet</h2>
            <p className="text-lg text-muted-foreground">
              Articles will appear here once they are published. Sign in to create
              and publish content.
            </p>
            <div className="pt-4">
              <Link href="/sign-in">
                <Button size="lg" className="bg-gold font-bold text-black hover:bg-gold/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      </main>
      <SiteFooter />
    </>
  )
}
