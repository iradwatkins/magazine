-- Migration script to add magazine tables to main stepperslife database
-- This preserves all existing data

-- Create enum types for magazine
DO $$ BEGIN
    CREATE TYPE "ArticleCategory" AS ENUM (
        'NEWS',
        'EVENTS',
        'INTERVIEWS',
        'HISTORY',
        'TUTORIALS',
        'LIFESTYLE',
        'FASHION',
        'MUSIC',
        'COMMUNITY',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ArticleStatus" AS ENUM (
        'DRAFT',
        'SUBMITTED',
        'APPROVED',
        'PUBLISHED',
        'REJECTED',
        'ARCHIVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id text NOT NULL,
    "authorId" text NOT NULL,
    "authorName" text NOT NULL,
    "authorPhoto" text,
    "authorBio" text,
    title text NOT NULL,
    slug text NOT NULL,
    subtitle text,
    content text NOT NULL,
    excerpt text,
    "featuredImage" text,
    images text[],
    category "ArticleCategory" NOT NULL,
    tags text[],
    "metaTitle" text,
    "metaDescription" text,
    status "ArticleStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone,
    "reviewNotes" text,
    "publishedAt" timestamp(3) without time zone,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "featuredUntil" timestamp(3) without time zone,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "likeCount" integer DEFAULT 0 NOT NULL,
    "shareCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT articles_pkey PRIMARY KEY (id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id text NOT NULL,
    "articleId" text NOT NULL,
    "userId" text NOT NULL,
    "userName" text NOT NULL,
    "userPhoto" text,
    content text NOT NULL,
    "parentId" text,
    status text DEFAULT 'PENDING' NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT comments_pkey PRIMARY KEY (id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    color text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Create writer_profiles table
CREATE TABLE IF NOT EXISTS writer_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    "displayName" text NOT NULL,
    slug text NOT NULL,
    bio text,
    "photoUrl" text,
    "instagramUrl" text,
    "twitterUrl" text,
    "websiteUrl" text,
    "isApproved" boolean DEFAULT false NOT NULL,
    "totalArticles" integer DEFAULT 0 NOT NULL,
    "totalViews" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT writer_profiles_pkey PRIMARY KEY (id)
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
    id text NOT NULL,
    filename text NOT NULL,
    "originalName" text NOT NULL,
    url text NOT NULL,
    "thumbnailUrl" text,
    "mimeType" text NOT NULL,
    size integer NOT NULL,
    width integer,
    height integer,
    alt text,
    caption text,
    credit text,
    "bucketKey" text NOT NULL,
    "uploadedById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT media_pkey PRIMARY KEY (id)
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_key ON articles USING btree (slug);
CREATE INDEX IF NOT EXISTS "articles_authorId_idx" ON articles USING btree ("authorId");
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles USING btree (category);
CREATE INDEX IF NOT EXISTS "articles_publishedAt_idx" ON articles USING btree ("publishedAt");
CREATE INDEX IF NOT EXISTS "articles_reviewedBy_idx" ON articles USING btree ("reviewedBy");
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles USING btree (status);

CREATE UNIQUE INDEX IF NOT EXISTS categories_name_key ON categories USING btree (name);
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON categories USING btree (slug);

CREATE INDEX IF NOT EXISTS "comments_articleId_idx" ON comments USING btree ("articleId");
CREATE INDEX IF NOT EXISTS "comments_userId_idx" ON comments USING btree ("userId");

CREATE INDEX IF NOT EXISTS "media_createdAt_idx" ON media USING btree ("createdAt");
CREATE INDEX IF NOT EXISTS "media_mimeType_idx" ON media USING btree ("mimeType");
CREATE INDEX IF NOT EXISTS "media_uploadedById_idx" ON media USING btree ("uploadedById");

CREATE UNIQUE INDEX IF NOT EXISTS writer_profiles_slug_key ON writer_profiles USING btree (slug);
CREATE INDEX IF NOT EXISTS "writer_profiles_userId_idx" ON writer_profiles USING btree ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "writer_profiles_userId_key" ON writer_profiles USING btree ("userId");

-- Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE articles ADD CONSTRAINT "articles_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE articles ADD CONSTRAINT "articles_reviewedBy_fkey"
        FOREIGN KEY ("reviewedBy") REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE comments ADD CONSTRAINT "comments_articleId_fkey"
        FOREIGN KEY ("articleId") REFERENCES articles(id) ON UPDATE CASCADE ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE comments ADD CONSTRAINT "comments_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE comments ADD CONSTRAINT "comments_parentId_fkey"
        FOREIGN KEY ("parentId") REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE writer_profiles ADD CONSTRAINT "writer_profiles_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE media ADD CONSTRAINT "media_uploadedById_fkey"
        FOREIGN KEY ("uploadedById") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Done!
SELECT 'Magazine tables successfully added to main database!' as message;
