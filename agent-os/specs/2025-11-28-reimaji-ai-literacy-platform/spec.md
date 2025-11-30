# Specification: Reimaji AI Literacy Platform - System Design Documentation

## Goal
Integrate and organize the comprehensive system design documentation for the Reimaji AI Literacy Platform, providing a unified technical architecture blueprint that encompasses frontend, backend, integration patterns, and development guidelines for the development team.

## User Stories
- As a developer, I want a complete system architecture overview so that I can understand the entire platform structure and component relationships
- As a team lead, I want detailed technical specifications for each system layer so that I can guide development and ensure consistency
- As a new team member, I want clear integration patterns and development guidelines so that I can quickly onboard and contribute effectively

## Specific Requirements

**System Architecture Overview**
- Create comprehensive text-based architectural diagrams showing component relationships and data flow
- Document the complete technology stack integration: Next.js + Convex + Clerk + Xendit + Vercel AI SDK + Resend
- Define clear separation of concerns between frontend, backend, and external integrations
- Map data flow patterns across all system components

**Frontend Architecture Documentation**
- Detail Next.js 16 App Router structure with public, protected, and admin route patterns
- Document component organization: ui/, layout/, features/ folder structure
- Define server vs client component patterns and data fetching strategies
- Specify state management approach with Convex hooks and local state

**Backend Architecture Documentation**
- Document Convex schema design with all data models: users, news, research, courses, modules, lessons, quizzes, transactions, subscriptions
- Define function organization: queries, mutations, and actions pattern
- Specify API patterns for external integrations and webhook handling
- Document role-based authorization and security patterns

**Integration Architecture Specifications**
- Detail Xendit payment integration: invoice creation, webhook handling, subscription management
- Specify Clerk authentication integration: proxy, protected routes, role management
  - Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

### Rasional penggantian middleware → proxy
- “Middleware” sering disalahartikan sebagai pola Express.js.
- Next.js mendorong penggunaan API lain yang lebih ergonomis; middleware jadi opsi terakhir.
- “Proxy” menegaskan boundary jaringan (Edge Runtime) dan tujuan fitur.
- Document Vercel AI SDK integration: admin summarize features, playground functionality
- Define Resend email integration: welcome emails, payment confirmations, transaction notifications

**Development Architecture Guidelines**
- Establish coding standards and conventions for TypeScript, React, and Convex
- Define folder structure and naming conventions across frontend and backend
- Document deployment patterns for Vercel hosting and Convex deployment
- Specify testing approaches and quality assurance processes

**System Design Documentation Structure**
- Create hierarchical documentation system with cross-references between components
- Ensure documentation is actionable and includes code examples where helpful
- Provide clear technical specifications that can be directly used for implementation
- Include troubleshooting guides and common integration patterns

**Technical Specifications Integration**
- Merge existing frontend system design with technical specifications into unified documentation
- Resolve any conflicts between existing documentation sources
- Create comprehensive API specifications for all system endpoints
- Document configuration management and environment variable patterns

**Scalability and Performance Architecture**
- Define scaling strategies for frontend (Next.js) and backend (Convex) components
- Document caching strategies for content delivery and API responses
- Specify performance optimization patterns for AI features and data fetching
- Plan for monitoring and observability across system components

**Security Architecture Documentation**
- Document security patterns for authentication, authorization, and data protection
- Define webhook security implementations for Xendit integration
- Specify data validation and sanitization patterns throughout the system
- Document API rate limiting and abuse prevention strategies

## Existing Code to Leverage

**Frontend System Design Documentation**
- Comprehensive Next.js 16 App Router structure with route organization
- Component organization patterns with shadcn/ui + Tailwind CSS
- Server vs client component patterns already defined
- Data fetching strategies with Convex integration

**Technical Specifications Document**
- Complete Convex schema definitions for all data models
- Integration patterns for Xendit, Clerk, Vercel AI SDK, and Resend
- Role-based authorization model with clear access rules
- Development folder structure and naming conventions

**Technology Stack Architecture**
- Next.js frontend framework with TypeScript support
- Convex backend as unified data store and server functions
- Clerk authentication system with role-based access control
- Payment processing with Xendit integration
- AI capabilities through Vercel AI SDK
- Email delivery via Resend service

**Development Patterns Established**
- Block-by-block development approach for systematic feature building
- Skeleton → Layout → Component → UI → Content development workflow
- Plan → Analyze → Refine → Implement → Review → Test development cycle
- Security-first approach with server-side sensitive operations

## Out of Scope
- Creation of actual implementation code - this is documentation only
- Specific UI/UX design details beyond technical implementation patterns
- Business logic beyond what's needed for technical architecture understanding
- Marketing content or user-facing documentation
- Infrastructure setup scripts or deployment automation
- Database migration strategies beyond schema definitions
- Performance benchmarking or load testing specifications
- DevOps processes beyond basic deployment patterns
- Third-party service contract negotiations or pricing details
- Legal or compliance documentation beyond technical security measures
