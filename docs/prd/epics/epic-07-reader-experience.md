# Epic 7: Reader Experience - Public Site

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Article Management Dashboard ←](epic-06-article-dashboard.md) | [Next Epic: Category & Tag Management →](epic-08-category-tags.md)

---

## Epic Goal

Implement the complete public-facing reader experience including homepage with hero featured article and article grid, article detail pages with optimized typography and lazy-loaded images, category landing pages, author profile pages, responsive navigation with mobile hamburger menu, and SEO optimization with meta tags and structured data. Deliver a premium, fast-loading magazine reading experience that celebrates content and engages readers across all devices.

**Stories:** 10 | **Dependencies:** Epic 3 (Content Model), Epic 4 (Media Management)

---

## Story 7.1: Build Homepage with Hero Section and Article Grid

**As a** reader,
**I want** a visually appealing homepage showcasing featured and latest articles,
**so that** I can discover compelling content immediately upon visiting the site.

### Acceptance Criteria

1. Homepage created at `app/(reader)/page.tsx`
2. Hero section displays featured article: Large featured image (full-width), title overlay, category badge, author, excerpt
3. Featured article determined by: Latest published OR manually pinned (future: add "featured" flag to article schema)
4. Article grid below hero: 6-12 latest published articles (excluding featured)
5. Article cards display: Thumbnail, title, excerpt, author with avatar, category badge, published date, read time estimate
6. Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
7. Pagination: "Load more" button or numbered pagination (20 articles per page)
8. Homepage fetches data server-side (SSR) for SEO and fast initial load
9. Hover effects on article cards (subtle lift, shadow)
10. Responsive design with design system styling

---

## Story 7.2: Build Article Detail Page with Block Rendering

**As a** reader,
**I want** to read articles with beautiful typography and optimal layout,
**so that** I have an immersive, distraction-free reading experience.

### Acceptance Criteria

1. Article page created at `app/(reader)/[slug]/page.tsx`
2. Article header: Category badge, title (H1, serif, large), subtitle, author byline (name, avatar, bio snippet), published date, read time
3. Featured image displayed below header (full-width, caption, credit)
4. Article body renders all block types: Heading, Paragraph, Image, Quote, List, Divider
5. Typography optimized: Serif for body text, line-height 1.7, max-width 720px
6. Images lazy-loaded with loading="lazy" attribute
7. Image layouts respected: Full-width, centered, float-left, float-right
8. Quotes styled prominently with large text and accent color
9. Code blocks syntax-highlighted (if code block added later)
10. Responsive: Single-column on mobile, optimal reading on all devices
11. Server-side rendering (SSR) for SEO
12. 404 page if article slug not found

---

## Story 7.3: Implement Article View Tracking

**As a** product manager,
**I want** article views automatically tracked when readers load an article,
**so that** we can measure content popularity and engagement.

### Acceptance Criteria

1. Article page calls `POST /api/articles/[id]/view` on mount (client-side)
2. View tracking only counts once per user per hour (rate limited by IP/session)
3. View tracking uses cookie or localStorage to track viewed articles
4. View count incremented atomically in database
5. View tracking works in production (not counted in preview mode)
6. View tracking doesn't block page render (fire-and-forget)
7. View tracking respects DNT (Do Not Track) header
8. Popular articles query uses view count for sorting

---

## Story 7.4: Build Category Landing Pages

**As a** reader,
**I want** dedicated pages for each category showing all related articles,
**so that** I can explore content by topic of interest.

### Acceptance Criteria

1. Category page created at `app/(reader)/category/[slug]/page.tsx`
2. Page header: Category name (H1), description (if set), featured image (hero)
3. Article grid: All published articles in category, sorted by published date (newest first)
4. Article cards same format as homepage
5. Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
6. Pagination: 20 articles per page
7. Empty state if category has no published articles: "No articles in this category yet"
8. Breadcrumb navigation: Home > Category Name
9. Server-side rendering (SSR) for SEO
10. 404 page if category slug not found

---

## Story 7.5: Build Author Profile Pages

**As a** reader,
**I want** to view an author's profile and all their published articles,
**so that** I can follow writers I enjoy and discover more of their work.

### Acceptance Criteria

1. Author page created at `app/(reader)/author/[id]/page.tsx`
2. Author header: Avatar (large), name (H1), bio, social media links (Twitter, Instagram, LinkedIn icons)
3. Article count: "X articles by [Author Name]"
4. Article grid: All published articles by author, sorted by published date (newest first)
5. Article cards same format as homepage
6. Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
7. Pagination: 20 articles per page
8. Empty state if author has no published articles: "No published articles yet"
9. Breadcrumb navigation: Home > Authors > Author Name
10. Server-side rendering (SSR)

---

## Story 7.6: Build Responsive Navigation Header

**As a** reader,
**I want** consistent navigation across all pages,
**so that** I can easily access different sections of the magazine.

### Acceptance Criteria

1. Navigation component created at `/components/shared/navbar.tsx`
2. Sticky header (remains at top on scroll)
3. Logo/site name on left (links to homepage)
4. Navigation links: Home, Categories (dropdown), About
5. Categories dropdown shows all categories with article counts
6. Search icon placeholder (search deferred to post-MVP)
7. Mobile: Hamburger menu icon (≤768px)
8. Mobile menu: Slide-in drawer with navigation links, close button
9. Desktop: Horizontal nav bar with dropdowns
10. Header uses design system colors (background, text, accent)
11. Accessible: Keyboard navigation, ARIA labels, focus indicators

---

## Story 7.7: Build Site Footer

**As a** reader,
**I want** a footer with important links and site information,
**so that** I can access legal pages, social media, and additional resources.

### Acceptance Criteria

1. Footer component created at `/components/shared/footer.tsx`
2. Footer sections: About (site description), Categories (links to all categories), Social (icon links), Legal (Privacy, Terms)
3. Copyright notice: "© 2025 [Magazine Name]. All rights reserved."
4. Newsletter signup form (placeholder: "Coming soon")
5. Footer background matches design system (dark theme or light with border)
6. Footer responsive: Stacks vertically on mobile
7. Social icons: Twitter, Instagram, Facebook, LinkedIn (configurable)
8. Accessible: Proper heading hierarchy, link labels

---

## Story 7.8: Implement SEO Meta Tags and Open Graph

**As a** marketer,
**I want** comprehensive SEO meta tags on all pages,
**so that** articles are discoverable via search engines and share beautifully on social media.

### Acceptance Criteria

1. Meta tags component created at `/components/shared/seo-meta.tsx`
2. Article pages include: title, description, canonical URL, author, published date, modified date
3. Open Graph tags: og:title, og:description, og:image (featured image), og:url, og:type (article)
4. Twitter Card tags: twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image
5. Homepage includes: site title, description, logo as og:image
6. Category pages include: category name, description, image
7. Author pages include: author name, bio, avatar
8. Meta tags use article SEO fields if set, fallback to defaults
9. All images use absolute URLs for Open Graph
10. Validate tags with Facebook Debugger and Twitter Card Validator

---

## Story 7.9: Implement Schema.org Structured Data

**As a** marketer,
**I want** Schema.org structured data on all pages,
**so that** search engines can understand and display rich snippets for our content.

### Acceptance Criteria

1. JSON-LD structured data component created
2. Article pages include Article schema: headline, description, image, datePublished, dateModified, author (Person), publisher (Organization)
3. Homepage includes Organization schema: name, logo, url, sameAs (social media)
4. Author pages include Person schema: name, image, description, sameAs (social links)
5. Category pages include CollectionPage schema
6. Breadcrumb structured data on all pages
7. Validate structured data with Google Rich Results Test
8. Schema rendered in <script type="application/ld+json"> tags in <head>

---

## Story 7.10: Generate Dynamic Sitemap and Robots.txt

**As a** marketer,
**I want** an automatically updated sitemap and robots.txt,
**so that** search engines can efficiently crawl and index all published content.

### Acceptance Criteria

1. Sitemap generated at `/sitemap.xml` route
2. Sitemap includes: Homepage, all published articles, all category pages, all author pages
3. Sitemap dynamically updates as articles published/unpublished
4. Sitemap follows XML sitemap protocol (lastmod, changefreq, priority)
5. Articles have priority 0.8, categories 0.6, authors 0.5, homepage 1.0
6. Sitemap split into multiple files if >50,000 URLs (unlikely for MVP)
7. Robots.txt created at `/robots.txt`: Allow all, reference sitemap
8. Robots.txt blocks: /admin/_, /api/_, /preview/\*
9. Sitemap regenerated on-demand or cached (invalidate on publish)
10. Sitemap submitted to Google Search Console and Bing Webmaster Tools

---

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Article Management Dashboard ←](epic-06-article-dashboard.md) | [Next Epic: Category & Tag Management →](epic-08-category-tags.md)
