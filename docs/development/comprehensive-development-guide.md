# Reimaji AI Literacy Platform - Comprehensive Development Guide

## Quick Start Guide

### Prerequisites

- **Node.js**: Version 20.x or later
- **npm**: Version 9.x or later
- **Git**: Latest stable version
- **VS Code**: Recommended IDE with extensions (see setup below)

### One-Command Development Setup

```bash
# Clone and setup in one command
git clone <repository-url> reimaji-platform
cd reimaji-platform
chmod +x scripts/setup-dev.sh && ./scripts/setup-dev.sh
```

### Manual Setup (Alternative)

```bash
# 1. Clone repository
git clone <repository-url> reimaji-platform
cd reimaji-platform

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Initialize Convex
npx convex dev

# 5. Start development servers
npm run dev  # Starts Next.js on port 3000
```

### Required Environment Variables

```bash
# .env.local - Fill in with your actual keys
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

CONVEX_DEPLOYMENT=https://your-convex-url.convex.cloud
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
XENDIT_SECRET_KEY=xnd_development_your_xendit_key
XENDIT_WEBHOOK_TOKEN=your_webhook_token
RESEND_API_KEY=re_your_resend_key
RESEND_FROM_EMAIL=noreply@reimaji.id
OPENAI_API_KEY=sk_your_openai_key
```

### VS Code Extensions Setup

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "clerk.clerk-vscode",
    "convex.dev.convex"
  ]
}
```

## Project Architecture & Folder Structure

### Complete Directory Structure

```
reimaji-platform/
├── app/                         # Next.js App Router
│   ├── (public)/               # Public routes (landing, marketing)
│   │   ├── page.tsx           # Homepage
│   │   ├── news/              # Public news articles
│   │   └── research/          # Public research summaries
│   ├── (app)/                  # Protected user routes
│   │   ├── dashboard/          # User dashboard
│   │   ├── learning/           # LMS courses and lessons
│   │   ├── playground/         # AI playground
│   │   └── profile/           # User profile management
│   ├── admin/                  # Admin-only routes
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── content/           # Content management
│   │   ├── users/             # User management
│   │   └── payments/          # Payment management
│   ├── api/                    # API routes (webhooks, external APIs)
│   │   ├── webhooks/          # Webhook handlers
│   │   └── external/          # External API integrations
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── error.tsx              # Error boundary
│   └── not-found.tsx          # 404 page
├── components/                  # React components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── dialog.tsx         # Dialog component
│   │   └── form/              # Form components
│   ├── layout/                 # Layout components
│   │   ├── navbar.tsx         # Navigation bar
│   │   ├── sidebar.tsx        # Sidebar navigation
│   │   ├── footer.tsx         # Footer
│   │   └── page-shell.tsx     # Page wrapper component
│   ├── features/               # Feature-specific components
│   │   ├── news/              # News feature components
│   │   │   ├── news-card.tsx  # News article card
│   │   │   ├── news-list.tsx  # News listing
│   │   │   └── news-detail.tsx # News detail view
│   │   ├── lms/               # Learning management components
│   │   │   ├── course-card.tsx # Course card
│   │   │   ├── lesson-player.tsx # Video player
│   │   │   └── progress-bar.tsx # Progress tracking
│   │   ├── auth/              # Authentication components
│   │   │   ├── sign-in-form.tsx # Sign in form
│   │   │   ├── sign-up-form.tsx # Sign up form
│   │   │   └── auth-guard.tsx   # Route protection
│   │   └── payments/          # Payment components
│   │       ├── subscription-form.tsx # Subscription form
│   │       └── payment-status.tsx   # Payment status
│   └── providers/              # Context providers
│       ├── convex-provider.tsx # Convex client provider
│       ├── clerk-provider.tsx  # Clerk auth provider
│       └── theme-provider.tsx # Theme provider
├── convex/                      # Convex backend
│   ├── schema.ts               # Database schema definition
│   ├── users.ts                # User management functions
│   ├── news.ts                 # News content functions
│   ├── courses.ts              # LMS course functions
│   ├── payments.ts             # Payment processing
│   ├── ai.ts                   # AI integration functions
│   ├── emails.ts               # Email automation
│   └── _generated/             # Auto-generated types
├── lib/                         # Utility libraries
│   ├── auth.ts                 # Authentication helpers
│   ├── convex.ts               # Convex client setup
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-auth.ts         # Authentication hook
│   │   ├── use-news.ts         # News data hook
│   │   └── use-courses.ts      # Course data hook
│   ├── utils/                  # Utility functions
│   │   ├── formatting.ts       # Text formatting
│   │   ├── validation.ts       # Form validation
│   │   └── api.ts              # API helpers
│   └── types/                  # TypeScript type definitions
│       ├── user.ts             # User types
│       ├── content.ts          # Content types
│       └── api.ts              # API response types
├── public/                      # Static assets
│   ├── images/                 # Image assets
│   ├── icons/                  # Icon files
│   └── favicon.ico             # Favicon
└── docs/                        # Project documentation
    ├── api/                    # API documentation
    ├── deployment/             # Deployment guides
    └── development/            # Development guides
```

## Implementation Patterns & Best Practices

### 1. Component Development Patterns

#### Standard Component Structure

```typescript
// components/features/news/news-card.tsx
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from '@/lib/utils/formatting'

interface NewsCardProps {
  newsId: string
  variant?: 'default' | 'featured' | 'compact'
  showExcerpt?: boolean
  className?: string
}

export function NewsCard({
  newsId,
  variant = 'default',
  showExcerpt = true,
  className = ''
}: NewsCardProps) {
  // Data fetching with Convex
  const news = useQuery(api.news.getById, { id: newsId })

  // Loading and error states
  if (news === undefined) {
    return <NewsCardSkeleton variant={variant} />
  }

  if (!news) {
    return <div>Article not found</div>
  }

  // Component rendering
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{news.title}</CardTitle>
          <Badge variant="secondary">{news.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(news.publishedAt)}
        </p>
      </CardHeader>

      {(showExcerpt || variant === 'featured') && (
        <CardContent>
          <p className="text-sm line-clamp-3">{news.excerpt}</p>
          {variant === 'featured' && news.featuredImage && (
            <img
              src={news.featuredImage}
              alt={news.title}
              className="mt-3 rounded-lg w-full h-48 object-cover"
            />
          )}
        </CardContent>
      )}
    </Card>
  )
}

// Skeleton loading component
function NewsCardSkeleton({ variant }: { variant: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </CardHeader>
      {variant === 'featured' && (
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
```

#### Custom Hook Pattern

```typescript
// lib/hooks/use-news.ts
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState, useCallback } from 'react'
import type { Doc } from '@/convex/_generated/dataModel'

export function useNews(options?: {
  category?: string
  limit?: number
  featured?: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Query for news list
  const news = useQuery(api.news.list, {
    category: options?.category,
    limit: options?.limit,
    featured: options?.featured
  })

  // Mutation for bookmarking
  const bookmarkNews = useMutation(api.news.bookmark)

  const toggleBookmark = useCallback(async (newsId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await bookmarkNews({ newsId })
    } catch (err: any) {
      setError(err.message || 'Failed to bookmark article')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [bookmarkNews])

  return {
    news,
    isLoading,
    error,
    toggleBookmark,
    refetch: () => {} // Convex handles this automatically
  }
}
```

### 2. Backend Function Patterns

#### Convex Query Pattern

```typescript
// convex/news.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Public news query
export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    cursor: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let newsQuery = ctx.db.query('news')

    // Apply filters
    if (args.category) {
      newsQuery = newsQuery.filter(q =>
        q.eq(q.field('category'), args.category)
      )
    }

    if (args.featured) {
      newsQuery = newsQuery.filter(q =>
        q.eq(q.field('featured'), true)
      )
    }

    // Only return published news
    newsQuery = newsQuery.filter(q =>
      q.eq(q.field('status'), 'published')
    )

    // Order by publication date (newest first)
    newsQuery = newsQuery.order('desc')

    // Apply pagination
    if (args.limit) {
      newsQuery = newsQuery.limit(args.limit)
    }

    return await newsQuery.collect()
  }
})

// Get specific news article
export const getById = query({
  args: { id: v.id('news') },
  handler: async (ctx, { id }) => {
    const news = await ctx.db.get(id)

    if (!news) {
      return null
    }

    // Increment view count (only for published articles)
    if (news.status === 'published') {
      await ctx.db.patch(id, {
        viewCount: (news.viewCount || 0) + 1
      })
    }

    return news
  }
})
```

#### Convex Mutation Pattern

```typescript
// convex/news.ts (continued)

export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    clerkUserId: v.string()
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await getCurrentUser(ctx, args.clerkUserId)
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    // Validation
    if (!args.title.trim()) {
      throw new Error('Title is required')
    }

    if (!args.content.trim()) {
      throw new Error('Content is required')
    }

    // Create news article
    const now = Date.now()
    const newsId = await ctx.db.insert('news', {
      title: args.title.trim(),
      excerpt: args.excerpt.trim(),
      content: args.content.trim(),
      category: args.category,
      tags: args.tags || [],
      featured: args.featured || false,
      status: 'draft', // Start as draft, admin can publish
      userId: user._id,
      publishedAt: null,
      viewCount: 0,
      createdAt: now,
      updatedAt: now
    })

    // Create notification for admin users
    await ctx.scheduler.runAfter(0, internal.notifications.create, {
      type: 'news_created',
      title: 'New Article Created',
      message: `Article "${args.title}" has been created`,
      userId: user._id,
      relatedId: newsId
    })

    return newsId
  }
})

// Helper function for user authentication
async function getCurrentUser(ctx: any, clerkUserId: string) {
  return await ctx.db
    .query('users')
    .filter(q => q.eq(q.field('clerkUserId'), clerkUserId))
    .first()
}
```

#### Convex Action Pattern (External API Integration)

```typescript
// convex/ai.ts
import { action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'

export const summarizeContent = action({
  args: {
    contentId: v.id('news'),
    clerkUserId: v.string()
  },
  handler: async (ctx, { contentId, clerkUserId }) => {
    // Authentication and authorization
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    // Get the content
    const content = await ctx.runQuery(api.news.getById, { id: contentId })
    if (!content) {
      throw new Error('Content not found')
    }

    // Check if AI feature is available for this user
    if (user.role !== 'pro') {
      const todayUsage = await ctx.runQuery(api.ai.getTodayUsage, {
        userId: user._id
      })
      if (todayUsage >= 5) {
        throw new Error('Daily AI usage limit reached for free users')
      }
    }

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI literacy educator. Create a concise, educational summary of the following AI-related news article, focusing on its implications for non-technical knowledge workers in Indonesia.'
            },
            {
              role: 'user',
              content: `Title: ${content.title}\n\nContent: ${content.content}`
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const result = await response.json()
      const summary = result.choices[0].message.content

      // Update content with AI summary
      await ctx.runMutation(api.news.update, {
        id: contentId,
        updates: {
          aiSummary: summary,
          summarizedAt: Date.now()
        }
      })

      // Track AI usage
      await ctx.runMutation(api.ai.trackUsage, {
        userId: user._id,
        type: 'summary',
        contentId
      })

      return { summary }

    } catch (error: any) {
      console.error('AI summarization error:', error)
      throw new Error('Failed to generate AI summary')
    }
  }
})
```

### 3. Authentication & Authorization Patterns

#### Clerk Integration with Middleware

```typescript
// middleware.ts
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  // Routes that require authentication
  afterAuth: (auth, req) => {
    // Handle authenticated users
    if (auth.userId) {
      // Redirect authenticated users away from auth pages
      if (req.nextUrl.pathname.startsWith('/sign-in') ||
          req.nextUrl.pathname.startsWith('/sign-up')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Handle unauthenticated users
    if (!auth.userId) {
      // Redirect to sign in for protected routes
      const protectedRoutes = ['/dashboard', '/learning', '/playground', '/profile']
      const adminRoutes = ['/admin']

      const isProtectedRoute = protectedRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
      )

      const isAdminRoute = adminRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
      )

      if (isProtectedRoute || isAdminRoute) {
        return redirectToSignIn({ returnBackUrl: req.url })
      }
    }
  },

  // Clerk configuration
  publicRoutes: [
    '/',
    '/news',
    '/research',
    '/api/webhooks' // Allow webhook access
  ]
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ]
}
```

#### User Role Management

```typescript
// lib/auth.ts
import { auth } from '@clerk/nextjs/server'
import { convexClient } from './convex'
import { api } from '@/convex/_generated/api'

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  try {
    // Get or create user in Convex
    const user = await convexClient.query(api.users.getByClerkId, {
      clerkUserId: userId
    })

    if (!user) {
      // Create user if doesn't exist
      const { sessionClaims } = await auth()
      const email = sessionClaims?.email as string
      const name = sessionClaims?.name as string

      return await convexClient.mutation(api.users.createOrUpdate, {
        clerkUserId: userId,
        email,
        name,
        role: 'free' // Default role
      })
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireRole(requiredRole: 'admin' | 'pro' | 'free') {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  const roleHierarchy = { admin: 3, pro: 2, free: 1 }
  const userLevel = roleHierarchy[user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole]

  if (userLevel < requiredLevel) {
    throw new Error(`${requiredRole} role required`)
  }

  return user
}
```

## Configuration Templates

### 1. Package.json Configuration

```json
{
  "name": "reimaji-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy",
    "setup": "node scripts/setup.js"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",

    "convex": "^1.0.0",
    "clerk": "^5.0.0",
    "@clerk/nextjs": "^5.0.0",

    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",

    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0",

    "ai": "^3.0.0",
    "openai": "^4.0.0",

    "resend": "^3.0.0",

    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",

    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",

    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",

    "@playwright/test": "^1.40.0",

    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 2. Tailwind CSS Configuration

```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

### 3. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"],
      "@/public/*": ["./public/*"],
      "@/types/*": ["./lib/types/*"],
      "@/utils/*": ["./lib/utils/*"],
      "@/hooks/*": ["./lib/hooks/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 4. Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['resend']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
        ],
      },
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Fix for wallet adapters and other browser-specific modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

### 5. ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "react-hooks/exhaustive-deps": "warn"
  },
  "overrides": [
    {
      "files": ["*.js"],
      "rules": {
        "@typescript-eslint/no-require-imports": "off"
      }
    }
  ]
}
```

## API Integration Guides

### 1. Xendit Payment Integration

#### Frontend Payment Form

```typescript
// components/features/payments/subscription-form.tsx
import React, { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration: 'monthly' | 'yearly'
  features: string[]
}

const plans: SubscriptionPlan[] = [
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 99000,
    duration: 'monthly',
    features: [
      'Unlimited news access',
      'Full research library',
      'Complete LMS access',
      'AI playground features',
      'Email support'
    ]
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: 990000,
    duration: 'yearly',
    features: [
      'All monthly features',
      '2 months free (save 20%)',
      'Priority support',
      'Exclusive webinars'
    ]
  }
]

export function SubscriptionForm() {
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const createSubscription = useMutation(api.payments.createSubscription)

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId)
    setIsLoading(true)

    try {
      const result = await createSubscription({
        planId,
        returnUrl: window.location.href,
        successUrl: `${window.location.origin}/dashboard?subscription=success`,
        failureUrl: `${window.location.origin}/pricing?subscription=failed`
      })

      if (result.invoiceUrl) {
        // Redirect to Xendit payment page
        window.location.href = result.invoiceUrl
      } else {
        throw new Error('Failed to create payment invoice')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create subscription')
    } finally {
      setIsLoading(false)
      setSelectedPlan('')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <Card key={plan.id} className="relative">
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                Rp {plan.price.toLocaleString('id-ID')}
              </span>
              <span className="text-muted-foreground">
                /{plan.duration === 'monthly' ? 'bulan' : 'tahun'}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading && selectedPlan === plan.id}
            >
              {isLoading && selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

#### Backend Payment Processing

```typescript
// convex/payments.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createSubscription = mutation({
  args: {
    planId: v.string(),
    returnUrl: v.string(),
    successUrl: v.string(),
    failureUrl: v.string(),
    clerkUserId: v.string()
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await getCurrentUser(ctx, args.clerkUserId)
    if (!user) {
      throw new Error('User not found')
    }

    // Define plan configurations
    const plans = {
      'pro-monthly': {
        name: 'Pro Monthly',
        amount: 99000,
        duration: 'monthly'
      },
      'pro-yearly': {
        name: 'Pro Yearly',
        amount: 990000,
        duration: 'yearly'
      }
    }

    const plan = plans[args.planId as keyof typeof plans]
    if (!plan) {
      throw new Error('Invalid plan selected')
    }

    try {
      // Create Xendit invoice
      const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_id: `reimaji-subscription-${Date.now()}`,
          amount: plan.amount,
          description: `${plan.name} Subscription`,
          payer_email: user.email,
          customer: {
            given_names: user.name,
            email: user.email,
          },
          success_redirect_url: args.successUrl,
          failure_redirect_url: args.failureUrl,
          invoice_duration: 86400, // 24 hours in seconds
          currency: 'IDR',
          items: [
            {
              name: plan.name,
              price: plan.amount,
              quantity: 1
            }
          ],
          fees: [
            {
              type: 'XENDIT',
              value: 5000 // Fixed admin fee
            }
          ]
        })
      })

      if (!xenditResponse.ok) {
        const error = await xenditResponse.text()
        console.error('Xendit error:', error)
        throw new Error('Failed to create payment invoice')
      }

      const invoice = await xenditResponse.json()

      // Save transaction to database
      const transactionId = await ctx.db.insert('transactions', {
        userId: user._id,
        type: 'subscription',
        planId: args.planId,
        amount: plan.amount,
        status: 'pending',
        xenditInvoiceId: invoice.id,
        xenditInvoiceUrl: invoice.invoice_url,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      return {
        transactionId,
        invoiceUrl: invoice.invoice_url,
        invoiceId: invoice.id
      }

    } catch (error: any) {
      console.error('Payment creation error:', error)
      throw new Error('Failed to process payment request')
    }
  }
})

// Webhook handler for payment status updates
export const handleXenditWebhook = mutation({
  args: {
    headers: v.any(),
    body: v.any()
  },
  handler: async (ctx, { headers, body }) => {
    // Verify webhook signature
    const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN
    const receivedToken = headers['x-callback-token']

    if (receivedToken !== webhookToken) {
      throw new Error('Invalid webhook signature')
    }

    const { event, data } = body

    if (event === 'invoice.paid') {
      // Find the transaction
      const transaction = await ctx.db
        .query('transactions')
        .filter(q => q.eq(q.field('xenditInvoiceId'), data.id))
        .first()

      if (!transaction) {
        console.error('Transaction not found for invoice:', data.id)
        return { success: false, error: 'Transaction not found' }
      }

      // Update transaction status
      await ctx.db.patch(transaction._id, {
        status: 'completed',
        paymentMethod: data.payment_method,
        paidAt: Date.now(),
        updatedAt: Date.now()
      })

      // Update user subscription
      const user = await ctx.db.get(transaction.userId)
      if (user) {
        const subscriptionDuration = transaction.planId.includes('yearly') ? 365 : 30
        const subscriptionEndsAt = Date.now() + (subscriptionDuration * 24 * 60 * 60 * 1000)

        await ctx.db.patch(user._id, {
          role: 'pro',
          subscriptionEndsAt,
          updatedAt: Date.now()
        })

        // Send confirmation email
        await ctx.scheduler.runAfter(0, internal.emails.sendPaymentConfirmation, {
          userId: user._id,
          transactionId: transaction._id
        })
      }

      return { success: true, message: 'Payment processed successfully' }
    }

    return { success: true, message: 'Webhook processed' }
  }
})
```

### 2. Vercel AI SDK Integration

#### AI Playground Component

```typescript
// components/features/playground/ai-chat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const chatWithAI = useMutation(api.ai.chatWithAssistant)

  // Get conversation history if needed
  const conversationHistory = useQuery(api.ai.getConversationHistory, {
    limit: 50
  })

  useEffect(() => {
    // Load existing messages
    if (conversationHistory) {
      setMessages(conversationHistory)
    }
  }, [conversationHistory])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await chatWithAI({
        message: input.trim(),
        conversationHistory: messages.slice(-10) // Send last 10 messages for context
      })

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Learning Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with our AI learning assistant!</p>
                <p className="text-sm">Ask me anything about AI concepts, tools, or learning paths.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about AI concepts, tools, or learning paths..."
              className="flex-1 resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### Backend AI Functions

```typescript
// convex/ai.ts
import { action, mutation } from './_generated/server'
import { v } from 'convex/values'

export const chatWithAssistant = action({
  args: {
    message: v.string(),
    conversationHistory: v.optional(v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number()
    }))),
    clerkUserId: v.string()
  },
  handler: async (ctx, { message, conversationHistory = [], clerkUserId }) => {
    // Get user and check permissions
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user) {
      throw new Error('User not found')
    }

    // Check AI usage limits for free users
    if (user.role !== 'pro') {
      const todayUsage = await ctx.runQuery(api.ai.getTodayUsage, {
        userId: user._id
      })

      if (todayUsage >= 10) { // 10 messages per day for free users
        throw new Error('Daily AI chat limit reached. Upgrade to Pro for unlimited access.')
      }
    }

    try {
      // Prepare messages for OpenAI
      const systemMessage = {
        role: 'system' as const,
        content: `You are an AI literacy assistant for Reimaji, an educational platform for non-technical knowledge workers in Indonesia.

Your role is to help users understand AI concepts, tools, and practical applications in their work. You should:

1. Explain complex AI concepts in simple, practical terms
2. Focus on real-world applications relevant to knowledge workers
3. Provide specific, actionable advice
4. Use Indonesian and English as appropriate based on the user's language preference
5. Be encouraging and supportive in your responses
6. Recommend learning resources from the Reimaji platform when relevant

Keep your responses concise but comprehensive, and always consider the practical implications for non-technical professionals.`
      }

      const messages = [
        systemMessage,
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: message
        }
      ]

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('OpenAI API error:', error)
        throw new Error('AI service temporarily unavailable')
      }

      const result = await response.json()
      const aiResponse = result.choices[0].message.content

      // Save conversation to database
      await ctx.runMutation(api.ai.saveMessage, {
        userId: user._id,
        userMessage: message,
        assistantResponse: aiResponse,
        timestamp: Date.now()
      })

      // Track AI usage
      await ctx.runMutation(api.ai.trackUsage, {
        userId: user._id,
        type: 'chat',
        metadata: {
          messageLength: message.length,
          responseLength: aiResponse.length
        }
      })

      return { response: aiResponse }

    } catch (error: any) {
      console.error('AI chat error:', error)
      throw new Error('Failed to process AI request')
    }
  }
})

// Save conversation to database
export const saveMessage = mutation({
  args: {
    userId: v.id('users'),
    userMessage: v.string(),
    assistantResponse: v.string(),
    timestamp: v.number()
  },
  handler: async (ctx, { userId, userMessage, assistantResponse, timestamp }) => {
    await ctx.db.insert('aiMessages', {
      userId,
      userMessage,
      assistantResponse,
      timestamp,
      createdAt: timestamp
    })
  }
})

// Get conversation history
export const getConversationHistory = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number())
  },
  handler: async (ctx, { userId, limit = 50 }) => {
    const messages = await ctx.db
      .query('aiMessages')
      .filter(q => q.eq(q.field('userId'), userId))
      .order('desc')
      .limit(limit)
      .collect()

    // Transform messages into chat format
    const conversationHistory: any[] = []

    messages.reverse().forEach(msg => {
      conversationHistory.push({
        id: `user-${msg._id}`,
        role: 'user',
        content: msg.userMessage,
        timestamp: msg.timestamp
      })

      conversationHistory.push({
        id: `assistant-${msg._id}`,
        role: 'assistant',
        content: msg.assistantResponse,
        timestamp: msg.timestamp + 1 // Small offset to maintain order
      })
    })

    return conversationHistory
  }
})
```

### 3. Resend Email Integration

#### Email Service Setup

```typescript
// convex/emails.ts
import { action } from './_generated/server'
import { v } from 'convex/values'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendWelcomeEmail = action({
  args: {
    userId: v.id('users')
  },
  handler: async (ctx, { userId }) => {
    try {
      const user = await ctx.runQuery(api.users.getById, { id: userId })
      if (!user) {
        throw new Error('User not found')
      }

      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: [user.email],
        subject: 'Selamat Datang di Reimaji Platform AI Literacy! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Selamat Datang di Reimaji</title>
            <style>
              body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 30px; }
              .content { padding: 20px 0; }
              .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding-top: 30px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Selamat Datang di Reimaji! 🚀</h1>
                <p>Platform AI Literacy untuk Knowledge Worker Indonesia</p>
              </div>

              <div class="content">
                <p>Halo ${user.name || 'Pengguna Baru'},</p>

                <p>Terima kasih telah bergabung dengan Reimaji! Kami sangat bersemangat untuk membantu Anda memahami dunia AI dengan cara yang praktis dan relevan untuk pekerjaan Anda.</p>

                <h2>🎯 Apa yang bisa Anda lakukan sekarang:</h2>
                <ul>
                  <li><strong>Berita AI Terkini:</strong> Dapatkan update terbaru tentang tools, use cases, dan regulasi AI di Indonesia</li>
                  <li><strong>Research Summaries:</strong> Akses ringkasan penelitian AI dengan implikasi praktis untuk bisnis Anda</li>
                  <li><strong>Learning Paths:</strong> Ikuti jalur pembelajaran "Fundamental Generative AI untuk Non-Teknis"</li>
                  <li><strong>AI Playground:</strong> Coba berbagai tools AI dalam lingkungan yang aman dan edukatif</li>
                </ul>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                    Mulai Eksplorasi Dashboard
                  </a>
                </div>

                <h2>💡 Tips untuk memulai:</h2>
                <p>1. Lengkapi profile Anda untuk personalisasi konten yang lebih baik</p>
                <p>2. Mulai dengan course "AI Fundamentals" di Learning Management System</p>
                <p>3. Ikuti berita AI terkini untuk tetap update dengan perkembangan terbaru</p>

                <p>Jika ada pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>

                <p>Salam,</p>
                <p>Team Reimaji</p>
              </div>

              <div class="footer">
                <p>© 2024 Reimaji. All rights reserved.</p>
                <p>Anda menerima email ini karena telah mendaftar di platform Reimaji.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Selamat Datang di Reimaji!

          Halo ${user.name || 'Pengguna Baru'},

          Terima kasih telah bergabung dengan Reimaji! Platform AI Literacy untuk Knowledge Worker Indonesia.

          Mulai eksplorasi Anda di: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

          Salam,
          Team Reimaji
        `
      })

      if (error) {
        console.error('Email send error:', error)
        throw new Error('Failed to send welcome email')
      }

      return { success: true, messageId: data?.id }
    } catch (error: any) {
      console.error('Welcome email error:', error)
      throw new Error('Failed to send welcome email')
    }
  }
})

export const sendPaymentConfirmation = action({
  args: {
    userId: v.id('users'),
    transactionId: v.id('transactions')
  },
  handler: async (ctx, { userId, transactionId }) => {
    try {
      const [user, transaction] = await Promise.all([
        ctx.runQuery(api.users.getById, { id: userId }),
        ctx.runQuery(api.payments.getTransaction, { id: transactionId })
      ])

      if (!user || !transaction) {
        throw new Error('User or transaction not found')
      }

      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: [user.email],
        subject: 'Konfirmasi Pembayaran Berhasil - Reimaji Pro',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Konfirmasi Pembayaran Reimaji</title>
          </head>
          <body>
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h1 style="color: #28a745; text-align: center;">✅ Pembayaran Berhasil!</h1>

              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2>Detail Pembayaran:</h2>
                <p><strong>Paket:</strong> ${transaction.planId}</p>
                <p><strong>Jumlah:</strong> Rp ${transaction.amount.toLocaleString('id-ID')}</p>
                <p><strong>Tanggal:</strong> ${new Date(transaction.paidAt).toLocaleDateString('id-ID')}</p>
                <p><strong>Transaksi ID:</strong> ${transaction._id}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Akses Dashboard Pro
                </a>
              </div>

              <h2>Sekarang Anda bisa menikmati:</h2>
              <ul>
                <li>✅ Akses unlimited ke semua konten berita dan research</li>
                <li>✅ Semua course dan learning paths</li>
                <li>✅ AI Playground dengan full features</li>
                <li>✅ Support prioritas</li>
              </ul>

              <p>Terima kasih atas kepercayaan Anda terhadap Reimaji!</p>
            </div>
          </body>
          </html>
        `
      })

      if (error) {
        console.error('Payment confirmation email error:', error)
        throw new Error('Failed to send payment confirmation email')
      }

      return { success: true, messageId: data?.id }
    } catch (error: any) {
      console.error('Payment confirmation email error:', error)
      throw new Error('Failed to send payment confirmation email')
    }
  }
})
```

## Testing Strategies

### 1. Unit Testing Setup

```typescript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/api/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/(components|lib)/**/__tests__/*.{js,jsx,ts,tsx}'
  ]
}

module.exports = createJestConfig(customJestConfig)
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useSubscription: jest.fn(),
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  auth: () => Promise.resolve({ userId: 'user123' }),
  useAuth: () => ({ isSignedIn: true, userId: 'user123' }),
  UserButton: () => <div>UserButton</div>,
  SignIn: () => <div>SignIn</div>,
  SignUp: () => <div>SignUp</div>,
}))
```

### 2. Component Testing Examples

```typescript
// __tests__/components/news-card.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NewsCard } from '@/components/features/news/news-card'
import { api } from '@/convex/_generated/api'

// Mock Convex hooks
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}))

const mockUseQuery = require('convex/react').useQuery

describe('NewsCard Component', () => {
  const mockNews = {
    _id: 'news123',
    title: 'AI Development in Indonesia',
    excerpt: 'Latest developments in AI technology',
    category: 'Technology',
    publishedAt: Date.now() - 3600000, // 1 hour ago
    featured: false,
    status: 'published',
    viewCount: 100,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders news article correctly', () => {
    mockUseQuery.mockReturnValue(mockNews)

    render(<NewsCard newsId="news123" />)

    expect(screen.getByText('AI Development in Indonesia')).toBeInTheDocument()
    expect(screen.getByText('Latest developments in AI technology')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText(/hour ago/)).toBeInTheDocument()
  })

  it('shows loading skeleton while loading', () => {
    mockUseQuery.mockReturnValue(undefined) // Loading state

    render(<NewsCard newsId="news123" />)

    expect(screen.getByTestId('news-card-skeleton')).toBeInTheDocument()
  })

  it('handles missing news article', () => {
    mockUseQuery.mockReturnValue(null)

    render(<NewsCard newsId="news123" />)

    expect(screen.getByText('Article not found')).toBeInTheDocument()
  })

  it('renders featured variant correctly', () => {
    mockUseQuery.mockReturnValue({
      ...mockNews,
      featured: true,
      featuredImage: 'https://example.com/image.jpg'
    })

    render(<NewsCard newsId="news123" variant="featured" />)

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'AI Development in Indonesia')
  })

  it('does not show excerpt when showExcerpt is false', () => {
    mockUseQuery.mockReturnValue(mockNews)

    render(<NewsCard newsId="news123" showExcerpt={false} />)

    expect(screen.queryByText('Latest developments in AI technology')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    mockUseQuery.mockReturnValue(mockNews)

    render(<NewsCard newsId="news123" className="custom-class" />)

    const card = screen.getByRole('article') || screen.getByText('AI Development in Indonesia').closest('div')
    expect(card).toHaveClass('custom-class')
  })
})
```

### 3. Hook Testing

```typescript
// __tests__/hooks/use-news.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useNews } from '@/lib/hooks/use-news'
import { api } from '@/convex/_generated/api'

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}))

const mockUseQuery = require('convex/react').useQuery
const mockUseMutation = require('convex/react').useMutation

describe('useNews Hook', () => {
  const mockNews = [
    { _id: '1', title: 'News 1', category: 'tech' },
    { _id: '2', title: 'News 2', category: 'ai' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns news data correctly', () => {
    mockUseQuery.mockReturnValue(mockNews)
    mockUseMutation.mockReturnValue({
      mutate: jest.fn(),
      loading: false,
    })

    const { result } = renderHook(() => useNews())

    expect(result.current.news).toEqual(mockNews)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('handles loading state', () => {
    mockUseQuery.mockReturnValue(undefined)
    mockUseMutation.mockReturnValue({
      mutate: jest.fn(),
      loading: false,
    })

    const { result } = renderHook(() => useNews())

    expect(result.current.news).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
  })

  it('handles bookmark toggle', async () => {
    const mockBookmarkMutation = jest.fn()
    mockUseQuery.mockReturnValue(mockNews)
    mockUseMutation.mockReturnValue({
      mutate: mockBookmarkMutation,
      loading: false,
    })

    const { result } = renderHook(() => useNews())

    await act(async () => {
      await result.current.toggleBookmark('news123')
    })

    expect(mockBookmarkMutation).toHaveBeenCalledWith({ newsId: 'news123' })
  })

  it('filters news by category', () => {
    mockUseQuery.mockReturnValue(mockNews.filter(n => n.category === 'ai'))
    mockUseMutation.mockReturnValue({
      mutate: jest.fn(),
      loading: false,
    })

    const { result } = renderHook(() => useNews({ category: 'ai' }))

    expect(result.current.news).toHaveLength(1)
    expect(result.current.news[0].category).toBe('ai')
  })
})
```

### 4. E2E Testing with Playwright

```typescript
// tests/e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Journey', () => {
  test('new user can sign up and access free content', async ({ page }) => {
    // Visit homepage
    await page.goto('/')

    // Check homepage loads
    await expect(page.locator('h1')).toContainText('Reimaji')

    // Click sign up
    await page.click('text=Sign Up')

    // Fill registration form
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="name-input"]', 'Test User')

    // Submit form
    await page.click('[data-testid="sign-up-button"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.locator('text=Welcome, Test User')).toBeVisible()

    // Can access public news
    await page.click('text=News')
    await expect(page.locator('[data-testid="news-list"]')).toBeVisible()

    // Can see free content badges
    await expect(page.locator('[data-testid="free-badge"]').first()).toBeVisible()
  })

  test('pro user can access premium content', async ({ page }) => {
    // Mock authenticated pro user
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-db-jwt', 'mock-pro-token')
    })

    await page.goto('/dashboard')

    // Can access all content
    await page.click('text=Learning')
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    await page.click('text=Playground')
    await expect(page.locator('[data-testid="ai-chat"]')).toBeVisible()

    // No upgrade prompts
    await expect(page.locator('text=Upgrade to Pro')).not.toBeVisible()
  })

  test('free user sees upgrade prompts for premium content', async ({ page }) => {
    // Mock authenticated free user
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-db-jwt', 'mock-free-token')
    })

    await page.goto('/learning')

    // Should see upgrade prompt for premium courses
    await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible()

    // Click on premium course
    await page.click('[data-testid="premium-course"]')

    // Should show upgrade modal
    await expect(page.locator('[data-testid="upgrade-modal"]')).toBeVisible()
  })
})

test.describe('Admin Features', () => {
  test('admin can create and manage news content', async ({ page }) => {
    // Mock admin authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-db-jwt', 'mock-admin-token')
    })

    await page.goto('/admin')

    // Should have access to admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible()

    // Can create news article
    await page.click('text=Create News Article')

    await page.fill('[data-testid="article-title"]', 'Test AI News Article')
    await page.fill('[data-testid="article-content"]', 'This is test content for AI news article.')
    await page.selectOption('[data-testid="article-category"]', 'Technology')

    await page.click('[data-testid="save-article"]')

    // Should show success message
    await expect(page.locator('text=Article created successfully')).toBeVisible()

    // Article should appear in the list
    await expect(page.locator('text=Test AI News Article')).toBeVisible()
  })
})
```

## Deployment Procedures

### 1. Production Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code coverage meets threshold (>80%)
- [ ] No console.log statements in production code
- [ ] Environment variables validated

### Security Review
- [ ] No hardcoded secrets or API keys
- [ ] CORS configuration is appropriate
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] Authentication and authorization checks
- [ ] HTTPS enforced in production

### Performance
- [ ] Images optimized and lazy loaded
- [ ] Bundle size optimized
- [ ] Database queries optimized
- [ ] Caching strategies implemented
- [ ] Lighthouse performance score >90

### Content & Features
- [ ] All features working as expected
- [ ] Content properly seeded
- [ ] Email templates working
- [ ] Payment integration tested
- [ ] Error pages configured

### Monitoring & Logging
- [ ] Error tracking configured (Sentry)
- [ ] Analytics tracking implemented
- [ ] Performance monitoring set up
- [ ] Database monitoring configured
```

### 2. Vercel Deployment Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app-url",
    "NEXT_PUBLIC_CONVEX_URL": "@convex-url",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@clerk-publishable-key"
  },
  "functions": {
    "app/api/webhooks/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        }
      ]
    }
  ]
}
```

### 3. GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.NEXT_PUBLIC_CONVEX_URL }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

  deploy-backend:
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy Convex functions
        run: npx convex deploy
        env:
          CONVEX_DEPLOYMENT: ${{ secrets.CONVEX_DEPLOYMENT }}
          CONVEX_TOKEN: ${{ secrets.CONVEX_TOKEN }}
```

### 4. Environment Management

```bash
# scripts/deploy-staging.sh
#!/bin/bash

echo "🚀 Deploying to Staging Environment..."

# Set staging environment variables
export NEXT_PUBLIC_APP_ENV=staging
export NEXT_PUBLIC_APP_URL=https://staging.reimaji.id

# Build and deploy to Vercel staging
vercel --prod --token $VERCEL_TOKEN

echo "✅ Staging deployment complete!"

# Run smoke tests
npm run test:e2e:staging

echo "🧪 Smoke tests completed!"
```

```bash
# scripts/deploy-production.sh
#!/bin/bash

echo "🚀 Deploying to Production Environment..."

# Pre-deployment checks
npm run test
npm run type-check
npm run lint

# Set production environment variables
export NEXT_PUBLIC_APP_ENV=production
export NEXT_PUBLIC_APP_URL=https://reimaji.id

# Deploy Convex functions
npx convex deploy --prod

# Deploy frontend
vercel --prod --token $VERCEL_TOKEN

echo "✅ Production deployment complete!"

# Run production health checks
npm run health-check

echo "🏥 Health checks completed!"
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Authentication Issues

```typescript
// Debug auth issues
// lib/debug-auth.ts
import { auth } from '@clerk/nextjs/server'
import { convexClient } from './convex'

export async function debugAuth() {
  try {
    const { userId, sessionClaims } = await auth()
    console.log('Clerk User ID:', userId)
    console.log('Session Claims:', sessionClaims)

    if (userId) {
      const user = await convexClient.query(api.users.getByClerkId, {
        clerkUserId: userId
      })
      console.log('Convex User:', user)
    }
  } catch (error) {
    console.error('Auth debug error:', error)
  }
}
```

**Common Problems:**
- Clerk not configured properly
- User not found in Convex database
- Middleware redirect loops

**Solutions:**
1. Verify Clerk environment variables
2. Check user creation flow in Convex
3. Review middleware configuration

#### 2. Payment Integration Issues

```typescript
// Debug payment issues
// lib/debug-payments.ts
export async function debugPaymentWebhook(body: any, headers: any) {
  console.log('Payment webhook headers:', headers)
  console.log('Payment webhook body:', body)

  // Verify signature
  const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN
  const receivedToken = headers['x-callback-token']

  console.log('Expected token:', webhookToken)
  console.log('Received token:', receivedToken)

  if (receivedToken !== webhookToken) {
    console.error('Webhook signature mismatch')
    return false
  }

  return true
}
```

**Common Problems:**
- Xendit webhook signature verification fails
- Database transaction updates fail
- Email notifications not sending

**Solutions:**
1. Verify webhook token configuration
2. Check Convex function permissions
3. Test Resend API configuration

#### 3. Performance Issues

```typescript
// Debug performance
// lib/debug-performance.ts
export function debugPageLoad() {
  if (typeof window !== 'undefined') {
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    console.log('Page Load Metrics:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
      firstPaint: window.performance.getEntriesByType('paint')[0]?.startTime,
      firstContentfulPaint: window.performance.getEntriesByType('paint')[1]?.startTime,
    })
  }
}
```

**Common Problems:**
- Slow initial page load
- Large bundle sizes
- Database query performance

**Solutions:**
1. Implement code splitting
2. Optimize images and assets
3. Add database indexes
4. Use React.memo and useMemo appropriately

#### 4. Convex Development Issues

```typescript
// Debug Convex connection
// lib/debug-convex.ts
import { convexClient } from './convex'

export async function debugConvexConnection() {
  try {
    // Test basic connection
    const result = await convexClient.query(api.users.list, { limit: 1 })
    console.log('Convex connection test:', result)

    // Test authentication
    const { userId } = await auth()
    if (userId) {
      const user = await convexClient.query(api.users.getByClerkId, {
        clerkUserId: userId
      })
      console.log('Convex auth test:', user)
    }
  } catch (error) {
    console.error('Convex debug error:', error)
  }
}
```

**Common Problems:**
- Convex deployment not connected
- Schema migration issues
- Function not found errors

**Solutions:**
1. Verify CONVEX_DEPLOYMENT environment variable
2. Run `npx convex dev` to sync schema
3. Check function names and imports

### 2. Environment Variable Issues

```typescript
// Debug environment variables
// lib/debug-env.ts
export function debugEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_CONVEX_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CONVEX_DEPLOYMENT',
    'CLERK_SECRET_KEY',
    'XENDIT_SECRET_KEY',
    'RESEND_API_KEY'
  ]

  const missing = requiredEnvVars.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('Missing environment variables:', missing)
    return false
  }

  console.log('✅ All required environment variables present')
  return true
}
```

### 3. Build and Deployment Issues

```bash
# Debug build issues
# scripts/debug-build.sh

echo "🔍 Debugging build process..."

# Check Node.js version
echo "Node.js version:"
node --version

# Check npm version
echo "npm version:"
npm --version

# Check available memory
echo "Available memory:"
free -h

# Clean build artifacts
echo "Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run type check
echo "Running type check..."
npm run type-check

# Try building
echo "Attempting build..."
npm run build
```

This comprehensive development guide provides everything needed to set up, develop, test, and deploy the Reimaji AI Literacy Platform. The guide includes practical code examples, configuration templates, and step-by-step procedures that development teams can use immediately.