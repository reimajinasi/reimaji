# Reimaji AI Literacy Platform - Development Guide

Platform edukasi AI literacy untuk knowledge worker non-teknis di Indonesia dengan teknologi modern dan best practices development.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x atau lebih baru
- **npm** 9.x atau lebih baru
- **Git** latest version

### One-Command Setup

```bash
# Clone repository
git clone <repository-url> reimaji-platform
cd reimaji-platform

# Run setup script (recommended)
chmod +x scripts/setup-dev.sh && ./scripts/setup-dev.sh

# Atau manual setup
npm install && cp .env.example .env.local
```

### Start Development

```bash
# Terminal 1 - Start frontend
npm run dev

# Terminal 2 - Start backend (Convex)
npx convex dev

# Terminal 3 - Run tests (optional)
npm run test:watch
```

Aplikasi akan tersedia di:
- **Frontend**: http://localhost:3000
- **Backend**: https://your-convex-url.convex.cloud (dari setup Convex)

## 📁 Project Structure

```
reimaji-platform/
├── app/                    # Next.js App Router (routes)
│   ├── (public)/          # Public routes (landing, marketing)
│   ├── (app)/             # Protected user routes
│   ├── admin/             # Admin-only routes
│   └── api/               # API routes & webhooks
├── components/             # React components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── layout/            # Layout components
│   ├── features/          # Feature-specific components
│   └── providers/         # Context providers
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── [feature].ts       # Feature functions
│   └── _generated/        # Auto-generated types
├── lib/                   # Utility libraries
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript definitions
├── docs/                  # Documentation
└── scripts/               # Setup and utility scripts
```

## 🛠️ Development Workflow

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit dengan konfigurasi Anda:
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# NEXT_PUBLIC_CONVEX_URL=your-convex-url
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
# CONVEX_DEPLOYMENT=your-convex-url
# CLERK_SECRET_KEY=your-clerk-secret
# XENDIT_SECRET_KEY=your-xendit-key
# RESEND_API_KEY=your-resend-key
# OPENAI_API_KEY=your-openai-key
```

### 2. Component Development

```typescript
// Contoh component structure
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent } from '@/components/ui/card'

export function NewsCard({ newsId }: { newsId: string }) {
  const news = useQuery(api.news.getById, { id: newsId })

  if (news === undefined) return <div>Loading...</div>
  if (!news) return <div>Not found</div>

  return (
    <Card>
      <CardContent>
        <h2>{news.title}</h2>
        <p>{news.excerpt}</p>
      </CardContent>
    </Card>
  )
}
```

### 3. Backend Function Development

```typescript
// convex/news.ts - Query function
import { query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let newsQuery = ctx.db.query('news')

    if (args.category) {
      newsQuery = newsQuery.filter(q =>
        q.eq(q.field('category'), args.category)
      )
    }

    return await newsQuery.limit(args.limit || 10).collect()
  }
})
```

### 4. Testing

```bash
# Run semua tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Convex (unified data store + server functions)
- **Authentication**: Clerk (user management + role-based access)
- **Payment**: Xendit (subscription processing)
- **AI Integration**: Vercel AI SDK + OpenAI
- **Email**: Resend (transactional emails)
- **Deployment**: Vercel (frontend) + Convex (backend)

### Key Features

1. **News Curation** - AI tools, use cases, regulation updates
2. **Research Summaries** - Academic research with practical implications
3. **Learning Management System** - "Fundamental Generative AI untuk Non-Teknis" course
4. **AI Playground** - Interactive AI tools with educational focus
5. **Admin Panel** - Content management system
6. **Freemium Monetization** - Subscription dengan payment gateway

### User Roles

- **Guest**: Public content access (news, research summaries)
- **Free**: Registered users, basic content access
- **Pro**: Subscribed users, full content access + AI features
- **Admin**: Platform administrators, full system access

## 🔧 Configuration Files

### Package Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy",
    "setup": "./scripts/setup-dev.sh"
  }
}
```

### Environment Variables

```bash
# Public variables (accessible di browser)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Server-only variables (rahasia)
CONVEX_DEPLOYMENT=https://your-convex-url.convex.cloud
CLERK_SECRET_KEY=sk_test_...
XENDIT_SECRET_KEY=xnd_development_...
RESEND_API_KEY=re_...
OPENAI_API_KEY=sk_...
```

## 🧪 Testing Strategy

### Component Testing

```typescript
// Example test file
import { render, screen } from '@testing-library/react'
import { NewsCard } from '@/components/features/news/news-card'

describe('NewsCard', () => {
  it('renders news title', () => {
    render(<NewsCard newsId="test-id" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react'
import { useNews } from '@/lib/hooks/use-news'

describe('useNews', () => {
  it('returns news data', () => {
    const { result } = renderHook(() => useNews())
    expect(result.current.news).toBeDefined()
  })
})
```

## 🚀 Deployment

### Staging Environment

```bash
# Deploy ke staging
npm run deploy:staging

# Run smoke tests
npm run test:e2e:staging
```

### Production Environment

```bash
# Pre-deployment checks
npm run test && npm run type-check && npm run lint

# Deploy backend (Convex)
npx convex deploy --prod

# Deploy frontend (Vercel)
vercel --prod

# Post-deployment health checks
npm run health-check
```

### CI/CD Pipeline

- **GitHub Actions** untuk automated testing dan deployment
- **Code coverage** minimum 80%
- **Type checking** dan **linting** requirements
- **E2E tests** di staging sebelum production

## 🔧 Troubleshooting

### Common Issues

1. **Convex Connection Issues**
   ```bash
   # Check Convex configuration
   npx convex dev --dry-run

   # Verify environment variables
   echo $CONVEX_DEPLOYMENT
   ```

2. **Clerk Authentication Issues**
   ```bash
   # Check proxy configuration
   cat proxy.ts

   # Verify Clerk keys
   grep CLERK_ .env.local
   ```

3. **Build Errors**
   ```bash
   # Clean build
   rm -rf .next node_modules
   npm install
   npm run build
   ```

### Performance Optimization

- Gunakan React.memo untuk heavy components
- Implement code splitting dengan dynamic imports
- Optimasi images dengan Next.js Image component
- Monitor bundle size dengan webpack-bundle-analyzer

## 📚 Documentation

- **[Comprehensive Development Guide](/docs/development/comprehensive-development-guide.md)** - Complete setup dan implementation guide
- **[API Documentation](/docs/api/)** - API endpoints dan Convex functions
- **[Deployment Guide](/docs/deployment/)** - Production deployment procedures
- **[Component Library](/docs/components/)** - Reusable component documentation

## 🔄 Rasional penggantian middleware → proxy
- Istilah “middleware” sering disalahartikan (diasosiasikan dengan Express.js), bikin misuse.
- Next.js mengarahkan ke API yang lebih ergonomis; middleware jadi opsi terakhir.
- “Proxy” menegaskan boundary jaringan di depan app dan default Edge Runtime.
- Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

## 🤝 Contributing

### Development Guidelines

1. **Branching Strategy**: Gunakan feature branches dari `main`
2. **Commit Messages**: Follow conventional commits (`feat:`, `fix:`, `docs:`, dll)
3. **Code Reviews**: Semua PR memerlukan review minimal 1 team member
4. **Testing**: Tambahkan tests untuk new features dan bug fixes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🆘 Support

### Getting Help

1. **Development Issues**: Check troubleshooting guide
2. **Feature Questions**: Refer to documentation
3. **Technical Support**: Create issue dengan template yang sesuai

### Resources

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Convex Documentation](https://docs.convex.dev/)**
- **[Clerk Documentation](https://clerk.com/docs)**
- **[shadcn/ui Documentation](https://ui.shadcn.com/)**

---

## 📞 Contact

**Development Team**: development@reimaji.id
**Support**: support@reimaji.id
**Documentation**: docs.reimaji.id

**Happy coding! 🎉**
