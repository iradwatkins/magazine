import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { ArticleCard } from '@/components/articles/article-card'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'

interface AuthorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
    select: { name: true },
  })

  if (!author) {
    return {
      title: 'Author Not Found',
    }
  }

  return {
    title: `${author.name} - SteppersLife Magazine`,
    description: `Read all articles by ${author.name} on SteppersLife Magazine`,
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  })

  if (!author) {
    notFound()
  }

  const articles = await prisma.article.findMany({
    where: {
      authorId: params.id,
      status: 'PUBLISHED',
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

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Author Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 relative h-32 w-32 overflow-hidden rounded-full bg-muted">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name || 'Author'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Author</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
                {author.name || 'Anonymous'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {articles.length} {articles.length === 1 ? 'article' : 'articles'} published
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
              <div className="text-6xl">📝</div>
              <h2 className="text-3xl font-bold">No Published Articles</h2>
              <p className="text-lg text-muted-foreground">
                This author hasn't published any articles yet. Check back soon!
              </p>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
