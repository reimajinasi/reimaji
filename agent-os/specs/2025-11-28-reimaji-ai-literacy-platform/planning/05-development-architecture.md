# Development Architecture - Reimaji AI Literacy Platform

## Overview

The development architecture establishes comprehensive guidelines, standards, and workflows for building, deploying, and maintaining the Reimaji AI Literacy Platform. This framework ensures consistency, quality, and scalability across the entire development lifecycle.

## 🔐 Development Environment Setup & Credentials

**🚨 SECURITY REMINDER:** All production credentials and API keys are documented in:
`/Users/eriksupit/Desktop/reimaji/knowledge-base/env.txt`

### Quick Development Setup

```bash
# 1. Clone repository and navigate to project
git clone [repository-url]
cd reimaji

# 2. Run automated setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# 3. Configure environment variables
# Copy from knowledge-base/env.txt to .env.local
cp knowledge-base/env.txt .env.local.template

# 4. Validate setup
npm run dev:validate

# 5. Start development
npm run dev
```

### Environment Configuration

**Development Environment (.env.local):**
```bash
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Payment Processing (Xendit)
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_PUBLIC_KEY=xnd_public_development_...

# Email Service (Resend)
RESEND_API_KEY=re_...

# Database (Convex)
NEXT_PUBLIC_CONVEX_URL=https://reimaji.dev.convex.cloud
CONVEX_DEPLOYMENT=reimaji

# Development Tools
NEXT_TELEMETRY_DISABLED=1
```

**Security Validation Script:**
```bash
#!/bin/bash
# scripts/validate-env.sh

echo "🔍 Validating environment configuration..."

# Check for .env.local file
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Copy from knowledge-base/env.txt"
    exit 1
fi

# Check for required environment variables
source .env.local

required_vars=(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "XENDIT_SECRET_KEY"
    "RESEND_API_KEY"
    "NEXT_PUBLIC_CONVEX_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required variable: $var"
        exit 1
    fi
done

echo "✅ Environment validation passed"
```

### Development Tools Configuration

**VS Code Settings (.vscode/settings.json):**
```json
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "files.exclude": {
        "**/.env.local": true,
        "**/node_modules": true,
        "**/.next": true
    },
    "env.validation": {
        "enabled": true,
        "credentialPath": "../knowledge-base/env.txt"
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "css"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

**Git Hooks (.git/hooks/pre-commit):**
```bash
#!/bin/bash
# Prevent credential commits
if git diff --cached --name-only | grep -E "\.env"; then
    echo "❌ Environment files should not be committed!"
    exit 1
fi

# Run linting and type checking
npm run lint:fix
npm run type-check

echo "✅ Pre-commit checks passed"
```

## Development Workflow Architecture

### 1. Development Process Flow

```
┌─────────────────┐
│   Planning      │
│   & Requirements│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Design        │
│   & Architecture│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Development   │
│   (Block by     │
│    Block)       │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Code Review   │
│   & Testing     │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Deployment    │
│   & Integration │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Monitoring    │
│   & Maintenance │
└─────────────────┘
```

### 2. Block-by-Block Development Strategy

```typescript
// Example Block Development Structure
const DEVELOPMENT_BLOCKS = {
  BLOCK_1: {
    name: "Authentication Foundation",
    components: [
      "Clerk integration setup",
      "User registration flow",
      "Protected routes proxy",
      "User profile management",
    ],
    dependencies: ["Project setup", "Database schema"],
    deliverables: [
      "Working authentication system",
      "User registration and login",
      "Protected route guards (proxy)",
    ],
  },

  BLOCK_2: {
    name: "Content Management",
    components: [
      "News CRUD operations",
      "Research CRUD operations",
      "Content publishing workflow",
      "Admin content management",
    ],
    dependencies: ["BLOCK_1", "Database schema"],
    deliverables: [
      "Complete news management",
      "Research content system",
      "Admin content dashboard",
    ],
  },

  BLOCK_3: {
    name: "Learning Management System",
    components: [
      "Course structure",
      "Video lesson player",
      "Progress tracking",
      "Quiz system",
    ],
    dependencies: ["BLOCK_1", "BLOCK_2"],
    deliverables: [
      "Functional LMS",
      "Video lesson system",
      "Progress tracking",
    ],
  },
} as const
```

## Project Structure & Organization

### 1. Complete Directory Architecture

```
reimaji-platform/
├── .github/                     # GitHub configuration
│   ├── workflows/               # CI/CD pipelines
│   │   ├── ci.yml              # Continuous integration
│   │   ├── deploy.yml          # Deployment pipeline
│   │   └── security.yml        # Security scanning
│   ├── PULL_REQUEST_TEMPLATE.md # PR template
│   └── ISSUE_TEMPLATE/         # Issue templates
│       ├── bug_report.md
│       └── feature_request.md
├── .vscode/                     # VS Code configuration
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
├── app/                         # Next.js App Router
│   ├── (public)/               # Public routes
│   ├── (app)/                  # Protected routes
│   ├── admin/                  # Admin routes
│   ├── api/                    # API routes
│   ├── globals.css
│   ├── layout.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── opengraph-image.tsx
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   ├── layout/                 # Layout components
│   ├── features/               # Feature-specific components
│   └── providers/              # Context providers
├── convex/                      # Convex backend
│   ├── schema.ts               # Database schema
│   ├── [module].ts             # Backend functions
│   ├── test/                   # Backend tests
│   └── _generated/             # Generated types
├── lib/                         # Utility libraries
│   ├── auth.ts                 # Authentication helpers
│   ├── convex.ts               # Convex client setup
│   ├── hooks/                  # Custom hooks
│   ├── types/                  # TypeScript types
│   └── utils/                  # General utilities
├── public/                      # Static assets
│   ├── images/                 # Images
│   ├── icons/                  # Icons
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                        # Documentation
│   ├── api/                    # API documentation
│   ├── deployment/             # Deployment guides
│   └── development/            # Development guides
├── scripts/                     # Build and utility scripts
│   ├── build.sh               # Build script
│   ├── deploy.sh              # Deployment script
│   └── seed-data.ts           # Data seeding
├── tests/                       # Test files
│   ├── __mocks__/             # Mock files
│   ├── fixtures/              # Test fixtures
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── .env.example                 # Environment variables template
├── .env.local.example           # Local environment example
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── components.json               # shadcn/ui configuration
├── convex.json                  # Convex configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # Project documentation
└── LICENSE                      # License file
```

### 2. Component Naming Conventions

```typescript
// File naming conventions
// - kebab-case for folders: news-card, lesson-player
// - PascalCase for components: NewsCard, LessonPlayer
// - camelCase for hooks: useAuth, useNewsData

// Directory structure examples
components/
├── ui/                          # Base components
│   ├── button.tsx              # <Button />
│   ├── input.tsx               # <Input />
│   ├── card.tsx                # <Card />
│   └── dialog.tsx              # <Dialog />
├── layout/                      # Layout components
│   ├── navbar.tsx              # <Navbar />
│   ├── sidebar.tsx             # <Sidebar />
│   ├── page-shell.tsx          # <PageShell />
│   └── dashboard-layout.tsx    # <DashboardLayout />
├── features/                    # Feature-specific components
│   ├── news/                   # News feature
│   │   ├── news-card.tsx       # <NewsCard />
│   │   ├── news-list.tsx       # <NewsList />
│   │   ├── news-detail.tsx     # <NewsDetail />
│   │   └── index.ts            # Barrel exports
│   ├── auth/                   # Authentication feature
│   │   ├── auth-guard.tsx      # <AuthGuard />
│   │   ├── sign-in-form.tsx    # <SignInForm />
│   │   └── user-menu.tsx       # <UserMenu />
│   └── lms/                    # LMS feature
│       ├── course-card.tsx     # <CourseCard />
│       ├── lesson-player.tsx   # <LessonPlayer />
│       └── progress-bar.tsx    # <ProgressBar />
```

### 3. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
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
      "@/types/*": ["./lib/types/*"]
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

## Coding Standards & Guidelines

### 1. Frontend Development Standards

```typescript
// Component structure template
import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComponentProps {
  // Define props with TypeScript interfaces
  id: string
  title: string
  onAction?: () => void
  variant?: "default" | "secondary"
}

export function ComponentName({
  id,
  title,
  onAction,
  variant = "default"
}: ComponentProps) {
  // 1. Hooks at the top
  const [state, setState] = useState<DataType | null>(null)
  const data = useQuery(api.data.getById, { id })

  // 2. Computed values
  const isLoading = data === undefined
  const canEdit = data?.canEdit === true

  // 3. Event handlers
  const handleClick = () => {
    if (canEdit && onAction) {
      onAction()
    }
  }

  // 4. Effects
  useEffect(() => {
    if (data) {
      setState(data)
    }
  }, [data])

  // 5. Early returns
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Not found</div>
  }

  // 6. Main render
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
        <Button
          variant={variant}
          onClick={handleClick}
          disabled={!canEdit}
        >
          Action
        </Button>
      </CardContent>
    </Card>
  )
}

// Export with descriptive name
export default ComponentName
```

### 2. Backend Development Standards

```typescript
// Convex function structure template
import { query, mutation, action } from "./_generated/server"
import { v } from "convex/values"

// Define argument types at the top
export const createArgs = {
  title: v.string(),
  content: v.string(),
  clerkUserId: v.string(),
  tags: v.optional(v.array(v.string())),
} as const

export const updateArgs = {
  id: v.id("entityName"),
  updates: v.object({
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }),
  clerkUserId: v.string(),
} as const

// Query function (read operations)
export const getById = query({
  args: { id: v.id("entityName") },
  handler: async (ctx, { id }) => {
    // 1. Input validation
    const entity = await ctx.db.get(id)
    if (!entity) {
      throw new Error("Entity not found")
    }

    // 2. Permission checks
    if (entity.isPrivate) {
      // Add permission logic here
    }

    // 3. Return data
    return entity
  },
})

// Mutation function (write operations)
export const create = mutation({
  args: createArgs,
  handler: async (ctx, args) => {
    // 1. Authenticate user
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.clerkUserId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // 2. Authorize action
    if (user.role !== "admin") {
      throw new Error("Unauthorized")
    }

    // 3. Validation
    if (!args.title.trim()) {
      throw new Error("Title is required")
    }

    // 4. Create entity
    const now = Date.now()
    const entityId = await ctx.db.insert("entityName", {
      title: args.title,
      content: args.content,
      tags: args.tags || [],
      userId: user._id,
      createdAt: now,
      updatedAt: now,
    })

    // 5. Return result
    return entityId
  },
})

// Action function (external API calls)
export const processWithAI = action({
  args: {
    id: v.id("entityName"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { id, clerkUserId }) => {
    // 1. Authentication
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user) {
      throw new Error("User not found")
    }

    // 2. Rate limiting
    if (user.role !== "pro") {
      const todayUsage = await ctx.runQuery(api.ai.getTodayUsage, { userId: user._id })
      if (todayUsage >= 5) {
        throw new Error("Daily limit reached")
      }
    }

    // 3. Get data
    const entity = await ctx.runQuery(api.entityName.getById, { id })
    if (!entity) {
      throw new Error("Entity not found")
    }

    // 4. External API call
    try {
      const response = await fetch("https://api.external-service.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: entity.content }),
      })

      if (!response.ok) {
        throw new Error("External API error")
      }

      const result = await response.json()

      // 5. Update database
      await ctx.runMutation(api.entityName.update, {
        id,
        updates: { processedContent: result.data },
      })

      return result
    } catch (error) {
      console.error("AI processing error:", error)
      throw new Error("Failed to process with AI")
    }
  },
})
```

### 3. Custom Hooks Patterns

```typescript
// lib/hooks/use-data.ts
import { useQuery, useMutation, useSubscription } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect, useCallback } from "react"

// Data fetching hook
export function useDataQuery(queryName: string, args?: any) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const result = useQuery((api as any)[queryName], args)

  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true)
    } else {
      setData(result)
      setIsLoading(false)
      setError(null)
    }
  }, [result])

  return { data, isLoading, error }
}

// Mutation hook with optimistic updates
export function useDataMutation(mutationName: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation((api as any)[mutationName])

  const execute = useCallback(async (args: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutation(args)
      return result
    } catch (err: any) {
      setError(err.message || "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [mutation])

  return { execute, isLoading, error }
}

// Real-time subscription hook
export function useRealtimeData(subscriptionName: string, args?: any) {
  const [data, setData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // Note: This would need to be adapted based on Convex's real-time capabilities
  const subscription = useSubscription((api as any)[subscriptionName], args)

  useEffect(() => {
    if (subscription) {
      setData(subscription)
      setIsConnected(true)
    }
  }, [subscription])

  return { data, isConnected }
}
```

## Testing Architecture

### 1. Testing Strategy

```
┌─────────────────┐
│   Unit Tests    │
│   (Jest +       │
│   Testing       │
│   Library)      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Integration   │
│   Tests         │
│   (API + DB)    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   E2E Tests     │
│   (Playwright)  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Performance   │
│   Tests          │
│   (Lighthouse)  │
└─────────────────┘
```

### 2. Testing Configuration

```json
// package.json test scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "lighthouse-ci"
  }
}
```

```javascript
// jest.config.js
const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/.next/**",
    "!**/api/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### 3. Test Examples

```typescript
// __tests__/components/Button.test.tsx
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button Component", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("applies correct variant classes", () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-destructive")
  })
})
```

```typescript
// __tests__/hooks/useAuth.test.tsx
import { renderHook, act } from "@testing-library/react"
import { useAuth } from "@/lib/hooks/use-auth"
import { convexClient } from "@/lib/convex"

// Mock Convex client
jest.mock("@/lib/convex")
const mockConvex = convexClient as jest.MockedFunction<typeof convexClient>

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns initial state correctly", () => {
    mockConvex.mockReturnValue({
      query: jest.fn(),
      mutation: jest.fn(),
    } as any)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeUndefined()
  })

  it("handles successful authentication", async () => {
    const mockUser = { id: "user123", email: "test@example.com" }
    mockConvex.mockReturnValue({
      query: {
        users: {
          getByClerkId: jest.fn().mockResolvedValue(mockUser),
        },
      },
      mutation: {
        users: {
          createOrUpdate: jest.fn().mockResolvedValue(mockUser.id),
        },
      },
    } as any)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      // Simulate Clerk authentication
      result.current.signIn!("mockClerkUser")
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })
})
```

## CI/CD Pipeline Architecture

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: lint-and-test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL }}
          CONVEX_DEPLOYMENT: ${{ secrets.CONVEX_DEPLOYMENT }}

  e2e-tests:
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.APP_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

  deploy-backend:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Deploy Convex functions
        run: npx convex deploy
        env:
          CONVEX_DEPLOYMENT: ${{ secrets.CONVEX_DEPLOYMENT }}

  notify-deployment:
    runs-on: ubuntu-latest
    needs: [deploy-frontend, deploy-backend]

    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          message: "🚀 Reimaji Platform deployed to production!"
```

## Environment Configuration

### 1. Environment Variables Management

```bash
# .env.example - Template for all environments
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# Server-side Configuration
CONVEX_DEPLOYMENT=https://your-convex-url.convex.cloud
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
XENDIT_SECRET_KEY=xnd_development_your_xendit_key
XENDIT_WEBHOOK_TOKEN=your_webhook_token
RESEND_API_KEY=re_your_resend_key
RESEND_FROM_EMAIL=noreply@reimaji.id

# External Services
OPENAI_API_KEY=sk_your_openai_key
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_ORG_ID=your_vercel_org_id

# Development Only
NEXT_PUBLIC_APP_ENV=development
```

```typescript
// lib/env.ts - Environment variables with type safety
import { z } from "zod"

const envSchema = z.object({
  // Public environment variables
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),

  // Server-only environment variables
  CONVEX_DEPLOYMENT: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  XENDIT_SECRET_KEY: z.string().min(1),
  XENDIT_WEBHOOK_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  OPENAI_API_KEY: z.string().min(1),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export function validateEnv() {
  try {
    envSchema.parse(process.env)
  } catch (error) {
    console.error("Environment validation failed:", error)
    process.exit(1)
  }
}
```

### 2. Development Environment Setup

```bash
#!/bin/bash
# scripts/setup-dev.sh

echo "🚀 Setting up Reimaji Development Environment"

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Copy environment template
echo "⚙️ Setting up environment variables..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📝 Please update .env.local with your configuration"
fi

# Generate Convex types
echo "🔧 Generating Convex types..."
npx convex dev --dry-run

# Setup pre-commit hooks
echo "🪝 Setting up pre-commit hooks..."
npx husky install

# Run type check
echo "🔍 Running type check..."
npm run type-check

echo "✅ Development environment setup complete!"
echo "💡 Run 'npm run dev' to start the development server"
```

## Performance & Optimization

### 1. Performance Monitoring

```typescript
// lib/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  measurePageLoad(name: string) {
    if (typeof window !== "undefined") {
      const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.fetchStart
      this.recordMetric(name, loadTime)
    }
  }

  measureApiCall(name: string, startTime: number, endTime: number) {
    const duration = endTime - startTime
    this.recordMetric(`api.${name}`, duration)
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || []
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  reportMetrics() {
    const report: Record<string, number> = {}
    for (const [name] of this.metrics) {
      report[name] = this.getAverageMetric(name)
    }
    return report
  }
}

// Usage in API calls
export async function withPerformanceTracking<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now()
  try {
    const result = await operation()
    const endTime = performance.now()
    PerformanceMonitor.getInstance().measureApiCall(name, startTime, endTime)
    return result
  } catch (error) {
    const endTime = performance.now()
    PerformanceMonitor.getInstance().measureApiCall(`${name}.error`, startTime, endTime)
    throw error
  }
}
```

### 2. Image and Asset Optimization

```typescript
// lib/image-optimization.ts
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  placeholder?: "blur" | "empty"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = "blur",
}: OptimizedImageProps) {
  const blurDataURL = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/xjqNzTakmeZQQM5xQB5AASFqv8AEm8+F/AA`

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className="transition-opacity duration-300"
      onLoadingComplete={(img) => {
        img.classList.remove("opacity-0")
      }}
    />
  )
}
```

This comprehensive development architecture provides the foundation for building a scalable, maintainable, and high-quality Reimaji AI Literacy Platform with clear standards, efficient workflows, and robust testing strategies.
### Rasional penggantian middleware → proxy
- “Middleware” membingungkan dan sering disalahartikan sebagai pola Express.js.
- Next.js dorong API yang lebih ergonomis, middleware hanya last resort.
- “Proxy” menegaskan boundary jaringan dan Edge Runtime default.
