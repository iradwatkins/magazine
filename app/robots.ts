/**
 * Robots.txt Configuration (Story 9.8)
 *
 * Defines crawling rules for search engines
 * Allows all bots to index the site and points to sitemap
 *
 * Route: /robots.txt
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magazine.stepperslife.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/editor/',
          '/preview/',
          '/media/',
          '/comments/moderate/',
          '/writers/',
          '/auth/',
          '/sign-in',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
