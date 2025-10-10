import { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Users, BookOpen, Sparkles, Award, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - SteppersLife Magazine',
  description: 'Learn about SteppersLife Magazine, our mission, values, and the team behind the premier digital magazine for stepping culture.',
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">About</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">About SteppersLife Magazine</h1>
              <p className="text-xl text-muted-foreground">
                The premier digital magazine celebrating stepping culture, lifestyle, and community
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  SteppersLife Magazine was born from a passion for stepping culture and a vision to create a dedicated platform where the community could share stories, celebrate achievements, and connect with one another. Founded in 2024, we recognized the need for a sophisticated, modern publication that honors the rich traditions of stepping while embracing contemporary culture and innovation.
                </p>
                <p>
                  What started as a small community blog has evolved into a comprehensive digital magazine that reaches thousands of readers worldwide. We cover everything from stepping techniques and dance culture to lifestyle, entertainment, fashion, music, and the social movements that shape our community.
                </p>
                <p>
                  Today, SteppersLife Magazine stands as a testament to the vibrant, dynamic stepping community - a place where voices are heard, stories are told, and culture is preserved and celebrated for generations to come.
                </p>
              </CardContent>
            </Card>

            {/* Mission & Values */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Target className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    To be the definitive voice of stepping culture, providing high-quality content that informs, inspires, and connects our community while preserving and promoting the art form for future generations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <Sparkles className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    To create a world where stepping culture is recognized, celebrated, and accessible to all, fostering a global community united by rhythm, tradition, and shared experiences.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Core Values */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Core Values</CardTitle>
                <CardDescription>The principles that guide everything we do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Heart className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Authenticity</h3>
                        <p className="text-sm text-muted-foreground">
                          We celebrate genuine voices and real stories from the stepping community.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Users className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Community</h3>
                        <p className="text-sm text-muted-foreground">
                          We build connections and foster relationships across the stepping world.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Award className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Excellence</h3>
                        <p className="text-sm text-muted-foreground">
                          We maintain the highest standards in content quality and editorial integrity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <BookOpen className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Education</h3>
                        <p className="text-sm text-muted-foreground">
                          We educate and inform, sharing knowledge and preserving stepping heritage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Cover */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What We Cover</CardTitle>
                <CardDescription>Comprehensive coverage of stepping culture and lifestyle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">Culture</Badge>
                    <h3 className="font-semibold">Lifestyle & Culture</h3>
                    <p className="text-sm text-muted-foreground">
                      Fashion, trends, social movements, and the lifestyle that defines stepping culture.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">Entertainment</Badge>
                    <h3 className="font-semibold">Entertainment</h3>
                    <p className="text-sm text-muted-foreground">
                      Events, performances, music, and the entertainment side of the stepping scene.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">Community</Badge>
                    <h3 className="font-semibold">Politics & Society</h3>
                    <p className="text-sm text-muted-foreground">
                      Social issues, community activism, and political topics that impact our culture.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">Business</Badge>
                    <h3 className="font-semibold">Business & Entrepreneurship</h3>
                    <p className="text-sm text-muted-foreground">
                      Business insights, entrepreneurship, and success stories from the community.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">Sports</Badge>
                    <h3 className="font-semibold">Sports & Fitness</h3>
                    <p className="text-sm text-muted-foreground">
                      Athletic achievements, fitness tips, and the sports culture within stepping.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">Technology</Badge>
                    <h3 className="font-semibold">Technology & Innovation</h3>
                    <p className="text-sm text-muted-foreground">
                      Tech trends, digital culture, and innovation shaping the future of stepping.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Team */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Team</CardTitle>
                <CardDescription>Meet the passionate people behind SteppersLife Magazine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  SteppersLife Magazine is powered by a dedicated team of writers, editors, photographers, and stepping enthusiasts who are passionate about sharing the culture with the world. Our diverse team brings together decades of combined experience in journalism, digital media, and stepping culture.
                </p>
                <p>
                  We work with contributors from across the country who bring unique perspectives, local insights, and authentic voices to our publication. From veteran steppers to emerging talents, our writers are deeply embedded in the communities they cover.
                </p>
                <p>
                  Behind the scenes, our editorial team works tirelessly to maintain the highest standards of quality, accuracy, and relevance. Every article is carefully researched, fact-checked, and edited to ensure we deliver content that informs, inspires, and resonates with our readers.
                </p>
              </CardContent>
            </Card>

            {/* Join Our Community */}
            <Card className="border-gold/20 bg-gold/5">
              <CardHeader>
                <CardTitle className="text-2xl">Join Our Community</CardTitle>
                <CardDescription>Become part of the SteppersLife Magazine family</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Whether you're a lifelong stepper, a curious newcomer, or someone who simply appreciates the culture, there's a place for you in our community. We welcome diverse perspectives and celebrate the many ways people engage with stepping culture.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="bg-gold text-black hover:bg-gold/90">
                    <Link href="/writers">Write for Us</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/advertise">Partner with Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Part of SteppersLife Network */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Part of the SteppersLife Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  SteppersLife Magazine is proud to be part of the SteppersLife Network, a comprehensive ecosystem of platforms and services dedicated to the stepping community. Our sister sites include:
                </p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>SteppersLife.com</strong> - The main hub for stepping culture and community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>SteppersLife Events</strong> - Discover and attend stepping events nationwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>SteppersLife Shop</strong> - Official merchandise and stepping gear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>SteppersLife Classes</strong> - Learn from the best instructors</span>
                  </li>
                </ul>
                <p>
                  Together, we're building a comprehensive platform that serves every aspect of stepping culture, from learning and connecting to shopping and staying informed.
                </p>
              </CardContent>
            </Card>

            {/* Editorial Standards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Editorial Standards</CardTitle>
                <CardDescription>Our commitment to quality journalism</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  At SteppersLife Magazine, we are committed to the highest standards of journalism and editorial integrity. Every article we publish adheres to strict guidelines:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>Accuracy: All facts are verified and sources are credible</li>
                  <li>Fairness: We present balanced perspectives and diverse viewpoints</li>
                  <li>Transparency: We clearly identify sponsored content and disclose conflicts of interest</li>
                  <li>Respect: We treat all subjects with dignity and cultural sensitivity</li>
                  <li>Independence: Our editorial decisions are free from commercial influence</li>
                  <li>Accountability: We correct errors promptly and transparently</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Get in Touch</CardTitle>
                <CardDescription>We'd love to hear from you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Have a story idea? Want to contribute? Have feedback or questions? We're always happy to hear from our readers and community members.
                </p>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p><strong>General Inquiries:</strong> info@stepperslife.com</p>
                  <p><strong>Editorial:</strong> editorial@stepperslife.com</p>
                  <p><strong>Advertising:</strong> ads@stepperslife.com</p>
                  <p><strong>Press:</strong> press@stepperslife.com</p>
                </div>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
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
