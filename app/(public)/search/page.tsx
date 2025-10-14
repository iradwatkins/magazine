import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { ArticleCard } from '@/components/articles/article-card'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: { q?: string }
}

async function SearchResults({ query }: { query: string }) {
  if (!query || query.length < 2) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Enter at least 2 characters to search</p>
      </div>
    )
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } }
      ]
    },
    orderBy: { publishedAt: 'desc' },
    take: 20
  })

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No results found for "{query}"</p>
        <p className="text-sm mt-2">Try different keywords or check your spelling</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Found {articles.length} result{articles.length === 1 ? '' : 's'} for "{query}"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      {/* Search Form */}
      <form className="mb-8" action="/search" method="get">
        <div className="flex gap-2 max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
}