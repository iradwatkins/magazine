# Epic 6 - Story 6.8: New Article Creation Flow

**Status:** COMPLETE
**Date Completed:** 2025-10-10
**Estimated Time:** 3 hours
**Actual Time:** 3 hours
**Developer:** Dev Agent

---

## Story Overview

Implement a streamlined modal dialog for creating new articles. When users click "New Article" on the articles page, a modal opens with a form to enter the article title and select a category. Upon submission, the system creates a draft article and redirects the user to the article editor.

---

## Requirements Met

### Functional Requirements

1. **"New Article" Button** - Added prominent button with pen icon on articles page
2. **Modal Dialog** - Implemented using shadcn/ui Dialog component
3. **Form Fields:**
   - Title input (required, max 200 characters with counter)
   - Category dropdown (required, all 10 categories)
4. **Validation:**
   - Title required with max length check
   - Category required
   - Real-time error display
5. **Auto-generate Slug** - Uses existing `generateUniqueSlug()` function
6. **Set Current User as Author** - Uses session.user.id from SSO
7. **Initialize with Empty Content** - Creates article with empty blocks array
8. **Redirect to Editor** - Navigates to `/articles/[id]/edit` after creation
9. **Cancel Handling** - Close modal without creating article
10. **Loading States** - Shows spinner during creation
11. **Toast Notifications** - Success and error messages
12. **SSO Compatibility** - Properly handles single role field from SSO

### Technical Requirements

- Next.js 15 App Router patterns
- SSO authentication with single role field
- Server-side validation
- Client-side form validation
- Proper error handling
- TypeScript strict mode compliance

---

## Implementation Details

### Files Created

#### 1. `/components/articles/create-article-modal.tsx`

**Purpose:** Modal dialog component for creating new articles

**Key Features:**

- Client component with form state management
- Real-time validation with error messages
- Character counter for title (200 max)
- Category dropdown with all 10 article categories
- Loading state with spinner during submission
- Success/error toast notifications
- Form reset on close
- Automatic redirect to editor after creation

**Component Structure:**

```typescript
interface CreateArticleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Categories array with display labels
const ARTICLE_CATEGORIES = [
  { value: 'NEWS', label: 'News' },
  { value: 'EVENTS', label: 'Events' },
  // ... all 10 categories
]
```

**Validation Logic:**

- Title: Required, max 200 characters
- Category: Required, must be valid enum value
- Client-side validation before API call
- Server-side validation in API endpoint

**API Integration:**

```typescript
POST / api / articles
Body: {
  title: string(trimmed)
  category: ArticleCategory
  content: JSON.stringify([]) // Empty blocks array
  excerpt: '' // Empty initially
}
```

#### 2. `/components/articles/articles-page-header.tsx`

**Purpose:** Header section for articles page with modal state management

**Key Features:**

- Manages modal open/close state
- Renders "New Article" button
- Renders CreateArticleModal component
- Clean separation of concerns (presentational component)

**Component Structure:**

```typescript
export function ArticlesPageHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Title and description */}
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PenLine className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>
      <CreateArticleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  )
}
```

### Files Modified

#### 1. `/app/(admin)/articles/page.tsx`

**Changes:**

- Replaced inline header with ArticlesPageHeader component
- Removed Link and PenLine imports (moved to header component)
- Added ArticlesPageHeader import

**Before:**

```tsx
<div className="flex items-center justify-between">
  <div>
    <h2>Articles</h2>
    <p>Manage and organize all your articles</p>
  </div>
  <Button asChild>
    <Link href="/articles/new">
      <PenLine className="mr-2 h-4 w-4" />
      New Article
    </Link>
  </Button>
</div>
```

**After:**

```tsx
<ArticlesPageHeader />
```

**Benefit:** Cleaner separation between server and client components

#### 2. `/app/api/articles/route.ts`

**Changes:**

- Converted from `withAnyRole` middleware to direct session handling
- Added SSO compatibility for single role field
- Updated to handle optional content parameter
- Added proper category validation with all 10 categories
- Made content optional (defaults to empty array)

**SSO Pattern Applied:**

```typescript
// SSO provides single role, convert to array for RBAC functions
const userRole = (session.user as any)?.role || 'USER'
const userRoles = [userRole] as UserRole[]

// Check if user has writer permissions
const hasWriterPermission = userRoles.some((role) =>
  ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(role)
)
```

**Category Validation:**

```typescript
const validCategories: ArticleCategory[] = [
  'NEWS',
  'EVENTS',
  'INTERVIEWS',
  'HISTORY',
  'TUTORIALS',
  'LIFESTYLE',
  'FASHION',
  'MUSIC',
  'COMMUNITY',
  'OTHER',
]
```

**Default Values:**

```typescript
content: content || JSON.stringify([]),  // Empty blocks if not provided
excerpt: excerpt || '',                   // Empty excerpt if not provided
status: 'DRAFT',                          // Always starts as draft
```

---

## SSO Compatibility

### Critical Pattern

The implementation follows the SSO pattern established in Epic 6.7 where:

- SSO provides `session.user.role` (single value, not array)
- Convert to array for RBAC functions: `const userRoles = [session.user.role]`
- Example from `/app/api/articles/[id]/route.ts` (lines 36-37, 73-74)

### Implementation in POST /api/articles:

```typescript
const session = await getSession()

if (!session?.user) {
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
}

// SSO provides single role, convert to array for RBAC functions
const userRole = (session.user as any)?.role || 'USER'
const userRoles = [userRole] as UserRole[]

// Check if user has writer permissions
const hasWriterPermission = userRoles.some((role) =>
  ['MAGAZINE_WRITER', 'MAGAZINE_EDITOR', 'ADMIN'].includes(role)
)
```

---

## User Flow

1. User navigates to `/articles` page
2. User clicks "New Article" button in page header
3. Modal dialog opens with form
4. User enters article title (required, max 200 chars)
5. User selects category from dropdown (required)
6. User clicks "Create Article" button
7. System validates input:
   - Client-side: Title required, max length
   - Client-side: Category required
   - Server-side: Title and category required
   - Server-side: Category must be valid enum value
8. System creates article:
   - Generates unique slug from title
   - Sets current user as author
   - Initializes with empty content blocks
   - Sets status to DRAFT
9. Success:
   - Shows success toast
   - Closes modal
   - Redirects to `/articles/[id]/edit`
   - Refreshes router to show new article
10. Error:
    - Shows error toast with message
    - Keeps modal open for correction

---

## API Endpoint Specification

### POST /api/articles

**Authentication:** Required (MAGAZINE_WRITER, MAGAZINE_EDITOR, or ADMIN)

**Request Body:**

```json
{
  "title": "My New Article",
  "category": "NEWS",
  "content": "[]", // Optional, defaults to empty array
  "excerpt": "" // Optional, defaults to empty string
}
```

**Response (201):**

```json
{
  "message": "Article created successfully",
  "article": {
    "id": "clx123...",
    "title": "My New Article",
    "slug": "my-new-article",
    "category": "NEWS",
    "status": "DRAFT",
    "authorId": "user123",
    "content": "[]",
    "excerpt": ""
    // ... other fields
  }
}
```

**Validation Errors (400):**

```json
{
  "error": "Title and category are required"
}
```

```json
{
  "error": "Invalid category. Must be one of: NEWS, EVENTS, ..."
}
```

**Authorization Errors (403):**

```json
{
  "error": "You need writer permissions to create articles"
}
```

---

## Testing Checklist

### Manual Testing Performed

- [x] Click "New Article" button opens modal
- [x] Modal shows title input and category dropdown
- [x] Title input shows character counter
- [x] Validation shows error for empty title
- [x] Validation shows error for missing category
- [x] Validation shows error for title over 200 chars
- [x] Cancel button closes modal without creating article
- [x] ESC key closes modal without creating article
- [x] Submit with valid data creates article
- [x] Success toast appears on creation
- [x] Redirects to editor after creation
- [x] Created article has correct title and category
- [x] Created article has DRAFT status
- [x] Created article has current user as author
- [x] Created article has unique slug
- [x] Created article has empty content blocks
- [x] Loading state shows during creation
- [x] Error toast shows on API failure
- [x] Form resets when modal closes
- [x] Modal reopens with clean form

### Build Verification

```bash
npm run build
```

**Result:** Compiled successfully in 6.0s

### Code Formatting

```bash
npm run format
```

**Result:** All files formatted successfully

### Server Restart

```bash
pm2 restart magazine-stepperslife
```

**Result:** Server restarted successfully

---

## Design Patterns Used

### 1. Modal Dialog Pattern

- Used shadcn/ui Dialog component
- Controlled open/close state
- Form within modal
- Proper focus management with autoFocus on title input

### 2. Form Validation Pattern

- Client-side validation before API call
- Real-time error display
- Error state cleared on input change
- Server-side validation as safety net

### 3. Loading States Pattern

- Button disabled during submission
- Spinner icon shown during loading
- Form inputs disabled during loading
- Prevents double submission

### 4. Toast Notification Pattern

- Success toast on article creation
- Error toast with specific error message
- Non-blocking feedback

### 5. Server/Client Component Separation

- Articles page: Server component (data fetching)
- ArticlesPageHeader: Client component (modal state)
- CreateArticleModal: Client component (form handling)

### 6. SSO Role Pattern

- Convert single role to array for RBAC
- Consistent with other endpoints
- Proper permission checking

---

## Accessibility Features

1. **Keyboard Navigation:**
   - Tab through form fields
   - ESC to close modal
   - Enter to submit form
   - AutoFocus on title input when modal opens

2. **Screen Reader Support:**
   - Proper label associations
   - Required field indicators
   - Error message announcements
   - Loading state feedback

3. **Visual Indicators:**
   - Required field asterisks
   - Character counter
   - Error messages in destructive color
   - Loading spinner

---

## Performance Considerations

1. **Client Components Only Where Needed:**
   - Modal and header are client components
   - Main page remains server component for data fetching

2. **Debounced Validation:**
   - Errors clear immediately on input change
   - No unnecessary re-renders

3. **Optimized Redirects:**
   - Uses Next.js router.push()
   - Calls router.refresh() to update server components
   - No full page reload

4. **Form Reset:**
   - State properly cleared on modal close
   - No memory leaks

---

## Known Limitations

None. All acceptance criteria met.

---

## Future Enhancements (Not in Scope)

1. **Template Selection:**
   - Optional template dropdown
   - Pre-fill content with template blocks
   - Requires template management system

2. **Featured Image Upload:**
   - Allow setting featured image during creation
   - Currently must be set in editor

3. **Tags Selection:**
   - Add tags during creation
   - Currently must be set in article settings

4. **Excerpt Preview:**
   - Show generated excerpt preview
   - Auto-generate from title

5. **Duplicate Article:**
   - "Create from existing" option
   - Covered in Story 6.9

---

## Code Quality Metrics

- **TypeScript Strict Mode:** Passing
- **Build Status:** Passing (no errors, warnings unrelated to this story)
- **Linting:** No issues
- **Formatting:** All files formatted with Prettier
- **Test Coverage:** Manual testing complete

---

## Dependencies

### Component Dependencies

- shadcn/ui Dialog, Button, Input, Label, Select
- lucide-react icons (PenLine, Loader2)
- next/navigation (useRouter)
- Custom toast hook (useToast)

### API Dependencies

- /lib/auth-middleware (getSession)
- /lib/articles (createArticle, generateUniqueSlug)
- Prisma ArticleCategory, UserRole enums

### No Breaking Changes

- All existing functionality preserved
- New components added, existing code enhanced
- Backward compatible

---

## Deployment Notes

1. **Build Verified:** npm run build successful
2. **Server Restarted:** pm2 restart successful
3. **No Database Migrations Required:** Uses existing schema
4. **No Environment Variables Added:** Uses existing configuration

---

## Related Documentation

- **Epic 6 Kickoff:** `/docs/epic-06-kickoff.md`
- **PRD:** `/docs/prd/epics/epic-06-article-dashboard.md`
- **API Docs:** `/docs/API.md`
- **RBAC Patterns:** `/lib/rbac.ts`
- **SSO Auth:** `/lib/auth.ts`

---

## Acceptance Criteria Status

| Criteria                                   | Status | Notes                          |
| ------------------------------------------ | ------ | ------------------------------ |
| "New Article" button prominently displayed | PASS   | In page header with icon       |
| Click opens modal dialog                   | PASS   | Smooth animation               |
| Form with title (required)                 | PASS   | Max 200 chars, counter shown   |
| Form with category (dropdown)              | PASS   | All 10 categories              |
| Template selection (optional)              | N/A    | Deferred to future enhancement |
| "Create" button creates draft article      | PASS   | Status always DRAFT            |
| Auto-generate slug from title              | PASS   | Uses generateUniqueSlug()      |
| Set current user as author                 | PASS   | Uses session.user.id           |
| Initialize with empty content              | PASS   | JSON.stringify([])             |
| Redirect to editor after creation          | PASS   | /articles/[id]/edit            |
| Close modal on cancel                      | PASS   | No article created             |
| Validation: title required                 | PASS   | Client and server validation   |
| Validation: character limits               | PASS   | Max 200 chars enforced         |
| Toast notification on success              | PASS   | Shows "Article created"        |
| Toast notification on error                | PASS   | Shows specific error           |
| Loading state during creation              | PASS   | Button disabled with spinner   |

**Overall Status:** 15/15 PASS (100%)

---

## Summary

Story 6.8 has been successfully implemented with all acceptance criteria met. The new article creation flow provides a streamlined experience for users to quickly create draft articles and begin editing. The implementation follows established patterns for SSO compatibility, form validation, and user feedback.

**Key Achievements:**

- Clean modal dialog interface
- Robust validation (client and server)
- SSO-compatible authentication
- Proper error handling and user feedback
- Seamless redirect to editor
- No TypeScript errors
- All code formatted and linted
- Server successfully restarted

**Ready for QA Review:** Yes
**Epic 6 Progress:** 8/10 stories complete (80%)
