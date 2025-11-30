# Reimaji AI Literacy Platform - AI Development Guide

## Project Overview

Reimaji is a comprehensive AI literacy education platform designed for non-technical knowledge workers in Indonesia. The platform provides news curation, research summaries, a learning management system (LMS), AI playground, and administrative capabilities.

**Tech Stack:**
- **Frontend**: Next.js 16 (App Router) + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Convex (unified backend with data store, server functions, and real-time capabilities)
- **Authentication**: Clerk (user management, role-based access control, social login)
- **Payment**: Xendit (subscription processing, invoice management, webhooks)
- **AI Services**: Vercel AI SDK + OpenAI (content summarization, AI playground)
- **Email**: Resend (transactional emails, notifications)
- **Deployment**: Vercel (frontend) + Convex (backend)
- **Testing**: Jest + Testing Library + Playwright (E2E)

## Architecture Overview

The platform follows a modern full-stack architecture with clear separation of concerns:

```
Frontend (Next.js 16)
├── Server Components (SEO, initial data loading)
├── Client Components (interactive features)
├── App Router (file-based routing with route groups)
└── shadcn/ui + Tailwind CSS (design system)

Authentication & Authorization (Clerk)
├── User identity management
├── Role-based access control (guest/free/pro/admin)
├── Session management
└── Social login integration

Backend & Data Layer (Convex)
├── Database (schema-defined with automatic indexing)
├── Server Functions (queries, mutations, actions)
├── Real-time synchronization
├── File storage
└── HTTP functions (webhooks)

External Integrations
├── Xendit (payment processing)
├── Vercel AI SDK (AI features)
├── Resend (email delivery)
└── GitHub (repository management)
```

## Project Structure

```
reimaji/
├── agent-os/                     # Platform specifications and standards
│   ├── specs/                   # Feature specifications and requirements
│   └── standards/               # Development standards and guidelines
├── knowledge-base/              # Platform documentation and resources
│   ├── design-system/           # Complete UI/UX design specifications
│   ├── env.txt                  # Central credential storage (SECURITY)
│   └── SPECS.md                 # Platform specifications overview
├── scripts/                     # Development and utility scripts
│   └── setup-dev.sh             # Automated development environment setup
├── docs/                        # Additional documentation
├── app/                         # Next.js App Router (main application)
│   ├── (public)/                # Public routes (landing, marketing, news)
│   ├── (app)/                   # Protected user routes (dashboard, LMS)
│   ├── admin/                   # Admin-only routes (content management)
│   └── api/                     # API routes and webhook handlers
├── components/                  # React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── layout/                  # Layout components
│   ├── features/                # Feature-specific components
│   └── providers/               # React context providers
├── convex/                      # Convex backend
│   ├── schema.ts                # Database schema definition
│   ├── types.ts                 # Custom TypeScript types
│   ├── http.ts                  # HTTP functions (webhooks)
│   ├── cron.ts                  # Scheduled tasks
│   ├── users.ts                 # User management functions
│   ├── news.ts                  # News content functions
│   ├── research.ts              # Research content functions
│   ├── courses.ts               # Course management functions
│   ├── modules.ts               # Module management functions
│   ├── lessons.ts               # Lesson management functions
│   ├── quizzes.ts               # Quiz management functions
│   ├── progress.ts              # User progress functions
│   ├── subscriptions.ts        # Subscription management
│   ├── transactions.ts         # Payment transaction functions
│   ├── ai.ts                    # AI integration functions
│   ├── analytics.ts             # Analytics and reporting
│   ├── search.ts                # Search functionality
│   ├── notifications.ts         # Notification system
│   ├── validation.ts            # Input validation helpers
│   ├── permissions.ts           # Permission management
│   ├── utils.ts                 # Utility functions
│   └── constants.ts             # Application constants
├── lib/                         # Utility libraries
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Helper functions
│   ├── types/                   # TypeScript definitions
│   └── env-validation.ts        # Environment variable validation
└── .vscode/                     # VS Code configuration
```

## Development Setup

### Prerequisites
- **Node.js** 20.x or later
- **npm** 9.x or later
- **Git** latest version

### Quick Setup (Recommended)
```bash
# Clone repository
git clone https://github.com/reimajinasi/reimaji.git
cd reimaji

# Run automated setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Start development servers
npm run dev:setup  # Starts both frontend and backend
```

### Manual Setup
```bash
# Install dependencies
npm install

# Setup environment variables
# Copy credentials from knowledge-base/env.txt
cp .env.example .env.local  # Edit with actual values

# Setup Convex backend
npx convex dev

# Start Next.js frontend
npm run dev
```

### Environment Configuration
**Security**: All production credentials are stored in `knowledge-base/env.txt` - NEVER commit actual secrets.

**Required Environment Variables:**
```bash
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Payment Processing (Xendit)
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_PUBLIC_KEY=xnd_public_development_...

# Database (Convex)
NEXT_PUBLIC_CONVEX_URL=https://reimaji.dev.convex.cloud
CONVEX_DEPLOYMENT=reimaji

# Email Service (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@reimaji.id

# AI Services
OPENAI_API_KEY=sk_...

# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Commands

### Core Development
```bash
# Start development servers
npm run dev              # Next.js frontend only
npx convex dev          # Convex backend only
npm run dev:setup       # Start both frontend and backend

# Build and deployment
npm run build            # Production build
npm run start           # Production server
npm run preview         # Preview production build

# Code quality
npm run lint            # ESLint checking
npm run lint:fix        # Auto-fix linting issues
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier
```

### Testing
```bash
# Unit and integration tests
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# End-to-end tests
npm run test:e2e        # Playwright E2E tests
npm run test:e2e:ui     # Playwright UI mode

# Integration testing
npm run test:integrations  # Test external service integrations
```

### Backend Operations
```bash
# Convex development
npx convex dev          # Start development backend
npx convex deploy       # Deploy to production
npx convex dashboard    # Open Convex dashboard

# Database operations
npx convex db dump      # Export database
npx convex db push      # Push schema changes
```

### Setup and Validation
```bash
# Environment setup
./scripts/setup-dev.sh   # Complete automated setup
npm run env:validate    # Validate environment variables
npm run dev:validate    # Validate development setup
```

## Architecture Patterns

### 1. Frontend Architecture (Next.js 16 + App Router)

**Route Organization:**
- `(public)/` - Public routes accessible without authentication
  - Landing page, marketing content
  - News listings and articles
  - Research summaries
- `(app)/` - Protected routes requiring authentication
  - User dashboard
  - Learning management system
  - AI playground
  - Profile and settings
- `admin/` - Admin-only routes with role-based access

**Component Architecture:**
- Server Components for SEO-critical pages and initial data loading
- Client Components for interactive features requiring hooks or state
- Shared components in `components/ui/` (shadcn/ui base)
- Feature-specific components organized by domain

**State Management:**
- Convex React hooks for server state
- React useState/useReducer for local UI state
- Context providers for cross-component state
- Real-time updates via Convex subscriptions

#### Catatan Next.js 16: proxy.ts
- `middleware.ts` diganti menjadi `proxy.ts` untuk proteksi rute global.
- Implementasi ada di `src/proxy.ts` menggunakan `clerkMiddleware` dari Clerk.
- Atur rute lewat `config.matcher`; rute publik jangan dipaksa auth.
- Hindari logika berat di `proxy.ts`; fokus pada auth dan redirect.
- Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

##### Rasional penggantian middleware → proxy
- “Middleware” sering disalahartikan sebagai pola Express.js.
- Next.js ingin penggunaan API alternatif yang lebih baik; middleware jadi opsi terakhir.
- “Proxy” menegaskan posisi di depan app (Edge Runtime), sesuai perilaku sebenarnya.
- Mengurangi overload fitur, bikin tujuan dan batasan lebih jelas.

### 2. Backend Architecture (Convex)

**Function Types:**
- `query` - Read-only data operations
- `mutation` - Write operations that modify data
- `action` - External API calls and complex operations
- `http` - HTTP endpoints for webhooks and external integrations
- `cron` - Scheduled tasks and background jobs

**Data Models:**
```typescript
// Core entities
users - User profiles and authentication data
news - News articles with AI summaries
research - Research papers with practical implications
courses - Course management for LMS
modules - Course modules and lessons
lessons - Individual lesson content
quizzes - Quiz questions and user responses
progress - User learning progress tracking
subscriptions - Subscription status and billing
transactions - Payment transaction records
```

**Security Patterns:**
- Role-based access control in all functions
- Input validation using Convex schemas
- Clerk authentication integration
- Environment variable security

### 3. Integration Architecture

**Authentication Flow (Clerk):**
1. User login via Clerk (email, social providers)
2. Clerk middleware validates session
3. User profile synchronized with Convex database
4. Role-based access control applied throughout application

**Payment Processing (Xendit):**
1. User initiates subscription via frontend
2. Invoice creation through Xendit API
3. Payment processing on Xendit platform
4. Webhook notification to Next.js API route
5. Convex functions update subscription status
6. Email confirmation via Resend

**AI Integration (Vercel AI SDK):**
1. Content processed through Convex actions
2. OpenAI API calls via Vercel AI SDK
3. AI-generated content stored in database
4. Real-time updates to frontend

## Key Development Patterns

### 1. Component Development Pattern
```typescript
// Feature component structure
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent } from '@/components/ui/card'

interface FeatureCardProps {
  id: string
}

export function FeatureCard({ id }: FeatureCardProps) {
  const data = useQuery(api.features.getById, { id })

  if (data === undefined) return <div>Loading...</div>
  if (!data) return <div>Not found</div>

  return (
    <Card>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  )
}
```

### 2. Convex Function Pattern
```typescript
// convex/features.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id)
    return item
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const newItem = await ctx.db.insert('features', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return newItem
  },
})
```

### 3. Form Handling Pattern
```typescript
// Server Actions with form validation
import { z } from 'zod'
import { createAction } from '@/lib/actions'

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
})

export const createFeature = createAction(formSchema, async (data) => {
  const result = await convex.mutation(api.features.create, data)
  return { success: true, data: result }
})
```

## Security Guidelines

### 1. Authentication & Authorization
- Use Clerk middleware for route protection
- Implement role-based access control (RBAC)
- Validate user permissions in Convex functions
- Use Clerk client for frontend authentication

### 2. Data Security
- Never commit secrets or API keys
- Use environment variables for all configuration
- Validate all input data using schemas
- Implement proper error handling without data leakage

### 3. API Security
- Use webhook signature verification for Xendit
- Implement rate limiting for API endpoints
- Use HTTPS for all communications
- Regular security updates for dependencies

## Testing Strategy

### 1. Unit Testing
- Test utility functions and hooks
- Test Convex functions in isolation
- Mock external dependencies
- Aim for high coverage on business logic

### 2. Component Testing
- Test React components with Testing Library
- Mock Convex hooks for component testing
- Test user interactions and state changes
- Focus on critical user flows

### 3. Integration Testing
- Test API endpoints and webhooks
- Test database operations
- Test third-party integrations
- Validate end-to-end data flows

### 4. E2E Testing
- Critical user journeys with Playwright
- Authentication flows
- Payment processing flows
- Learning management workflows

## Deployment Architecture

### 1. Development Environment
- Local development with hot reload
- Convex development backend
- Environment variable validation
- Comprehensive tooling setup

### 2. Staging Environment
- Automated deployment from main branch
- Integration testing before production
- Performance monitoring
- Feature flag management

### 3. Production Environment
- Blue-green deployment strategy
- Zero-downtime deployments
- Comprehensive monitoring and alerting
- Automatic scaling and load balancing

## Performance Optimization

### 1. Frontend Optimization
- Route-based code splitting
- Image optimization with Next.js Image
- Font optimization and preloading
- Client-side caching strategies
- Bundle size monitoring

### 2. Backend Optimization
- Database indexing for query performance
- Efficient Convex query patterns
- Response caching where appropriate
- Real-time synchronization optimization

### 3. CDN and Caching
- Vercel Edge Network for global distribution
- Static asset caching through CDN
- Dynamic content caching with proper invalidation
- Browser caching headers optimization

## Monitoring & Observability

### 1. Application Monitoring
- Error tracking and reporting
- Performance metrics collection
- User behavior analytics
- System health monitoring

### 2. Business Metrics
- User acquisition and retention
- Content engagement metrics
- Subscription conversion rates
- Learning progress completion

## Important Development Notes

### 1. Design System Integration
The platform has a comprehensive design system located at `/knowledge-base/design-system/`. Always reference these specifications before implementing UI components:

- **Foundation Tokens**: Typography, colors, shadows
- **Component Design**: Complete component specifications
- **Navigation Components**: Headers, breadcrumbs, menus
- **Form Controls**: Input patterns and validation
- **Feedback Components**: Alerts, loaders, tooltips

### 2. Environment Security
- All production credentials are stored in `knowledge-base/env.txt`
- Never commit actual secrets to any repository
- Use different keys for development, staging, and production
- Rotate keys regularly and update documentation

### 3. Development Workflow
- Follow the automated setup script for new environments
- Use conventional commits for all changes
- Create focused branches from `main`
- All PRs require automated testing and manual review
- Maintain 80%+ test coverage on critical modules

### 4. Integration Dependencies
- **Clerk**: All authentication and user management
- **Xendit**: Payment processing and subscription management
- **Convex**: Data persistence, real-time updates, and server functions
- **Resend**: Email notifications and transactional emails
- **Vercel AI SDK**: AI content generation and processing

## Quick Reference Commands

```bash
# Environment Setup
./scripts/setup-dev.sh                    # Complete automated setup
npm run env:validate                     # Validate environment

# Development
npm run dev                               # Frontend only
npx convex dev                           # Backend only
npm run dev:setup                        # Both servers

# Code Quality
npm run lint && npm run type-check       # Pre-commit checks
npm run test                              # All tests
npm run test:e2e                         # E2E tests

# Deployment
npx convex deploy                        # Deploy backend
npm run build && npm run start           # Deploy frontend
```

## Resources and Documentation

- **Development Guide**: `/docs/development/comprehensive-development-guide.md`
- **API Documentation**: Generated from Convex functions
- **Design System**: `/knowledge-base/design-system/`
- **Project Specifications**: `/agent-os/specs/2025-11-28-reimaji-ai-literacy-platform/`
- **Standards**: `/agent-os/standards/`

## Credentials
### Superadmin
 **Email**: erik.supit@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Erik
    - **Last Name**: Supit
    - **Role**: superadmin
    - **User ID**:

### Admin
The following credentials are configured for the application:

    - **Email**: reimajinasi@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Jett
    - **Last Name**: Juara
    - **Role**: admin
    - **User ID**:

### User
The following credentials are configured for the application:

    - **Email**: tokayakuwi@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Kaya
    - **Last Name**: Kuwi
    - **Role**: user
    - **User ID*

### Pro
The following credentials are configured for the application:

    - **Email**: 1200pixels@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Seribu
    - **Last Name**: Duaratus
    - **Role**: pro
    - **User ID**

> **SECURITY WARNING**: These are permanent credentials for the application. Never commit credentials to version control.
