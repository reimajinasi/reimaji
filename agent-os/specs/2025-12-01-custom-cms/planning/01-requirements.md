# Requirements: Custom CMS

## 1. Functional Requirements

### 1.1 News Management

- **List View**: Display a paginated table of news articles with columns for Title, Status (Published/Draft), Date, and Actions.
- **Create/Edit**: Form to add/update news articles.
  - **Fields**: Title, Slug (auto-generated but editable), Cover Image, Content (Rich Text), Tags, Published Status.
- **Delete**: Soft delete or hard delete option for articles.

### 1.2 Research Management

- **List View**: Paginated table of research papers.
- **Create/Edit**: Form to add/update research papers.
  - **Fields**: Title, Abstract, Content/Body, Authors, Publication Date, Status.

### 1.3 Rich Text Editor

- Must support basic formatting: Bold, Italic, Headings (H1-H3), Lists (Bullet/Ordered), Links.
- Ideally supports inline image embedding or at least a cover image field.

### 1.4 Media Management

- Ability to upload images for covers.
- Integration with Convex File Storage.

## 2. User Experience (UX)

- **Navigation**: Sidebar links for "News" and "Research" under an "Admin" or "Content" section.
- **Feedback**: Toast notifications on success/error.
- **Loading States**: Skeleton loaders for tables and submission buttons.

## 3. Non-Functional Requirements

- **Performance**: Admin pages should load within 1s.
- **Security**: Only users with `role: 'admin'` can access these routes and perform mutations.
