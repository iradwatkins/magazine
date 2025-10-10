import { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  PenTool,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Check,
  AlertCircle,
  FileText,
  Mail
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Write for Us - SteppersLife Magazine',
  description: 'Join our team of contributors and share your voice with the SteppersLife community. Learn about our submission guidelines and contributor benefits.',
}

export default function WritersPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Contributors</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Write for SteppersLife</h1>
              <p className="text-xl text-muted-foreground">
                Share your voice, expertise, and stories with our engaged community
              </p>
            </div>
          </div>
        </section>

        {/* Why Write for Us */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold">Why Write for SteppersLife?</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Join a community of passionate writers and thought leaders shaping the conversation around stepping culture
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Users className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle>Reach</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-sm">
                    Connect with 50,000+ monthly readers passionate about stepping culture and lifestyle
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Award className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle>Credibility</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-sm">
                    Build your portfolio and establish yourself as an authority in the stepping community
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <TrendingUp className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle>Growth</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-sm">
                    Work with our editorial team to refine your craft and develop your unique voice
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <BookOpen className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle>Platform</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="text-sm">
                    Gain exposure on a respected platform dedicated to celebrating stepping culture
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We're Looking For */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">What We're Looking For</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  We welcome diverse voices and perspectives across multiple categories
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Categories</CardTitle>
                    <CardDescription>Topics we cover</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Lifestyle & Culture</p>
                          <p className="text-sm text-muted-foreground">
                            Fashion, trends, social movements, personal stories
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Entertainment</p>
                          <p className="text-sm text-muted-foreground">
                            Events, music, performances, reviews
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Politics & Society</p>
                          <p className="text-sm text-muted-foreground">
                            Social issues, community activism, opinion pieces
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Business & Entrepreneurship</p>
                          <p className="text-sm text-muted-foreground">
                            Success stories, business insights, career advice
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Sports & Fitness</p>
                          <p className="text-sm text-muted-foreground">
                            Athletic achievements, health, wellness
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-medium">Technology & Innovation</p>
                          <p className="text-sm text-muted-foreground">
                            Digital culture, tech trends, innovation
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ideal Contributors</CardTitle>
                    <CardDescription>Who we work with</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Writers with authentic connection to stepping culture
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Industry experts and thought leaders
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Journalists and professional writers
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Community leaders and activists
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Photographers and visual storytellers
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Emerging voices with fresh perspectives
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                        <span className="text-sm">
                          Anyone passionate about sharing quality content
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Guidelines */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold">Submission Guidelines</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Follow these guidelines to ensure your submission gets the attention it deserves
              </p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <FileText className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle>Article Requirements</CardTitle>
                    <CardDescription>Technical specifications for submissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold">Length</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Articles: 800-2,000 words</li>
                      <li>• Features: 1,500-3,000 words</li>
                      <li>• Opinion pieces: 600-1,200 words</li>
                      <li>• News briefs: 300-500 words</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Format</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Submit as Google Doc or Word file</li>
                      <li>• Include headline and subheading</li>
                      <li>• Add relevant links and sources</li>
                      <li>• Include author bio (50-100 words)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Images</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• High-resolution (min 1200px wide)</li>
                      <li>• Relevant to article content</li>
                      <li>• Include photo credits/attribution</li>
                      <li>• Confirm usage rights</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Style</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• AP Style preferred</li>
                      <li>• Clear, engaging writing</li>
                      <li>• Well-researched and factual</li>
                      <li>• Original, unpublished content</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <PenTool className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle>Editorial Standards</CardTitle>
                    <CardDescription>Quality expectations for all content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium">Originality</p>
                      <p className="text-sm text-muted-foreground">
                        All content must be original and not previously published elsewhere. We check for plagiarism.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium">Accuracy</p>
                      <p className="text-sm text-muted-foreground">
                        Fact-check all claims and provide credible sources. We verify information before publication.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium">Objectivity</p>
                      <p className="text-sm text-muted-foreground">
                        Present balanced viewpoints. Opinion pieces should be clearly labeled and well-reasoned.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium">Respect</p>
                      <p className="text-sm text-muted-foreground">
                        Treat all subjects with dignity and cultural sensitivity. No discriminatory or offensive content.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium">Relevance</p>
                      <p className="text-sm text-muted-foreground">
                        Content should be timely, relevant, and valuable to our community.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>What We Don't Accept</CardTitle>
                    <CardDescription>Content that will be rejected</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Previously published content or simultaneous submissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Promotional or overtly commercial content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Content containing hate speech, discrimination, or harassment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Poorly researched or factually inaccurate articles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Articles with extensive grammatical or spelling errors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Content that violates copyright or intellectual property rights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Process */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">The Submission Process</h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Here's what happens after you submit your article
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-black font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">Submit Your Pitch or Article</h3>
                        <p className="text-sm text-muted-foreground">
                          Email your pitch or completed article to editorial@stepperslife.com. Include a brief introduction about yourself and why this story matters.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-black font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">Initial Review</h3>
                        <p className="text-sm text-muted-foreground">
                          Our editorial team reviews all submissions within 5-7 business days. We'll let you know if we're interested in publishing your piece or need more information.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-black font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">Editing & Collaboration</h3>
                        <p className="text-sm text-muted-foreground">
                          If accepted, we'll work with you to refine the article. Our editors may suggest changes for clarity, accuracy, or style. This is a collaborative process.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-black font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">Publication</h3>
                        <p className="text-sm text-muted-foreground">
                          Once finalized, we'll schedule your article for publication. You'll receive advance notice of the publication date and a link to share with your network.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-black font-bold">
                        5
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">Promotion</h3>
                        <p className="text-sm text-muted-foreground">
                          We promote all published articles across our social media channels and newsletter. You retain the right to promote your article on your own platforms.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contributor Benefits */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <Card className="border-gold/20 bg-gold/5">
              <CardHeader>
                <CardTitle className="text-2xl">Contributor Benefits</CardTitle>
                <CardDescription>What you get as a SteppersLife contributor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Author byline and bio with social links</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Featured author profile page</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Promotion across our social channels</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Portfolio-worthy published clips</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Access to contributor network</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Editorial feedback and mentorship</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Opportunity for regular column</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm">Compensation for select pieces</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Do you pay contributors?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      We offer compensation for commissioned pieces and regular contributors. Most first-time submissions are published for exposure and portfolio building. As you establish yourself as a regular contributor, paid opportunities become available.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I republish my article elsewhere?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      We require first publication rights, meaning we publish your article first. After 30 days, you may republish the article elsewhere with attribution to SteppersLife Magazine as the original publisher.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How long does the review process take?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      We typically respond to pitches and submissions within 5-7 business days. During busy periods, it may take up to 2 weeks. If you haven't heard back after 2 weeks, feel free to follow up.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I submit if I'm not a professional writer?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      Absolutely! We welcome submissions from anyone with a compelling story or unique perspective, regardless of writing experience. Our editors can help polish your piece to meet our publication standards.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What if my submission is rejected?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p>
                      Rejection doesn't mean your writing isn't good - it may simply not be the right fit for our current editorial calendar. We encourage you to revise and resubmit, or pitch a different story. We provide feedback when possible.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <Card className="border-gold/20 bg-gold/5">
              <CardHeader>
                <div className="flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                    <Mail className="h-8 w-8 text-gold" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">Ready to Submit?</CardTitle>
                <CardDescription className="text-center">
                  We're excited to hear from you
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 text-muted-foreground">
                  Send your pitch or completed article to our editorial team. Include a brief introduction and tell us why your story matters to the SteppersLife community.
                </p>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-semibold">Editorial Email</p>
                    <p className="text-gold">editorial@stepperslife.com</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                      <Link href="mailto:editorial@stepperslife.com">Submit Your Pitch</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/contact">Ask a Question</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
