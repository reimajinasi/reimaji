# Reimaji AI Literacy Platform - System Overview & Architecture

## Executive Summary

The Reimaji AI Literacy Platform is a comprehensive educational platform designed to provide AI literacy training for non-technical knowledge workers. The system integrates modern web technologies to deliver news curation, research summaries, learning management system (LMS), AI playground, and administrative capabilities in a scalable, secure architecture.

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│ Next.js 16 (App Router) + TypeScript                        │
│ shadcn/ui + Tailwind CSS                                    │
│ Client Components: Interactive features                     │
│ Server Components: SEO & initial data loading              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Authentication                          │
├─────────────────────────────────────────────────────────────┤
│ Clerk Authentication & Authorization                        │
│ Middleware: Route protection                               │
│ Role-based access control                                  │
│ User management & profile                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend/Data Layer                      │
├─────────────────────────────────────────────────────────────┤
│ Convex (Unified Backend)                                   │
│ - Data Store (Database)                                    │
│ - Server Functions (API)                                   │
│ - Real-time Updates                                         │
│ - File Storage                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Integrations                      │
├─────────────────────────────────────────────────────────────┤
│ Xendit: Payment Processing                                 │
│ Vercel AI SDK: AI Features                                 │
│ Resend: Email Delivery                                    │
│ Vercel: Hosting & Deployment                              │
└─────────────────────────────────────────────────────────────┘
```

## Core System Components

### 1. Frontend Application Layer
**Technology**: Next.js 16 with App Router

**Responsibilities**:
- User interface rendering and interaction
- Client-side state management
- Server-side rendering for SEO-critical pages
- Route-based code splitting and lazy loading
- Progressive web app capabilities

**Key Features**:
- Marketing pages (landing, news, research)
- User dashboard and LMS interface
- AI playground with real-time interactions
- Admin panel for content management
- Responsive design for mobile and desktop

### 2. Authentication & Authorization Layer
**Technology**: Clerk Authentication

**Responsibilities**:
- User identity management
- Session management
- Role-based access control
- Multi-factor authentication
- Social login integration

**Role Hierarchy**:
- `guest`: No authentication, limited content access
- `free`: Registered users, basic content access
- `pro`: Subscribed users, full content access
- `admin`: Platform administrators, full system access

### 3. Backend & Data Layer
**Technology**: Convex (Unified Backend)

**Responsibilities**:
- Data persistence and querying
- Business logic implementation
- API endpoint management
- Real-time data synchronization
- File storage and management

**Core Data Models**:
- Users and profiles
- Content management (news, research, courses)
- Learning progress tracking
- Subscription and billing data

### 4. Payment & Subscription Layer
**Technology**: Xendit Payment Gateway

**Responsibilities**:
- Invoice generation and management
- Payment processing and verification
- Subscription lifecycle management
- Webhook event handling
- Refund and cancellation processing

### 5. AI & Content Generation Layer
**Technology**: Vercel AI SDK

**Responsibilities**:
- Content summarization for news and research
- AI playground functionality
- Risk assessment and explanations
- Educational content generation
- Real-time AI model interactions

### 6. Communication Layer
**Technology**: Resend Email Service

**Responsibilities**:
- Welcome email delivery
- Payment confirmation notifications
- Subscription status updates
- Educational content delivery
- Administrative notifications

## Data Flow Architecture

### User Registration & Onboarding Flow
```
1. User Registration (Clerk)
   ↓
2. User Profile Creation (Convex)
   ↓
3. Welcome Email (Resend)
   ↓
4. Dashboard Initialization (Next.js)
   ↓
5. Content Recommendations (Convex Queries)
```

### Content Access Flow
```
1. User Request (Next.js)
   ↓
2. Authentication Check (Clerk Middleware)
   ↓
3. Authorization Verification (Convex)
   ↓
4. Content Retrieval (Convex Queries)
   ↓
5. UI Rendering (Next.js Components)
   ↓
6. Progress Tracking (Convex Mutations)
```

### Payment & Subscription Flow
```
1. Subscription Request (Next.js)
   ↓
2. Invoice Creation (Xendit API)
   ↓
3. Payment Processing (Xendit)
   ↓
4. Webhook Receipt (Next.js API Route)
   ↓
5. Subscription Update (Convex)
   ↓
6. Confirmation Email (Resend)
   ↓
7. Access Level Update (Clerk/Convex)
```

### AI Content Generation Flow
```
1. Admin Content Input (Next.js)
   ↓
2. Raw Content Processing (Convex)
   ↓
3. AI Summarization (Vercel AI SDK)
   ↓
4. Content Enhancement (Convex Functions)
   ↓
5. Storage & Publication (Convex)
   ↓
6. User Access (Next.js Frontend)
```

## Security Architecture

### Authentication Security
- JWT-based session management through Clerk
- Secure password hashing and storage
- Multi-factor authentication support
- Session timeout and refresh mechanisms
- Social login provider integration

### Data Security
- End-to-end encryption for sensitive data
- Role-based data access control
- Input validation and sanitization
- Injection prevention melalui API typed Convex dan validasi input
- XSS protection through React and Next.js

### API Security
- Webhook signature verification (Xendit)
- Rate limiting and abuse prevention
- CORS configuration for cross-origin requests
- Environment variable management for secrets
- API key rotation policies

### Infrastructure Security
- HTTPS enforcement across all endpoints
- Content Security Policy (CSP) implementation
- Secure headers configuration
- Regular security updates and patching
- Monitoring and alerting for security events

## Performance Architecture

### Frontend Optimization
- Code splitting by route and component
- Image optimization and lazy loading
- Font optimization and preloading
- Static generation for marketing pages
- Client-side caching strategies

### Backend Optimization
- Database indexing for query performance
- Real-time data synchronization
- Efficient query patterns in Convex
- Response caching where appropriate
- Connection pooling and management

### CDN & Caching Strategy
- Vercel Edge Network for global distribution
- Static asset caching through CDN
- Dynamic content caching with proper invalidation
- Browser caching headers optimization
- API response caching strategies

## Scalability Architecture

### Horizontal Scaling
- Serverless functions for API endpoints
- Auto-scaling through Vercel platform
- Database scaling through Convex managed service
- Load balancing across edge locations
- Microservice architecture for future expansion

### Vertical Scaling
- Resource allocation optimization
- Memory usage optimization
- CPU-intensive task management
- Database query optimization
- Concurrent request handling

### Content Delivery Scaling
- Global CDN distribution
- Image and video optimization
- Progressive content loading
- Adaptive streaming for video content
- Geographic content distribution

## Monitoring & Observability

### Application Monitoring
- Error tracking and reporting
- Performance metrics collection
- User behavior analytics
- System health monitoring
- Custom event tracking

### Infrastructure Monitoring
- Server response times
- Database performance metrics
- Third-party service availability
- Network latency monitoring
- Resource utilization tracking

### Business Metrics
- User acquisition and retention
- Content engagement metrics
- Subscription conversion rates
- Learning progress completion
- Platform usage analytics

## Deployment Architecture

### Development Environment
- Local development with hot reload
- Database seeding and migration tools
- Staging environment for testing
- Feature flag management
- Debugging and profiling tools

### Production Deployment
- Automated deployment through Vercel
- Blue-green deployment strategy
- Rollback capabilities
- Environment-specific configurations
- Zero-downtime deployment process

### Continuous Integration/Deployment
- Automated testing on code changes
- Code quality and security scanning
- Build and test automation
- Deployment pipeline management
- Rollback and recovery procedures

This system overview provides the foundation for detailed technical specifications in subsequent documentation sections, ensuring all development team members understand the complete architecture and component relationships.
