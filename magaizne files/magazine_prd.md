# Product Requirements Document (PRD)

## Online Magazine Platform with Drag-and-Drop Editor

**Version:** 1.0  
**Last Updated:** October 2025  
**Product Owner:** [Your Name]  
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Vision

Create a modern, sophisticated online magazine platform that empowers content creators to design and publish editorial-quality articles using an intuitive drag-and-drop interface. The platform will celebrate Black culture, excellence, and storytelling while providing professional-grade publishing tools.

### 1.2 Product Goals

- Enable non-technical users to create stunning magazine-quality articles
- Provide a rich, intuitive drag-and-drop content editor
- Deliver a premium reading experience across all devices
- Build a scalable CMS for managing multiple articles, authors, and categories
- Support multimedia content (images, videos, audio, embeds)

### 1.3 Success Metrics

- Time to publish first article: < 30 minutes
- Editor satisfaction score: > 4.5/5
- Page load time: < 2 seconds
- Mobile responsiveness score: 100%
- Monthly active creators: 500+ (Year 1)
- Published articles per month: 200+ (Year 1)

---

## 2. User Personas

### 2.1 Content Creator (Primary)

**Name:** Maya, Magazine Editor  
**Age:** 32  
**Background:** Former print magazine editor, transitioning to digital  
**Goals:**

- Create visually stunning articles quickly
- Maintain editorial quality and brand consistency
- Collaborate with writers and photographers
- Schedule and manage content calendar

**Pain Points:**

- Complex CMSs require technical knowledge
- Limited design flexibility in traditional platforms
- Difficult to preview exactly how articles will look
- Time-consuming to format multimedia content

### 2.2 Writer/Contributor

**Name:** James, Freelance Writer  
**Age:** 28  
**Background:** Journalist covering culture and entertainment  
**Goals:**

- Focus on writing, not technical formatting
- Easily embed research and multimedia sources
- Track article performance and engagement
- Build personal portfolio

### 2.3 Reader

**Name:** Aisha, Professional  
**Age:** 35  
**Background:** Works in marketing, reads during commute  
**Goals:**

- Consume quality content on mobile and desktop
- Discover new stories and perspectives
- Engage with content (share, comment, save)
- Fast loading, distraction-free reading

---

## 3. Feature Requirements

### 3.1 Drag-and-Drop Article Editor (MVP - Priority 1)

#### 3.1.1 Core Content Blocks

All blocks should be draggable, reorderable, and deletable.

**Text Blocks:**

- **Heading** (H1, H2, H3, H4, H5, H6)
  - Customizable font size, color, alignment
  - Bold, italic, underline formatting
- **Paragraph**
  - Rich text formatting toolbar
  - Font family selection (Serif, Sans-serif)
  - Line height and letter spacing controls
  - Alignment (left, center, right, justify)
- **Quote Block**
  - Pullquote style with large text
  - Attribution field for source/author
  - Accent color customization
- **List Block**
  - Bulleted lists
  - Numbered lists
  - Nested list support

**Media Blocks:**

- **Image Block**
  - Drag-and-drop image upload
  - URL import
  - Caption and credit fields
  - Size options: Full-width, Centered, Float left/right
  - Alt text for accessibility
  - Lazy loading support
- **Image Gallery**
  - Multiple images in carousel or grid
  - Lightbox functionality
  - Caption support per image
- **Video Block**
  - YouTube embed (paste URL)
  - Vimeo embed
  - Self-hosted video upload
  - Thumbnail selection
  - Caption field
- **Audio Block**
  - SoundCloud embed
  - Spotify embed
  - Self-hosted audio upload
  - Custom player styling

**Embed Blocks:**

- **Social Media Embeds**
  - Twitter/X posts
  - Instagram posts
  - Facebook posts
  - TikTok videos
- **Interactive Content**
  - PDF viewer
  - Maps (Google Maps embed)
  - Infographics
  - Forms/Surveys

**Layout Blocks:**

- **Divider**
  - Horizontal line with style options
- **Spacer**
  - Adjustable vertical spacing
- **Column Layout**
  - 2-column, 3-column options
  - Responsive stacking on mobile

- **Call-to-Action (CTA)**
  - Button with link
  - Styled box with text + button
  - Newsletter signup integration

#### 3.1.2 Editor Interface Features

- **Sidebar Panel**
  - Block library with search
  - Drag blocks into canvas
  - Recently used blocks
- **Block Controls**
  - Drag handle for reordering
  - Settings gear icon
  - Delete button
  - Duplicate button
- **Formatting Toolbar**
  - Appears on text selection
  - Bold, italic, underline, strikethrough
  - Link insertion
  - Text color and highlight
- **Inspector Panel**
  - Block-specific settings
  - Style customization
  - Advanced options
- **Top Toolbar**
  - Save draft
  - Preview
  - Publish
  - Settings
  - Undo/Redo

#### 3.1.3 Article Settings

- **Basic Info**
  - Title (required)
  - Subtitle/Excerpt
  - Author selection (dropdown)
  - Category (Culture, Style, Beauty, etc.)
  - Tags
  - Publication date/time
  - Status (Draft, Scheduled, Published)
- **Featured Image**
  - Hero image upload
  - Caption and credit
  - Focal point selection
- **SEO Settings**
  - Meta title
  - Meta description
  - Open Graph image
  - Canonical URL
- **Display Options**
  - Show/hide author bio
  - Show/hide related articles
  - Show/hide comments
  - Layout template selection

### 3.2 Content Management System (Priority 1)

#### 3.2.1 Article Management

- **Article List View**
  - Searchable and filterable
  - Sort by date, status, author, category
  - Bulk actions (delete, change status)
  - Quick edit inline
- **Article Actions**
  - Create new article
  - Edit existing article
  - Duplicate article as template
  - Move to trash
  - View published URL
- **Version History**
  - Auto-save every 30 seconds
  - Manual save points
  - View previous versions
  - Restore from history

#### 3.2.2 Media Library

- **Upload Management**
  - Drag-and-drop upload
  - Bulk upload support
  - File type validation (JPEG, PNG, GIF, WebP, MP4, PDF)
  - File size limits (configurable)
  - Automatic image optimization
- **Organization**
  - Folders/Collections
  - Search by filename, tags
  - Filter by type, date
  - Grid and list views
- **Image Editing**
  - Crop and resize
  - Rotate and flip
  - Basic filters
  - Compress/optimize

#### 3.2.3 User Management

- **Roles & Permissions**
  - **Admin**: Full access
  - **Editor**: Create, edit, publish all content
  - **Author**: Create and edit own content, submit for review
  - **Contributor**: Create drafts only
- **User Profiles**
  - Name and bio
  - Profile photo
  - Social media links
  - Email and contact info
- **Team Collaboration**
  - Assign articles to users
  - Editorial workflow (Draft → Review → Published)
  - Comments/notes on articles
  - Activity log

#### 3.2.4 Categories & Tags

- **Category Management**
  - Create/edit/delete categories
  - Category slug (URL-friendly)
  - Category description
  - Featured category image
  - Parent-child relationships
- **Tag System**
  - Auto-suggest existing tags
  - Create new tags on-the-fly
  - Tag management page
  - Merge duplicate tags

### 3.3 Frontend Display (Priority 1)

#### 3.3.1 Homepage

- **Hero Section**
  - Featured article (latest or pinned)
  - Large image with overlay text
  - Category badge
- **Article Grid**
  - Latest articles (6-12 per page)
  - Pagination or infinite scroll
  - Hover effects
- **Category Sections**
  - "Latest in Culture"
  - "Latest in Style"
  - Featured editors' picks
- **Newsletter Signup**
  - Email capture form
  - Prominent placement

#### 3.3.2 Article Page

- **Header**
  - Category badge
  - Article title and subtitle
  - Author byline with photo
  - Publication date and read time
  - Social share buttons
- **Article Body**
  - Clean, readable typography
  - Responsive images
  - Inline media playback
  - Pull quotes highlighted
- **Sidebar** (desktop)
  - Table of contents (auto-generated)
  - Related articles
  - Popular articles
  - Newsletter signup
- **Footer**
  - Author bio section
  - Tags
  - Related articles (if not in sidebar)
  - Comments section
  - Social sharing

#### 3.3.3 Category/Archive Pages

- **Category Landing**
  - Category title and description
  - Featured category article
  - Grid of articles in category
  - Filter and sort options
- **Author Archive**
  - Author bio and photo
  - Grid of all articles by author
  - Social links

#### 3.3.4 Search & Discovery

- **Search Functionality**
  - Full-text search
  - Search suggestions
  - Filter by category, date, author
- **Navigation**
  - Sticky header
  - Dropdown category menus
  - Mobile hamburger menu
- **Recommendation Engine** (Priority 2)
  - "More like this" based on category/tags
  - "Trending now" based on views
  - Personalized recommendations (future)

### 3.4 User Engagement Features (Priority 2)

#### 3.4.1 Social Features

- **Social Sharing**
  - Share to Twitter, Facebook, LinkedIn, WhatsApp
  - Click-to-tweet quotes
  - Copy link button
- **Comments System**
  - Threaded comments
  - User login required
  - Moderation tools
  - Report inappropriate content
- **Reactions**
  - Like/Love button
  - Reaction count display
  - Bookmark/Save for later

#### 3.4.2 Newsletter

- **Email Subscription**
  - Subscribe forms (header, footer, in-article)
  - Double opt-in confirmation
  - Subscription preferences (topics, frequency)
- **Email Campaigns**
  - Weekly digest
  - New article notifications
  - Curated picks
  - Integration with email service (Mailchimp, SendGrid)

#### 3.4.3 Analytics

- **Reader Analytics**
  - Page views per article
  - Unique visitors
  - Average time on page
  - Bounce rate
  - Traffic sources
  - Popular content report
- **User Behavior**
  - Scroll depth
  - Click tracking on CTAs
  - Video play rates
  - Share counts

### 3.5 Technical Requirements (Priority 1)

#### 3.5.1 Performance

- **Speed**
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s
  - Lighthouse score > 90
- **Optimization**
  - Image lazy loading
  - CDN for static assets
  - Code splitting
  - Caching strategy
  - Minification and compression

#### 3.5.2 Responsive Design

- Mobile-first approach
- Breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- Touch-friendly interface
- Optimized images per device

#### 3.5.3 Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast ratios > 4.5:1

#### 3.5.4 SEO

- Clean, semantic URLs
- Meta tags (title, description, OG)
- Schema.org structured data (Article, Person, Organization)
- XML sitemap
- Robots.txt
- Canonical URLs

#### 3.5.5 Security

- HTTPS only
- Content Security Policy headers
- XSS protection
- CSRF tokens
- Rate limiting on API endpoints
- Secure file upload validation
- Regular security audits

---

## 4. Technical Stack Recommendations

### 4.1 Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS with custom design system
- **Drag-and-Drop**: @dnd-kit/core
- **Rich Text Editor**: TipTap (ProseMirror)
- **State Management**: Zustand + React Context
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation

### 4.2 Backend

- **Runtime**: Node.js + Next.js API routes
- **Database**: PostgreSQL (via Cloudflare D1 or Hyperdrive)
- **ORM**: Prisma or Drizzle ORM
- **File Storage**: Cloudflare R2
- **CDN**: Cloudflare CDN
- **Cache**: Cloudflare KV or Redis

### 4.3 Infrastructure

- **Hosting**: Cloudflare Pages or Workers
- **Database**: Cloudflare D1 or Hyperdrive (PostgreSQL)
- **Authentication**: NextAuth.js or Clerk
- **Email**: SendGrid or Resend
- **Analytics**: Google Analytics 4 or Plausible

---

## 5. Design System

### 5.1 Color Palette

**Light Theme:**

- Background: `#ffffff`
- Foreground: `#0f1419`
- Primary: `#1e9df1` (Blue)
- Secondary: `#0f1419` (Dark)
- Accent: `#e3ecf6` (Light Blue)
- Gold/Highlight: `#d4af37` (for premium feel, inspired by Ebony/Jet)
- Muted: `#e5e5e6`
- Border: `#e1eaef`

**Dark Theme:**

- Background: `#000000`
- Foreground: `#e7e9ea`
- Primary: `#1c9cf0` (Blue)
- Card: `#17181c`
- Muted: `#181818`
- Border: `#242628`

### 5.2 Typography

- **Sans-serif**: Open Sans (UI, navigation, metadata)
- **Serif**: Georgia (article body, headlines for editorial feel)
- **Mono**: Menlo (code blocks)

### 5.3 Spacing & Layout

- **Radius**: `1.3rem` (rounded corners)
- **Spacing Scale**: `0.25rem` base unit
- **Max Content Width**: 1200px
- **Article Body Width**: 720px (optimal reading)

---

## 6. User Flows

### 6.1 Creating an Article (Editor)

1. User logs in to admin dashboard
2. Clicks "New Article" button
3. Enters article title
4. Opens drag-and-drop editor
5. Drags blocks from sidebar (heading, paragraph, image, video, etc.)
6. Configures each block (uploads image, embeds video URL, formats text)
7. Reorders blocks by dragging
8. Adds featured image and article settings (category, tags, author)
9. Previews article in new tab
10. Saves as draft or publishes immediately

### 6.2 Reading an Article (Reader)

1. User visits homepage
2. Browses featured articles or navigates by category
3. Clicks on article card
4. Reads article with rich media (images load progressively)
5. Scrolls through embedded videos/audio
6. Clicks social share button
7. Scrolls to related articles at bottom
8. Subscribes to newsletter via inline form

### 6.3 Managing Content (Admin)

1. User logs in to dashboard
2. Views article list with status indicators
3. Filters articles by "Draft" status
4. Selects article to edit
5. Reviews content, makes changes
6. Changes status to "Published"
7. Views analytics dashboard for article performance

---

## 7. Launch Plan

### 7.1 Phase 1: MVP (Months 1-3)

- Core drag-and-drop editor with essential blocks
- Basic article CRUD operations
- User authentication and roles
- Responsive frontend (homepage, article pages)
- Media library with Cloudflare R2
- 50 articles pre-loaded

### 7.2 Phase 2: Enhanced Features (Months 4-6)

- Comments system
- Newsletter integration
- Advanced analytics
- Search functionality
- Social media integration
- 150+ articles

### 7.3 Phase 3: Growth (Months 7-12)

- Recommendation engine
- A/B testing framework
- Mobile apps (iOS/Android)
- Premium content/subscription tier
- API for third-party integrations
- 500+ articles

---

## 8. Success Criteria

### 8.1 Launch Metrics (First 3 Months)

- 10,000 unique visitors/month
- 500 newsletter subscribers
- 100 published articles
- 3+ content creators actively using platform
- < 5% bounce rate on article pages

### 8.2 Growth Metrics (First Year)

- 100,000 unique visitors/month
- 10,000 newsletter subscribers
- 500+ published articles
- 20+ active content creators
- Average 3 minutes time on page

---

## 9. Future Enhancements

### 9.1 Advanced Features (Post-Launch)

- AI-powered content suggestions
- Multi-language support
- Dark mode toggle
- Podcast hosting and players
- Event calendar integration
- Job board
- Community forums
- Mobile app (iOS/Android)
- Progressive Web App (PWA)

### 9.2 Monetization Options

- Display advertising
- Sponsored content
- Premium subscriptions
- E-commerce integration (merch, books)
- Affiliate marketing
- Event ticketing

---

**Document History**

- v1.0 - October 2025 - Initial draft with Cloudflare integration and design system
