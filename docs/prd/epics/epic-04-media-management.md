# Epic 4: Media Management & MinIO Integration

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Content Model & Database Layer ←](epic-03-content-model.md) | [Next Epic: Drag-and-Drop Article Editor →](epic-05-article-editor.md)

---

## Epic Goal

Build a complete media management system with drag-and-drop upload to MinIO, automatic image optimization, a browsable media library with grid view, search and filter capabilities, and seamless integration with the article editor. Enable creators to upload, organize, and reuse media assets efficiently across all articles.

**Stories:** 10 | **Dependencies:** Epic 1 (Foundation & Setup)

---

## Story 4.1: Define Media Schema and Create Database Migration

**As a** developer,
**I want** to define the Media data model for tracking uploaded files,
**so that** we have a structured database of all media assets with metadata.

### Acceptance Criteria

1. Media schema defined in `/db/schema.ts` with fields: id (UUID), filename, url (R2 public URL), thumbnailUrl, mimeType, size (bytes), width, height, alt, caption, credit, uploadedBy (FK to users), createdAt
2. Foreign key constraint: uploadedBy references users.id
3. Indexes created: uploadedBy, mimeType, createdAt
4. Database migration generated and applied
5. Media type exported for TypeScript usage
6. Supported MIME types documented: image/jpeg, image/png, image/gif, image/webp
7. Maximum file size documented (e.g., 10MB per image)
8. Schema includes metadata for image dimensions (width, height)

---

## Story 4.2: Implement File Upload API Endpoint with MinIO Storage

**As a** developer,
**I want** an API endpoint that accepts file uploads and stores them in MinIO,
**so that** users can upload images securely with proper validation.

### Acceptance Criteria

1. `POST /api/media/upload` endpoint accepts multipart/form-data
2. File validation: type (JPEG, PNG, GIF, WebP), size (max 10MB)
3. File sanitization: remove EXIF data, validate image integrity
4. Generate unique filename: `{uuid}.{extension}`
5. Upload file to MinIO bucket with proper ACL (public-read)
6. Extract image dimensions using image processing library
7. Store media record in PostgreSQL database with all metadata
8. Return media object: `{ id, url, thumbnailUrl, filename, size, width, height }`
9. Authenticated users only (author+ role)
10. Error handling: file too large, invalid type, upload failure

---

## Story 4.3: Implement Automatic Image Optimization and Thumbnail Generation

**As a** developer,
**I want** automatic image optimization and thumbnail generation on upload,
**so that** images load quickly and efficiently across different contexts (thumbnails, full-size).

### Acceptance Criteria

1. Original image uploaded to R2 at full resolution
2. Thumbnail generated (e.g., 400x300px) and uploaded to R2
3. Sharp image processing configured for on-demand image variants
4. Image optimization: compress, convert to WebP if browser supports
5. Thumbnail URL stored in database: `thumbnailUrl`
6. Image URLs use Nginx reverse proxy for global delivery
7. Lazy loading attributes added to img tags (`loading="lazy"`)
8. Alt text required for accessibility (enforced in upload form)

---

## Story 4.4: Create Media Library Grid View UI

**As a** content creator,
**I want** a visual media library showing all uploaded images in a grid,
**so that** I can browse, search, and select images for my articles.

### Acceptance Criteria

1. Media library page created at `app/(admin)/media/page.tsx`
2. Grid view displays image thumbnails with filename, size, upload date
3. Hover on image shows: alt text, dimensions, caption
4. Click on image opens detail modal with full metadata
5. Responsive grid: 4 columns desktop, 2 columns tablet, 1 column mobile
6. Infinite scroll or pagination (24 images per page)
7. Loading skeleton while images load
8. Empty state message if no media uploaded
9. Authenticated users only (author+ role)

---

## Story 4.5: Implement Media Library Search and Filtering

**As a** content creator,
**I want** to search and filter the media library,
**so that** I can quickly find specific images among hundreds of uploads.

### Acceptance Criteria

1. Search input filters by filename, alt text, caption
2. Filter dropdown: Image type (JPEG, PNG, GIF, WebP, All)
3. Filter dropdown: Uploaded by (user dropdown, "My uploads", All)
4. Sort options: Newest first, Oldest first, Filename A-Z, Largest size
5. Search updates URL query parameters (shareable filtered views)
6. Debounced search (300ms delay to avoid excessive queries)
7. Search results update grid in real-time
8. Clear filters button resets all filters and search
9. Filter state persists across page navigation

---

## Story 4.6: Implement Drag-and-Drop Upload Interface

**As a** content creator,
**I want** to drag and drop images directly into the media library,
**so that** uploading multiple images is fast and intuitive.

### Acceptance Criteria

1. Drag-and-drop zone in media library page
2. Drop zone highlights on drag-over
3. Multiple file selection supported
4. Upload progress bar for each file
5. Uploads happen in parallel (max 3 concurrent)
6. Success toast notification after upload completes
7. Newly uploaded images appear immediately in grid
8. Error toast for failed uploads with retry button
9. Drag-and-drop works on desktop and tablet
10. Fallback file input button for mobile/accessibility

---

## Story 4.7: Build Media Detail Modal with Edit Capabilities

**As a** content creator,
**I want** to view and edit media metadata in a modal,
**so that** I can update alt text, captions, and credits for uploaded images.

### Acceptance Criteria

1. Click on media thumbnail opens detail modal
2. Modal displays: full-size image, filename, dimensions, size, upload date, uploader
3. Editable fields: alt text (required), caption, credit
4. Save button updates media record via `PUT /api/media/[id]`
5. Delete button removes media from R2 and database (with confirmation)
6. Copy URL button copies R2 public URL to clipboard
7. Modal keyboard navigation: ESC to close, Tab to navigate fields
8. Modal accessible (ARIA labels, focus trap)
9. Changes reflect immediately in media library grid

---

## Story 4.8: Implement Media Selection Modal for Editor

**As a** content creator,
**I want** to select images from the media library when adding image blocks to articles,
**so that** I can reuse existing images without re-uploading.

### Acceptance Criteria

1. Media selection modal component created
2. Modal triggered from image block in editor ("Select from library" button)
3. Modal displays media library grid (same as media library page)
4. Search and filter functionality available in modal
5. Click on image selects it and returns URL to image block
6. "Upload new" tab in modal allows direct upload without leaving editor
7. Selected image automatically populates image block with URL, alt text, caption
8. Modal closeable via ESC key or close button
9. Modal responsive on all screen sizes

---

## Story 4.9: Implement Media Usage Tracking

**As an** admin,
**I want** to see which articles use each media asset,
**so that** I can safely delete unused media and avoid breaking articles.

### Acceptance Criteria

1. Media detail modal shows "Used in" section with article list
2. Query finds all articles containing image URL in block data (JSON search)
3. Article list displays: title, author, status, link to edit
4. Delete button disabled if media is in use (with warning message)
5. "Force delete" option for admins (with strong confirmation warning)
6. Orphaned media report: `GET /api/media/orphaned` lists media not used in any article
7. Bulk delete action for orphaned media (admin only)
8. Media usage count displayed in grid view

---

## Story 4.10: Implement MinIO Storage Cleanup and Quota Management

**As a** developer,
**I want** automated cleanup of deleted media and storage quota monitoring,
**so that** we don't accumulate orphaned files or exceed storage limits.

### Acceptance Criteria

1. Soft delete media: sets `deletedAt` timestamp instead of immediate removal
2. Background job (cron or manual) permanently deletes media marked deleted for >30 days
3. R2 cleanup removes both original and thumbnail files
4. Storage quota API: `GET /api/admin/storage` returns total used, file count, quota limit
5. Storage quota displayed in admin dashboard
6. Warning notification when storage reaches 80% capacity
7. Admin can manually trigger cleanup of orphaned R2 files (files in R2 not in database)
8. Cleanup logs activity to admin activity log

---

[← Back to Epic List](../05-epic-list.md) | [Previous Epic: Content Model & Database Layer ←](epic-03-content-model.md) | [Next Epic: Drag-and-Drop Article Editor →](epic-05-article-editor.md)
