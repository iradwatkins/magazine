import { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Privacy Policy - SteppersLife Magazine',
  description: 'Learn how SteppersLife Magazine collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Legal</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Privacy Policy</h1>
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
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Welcome to SteppersLife Magazine ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p>
                  By accessing or using SteppersLife Magazine, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
                <CardDescription>The types of information we may collect from you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Personal Information</h3>
                  <p className="mb-2">
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>Register for an account</li>
                    <li>Submit articles or content</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us through our contact form</li>
                    <li>Comment on articles or engage with our content</li>
                  </ul>
                  <p className="mt-2">
                    This information may include your name, email address, profile picture, biographical information, and any other information you choose to provide.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Automatically Collected Information</h3>
                  <p className="mb-2">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>IP address and browser type</li>
                    <li>Operating system and device information</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Click patterns and navigation paths</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Cookies and Tracking Technologies</h3>
                  <p>
                    We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze site traffic, and understand where our visitors are coming from. For more information, please see our Cookie Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
                <CardDescription>The purposes for which we process your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>Provide, operate, and maintain our website and services</li>
                  <li>Process and manage your account and content submissions</li>
                  <li>Send you newsletters, updates, and promotional materials (with your consent)</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Analyze usage patterns to improve our content and user experience</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations and enforce our terms of service</li>
                  <li>Personalize your experience and deliver targeted content</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Share Your Information</CardTitle>
                <CardDescription>Third parties with whom we may share your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We may share your information with:</p>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Service Providers</h3>
                  <p>
                    We may share your information with third-party service providers who perform services on our behalf, such as hosting providers, analytics services, email delivery services, and payment processors.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Business Transfers</h3>
                  <p>
                    If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Legal Requirements</h3>
                  <p>
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders or government agencies).
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">With Your Consent</h3>
                  <p>
                    We may share your information for any other purpose with your explicit consent.
                  </p>
                </div>

                <p className="font-semibold text-foreground">
                  We do not sell your personal information to third parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Restricted access to personal information on a need-to-know basis</li>
                  <li>Secure authentication and access controls</li>
                </ul>
                <p>
                  However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
                <CardDescription>Rights you have regarding your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
                  <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where consent is the legal basis</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at privacy@stepperslife.com. We will respond to your request within 30 days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
                <p>
                  Specific retention periods depend on the type of information and the purposes for which we use it:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>Account information: Retained while your account is active</li>
                  <li>Published content: Retained indefinitely unless you request deletion</li>
                  <li>Analytics data: Typically retained for 26 months</li>
                  <li>Email communications: Retained until you unsubscribe</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@stepperslife.com, and we will delete such information from our systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction.
                </p>
                <p>
                  If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including personal information, to the United States and process it there. By submitting your information, you consent to this transfer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our website may contain links to third-party websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of our services after any modifications indicates your acceptance of the updated Privacy Policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p><strong>Email:</strong> privacy@stepperslife.com</p>
                  <p><strong>Mailing Address:</strong> SteppersLife Magazine, Attn: Privacy Officer</p>
                  <p><strong>Contact Form:</strong> Available at /contact</p>
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
