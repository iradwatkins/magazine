import { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Terms of Service - SteppersLife Magazine',
  description: 'Read the terms and conditions for using SteppersLife Magazine services.',
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Legal</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Terms of Service</h1>
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
                <CardTitle>Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Welcome to SteppersLife Magazine. These Terms of Service ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                </p>
                <p>
                  If you do not agree to these Terms, you may not access or use our Services. We reserve the right to update these Terms at any time, and your continued use of the Services constitutes acceptance of any changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  You must be at least 13 years old to use our Services. If you are under 18, you must have permission from a parent or legal guardian. By using our Services, you represent and warrant that you meet these eligibility requirements.
                </p>
                <p>
                  If you are using our Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>Account registration and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Account Creation</h3>
                  <p>
                    To access certain features of our Services, you may need to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Account Security</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
                  </p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>Use a strong, unique password</li>
                    <li>Not share your account credentials with others</li>
                    <li>Notify us immediately of any unauthorized access or security breach</li>
                    <li>Log out of your account at the end of each session</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Account Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate your account at any time for any reason, including violation of these Terms. You may also delete your account at any time through your account settings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Content</CardTitle>
                <CardDescription>Content you submit to our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Content Ownership</h3>
                  <p>
                    You retain all rights to the content you submit to SteppersLife Magazine ("User Content"), including articles, comments, images, and other materials. However, by submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with our Services.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Content Standards</h3>
                  <p>You agree that your User Content will not:</p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>Violate any third-party rights, including copyrights, trademarks, or privacy rights</li>
                    <li>Contain hate speech, harassment, or discriminatory content</li>
                    <li>Include false, misleading, or defamatory statements</li>
                    <li>Promote illegal activities or violence</li>
                    <li>Contain spam, malware, or malicious code</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Be sexually explicit or obscene (unless properly labeled and age-restricted)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Content Moderation</h3>
                  <p>
                    We reserve the right, but have no obligation, to monitor, review, edit, or remove User Content that violates these Terms or is otherwise objectionable. We may remove content without notice and at our sole discretion.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Representations and Warranties</h3>
                  <p>
                    By submitting User Content, you represent and warrant that:
                  </p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>You own or have the necessary rights to submit the content</li>
                    <li>The content does not violate any laws or third-party rights</li>
                    <li>The content is accurate and not misleading</li>
                    <li>You have obtained all necessary permissions and releases</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  The Services and all content, features, and functionality (excluding User Content) are owned by SteppersLife Magazine and are protected by United States and international copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  Our trademarks, logos, and service marks (collectively, the "SteppersLife Marks") may not be used without our prior written permission. All other trademarks, logos, and service marks appearing on our Services are the property of their respective owners.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, or publicly perform any content from our Services without our express written permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prohibited Conduct</CardTitle>
                <CardDescription>Activities that are not allowed on our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You agree not to:</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>Use the Services for any illegal purpose or in violation of any laws</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Impersonate any person or entity or falsely represent your affiliation</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Use automated tools (bots, scrapers, crawlers) without permission</li>
                  <li>Interfere with or disrupt the Services or servers</li>
                  <li>Circumvent any security measures or access controls</li>
                  <li>Collect or harvest user information without consent</li>
                  <li>Engage in any fraudulent or deceptive practices</li>
                  <li>Upload viruses, malware, or other harmful code</li>
                  <li>Use the Services to send unsolicited communications (spam)</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Copyright Infringement</CardTitle>
                <CardDescription>DMCA and copyright protection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We respect the intellectual property rights of others and expect our users to do the same. We will respond to notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA).
                </p>
                <p>
                  If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>Identification of the material that is claimed to be infringing</li>
                  <li>Your contact information (address, telephone number, email)</li>
                  <li>A statement that you have a good faith belief that the use is not authorized</li>
                  <li>A statement that the information is accurate and you are authorized to act on behalf of the owner</li>
                </ul>
                <p className="mt-4">
                  Copyright notices should be sent to: copyright@stepperslife.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services and Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our Services may contain links to third-party websites, applications, or services that are not owned or controlled by SteppersLife Magazine. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party services.
                </p>
                <p>
                  You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by your use of any third-party services. We strongly advise you to read the terms and privacy policies of any third-party services you visit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclaimers and Limitations of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Disclaimer of Warranties</h3>
                  <p>
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
                  </p>
                  <p className="mt-2">
                    We do not warrant that the Services will be uninterrupted, secure, or error-free, or that any defects will be corrected. We make no warranties about the accuracy, reliability, or completeness of any content on the Services.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Limitation of Liability</h3>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, STEPPERSLIFE MAGAZINE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                  <p className="mt-2">
                    OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICES SHALL NOT EXCEED $100 USD OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS, WHICHEVER IS GREATER.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  You agree to defend, indemnify, and hold harmless SteppersLife Magazine, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>Your access to or use of the Services</li>
                  <li>Your User Content</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Governing Law</h3>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Arbitration Agreement</h3>
                  <p>
                    Any dispute arising from or relating to these Terms or the Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in the United States, and judgment on the arbitration award may be entered in any court having jurisdiction.
                  </p>
                  <p className="mt-2">
                    YOU AGREE TO WAIVE YOUR RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN A CLASS ACTION LAWSUIT.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Provisions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Entire Agreement</h3>
                  <p>
                    These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and SteppersLife Magazine regarding the Services.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Severability</h3>
                  <p>
                    If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Waiver</h3>
                  <p>
                    Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Assignment</h3>
                  <p>
                    You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p><strong>Email:</strong> legal@stepperslife.com</p>
                  <p><strong>Mailing Address:</strong> SteppersLife Magazine, Attn: Legal Department</p>
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
