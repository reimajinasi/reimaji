# Report: Backend Implementation

## Tasks Completed

- [x] Verify `news` and `research` schema in `convex/schema.ts`
- [x] Create/Update `convex/news.ts` with `listAdmin`, `getById`, `create`, `update`, `delete`
- [x] Create/Update `convex/research.ts` with `listAdmin`, `getById`, `create`, `update`, `delete`
- [x] Ensure `convex/files.ts` has `generateUploadUrl`

## Details

1.  **Schema Verification**: Confirmed `news` and `research` tables have necessary fields (`title`, `slug`, `content`, `image`, `isPublished`, etc.).
2.  **API Updates**:
    - Added `getById` query to `convex/news.ts` and `convex/research.ts` to support the Edit form.
    - Existing `listAll` (admin list), `create`, `update`, and `remove` mutations were already present and correct.
3.  **File Storage**: Created `convex/files.ts` with `generateUploadUrl` mutation to handle secure image uploads.
