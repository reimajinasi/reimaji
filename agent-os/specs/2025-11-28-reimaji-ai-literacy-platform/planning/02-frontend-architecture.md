# Frontend Architecture - Reimaji AI Literacy Platform

## Overview

The frontend architecture leverages Next.js 16 with the App Router pattern, providing a robust foundation for both server-side rendering (SSR) and client-side interactivity. This architecture ensures optimal SEO performance, excellent user experience, and maintainable code structure.

## 🎨 Design System Integration

**🚨 IMPORTANT:** Reimaji has a comprehensive design system available at:
`/Users/eriksupit/Desktop/reimaji/knowledge-base/design-system/`

### Design System Structure
The design system is modular and organized into focused documents for easy implementation:

#### **Foundation Tokens**
- **`design-typography.md`** - Complete typography scale (H1-H5, Display, Body, Caption)
- **`design-colors.md`** - Color tokens and semantic mapping to Tailwind/shadcn
- **`design-shadows.md`** - Elevation scale and shadow mapping

#### **Component Design Specifications**
- **`design-button.md`** - Button variants, sizes, states
- **`design-input.md`** - Form inputs and text areas
- **`design-card.md`** - Card layouts and variants
- **`design-tabs.md`** - Navigation tabs and states
- **`design-badge-chip.md`** - Status badges and filter chips
- **`design-alert.md`** - Alert variants and messaging
- **`design-icons.md`** - Icon usage and sizing
- **`design-loader.md`** - Loading states and spinners

#### **Navigation Components**
- **`design-navbar-top.md`** - Header navigation and actions
- **`design-navbar-bottom.md`** - Mobile bottom navigation
- **`design-breadcrumbs.md`** - Hierarchical navigation
- **`design-dropdown.md`** - Select-like dropdowns
- **`design-context-menu.md`** - Context and action menus
- **`design-stepper.md`** - Multi-step progress indicators
- **`design-pagination.md`** - Data navigation controls
- **`design-page-control.md`** - Slide and dot indicators

#### **Form & Control Components**
- **`design-checkbox.md`** - Checkbox states and layouts
- **`design-radio.md`** - Radio button groups
- **`design-toggle.md`** - Switches and toggles
- **`design-avatar.md`** - User avatars and profile images
- **`design-progress-bar.md`** - Linear progress indicators

#### **Overlay & Feedback Components**
- **`design-popup.md`** - Modal dialogs and popups
- **`design-tooltips.md`** - Contextual help and information
- **`design-list.md`** - List layouts and item structures
- **`design-action-sheet.md`** - Mobile action panels
- **`design-button-group.md`** - Grouped controls and segmented controls

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Stack                           │
├─────────────────────────────────────────────────────────────┤
│ Next.js 16 (App Router)                                     │
│ ├── TypeScript (Type Safety)                               │
│ ├── Server Components (SSR, SEO)                           │
│ ├── Client Components (Interactivity)                       │
│ ├── Route-based Code Splitting                              │
│ └── Edge Runtime Support                                   │
├─────────────────────────────────────────────────────────────┤
│ UI Layer                                                   │
│ ├── shadcn/ui (Component Library)                          │
│ ├── Tailwind CSS (Styling)                                 │
│ ├── Radix UI (Accessible Primitives)                      │
│ └── Framer Motion (Animations - Optional)                │
├─────────────────────────────────────────────────────────────┤
│ Data Management                                            │
│ ├── Convex React Hooks                                     │
│ ├── Server Actions (Form Handling)                         │
│ ├── Optimistic UI Updates                                  │
│ └── Real-time Synchronization                             │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
reimaji-frontend/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── page.tsx             # Landing page
│   │   ├── news/                # News section
│   │   │   ├── page.tsx         # News listing
│   │   │   ├── [id]/            # News detail
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx      # Loading state
│   │   ├── research/            # Research section
│   │   │   ├── page.tsx         # Research listing
│   │   │   ├── [id]/            # Research detail
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   └── layout.tsx           # Public pages layout
│   ├── (app)/                    # Protected route group
│   │   ├── dashboard/           # User dashboard
│   │   │   ├── page.tsx         # Main dashboard
│   │   │   └── layout.tsx       # Dashboard layout
│   │   ├── lms/                 # Learning Management System
│   │   │   ├── page.tsx         # Course overview
│   │   │   ├── [moduleId]/      # Module routes
│   │   │   │   ├── [lessonId]/  # Lesson routes
│   │   │   │   │   └── page.tsx # Lesson detail
│   │   │   │   └── page.tsx     # Module overview
│   │   │   └── layout.tsx       # LMS layout
│   │   └── playground/          # AI playground
│   │       ├── page.tsx         # Playground interface
│   │       └── layout.tsx       # Playground layout
│   ├── admin/                    # Admin routes
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── news/                # News management
│   │   │   ├── page.tsx         # News CRUD
│   │   │   ├── create/          # Create news
│   │   │   │   └── page.tsx
│   │   │   └── [id]/            # Edit news
│   │   │       └── page.tsx
│   │   ├── research/            # Research management
│   │   ├── courses/             # Course management
│   │   └── layout.tsx           # Admin layout
│   ├── api/                     # API routes
│   │   ├── xendit/              # Payment webhooks
│   │   │   └── webhook/route.ts
│   │   ├── ai/                  # AI endpoints (if needed)
│   │   │   └── summarize/route.ts
│   │   └── resend/              # Email endpoints
│   │       └── welcome/route.ts
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── error.tsx                # Global error boundary
│   ├── loading.tsx              # Global loading state
│   ├── not-found.tsx            # 404 page
│   └── opengraph-image.tsx      # Dynamic OG images
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components (shadcn/ui + Design System)
│   │   ├── button.tsx          # Button component - Follow design-button.md
│   │   ├── card.tsx            # Card component - Follow design-card.md
│   │   ├── input.tsx           # Input component - Follow design-input.md
│   │   ├── dialog.tsx          # Modal/dialog - Follow design-popup.md
│   │   ├── tabs.tsx            # Tabs navigation - Follow design-tabs.md
│   │   ├── toast.tsx           # Toast notifications - Follow design-alert.md
│   │   ├── badge.tsx           # Badge component - Follow design-badge-chip.md
│   │   ├── dropdown-menu.tsx   # Dropdown menus - Follow design-dropdown.md
│   │   ├── checkbox.tsx        # Checkbox - Follow design-checkbox.md
│   │   ├── radio.tsx           # Radio buttons - Follow design-radio.md
│   │   ├── toggle.tsx          # Toggle switch - Follow design-toggle.md
│   │   ├── avatar.tsx          # User avatars - Follow design-avatar.md
│   │   ├── progress.tsx        # Progress bars - Follow design-progress-bar.md
│   │   ├── tooltip.tsx         # Tooltips - Follow design-tooltips.md
│   │   ├── loader.tsx          # Loading states - Follow design-loader.md
│   │   └── ...                 # Other shadcn/ui components
│   ├── layout/                # Layout components (Design System Integration)
│   │   ├── navbar.tsx         # Main navigation - Follow design-navbar-top.md
│   │   ├── bottom-nav.tsx      # Mobile bottom nav - Follow design-navbar-bottom.md
│   │   ├── footer.tsx         # Footer component
│   │   ├── sidebar.tsx        # Sidebar navigation
│   │   ├── breadcrumbs.tsx    # Navigation breadcrumbs - Follow design-breadcrumbs.md
│   │   ├── page-shell.tsx     # Page wrapper
│   │   ├── dashboard-layout.tsx # Dashboard layout
│   │   ├── admin-layout.tsx   # Admin layout
│   │   └── loading-skeleton.tsx # Loading skeletons - Follow design-loader.md
│   ├── features/              # Feature-specific components
│   │   ├── auth/              # Authentication components
│   │   │   ├── auth-guard.tsx # Route protection
│   │   │   ├── role-guard.tsx # Role-based access
│   │   │   ├── user-menu.tsx  # User menu
│   │   │   └── sign-in-form.tsx
│   │   ├── news/              # News components
│   │   │   ├── news-card.tsx  # News item card
│   │   │   ├── news-list.tsx  # News listing
│   │   │   ├── news-filters.tsx # News filters
│   │   │   ├── news-detail.tsx # News detail view
│   │   │   └── news-form.tsx  # News creation/editing
│   │   ├── research/          # Research components
│   │   │   ├── research-card.tsx
│   │   │   ├── research-list.tsx
│   │   │   ├── research-detail.tsx
│   │   │   └── research-form.tsx
│   │   ├── lms/               # LMS components
│   │   │   ├── course-card.tsx
│   │   │   ├── module-list.tsx
│   │   │   ├── lesson-player.tsx
│   │   │   ├── video-player.tsx
│   │   │   ├── quiz-form.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   └── certificate.tsx
│   │   ├── playground/        # AI playground components
│   │   │   ├── prompt-form.tsx
│   │   │   ├── ai-response.tsx
│   │   │   ├── model-selector.tsx
│   │   │   ├── risk-panel.tsx
│   │   │   └── conversation-history.tsx
│   │   ├── admin/             # Admin components
│   │   │   ├── dashboard-overview.tsx
│   │   │   ├── content-table.tsx
│   │   │   ├── user-management.tsx
│   │   │   └── analytics.tsx
│   │   └── billing/           # Billing components
│   │       ├── subscription-card.tsx
│   │       ├── payment-form.tsx
│   │       ├── invoice-list.tsx
│   │       └── upgrade-modal.tsx
│   └── providers/             # Context providers
│       ├── auth-provider.tsx  # Authentication context
│       ├── theme-provider.tsx # Theme context
│       ├── toast-provider.tsx # Toast notifications
│       └── convex-provider.tsx # Convex client provider
├── lib/                       # Utility functions
│   ├── auth.ts               # Authentication helpers
│   ├── convex.ts             # Convex client setup
│   ├── utils.ts              # General utilities
│   ├── constants.ts          # App constants
│   ├── validations.ts        # Form validations
│   ├── api.ts                # API helpers
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts       # Authentication hook
│   │   ├── use-convex.ts     # Convex data hooks
│   │   ├── use-subscription.ts # Subscription management
│   │   └── use-prompt.ts     # AI prompt handling
│   └── types/                # TypeScript definitions
│       ├── auth.ts           # Auth types
│       ├── content.ts        # Content types
│       ├── lms.ts            # LMS types
│       ├── user.ts           # User types
│       └── api.ts            # API response types
├── public/                   # Static assets
│   ├── images/              # Images
│   ├── icons/               # Icons
│   ├── favicon.ico          # Favicon
│   └── robots.txt           # SEO robots
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── components.json         # shadcn/ui configuration
├── convex.json             # Convex configuration
└── package.json            # Dependencies and scripts
```

## Route Architecture

### Public Routes (No Authentication Required)
```
/                           # Landing page
/news                       # News listing (public + preview)
/news/[id]                  # News detail
/research                   # Research listing (public + preview)
/research/[id]              # Research detail
/sign-in                    # Authentication page
/sign-up                    # Registration page
```

### Protected Routes (Authentication Required)
```
/dashboard                  # User dashboard
/lms                        # Course overview
/lms/[moduleId]            # Module details
/lms/[moduleId]/[lessonId] # Lesson details
/playground                # AI playground
/billing                   # Subscription management
/profile                   # User profile
```

### Admin Routes (Admin Role Required)
```
/admin                    # Admin dashboard
/admin/news               # News management
/admin/news/create        # Create news
/admin/news/[id]          # Edit news
/admin/research           # Research management
/admin/courses            # Course management
/admin/users              # User management
/admin/analytics          # Platform analytics
```

## Component Architecture Patterns

### 1. Server Components (SSR)
Used for:
- SEO-critical pages
- Initial data loading
- Static content rendering
- Authentication checks

```typescript
// Example: Server Component for News Detail
import { auth } from "@clerk/nextjs/server"
import { NewsDetail } from "@/components/features/news/news-detail"
import { getNewsById } from "@/convex/news"

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const { userId } = auth()
  const news = await getNewsById({ id: params.id, userId })

  if (!news) {
    notFound()
  }

  return <NewsDetail news={news} isAuthenticated={!!userId} />
}
```

### 2. Client Components (CSR)
Used for:
- Interactive forms
- Real-time data updates
- User interactions
- State management

```typescript
// Example: Client Component for Playground
"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function PlaygroundForm() {
  const [prompt, setPrompt] = useState("")
  const generateResponse = useMutation(api.ai.generateResponse)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generateResponse({ prompt })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Interactive form content */}
    </form>
  )
}
```

### 3. Hybrid Components
Used for:
- Pages with both SSR and interactive elements
- Progressive enhancement patterns
- Optimistic UI updates

```typescript
// Example: Hybrid Component for Lesson
import { LessonPlayer } from "@/components/features/lms/lesson-player"
import { QuizSection } from "@/components/features/lms/quiz-section"

export default async function LessonPage({ params }: { params: { moduleId: string; lessonId: string } }) {
  const lesson = await getLesson(params.lessonId)

  return (
    <div className="lesson-container">
      <LessonPlayer lesson={lesson} /> {/* Server-rendered content */}
      <QuizSection lessonId={params.lessonId} /> {/* Interactive client component */}
    </div>
  )
}
```

## Data Fetching Patterns

### 1. Server-Side Data Fetching
```typescript
// Server Component with Convex HTTP functions
import { auth } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default async function NewsPage() {
  const { userId } = auth()
  const news = await convex.query(api.news.list, {
    isPublic: true,
    limit: 20
  })

  return <NewsList news={news} isAuthenticated={!!userId} />
}
```

### 2. Client-Side Data Fetching
```typescript
// Client Component with React hooks
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function UserDashboard() {
  const { userId } = useAuth()
  const userProgress = useQuery(api.progress.getUserProgress, { userId })
  const recommendedNews = useQuery(api.news.getRecommended, { userId })

  return (
    <div>
      {/* Dynamic content based on fetched data */}
    </div>
  )
}
```

### 3. Hybrid Data Fetching
```typescript
// Server loading with client hydration
import { NewsList } from "@/components/features/news/news-list"
import { getNewsList } from "@/lib/news"

// Initial server fetch
const initialNews = await getNewsList({ limit: 10 })

export default function NewsPage() {
  return (
    <NewsList initialNews={initialNews} /> {/* Client component handles pagination and updates */}
  )
}
```

## State Management Architecture

### 1. Local Component State
Used for:
- Form inputs
- UI interactions
- Temporary data

```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [formData, setFormData] = useState({ title: "", content: "" })
```

### 2. Global State (Minimal)
Used for:
- User authentication status
- Theme preferences
- Application-wide settings

```typescript
// Context provider for global state
export const AppContext = createContext({
  user: null,
  theme: "light",
  notifications: [],
})

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  )
}
```

### 3. Server State (Convex)
Used for:
- Application data
- Real-time updates
- Shared state between components

```typescript
// Convex-powered state management
export function NewsList() {
  const news = useQuery(api.news.list, { category: "ai-tools" })
  const updateNews = useMutation(api.news.update)

  // Real-time updates when news changes
  return (
    <div>
      {news?.map(item => (
        <NewsCard key={item._id} news={item} />
      ))}
    </div>
  )
}
```

### 4. Optimistic UI Updates
**Recommendation:** Use optimistic updates for immediate user feedback on actions like "Mark as Complete" or "Like".

```typescript
// Example: Optimistic Like Button
const toggleLike = useMutation(api.news.toggleLike).withOptimisticUpdate((localStore, args) => {
  const news = localStore.getQuery(api.news.getById, { id: args.id })
  if (news) {
    const isLiked = news.isLiked
    localStore.setQuery(api.news.getById, { id: args.id }, {
      ...news,
      likeCount: isLiked ? news.likeCount - 1 : news.likeCount + 1,
      isLiked: !isLiked
    })
  }
})
```

## Authentication Integration

### 1. Clerk Provider Setup
```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 2. Authentication Proxy
```typescript
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/news(.*)", "/research(.*)", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }
})

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)", "/admin(.*)", "/dashboard(.*)", "/lms(.*)"]
}
```

Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

#### Rasional penggantian middleware → proxy
- “Middleware” sering disalahartikan sebagai pola Express.js dan mendorong misuse.
- Next.js ingin developer memakai API yang lebih ergonomis; middleware jadi opsi terakhir.
- “Proxy” menegaskan boundary jaringan (Edge Runtime) di depan app, sesuai perilaku aktual.

### 3. Protected Routes
```typescript
// components/features/auth/auth-guard.tsx
"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    router.push("/sign-in")
    return null
  }

  return <>{children}</>
}
```

## Performance Optimization

### 1. Code Splitting
```typescript
// Lazy loading of components
const AdminPanel = dynamic(() => import("@/components/features/admin/dashboard"), {
  loading: () => <div>Loading admin panel...</div>,
  ssr: false, // Disable SSR for admin components
})
```

### 2. Image Optimization
```typescript
import Image from "next/image"

export function NewsImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={400}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### 3. Font Optimization
```typescript
// app/layout.tsx
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
```

## Responsive Design Architecture

### 1. Mobile-First Approach
```typescript
// Using Tailwind CSS responsive utilities
<div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {/* Responsive grid layout */}
  </div>
</div>
```

### 2. Adaptive Components
```typescript
// components/layout/navbar.tsx
export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Desktop navigation */}
          </div>
          <div className="md:hidden">
            {/* Mobile navigation */}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### 3. Breakpoint Strategy
- `sm`: 640px and up (small tablets)
- `md`: 768px and up (tablets)
- `lg`: 1024px and up (small laptops)
- `xl`: 1280px and up (laptops)
- `2xl`: 1536px and up (desktops)

## Error Handling & Loading States

### 1. Error Boundaries
```typescript
// app/error.tsx
"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button onClick={reset} className="bg-blue-500 text-white px-4 py-2 rounded">
          Try again
        </button>
      </div>
    </div>
  )
}
    </div>
  )
}
```

### 2. Granular Error Boundaries
**Recommendation:** Implement specific error boundaries for critical interactive components (e.g., AI Playground, Video Player) to prevent full page crashes.

```typescript
// components/features/playground/playground-error.tsx
"use client"

export function PlaygroundErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h3 className="text-red-800 font-medium">AI Generation Failed</h3>
      <p className="text-red-600 text-sm mt-1">{error.message}</p>
      <Button onClick={reset} variant="outline" className="mt-2">
        Try Again
      </Button>
    </div>
  )
}
```

### 2. Loading States
```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Skeleton loading cards */}
        </div>
      </div>
    </div>
  )
}
```

### 3. Progressive Enhancement
```typescript
// components/features/lesson-player.tsx
"use client"

import { useState, Suspense } from "react"

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="lesson-player">
      <Suspense fallback={<div>Loading video player...</div>}>
        <VideoPlayer lessonId={lessonId} onLoad={() => setIsLoading(false)} />
      </Suspense>
      {isLoading && <div>Loading lesson content...</div>}
    </div>
  )
}
```

## SEO & Accessibility Architecture

### 1. Metadata Generation
```typescript
// app/news/[id]/page.tsx
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const news = await getNewsById(params.id)

  return {
    title: news.title,
    description: news.summary,
    openGraph: {
      title: news.title,
      description: news.summary,
      images: [news.image],
    },
    alternates: {
      canonical: `/news/${params.id}`,
    },
  }
}
```

### 2. Accessibility Components
```typescript
// Accessible button component
export function AccessibleButton({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={props.ariaLabel || children?.toString()}
    >
      {children}
    </button>
  )
}
```

### 3. Semantic HTML Structure
```typescript
// Semantic page structure
export default function NewsDetailPage() {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">{/* Navigation */}</nav>
      </header>
      <main>
        <article>
          <header>
            <h1>{news.title}</h1>
          </header>
          <div>{news.content}</div>
        </article>
        <aside>
          <nav aria-label="Related articles">{/* Related content */}</nav>
        </aside>
      </main>
      <footer>
        <p>&copy; 2024 Reimaji</p>
      </footer>
    </>
  )
}
```

## 🎨 Design System Development Guidelines

### Design System Implementation Rules

**🚨 CRITICAL:** All components MUST follow the design system specifications in:
`/Users/eriksupit/Desktop/reimaji/knowledge-base/design-system/`

**📋 Quick Reference:** For daily development, see:
`/Users/eriksupit/Desktop/reimaji/agent-os/specs/2025-11-28-reimaji-ai-literacy-platform/DESIGN-SYSTEM-QUICK-REFERENCE.md`

#### 1. Typography Implementation
```typescript
// ✅ CORRECT: Use typography tokens from design system
import { cn } from "@/lib/utils"

export function NewsCard({ title, summary }: NewsCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-h5 text-foreground font-semibold">
        {title}
      </h3>
      <p className="text-body-2 text-muted-foreground">
        {summary}
      </p>
      <time className="text-caption-1 text-muted-foreground">
        {formatDate(publishedAt)}
      </time>
    </div>
  )
}

// ❌ WRONG: Inline styles or arbitrary values
export function NewsCardBad({ title, summary }: NewsCardProps) {
  return (
    <div>
      <h3 style={{fontSize: "24px", fontWeight: 600}}>
        {title}
      </h3>
      <p style={{fontSize: "14px", color: "#666"}}>
        {summary}
      </p>
    </div>
  )
}
```

#### 2. Color Implementation
```typescript
// ✅ CORRECT: Use semantic color tokens
import { cn } from "@/lib/utils"

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-caption-2 font-medium",
      status === "success" && "bg-success text-success-foreground",
      status === "warning" && "bg-warning text-warning-foreground",
      status === "error" && "bg-destructive text-destructive-foreground"
    )}>
      {children}
    </div>
  )
}

// ❌ WRONG: Hardcoded colors
export function StatusBadgeBad({ status, children }: StatusBadgeProps) {
  return (
    <div style={{
      backgroundColor: status === "success" ? "#10b981" : "#ef4444",
      color: "white"
    }}>
      {children}
    </div>
  )
}
```

#### 3. Component Structure Template
```typescript
// Template for all UI components
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// 1. Define variants based on design system specifications
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-small",
        md: "h-10 px-4 py-2 text-medium",
        lg: "h-12 px-6 text-large"
      },
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "primary"
    }
  }
)

// 2. Export component with proper TypeScript types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// 3. Implement component with design system compliance
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

#### 4. Design System Documentation References

For every component, reference the specific design system document:

| Component | Design System Document | Required Tokens |
|-----------|---------------------|-----------------|
| Button | `design-button.md` | Size, variant, state tokens |
| Input | `design-input.md` | Border, focus, disabled states |
| Card | `design-card.md` | Background, border, shadow tokens |
| Navigation | `design-navbar-top.md`, `design-navbar-bottom.md` | Layout, active/inactive states |
| Badge | `design-badge-chip.md` | Status colors, sizing |
| Alert | `design-alert.md` | Status colors, icons, layout |
| Progress | `design-progress-bar.md` | Height, color, animation tokens |
| Avatar | `design-avatar.md` | Size, status indicator positioning |

### Development Workflow with Design System

#### 1. Before Creating Components
1. **Check Design System**: Review corresponding `design-*.md` file
2. **Extract Tokens**: Identify all typography, color, spacing, and shadow tokens
3. **Plan Variants**: Define all size, variant, and state combinations
4. **Accessibility**: Plan ARIA labels, keyboard navigation, and focus states

#### 2. During Development
1. **Use Tailwind Classes**: Map design tokens to Tailwind utilities
2. **Component Variants**: Use `class-variance-authority` for variant management
3. **Consistent Props**: Use consistent prop naming across components
4. **TypeScript Types**: Define proper interfaces and variant types

#### 3. After Creating Components
1. **Visual Testing**: Compare with Figma design specifications
2. **Token Validation**: Ensure all design tokens are correctly applied
3. **Accessibility Testing**: Verify screen reader and keyboard navigation
4. **Documentation**: Update component props and usage examples

### Design System Configuration

#### Tailwind Config Integration
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Typography from design-typography.md
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '58px' }],
        'h2': ['40px', { lineHeight: '48px' }],
        'h3': ['32px', { lineHeight: '38px' }],
        'h4': ['28px', { lineHeight: '34px' }],
        'h5': ['24px', { lineHeight: '28px' }],
        'giant': ['18px', { lineHeight: '24px' }],
        'large': ['16px', { lineHeight: '20px' }],
        'medium': ['14px', { lineHeight: '16px' }],
        'small': ['12px', { lineHeight: '16px' }],
        'tiny': ['10px', { lineHeight: '12px' }],
        'body-1': ['16px', { lineHeight: '24px' }],
        'caption-1': ['12px', { lineHeight: '16px' }],
        'caption-2': ['12px', { lineHeight: '16px' }],
        'caption-3': ['10px', { lineHeight: '14px' }],
        'label': ['12px', { lineHeight: '16px' }],
      },
      // Colors from design-colors.md
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      }
    },
  },
  plugins: [],
}
export default config
```

#### Global CSS Variables
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors from design-colors.md */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 90%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
  }
}

@layer components {
  /* Base component styles following design system */
}
```

This frontend architecture provides a comprehensive foundation for building a scalable, maintainable, and performant React application with Next.js 16, incorporating modern best practices, design system integration, and component development patterns.
