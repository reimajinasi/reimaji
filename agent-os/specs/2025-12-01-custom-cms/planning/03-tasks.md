# Tasks: Custom CMS Implementation

## 0. Setup & Dependencies

- [ ] Install Tiptap dependencies (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`) <!-- id: 0 -->
- [ ] Install `lucide-react` (if not present) <!-- id: 1 -->

## 1. Backend (Convex)

- [ ] Verify `news` and `research` schema in `convex/schema.ts` <!-- id: 2 -->
- [ ] Create/Update `convex/news.ts` with `listAdmin`, `getById`, `create`, `update`, `delete` <!-- id: 3 -->
- [ ] Create/Update `convex/research.ts` with `listAdmin`, `getById`, `create`, `update`, `delete` <!-- id: 4 -->
- [ ] Ensure `convex/files.ts` has `generateUploadUrl` <!-- id: 5 -->

## 2. Shared Components

- [ ] Create `src/components/ui/rich-text-editor.tsx` (Tiptap implementation) <!-- id: 6 -->
- [ ] Create `src/components/ui/image-upload.tsx` (Convex storage integration) <!-- id: 7 -->

## 3. Feature: News Management

- [ ] Create `src/components/admin/news/news-table.tsx` (List view) <!-- id: 8 -->
- [ ] Create `src/components/admin/news/news-form.tsx` (Create/Edit form) <!-- id: 9 -->
- [ ] Implement Page: `/admin/news/page.tsx` <!-- id: 10 -->
- [ ] Implement Page: `/admin/news/create/page.tsx` <!-- id: 11 -->
- [ ] Implement Page: `/admin/news/[id]/page.tsx` <!-- id: 12 -->

## 4. Feature: Research Management

- [ ] Create `src/components/admin/research/research-table.tsx` <!-- id: 13 -->
- [ ] Create `src/components/admin/research/research-form.tsx` <!-- id: 14 -->
- [ ] Implement Page: `/admin/research/page.tsx` <!-- id: 15 -->
- [ ] Implement Page: `/admin/research/create/page.tsx` <!-- id: 16 -->
- [ ] Implement Page: `/admin/research/[id]/page.tsx` <!-- id: 17 -->
