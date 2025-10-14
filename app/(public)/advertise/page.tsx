import { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Eye,
  Sparkles,
  Check,
  Star
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Advertise with Us - SteppersLife Magazine',
  description: 'Reach a highly engaged audience of stepping enthusiasts. Learn about advertising opportunities and partnership packages.',
}

export default function AdvertisePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Advertising</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Advertise with SteppersLife</h1>
              <p className="text-xl text-muted-foreground">
                Connect with a passionate, engaged community of stepping enthusiasts
              </p>
            </div>
          </div>
        </section>

        {/* Why Advertise Section */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold">Why Advertise with Us?</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                SteppersLife Magazine reaches a highly engaged, culturally connected audience that values authentic brands and meaningful content.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Users className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-xl">Engaged Audience</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-2xl font-bold text-foreground">50K+</p>
                  <p className="text-sm">Monthly active readers passionate about stepping culture and lifestyle</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Eye className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-xl">High Visibility</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-2xl font-bold text-foreground">200K+</p>
                  <p className="text-sm">Monthly page views across our platform and content</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Target className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-xl">Targeted Reach</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-2xl font-bold text-foreground">6</p>
                  <p className="text-sm">Content categories to align with your brand message</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <TrendingUp className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-xl">Growing Platform</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-2xl font-bold text-foreground">45%</p>
                  <p className="text-sm">Year-over-year audience growth rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Audience Demographics */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">Our Audience</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Understand who you'll reach when you advertise with SteppersLife Magazine
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                    <CardDescription>Who reads SteppersLife Magazine</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Age 25-44</span>
                        <span className="text-sm text-muted-foreground">68%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[68%] rounded-full bg-gold" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Age 45-64</span>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[25%] rounded-full bg-gold" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">College Educated</span>
                        <span className="text-sm text-muted-foreground">72%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[72%] rounded-full bg-gold" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Household Income $50K+</span>
                        <span className="text-sm text-muted-foreground">65%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[65%] rounded-full bg-gold" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interests & Behaviors</CardTitle>
                    <CardDescription>What drives our readers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Culture & Lifestyle Enthusiasts</p>
                          <p className="text-sm text-muted-foreground">
                            Actively engaged in stepping culture and community events
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Fashion & Style Conscious</p>
                          <p className="text-sm text-muted-foreground">
                            Value quality brands and stay current with trends
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Entertainment Seekers</p>
                          <p className="text-sm text-muted-foreground">
                            Regular attendees of events, concerts, and social gatherings
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Community-Minded</p>
                          <p className="text-sm text-muted-foreground">
                            Support businesses that align with their values
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Advertising Options */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold">Advertising Options</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Flexible packages designed to meet your marketing goals and budget
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Essential Package */}
              <Card className="flex flex-col">
                <CardHeader>
                  <Badge variant="outline" className="mb-2 w-fit">Popular</Badge>
                  <CardTitle className="text-2xl">Essential</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">$499</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-6 flex-1 space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Display ads on article pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Up to 50,000 impressions/month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Mobile and desktop placement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Monthly performance reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Basic audience targeting</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Package */}
              <Card className="flex flex-col border-gold/50 bg-gold/5">
                <CardHeader>
                  <Badge className="mb-2 w-fit bg-gold text-black">Recommended</Badge>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>Maximum visibility and impact</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">$999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-6 flex-1 space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Premium ad placements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Up to 150,000 impressions/month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Homepage and featured article placement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Advanced audience targeting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Newsletter inclusion (1x/month)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Detailed analytics dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Dedicated account manager</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-gold text-black hover:bg-gold/90">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Package */}
              <Card className="flex flex-col">
                <CardHeader>
                  <Badge variant="outline" className="mb-2 w-fit">
                    <Star className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>Custom solutions for your brand</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-6 flex-1 space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Everything in Professional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Unlimited impressions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Sponsored content creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Social media promotion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Event partnership opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Custom integrations and features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Quarterly strategy sessions</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Opportunities */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">Additional Opportunities</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Beyond traditional advertising, we offer unique ways to connect with our audience
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <Sparkles className="h-5 w-5 text-gold" />
                    </div>
                    <CardTitle>Sponsored Content</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Work with our editorial team to create authentic, engaging branded content that resonates with our audience while maintaining editorial integrity.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <Users className="h-5 w-5 text-gold" />
                    </div>
                    <CardTitle>Event Partnerships</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Sponsor or partner with SteppersLife events to engage directly with our community through experiences they love.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <BarChart3 className="h-5 w-5 text-gold" />
                    </div>
                    <CardTitle>Newsletter Sponsorship</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Reach our most engaged subscribers directly in their inbox with dedicated newsletter sponsorships and featured placements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Why Partner with SteppersLife?</CardTitle>
                <CardDescription>We're more than just an advertising platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Authentic Connection</h3>
                  <p>
                    Our audience trusts us because we're part of the community we serve. When you advertise with us, you're not just buying impressions - you're building relationships with people who share values and culture.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Quality Content Environment</h3>
                  <p>
                    Your brand appears alongside high-quality, professionally produced content that readers actively seek out and engage with. We maintain strict editorial standards to ensure a premium environment for your message.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Measurable Results</h3>
                  <p>
                    We provide detailed analytics and transparent reporting so you can track performance, understand your ROI, and optimize your campaigns for maximum effectiveness.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Flexible Solutions</h3>
                  <p>
                    Whether you're a small business or a major brand, we offer flexible packages and custom solutions designed to meet your specific goals, timeline, and budget.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Let's discuss how SteppersLife Magazine can help you reach your marketing goals and connect with our engaged community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                  <Link href="/contact">Contact Our Ad Team</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Request Media Kit</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Questions? Email us at <span className="text-gold">ads@stepperslife.com</span>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
