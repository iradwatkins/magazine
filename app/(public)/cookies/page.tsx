import { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy - SteppersLife Magazine',
  description: 'Learn about how SteppersLife Magazine uses cookies and similar technologies to enhance your browsing experience.',
}

export default function CookiesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Legal</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Cookie Policy</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: October 10, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
                </p>
                <p>
                  Cookies help us understand how you use our website, remember your preferences, and improve your overall experience. This Cookie Policy explains what cookies are, how we use them, and how you can manage your cookie preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
                <CardDescription>The purposes for which we use cookies on our site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>SteppersLife Magazine uses cookies for several important purposes:</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>To enable certain functions of our website</li>
                  <li>To remember your preferences and settings</li>
                  <li>To understand how you interact with our content</li>
                  <li>To improve our website performance and user experience</li>
                  <li>To provide you with relevant content and advertisements</li>
                  <li>To analyze site traffic and usage patterns</li>
                  <li>To enable social media features and integrations</li>
                  <li>To detect and prevent fraud and security issues</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
                <CardDescription>Different categories of cookies on our website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-3 font-semibold text-foreground">1. Strictly Necessary Cookies</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    These cookies are essential for our website to function properly. Without these cookies, certain services cannot be provided.
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-2 text-sm font-semibold">Examples:</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Authentication cookies (to keep you logged in)</li>
                      <li>Security cookies (to prevent fraudulent activity)</li>
                      <li>Load balancing cookies (to distribute traffic)</li>
                      <li>Session cookies (to remember your actions)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-foreground">2. Performance and Analytics Cookies</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-2 text-sm font-semibold">Examples:</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Google Analytics (visitor statistics and behavior)</li>
                      <li>Page view tracking (most popular content)</li>
                      <li>Error tracking (technical issues)</li>
                      <li>Performance monitoring (load times and responsiveness)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-foreground">3. Functionality Cookies</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    These cookies allow our website to remember choices you make and provide enhanced, personalized features.
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-2 text-sm font-semibold">Examples:</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Language preferences</li>
                      <li>Theme preferences (light/dark mode)</li>
                      <li>Font size and accessibility settings</li>
                      <li>Previously viewed articles</li>
                      <li>Video player preferences</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-foreground">4. Targeting and Advertising Cookies</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    These cookies are used to deliver advertisements that are relevant to you and your interests. They also help limit the number of times you see an advertisement.
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-2 text-sm font-semibold">Examples:</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Advertising network cookies (Google Ads, Facebook Pixel)</li>
                      <li>Retargeting cookies (show relevant ads on other sites)</li>
                      <li>Interest-based advertising</li>
                      <li>Ad frequency capping</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-foreground">5. Social Media Cookies</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    These cookies enable you to share content and interact with social media platforms directly from our website.
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-2 text-sm font-semibold">Examples:</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      <li>Facebook sharing and like buttons</li>
                      <li>Twitter/X sharing and follow buttons</li>
                      <li>Instagram integration</li>
                      <li>LinkedIn sharing features</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
                <CardDescription>Cookies set by external services we use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  In addition to our own cookies, we also use various third-party cookies to provide analytics, advertising, and social media features. These third parties may also use cookies for their own purposes.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Analytics Services</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Google Analytics - Website traffic and user behavior analysis</li>
                      <li>Other analytics tools as needed for performance monitoring</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Advertising Networks</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Google AdSense - Displaying relevant advertisements</li>
                      <li>Facebook Pixel - Retargeting and conversion tracking</li>
                      <li>Other ad networks for monetization purposes</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Social Media Platforms</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Facebook - Social sharing and engagement features</li>
                      <li>Twitter/X - Content sharing and embedding</li>
                      <li>Instagram - Image and content embedding</li>
                      <li>LinkedIn - Professional sharing features</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Content Delivery</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>YouTube - Video embedding and playback</li>
                      <li>Content delivery networks (CDNs) for faster loading</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-sm">
                  Please note that these third parties have their own privacy policies and cookie policies. We recommend reviewing their policies to understand how they use cookies and collect data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookie Duration</CardTitle>
                <CardDescription>How long cookies remain on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Session Cookies</h3>
                  <p className="text-sm">
                    Session cookies are temporary cookies that expire when you close your browser. They help us maintain continuity during your browsing session.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Persistent Cookies</h3>
                  <p className="text-sm">
                    Persistent cookies remain on your device until they expire or you delete them. The expiration period varies:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm pl-4">
                    <li>Short-term: 24 hours to 30 days</li>
                    <li>Medium-term: 30 days to 1 year</li>
                    <li>Long-term: 1 to 2 years</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
                <CardDescription>How to control and delete cookies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in several ways:
                </p>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Browser Settings</h3>
                  <p className="mb-2 text-sm">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm pl-4">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete cookies after each browsing session</li>
                    <li>Set preferences for specific websites</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 font-semibold">Browser-Specific Instructions:</p>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Opt-Out Tools</h3>
                  <p className="mb-2 text-sm">
                    You can opt out of interest-based advertising through:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm pl-4">
                    <li>Digital Advertising Alliance (DAA) - optout.aboutads.info</li>
                    <li>Network Advertising Initiative (NAI) - optout.networkadvertising.org</li>
                    <li>Your Online Choices (EU) - youronlinechoices.eu</li>
                    <li>Google Ad Settings - adssettings.google.com</li>
                  </ul>
                </div>

                <div className="rounded-lg border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="mb-2 flex items-center gap-2 font-semibold text-amber-600">
                    <span>⚠️</span> Important Note
                  </p>
                  <p className="text-sm">
                    Blocking or deleting cookies may impact your experience on our website. Some features may not function properly, and you may need to re-enter information or preferences.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do Not Track Signals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for how websites should respond to DNT signals.
                </p>
                <p>
                  SteppersLife Magazine respects your privacy preferences. While we currently do not alter our data collection practices in response to DNT signals, we are committed to providing you with meaningful choices about how your information is collected and used.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you access our website through a mobile device, you can control cookies through your device settings:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4 text-sm">
                  <li><strong>iOS:</strong> Settings → Safari → Block All Cookies</li>
                  <li><strong>Android:</strong> Browser Settings → Privacy → Clear Cookies</li>
                </ul>
                <p className="text-sm">
                  Additionally, you can use your device's advertising identifier settings to limit ad tracking:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4 text-sm">
                  <li><strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking</li>
                  <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Cookie Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last updated" date at the top of this policy.
                </p>
                <p>
                  We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies and how you can manage your preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>More Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  For more information about how we collect, use, and protect your personal information, please review our Privacy Policy. For information about our terms and conditions, please see our Terms of Service.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button asChild variant="outline">
                    <Link href="/privacy">Privacy Policy</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/terms">Terms of Service</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p><strong>Email:</strong> privacy@stepperslife.com</p>
                  <p><strong>Subject Line:</strong> Cookie Policy Inquiry</p>
                  <p><strong>Contact Form:</strong> Available at /contact</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold/20 bg-gold/5">
              <CardHeader>
                <CardTitle>Your Privacy Matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  At SteppersLife Magazine, we are committed to transparency and respecting your privacy. We use cookies to improve your experience and provide you with relevant content, but we believe you should have control over your data.
                </p>
                <p>
                  If you have concerns about cookies or privacy, we're here to help. Don't hesitate to reach out to us with questions or feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
