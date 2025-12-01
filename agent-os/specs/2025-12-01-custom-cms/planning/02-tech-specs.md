# Technical Specifications: Custom CMS

## 1. Data Model (Convex Schema)

We will leverage the existing `news` and `research` tables. We need to ensure they support the required fields.

```typescript
// convex/schema.ts (Expected structure)
defineTable('news', {
  title: v.string(),
  slug: v.string(),
  content: v.string(), // HTML or JSON from Rich Text Editor
  image: v.optional(v.id('_storage')), // Cover image
  isPublished: v.boolean(),
  publishedAt: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),
  // ... standard fields
})
```

## 2. API Layer (Convex)

### 2.1 Mutations

- `news.ts:create`: Validates input, checks admin role, inserts doc.
- `news.ts:update`: Updates doc by ID.
- `news.ts:delete`: Removes doc.
- `files.ts:generateUploadUrl`: For uploading images to Convex Storage.

### 2.2 Queries

- `news.ts:listAdmin`: Returns all articles (including drafts), paginated, sorted by creation date.
- `news.ts:getById`: Fetches single article for editing.

## 3. Frontend Architecture

### 3.1 Routes

- `/admin/news/page.tsx`: List view (Server Component + Client Table).
- `/admin/news/create/page.tsx`: Creation form.
- `/admin/news/[id]/page.tsx`: Edit form.
- (Same structure for `/admin/research`)

### 3.2 Components

- `src/components/admin/news/news-table.tsx`: Uses `@tanstack/react-table` (or Shadcn Table).
- `src/components/admin/news/news-form.tsx`: Reusable form for Create/Edit using `react-hook-form` + `zod`.
- `src/components/ui/rich-text-editor.tsx`: Wrapper around **Tiptap**.
- `src/components/ui/image-upload.tsx`: Component to handle file selection and upload to Convex.

## 4. Dependencies

- `@tiptap/react`, `@tiptap/starter-kit`: For Rich Text.
- `react-hook-form`, `zod`: For form management.
- `lucide-react`: For icons.
