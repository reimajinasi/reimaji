# Product Context: Custom CMS for Reimaji

## 1. Problem Statement

The Reimaji platform currently lacks a dedicated, user-friendly interface for administrators to manage dynamic content such as News, Research, and Users. While the backend (Convex) supports these data types, there is no frontend "Content Management System" (CMS) exposed at the `/admin` route. Administrators would otherwise have to modify the database directly or use developer tools, which is inefficient and risky.

## 2. Goals & Objectives

- **Goal**: Transform the `/admin` route into a fully functional, custom-built CMS.
- **Objective 1**: Enable non-technical admins to Create, Read, Update, and Delete (CRUD) "News" and "Research" articles.
- **Objective 2**: Provide a rich text editing experience for content creation.
- **Objective 3**: Manage media assets (images) directly within the CMS.
- **Objective 4**: Maintain architectural simplicity by building directly on the existing Next.js + Convex stack (no external CMS dependencies).

## 3. Target Audience

- **Primary**: Platform Administrators / Content Managers.
- **Secondary**: Developers (easier maintenance than a separate CMS).

## 4. Success Metrics

- Admins can publish a new "News" article with an image and rich text without developer intervention.
- Admins can edit existing "Research" papers.
- The `/admin` interface loads instantly and feels integrated with the rest of the app (Shared UI/Auth).

## 5. Strategic Alignment

- **Why Custom?**: Research confirmed that integrating Payload CMS would require a separate SQL database, adding unnecessary complexity. A custom CMS leverages the existing Convex backend, ensuring a unified data source and real-time capabilities.
