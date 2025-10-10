import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <main className="via-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-2 shadow-2xl">
          <CardContent className="p-12 text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 inline-block">
                <Badge className="gold-gradient px-4 py-1 text-sm font-bold text-black">
                  SteppersLife Property
                </Badge>
              </div>
              <h1 className="gold-text-gradient mb-4 text-5xl font-bold">Magazine</h1>
              <p className="mb-2 text-xl text-muted-foreground">
                Your premier digital magazine for stepping culture and lifestyle
              </p>
            </div>

            {/* Coming Soon */}
            <div className="my-12">
              <p className="mb-2 text-3xl font-bold">Coming Soon!</p>
              <p className="text-muted-foreground">
                We&apos;re building something special for the stepping community
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
              <div className="space-y-2">
                <div className="font-semibold text-gold">📰 Articles</div>
                <p className="text-sm text-muted-foreground">
                  Curated stories and news from the stepping world
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-gold">📸 Media</div>
                <p className="text-sm text-muted-foreground">
                  Photos, videos, and coverage of events
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-gold">🎉 Community</div>
                <p className="text-sm text-muted-foreground">
                  Connect with steppers across the nation
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 border-t pt-8">
              <p className="text-sm text-muted-foreground">magazine.stepperslife.com · Port 3007</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Part of the SteppersLife ecosystem
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
