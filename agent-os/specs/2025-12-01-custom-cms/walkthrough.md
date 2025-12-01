# Custom CMS Walkthrough

## 1. Start the Application

Since this project uses both Next.js and Convex, you need to run the setup command:

```bash
npm run dev:setup
```

This will start:

- **Convex Backend**: Syncing schema and functions.
- **Next.js Frontend**: Available at `http://localhost:3000`.

## 2. Accessing the CMS

Navigate to the following routes in your browser:

### News Management

- **List View**: [http://localhost:3000/admin/news](http://localhost:3000/admin/news)
- **Create New**: [http://localhost:3000/admin/news/create](http://localhost:3000/admin/news/create)

### Research Management

- **List View**: [http://localhost:3000/admin/research](http://localhost:3000/admin/research)
- **Create New**: [http://localhost:3000/admin/research/create](http://localhost:3000/admin/research/create)

## 3. Prerequisites

> [!IMPORTANT]
> **Admin Role Required**: You must be logged in with a user account that has the `admin` or `superadmin` role in the Convex database.

If you get a "Permission denied" or "Author not found" error:

1.  Go to your **Convex Dashboard** (npx convex dashboard).
2.  Find your user record in the `users` table.
3.  Change the `role` field to `'admin'`.

## 4. Features to Test

1.  **Rich Text Editor**: Try bolding text, adding headings, and lists in the "Content" field.
2.  **Image Upload**: Upload a cover image and verify it shows the preview.
3.  **CRUD**: Create an article, see it in the list, edit it, and then delete it.
