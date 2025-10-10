# Epic 4: Media Management & MinIO Integration - QA Test Plan

**QA Agent:** Sarah
**Date:** 2025-10-09
**Epic:** Epic 4 - Media Management & MinIO Integration
**Status:** In Progress

## Test Environment

- **Application:** magazine.stepperslife.com
- **Port:** 3007
- **Database:** PostgreSQL (magazine_db)
- **Object Storage:** MinIO
- **Process Manager:** PM2

## Pre-Test Health Check

✅ Application Status: Online
✅ Database: Healthy (2ms latency)
✅ Redis: Healthy (0ms latency)
✅ MinIO: Healthy (4ms latency)

---

## Story 4.4: Media Library Grid View

### Test Cases

1. **TC-4.4.1: Page Access Control**
   - Verify unauthenticated users are redirected to /sign-in
   - Verify users without MAGAZINE_WRITER role are redirected to /
   - Verify users with MAGAZINE_WRITER role can access /media

2. **TC-4.4.2: Grid Display**
   - Verify media items display in responsive grid (4 columns desktop, 2 tablet, 1 mobile)
   - Verify thumbnails load correctly
   - Verify metadata displays on hover (filename, size, dimensions)

3. **TC-4.4.3: Pagination**
   - Verify pagination controls appear when > 12 items
   - Verify "Previous" button disabled on first page
   - Verify "Next" button disabled on last page
   - Verify page navigation works correctly

4. **TC-4.4.4: Loading States**
   - Verify skeleton loader displays while fetching
   - Verify empty state displays when no media exists

5. **TC-4.4.5: API Response**
   - Verify GET /api/media returns correct structure
   - Verify pagination metadata is accurate

---

## Story 4.5: Search & Filtering

### Test Cases

1. **TC-4.5.1: Search Functionality**
   - Verify search input is debounced (300ms delay)
   - Verify search works on filename
   - Verify search works on alt text
   - Verify search works on caption
   - Verify search is case-insensitive
   - Verify empty results show appropriate message

2. **TC-4.5.2: MIME Type Filtering**
   - Verify "All Types" shows all media
   - Verify filtering by image/png works
   - Verify filtering by image/jpeg works
   - Verify filtering by image/gif works
   - Verify filtering by image/webp works

3. **TC-4.5.3: Sort Options**
   - Verify "Newest First" sorts by createdAt DESC
   - Verify "Oldest First" sorts by createdAt ASC
   - Verify "Filename (A-Z)" sorts alphabetically

4. **TC-4.5.4: Clear Filters**
   - Verify "Clear Filters" button appears when filters active
   - Verify clicking resets all filters to default
   - Verify pagination resets to page 1 when filters change

5. **TC-4.5.5: API Response**
   - Verify GET /api/media?search={query} works
   - Verify GET /api/media?mimeType={type} works
   - Verify GET /api/media?sortBy={option} works
   - Verify combined filters work correctly

---

## Story 4.6: Drag-and-Drop Upload

### Test Cases

1. **TC-4.6.1: Drag-and-Drop Interface**
   - Verify drag area displays correctly
   - Verify drag-over visual feedback works
   - Verify dropping files adds them to upload list
   - Verify only image files are accepted
   - Verify non-image files are rejected

2. **TC-4.6.2: File Selection**
   - Verify "Choose files" button opens file picker
   - Verify multiple file selection works
   - Verify file list displays with previews
   - Verify individual files can be removed before upload

3. **TC-4.6.3: Upload Process**
   - Verify upload progress shows for each file
   - Verify successful uploads show success state
   - Verify failed uploads show error message
   - Verify upload to MinIO succeeds
   - Verify thumbnail generation works (400x300px)
   - Verify database record created with correct metadata

4. **TC-4.6.4: Post-Upload**
   - Verify media library refreshes after upload
   - Verify new items appear in grid
   - Verify dialog closes after successful upload
   - Verify upload list clears

5. **TC-4.6.5: API Response**
   - Verify POST /api/media/upload accepts multipart/form-data
   - Verify response includes url, thumbnailUrl, and media object
   - Verify file saved to MinIO bucket
   - Verify thumbnail saved to MinIO bucket

---

## Story 4.7: Media Detail Modal

### Test Cases

1. **TC-4.7.1: Modal Opening**
   - Verify clicking media card opens modal
   - Verify modal displays full-size image
   - Verify modal overlay dims background
   - Verify ESC key closes modal
   - Verify clicking outside closes modal

2. **TC-4.7.2: Media Information Display**
   - Verify filename displays correctly
   - Verify file size displays correctly
   - Verify dimensions display correctly
   - Verify MIME type displays correctly
   - Verify upload date displays correctly
   - Verify uploader name displays correctly

3. **TC-4.7.3: Edit Metadata**
   - Verify alt text field is editable
   - Verify caption field is editable
   - Verify credit field is editable
   - Verify "Save Changes" button appears when editing
   - Verify changes persist after save
   - Verify media library refreshes after edit

4. **TC-4.7.4: Copy URL**
   - Verify "Copy URL" button works
   - Verify URL copied to clipboard
   - Verify success feedback shows

5. **TC-4.7.5: Delete Media**
   - Verify "Delete" button shows confirmation dialog
   - Verify "Cancel" dismisses dialog
   - Verify "Delete" removes from database
   - Verify "Delete" removes from MinIO
   - Verify "Delete" removes thumbnail from MinIO
   - Verify media library refreshes after delete
   - Verify modal closes after delete

6. **TC-4.7.6: API Response**
   - Verify PUT /api/media/[id] updates metadata
   - Verify DELETE /api/media/[id] removes media
   - Verify DELETE removes both original and thumbnail from MinIO

---

## Cross-Story Integration Tests

### Test Cases

1. **TC-INT.1: Upload → Search → Edit → Delete Flow**
   - Upload new media
   - Search for uploaded media
   - Click and edit metadata
   - Delete media
   - Verify media no longer appears in grid

2. **TC-INT.2: Filter Persistence**
   - Apply search and filters
   - Upload new media
   - Verify filters persist after upload

3. **TC-INT.3: Pagination After Actions**
   - Navigate to page 2
   - Delete item from page 2
   - Verify pagination adjusts if page becomes empty

---

## Performance Tests

### Test Cases

1. **PERF.1: Large Upload**
   - Upload 10+ images simultaneously
   - Verify all process without timeout
   - Verify thumbnails generate for all

2. **PERF.2: Grid Rendering**
   - Load grid with 100+ items
   - Verify pagination prevents performance issues
   - Verify scroll performance is smooth

3. **PERF.3: Search Debouncing**
   - Type rapidly in search input
   - Verify only final query triggers API call
   - Verify 300ms debounce delay works

---

## Security Tests

### Test Cases

1. **SEC.1: Authentication**
   - Verify unauthenticated API calls return 401
   - Verify authenticated calls with wrong role return 403

2. **SEC.2: Authorization**
   - Verify users can only access own media (if applicable)
   - Verify RBAC enforces MAGAZINE_WRITER requirement

3. **SEC.3: File Upload Validation**
   - Attempt to upload non-image file
   - Attempt to upload oversized file
   - Verify server-side validation works

4. **SEC.4: SQL Injection**
   - Test search input with SQL injection patterns
   - Verify Prisma ORM prevents injection

---

## Browser Compatibility (Manual)

**Note:** Browser testing requires manual execution in production environment

### Browsers to Test

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## API Endpoint Summary

| Endpoint          | Method | Purpose                                  | Auth Required         |
| ----------------- | ------ | ---------------------------------------- | --------------------- |
| /api/media        | GET    | List media with pagination/search/filter | Yes (MAGAZINE_WRITER) |
| /api/media/upload | POST   | Upload media files                       | Yes (MAGAZINE_WRITER) |
| /api/media/[id]   | PUT    | Update media metadata                    | Yes (MAGAZINE_WRITER) |
| /api/media/[id]   | DELETE | Delete media                             | Yes (MAGAZINE_WRITER) |

---

## Test Execution Plan

1. ✅ Pre-test health check
2. ⏳ API endpoint testing (automated via curl)
3. ⏳ Database verification
4. ⏳ MinIO bucket verification
5. ⏳ Integration flow testing
6. ⏳ Document findings
7. ⏳ Report bugs/issues
8. ⏳ Create bug tickets if needed

---

## Notes

- Browser-based UI testing will be documented for manual execution
- Focus on API and backend functionality verification
- Integration tests cover end-to-end flows
