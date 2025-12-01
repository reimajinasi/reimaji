# Report: Shared Components Implementation

## Tasks Completed

- [x] Create `src/components/ui/rich-text-editor.tsx` (Tiptap implementation)
- [x] Create `src/components/ui/image-upload.tsx` (Convex storage integration)

## Details

1.  **Rich Text Editor**: Implemented using `@tiptap/react` and `starter-kit`. Includes toolbar for formatting (Bold, Italic, Headings, Lists, etc.).
2.  **Image Upload**: Implemented `ImageUpload` component that uses `convex/files.ts:generateUploadUrl` to securely upload images to Convex Storage. Returns the full URL (or storage ID logic can be adapted) to the parent form.
