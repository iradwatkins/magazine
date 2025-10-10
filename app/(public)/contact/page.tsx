'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    try {
      // In a real application, you would send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold px-4 py-1 text-black">Contact</Badge>
              <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Get in Touch</h1>
              <p className="text-lg text-muted-foreground">
                Have a question, story idea, or just want to say hello? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Information */}
              <div className="space-y-6 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Multiple ways to reach our team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Mail className="h-5 w-5 text-gold" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          info@stepperslife.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Phone className="h-5 w-5 text-gold" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-sm text-muted-foreground">
                          Available Monday - Friday
                          <br />
                          9:00 AM - 6:00 PM EST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <MapPin className="h-5 w-5 text-gold" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-sm text-muted-foreground">
                          SteppersLife Magazine
                          <br />
                          United States
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold">Editorial</h4>
                      <p className="text-muted-foreground">editorial@stepperslife.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Advertising</h4>
                      <p className="text-muted-foreground">ads@stepperslife.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Press Inquiries</h4>
                      <p className="text-muted-foreground">press@stepperslife.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Technical Support</h4>
                      <p className="text-muted-foreground">support@stepperslife.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gold/20 bg-gold/5">
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate "Urgent" in your subject line.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="editorial">Editorial / Story Submission</SelectItem>
                            <SelectItem value="advertising">Advertising</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="press">Press Inquiry</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Brief description of your inquiry"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={8}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="resize-none"
                        />
                      </div>

                      {submitStatus === 'success' && (
                        <div className="rounded-lg bg-green-500/10 p-4 text-green-700 dark:text-green-400">
                          <p className="font-semibold">Message sent successfully!</p>
                          <p className="text-sm">
                            Thank you for contacting us. We'll get back to you soon.
                          </p>
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="rounded-lg bg-red-500/10 p-4 text-red-700 dark:text-red-400">
                          <p className="font-semibold">Something went wrong</p>
                          <p className="text-sm">
                            Please try again or email us directly at info@stepperslife.com
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          * Required fields
                        </p>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gold text-black hover:bg-gold/90"
                        >
                          {isSubmitting ? (
                            <>Sending...</>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Quick answers to common questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-semibold">How do I submit an article?</h3>
                      <p className="text-sm text-muted-foreground">
                        Visit our <span className="text-gold">Write for Us</span> page to learn about our submission process and contributor guidelines. You can also email editorial@stepperslife.com with your pitch.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">How can I advertise with SteppersLife Magazine?</h3>
                      <p className="text-sm text-muted-foreground">
                        Check out our <span className="text-gold">Advertise</span> page for information about advertising opportunities and packages, or contact ads@stepperslife.com directly.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">I found an error in an article. How do I report it?</h3>
                      <p className="text-sm text-muted-foreground">
                        We take accuracy seriously. Please email editorial@stepperslife.com with the article URL and details about the error, and we'll review and correct it promptly.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">Can I republish SteppersLife content?</h3>
                      <p className="text-sm text-muted-foreground">
                        Most of our content is copyrighted. Please contact editorial@stepperslife.com with your request for permission to republish or license content.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">How do I unsubscribe from emails?</h3>
                      <p className="text-sm text-muted-foreground">
                        Every email we send includes an unsubscribe link at the bottom. Click it to manage your subscription preferences. For assistance, contact support@stepperslife.com.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
