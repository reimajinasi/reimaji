# Backend Architecture - Reimaji AI Literacy Platform

## Overview

The backend architecture leverages Convex as a unified backend solution, providing data persistence, server functions, and real-time capabilities. This architecture eliminates the need for traditional backend infrastructure while maintaining scalability and developer productivity.

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Convex Backend                          │
├─────────────────────────────────────────────────────────────┤
│ Data Layer                                                 │
│ ├── Database (Schema-defined)                             │
│ ├── Automatic Indexing                                     │
│ ├── Real-time Synchronization                              │
│ ├── File Storage                                           │
│ └── Data Validation                                        │
├─────────────────────────────────────────────────────────────┤
│ Function Layer                                             │
│ ├── Queries (Data Reading)                                 │
│ ├── Mutations (Data Writing)                               │
│ ├── Actions (External API Calls)                           │
│ ├── HTTP Functions (Webhooks)                              │
│ └── Cron Jobs (Scheduled Tasks)                           │
├─────────────────────────────────────────────────────────────┤
│ Integration Layer                                          │
│ ├── Clerk Authentication                                   │
│ ├── Xendit Payment Processing                              │
│ ├── Vercel AI SDK Integration                              │
│ ├── Resend Email Service                                   │
│ └── External APIs                                          │
└─────────────────────────────────────────────────────────────┘
```

## Convex Project Structure

```
convex/
├── schema.ts                    # Database schema definition
├── types.ts                     # Custom TypeScript types
├── http.ts                      # HTTP functions (webhooks)
├── cron.ts                      # Scheduled tasks
├── users.ts                     # User management functions
├── news.ts                      # News content functions
├── research.ts                  # Research content functions
├── courses.ts                   # Course management functions
├── modules.ts                   # Module management functions
├── lessons.ts                   # Lesson management functions
├── quizzes.ts                   # Quiz management functions
├── progress.ts                  # User progress functions
├── subscriptions.ts             # Subscription management
├── transactions.ts              # Payment transaction functions
├── ai.ts                        # AI integration functions
├── analytics.ts                 # Analytics and reporting
├── search.ts                    # Search functionality
├── notifications.ts             # Notification system
├── validation.ts                # Input validation helpers
├── permissions.ts               # Permission management
├── utils.ts                     # Utility functions
├── constants.ts                 # Application constants
└── test/                        # Test files
    ├── users.test.ts
    ├── news.test.ts
    └── subscriptions.test.ts
```

## Database Schema Architecture

### 1. Core Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // User Management
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.union(v.literal("free"), v.literal("pro"), v.literal("admin")),
    subscriptionStatus: v.union(
      v.literal("trial"),
      v.literal("active"),
      v.literal("expired"),
      v.literal("cancelled")
    ),
    subscriptionExpiresAt: v.optional(v.number()),
    preferences: v.optional(v.object({
      language: v.string(),
      notifications: v.boolean(),
      theme: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_role", ["role"])
    .index("by_subscriptionStatus", ["subscriptionStatus"]),

  // News Content
  news: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    content: v.string(),
    type: v.union(v.literal("tool"), v.literal("use_case"), v.literal("regulation")),
    tags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    viewCount: v.number(),
    likeCount: v.number(),
    deletedAt: v.optional(v.number()), // Soft delete support
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_type", ["type"])
    .index("by_isPublished", ["isPublished"])
    .index("by_isPremium", ["isPremium"])
    .index("by_createdBy", ["createdBy"])
    .searchIndex("search_title", {
      searchField: "title",
      filterField: "isPublished",
    })
    .searchIndex("search_content", {
      searchField: "content",
      filterField: "isPublished",
    }),

  // Research Content
  research: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    implication: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    paperUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    viewCount: v.number(),
    citationCount: v.number(),
    deletedAt: v.optional(v.number()), // Soft delete support
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_isPublished", ["isPublished"])
    .index("by_isPremium", ["isPremium"])
    .index("by_createdBy", ["createdBy"])
    .searchIndex("search_title", {
      searchField: "title",
      filterField: "isPublished",
    }),

  // Course Management
  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    level: v.union(v.literal("basic"), v.literal("intermediate"), v.literal("advanced")),
    duration: v.number(), // in hours
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    enrollmentCount: v.number(),
    completionCount: v.number(),
    createdBy: v.id("users"),
    deletedAt: v.optional(v.number()), // Soft delete support
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_isPublished", ["isPublished"])
    .index("by_level", ["level"])
    .index("by_createdBy", ["createdBy"]),

  // Module Management
  modules: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    order: v.number(),
    duration: v.number(), // in hours
    courseTitle: v.string(), // denormalized for performance
    isActive: v.boolean(),
    lessonCount: v.number(),
    deletedAt: v.optional(v.number()), // Soft delete support
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_courseId", ["courseId"])
    .index("by_order", ["order"])
    .index("by_isActive", ["isActive"]),

  // Lesson Management
  lessons: defineTable({
    moduleId: v.id("modules"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    videoUrl: v.string(),
    duration: v.number(), // in minutes
    order: v.number(),
    moduleTitle: v.string(), // denormalized for performance
    courseTitle: v.string(), // denormalized for performance
    isFreePreview: v.boolean(),
    isActive: v.boolean(),
    enrollmentCount: v.number(),
    completionCount: v.number(),
    deletedAt: v.optional(v.number()), // Soft delete support
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_moduleId", ["moduleId"])
    .index("by_order", ["order"])
    .index("by_isFreePreview", ["isFreePreview"])
    .index("by_isActive", ["isActive"]),

  // Quiz Management
  quizzes: defineTable({
    lessonId: v.id("lessons"),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.optional(v.string()),
    isActive: v.boolean(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    createdAt: v.number(),
  })
    .index("by_lessonId", ["lessonId"])
    .index("by_isActive", ["isActive"]),

  // User Progress Tracking
  userProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    moduleId: v.id("modules"),
    courseId: v.id("courses"),
    status: v.union(v.literal("started"), v.literal("completed")),
    score: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    timeSpent: v.number(), // in minutes
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_lessonId", ["lessonId"])
    .index("by_moduleId", ["moduleId"])
    .index("by_courseId", ["courseId"])
    .index("by_status", ["status"]),

  // Quiz Attempts
  quizAttempts: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    lessonId: v.id("lessons"),
    selectedOption: v.number(),
    isCorrect: v.boolean(),
    score: v.number(),
    attemptedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_quizId", ["quizId"])
    .index("by_lessonId", ["lessonId"]),

  // Payment Transactions
  transactions: defineTable({
    userId: v.id("users"),
    xenditInvoiceId: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("EXPIRED"),
      v.literal("FAILED")
    ),
    description: v.string(),
    externalId: v.string(),
    paymentUrl: v.optional(v.string()),
    expiresAt: v.number(),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_xenditInvoiceId", ["xenditInvoiceId"]),

  // Subscriptions
  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.union(v.literal("pro_monthly"), v.literal("pro_yearly")),
    status: v.union(v.literal("active"), v.literal("expired"), v.literal("cancelled")),
    startedAt: v.number(),
    expiresAt: v.number(),
    lastPaymentAt: v.optional(v.number()),
    nextBillingAt: v.optional(v.number()),
    xenditSubscriptionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_expiresAt", ["expiresAt"]),

  // AI Playground Sessions
  aiSessions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    prompt: v.string(),
    response: v.string(),
    model: v.string(),
    tokensUsed: v.number(),
    cost: v.number(),
    explanation: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_isPublic", ["isPublic"])
    .index("by_createdAt", ["createdAt"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("subscription_expired"),
      v.literal("payment_success"),
      v.literal("course_completed"),
      v.literal("system_announcement")
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_isRead", ["isRead"])
    .index("by_type", ["type"]),
})
```

## Function Architecture Patterns

### 1. Query Functions (Data Reading)

```typescript
// convex/news.ts
import { query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    type: v.optional(v.union(v.literal("tool"), v.literal("use_case"), v.literal("regulation"))),
    isPremium: v.optional(v.boolean()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { limit = 20, cursor, type, isPremium, userId } = args

    let newsQuery = ctx.db.query("news").filter(q =>
      q.and(
        q.eq(q.field("isPublished"), true),
        q.eq(q.field("deletedAt"), undefined)
      )
    )

    if (type) {
      newsQuery = newsQuery.filter(q => q.eq(q.field("type"), type))
    }

    if (isPremium !== undefined) {
      newsQuery = newsQuery.filter(q => q.eq(q.field("isPremium"), isPremium))
    }

    if (cursor) {
      const cursorDoc = await ctx.db.get(cursor)
      if (!cursorDoc) throw new Error("Invalid cursor")
      newsQuery = newsQuery.filter(q => q.gt(q.field("createdAt"), cursorDoc.createdAt))
    }

    const news = await newsQuery
      .order("desc")
      .take(limit)

    return {
      news,
      nextCursor: news.length === limit ? news[news.length - 1]._id : null,
    }
  },
})

export const getById = query({
  args: {
    id: v.id("news"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { id, userId }) => {
    const news = await ctx.db.get(id)
    if (!news || !news.isPublished) {
      throw new Error("News not found")
    }

    // Check premium access
    if (news.isPremium && userId) {
      const user = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("clerkUserId"), userId))
        .first()

      if (!user || user.role !== "pro") {
        throw new Error("Premium content requires subscription")
      }
    }

    // Increment view count
    await ctx.db.patch(id, { viewCount: news.viewCount + 1 })

    return news
  },
})
```

### 2. Mutation Functions (Data Writing)

```typescript
// convex/news.ts
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const create = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    content: v.string(),
    type: v.union(v.literal("tool"), v.literal("use_case"), v.literal("regulation")),
    tags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.clerkUserId))
      .first()

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized to create news")
    }

    const now = Date.now()
    const slug = args.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-').trim()

    const newsId = await ctx.db.insert("news", {
      title: args.title,
      slug,
      summary: args.summary,
      content: args.content,
      type: args.type,
      tags: args.tags,
      sourceUrl: args.sourceUrl,
      imageUrl: args.imageUrl,
      isPremium: args.isPremium,
      isPublished: false,
      publishedAt: null,
      createdBy: user._id,
      viewCount: 0,
      likeCount: 0,
      createdAt: now,
      updatedAt: now,
    })

    return newsId
  },
})

export const update = mutation({
  args: {
    id: v.id("news"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.union(v.literal("tool"), v.literal("use_case"), v.literal("regulation"))),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.clerkUserId))
      .first()

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized to update news")
    }

    const news = await ctx.db.get(args.id)
    if (!news) {
      throw new Error("News not found")
    }

    const updateData: any = {
      updatedAt: Date.now(),
    }

    if (args.title !== undefined) updateData.title = args.title
    if (args.summary !== undefined) updateData.summary = args.summary
    if (args.content !== undefined) updateData.content = args.content
    if (args.type !== undefined) updateData.type = args.type
    if (args.tags !== undefined) updateData.tags = args.tags
    if (args.sourceUrl !== undefined) updateData.sourceUrl = args.sourceUrl
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl
    if (args.isPremium !== undefined) updateData.isPremium = args.isPremium
    if (args.isPublished !== undefined) {
      updateData.isPublished = args.isPublished
      if (args.isPublished && !news.isPublished) {
        updateData.publishedAt = Date.now()
      }
    }

    await ctx.db.patch(args.id, updateData)
    return args.id
  },
})
```

### 3. Action Functions (External API Calls)

```typescript
// convex/ai.ts
import { action } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export const summarizeContent = action({
  args: {
    type: v.union(v.literal("news"), v.literal("research")),
    rawText: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { type, rawText, clerkUserId }) => {
    // Verify admin permissions
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized")
    }

    const prompt = type === "news"
      ? `Summarize the following news article in a clear, concise paragraph suitable for non-technical professionals: ${rawText}`
      : `Summarize the following research paper and provide practical implications for business professionals: ${rawText}`

    const { text } = await generateText({
      model: openai("gpt-4-turbo-preview"),
      prompt,
      temperature: 0.3,
      maxTokens: 300,
    })

    if (type === "research") {
      const implicationPrompt = `Based on the summary: "${text}", what are 2-3 practical implications for business professionals? Be specific and actionable.`

      const { text: implicationText } = await generateText({
        model: openai("gpt-4-turbo-preview"),
        prompt: implicationPrompt,
        temperature: 0.4,
        maxTokens: 200,
      })

      return {
        summary: text,
        implication: implicationText,
      }
    }

    return {
      summary: text,
    }
  },
})

```typescript
// convex/research.ts
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const update = mutation({
  args: {
    id: v.id("research"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    implication: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    paperUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.clerkUserId))
      .first()

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized to update research")
    }

    const research = await ctx.db.get(args.id)
    if (!research) {
      throw new Error("Research not found")
    }

    const updateData: any = {
      updatedAt: Date.now(),
    }

    if (args.title !== undefined) updateData.title = args.title
    if (args.summary !== undefined) updateData.summary = args.summary
    if (args.implication !== undefined) updateData.implication = args.implication
    if (args.content !== undefined) updateData.content = args.content
    if (args.tags !== undefined) updateData.tags = args.tags
    if (args.paperUrl !== undefined) updateData.paperUrl = args.paperUrl
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl
    if (args.isPremium !== undefined) updateData.isPremium = args.isPremium
    if (args.isPublished !== undefined) {
      updateData.isPublished = args.isPublished
      if (args.isPublished && !research.isPublished) {
        updateData.publishedAt = Date.now()
      }
    }

    await ctx.db.patch(args.id, updateData)
    return args.id
  },
})
```

```typescript
// convex/test/publishLifecycle.test.ts
import { api } from "../_generated/api"

describe("publish lifecycle", () => {
  it("creates draft with null publishedAt", async () => {
    const id = await runMutation(api.news.create, {
      title: "t",
      summary: "s",
      content: "c",
      type: "tool",
      tags: [],
      isPremium: false,
      clerkUserId: "admin-1",
    })
    const doc = await runQuery(api.news.getById, { id, userId: "admin-1" })
    expect(doc.isPublished).toBe(false)
    expect(doc.publishedAt).toBeNull()
  })

  it("publish sets publishedAt", async () => {
    const nowId = await runMutation(api.news.create, {
      title: "t2",
      summary: "s2",
      content: "c2",
      type: "tool",
      tags: [],
      isPremium: false,
      clerkUserId: "admin-1",
    })
    await runMutation(api.news.update, { id: nowId, isPublished: true, clerkUserId: "admin-1" })
    const doc = await runQuery(api.news.getById, { id: nowId, userId: "admin-1" })
    expect(doc.isPublished).toBe(true)
    expect(doc.publishedAt).not.toBeNull()
  })

  it("unpublish keeps publishedAt", async () => {
    const id = await runMutation(api.news.create, {
      title: "t3",
      summary: "s3",
      content: "c3",
      type: "tool",
      tags: [],
      isPremium: false,
      clerkUserId: "admin-1",
    })
    await runMutation(api.news.update, { id, isPublished: true, clerkUserId: "admin-1" })
    const afterPublish = await runQuery(api.news.getById, { id, userId: "admin-1" })
    await runMutation(api.news.update, { id, isPublished: false, clerkUserId: "admin-1" })
    const afterUnpublish = await runQuery(api.news.getById, { id, userId: "admin-1" })
    expect(afterUnpublish.isPublished).toBe(false)
    expect(afterUnpublish.publishedAt).toEqual(afterPublish.publishedAt)
  })

  it("republish updates publishedAt", async () => {
    const id = await runMutation(api.research.create, {
      title: "r1",
      summary: "rs",
      implication: "ri",
      content: "rc",
      tags: [],
      isPremium: false,
      clerkUserId: "admin-1",
    })
    await runMutation(api.research.update, { id, isPublished: true, clerkUserId: "admin-1" })
    const first = await runQuery(api.research.getById, { id, userId: "admin-1" })
    await runMutation(api.research.update, { id, isPublished: false, clerkUserId: "admin-1" })
    await runMutation(api.research.update, { id, isPublished: true, clerkUserId: "admin-1" })
    const second = await runQuery(api.research.getById, { id, userId: "admin-1" })
    expect(second.publishedAt).not.toEqual(first.publishedAt)
  })
})
```

export const generatePlaygroundResponse = action({
  args: {
    prompt: v.string(),
    model: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { prompt, model, clerkUserId }) => {
    // Verify user permissions and check limits
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user) {
      throw new Error("User not found")
    }

    // Check usage limits for free users
    if (user.role !== "pro") {
      const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)
      const todaySessions = await ctx.runQuery(api.ai.getTodaySessions, {
        userId: user._id,
        startOfDay: today,
      })

      if (todaySessions >= 5) {
        throw new Error("Daily limit reached for free users")
      }
    }

    const { text, usage } = await generateText({
      model: openai(model),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Save session
    const sessionId = await ctx.runMutation(api.ai.createSession, {
      userId: user._id,
      title: prompt.slice(0, 50) + "...",
      prompt,
      response: text,
      model,
      tokensUsed: usage.totalTokens,
      cost: calculateCost(usage.totalTokens, model),
    })

    return {
      response: text,
      sessionId,
      tokensUsed: usage.totalTokens,
    }
  },
})

function calculateCost(tokens: number, model: string): number {
  const rates = {
    "gpt-4-turbo-preview": 0.01 / 1000,
    "gpt-3.5-turbo": 0.002 / 1000,
  }
  return (tokens * (rates[model as keyof typeof rates] || 0.001)) / 1000
}
```

### 4. HTTP Functions (Webhooks)

```typescript
// convex/http.ts
import { httpAction } from "./_generated/server"
import { Webhook } from "svix"
import { api } from "./_generated/api"

export const xenditWebhook = httpAction(async (ctx, request) => {
  const body = await request.text()
  const signature = request.headers.get("x-callback-token")

  if (!signature || signature !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return new Response("Invalid signature", { status: 401 })
  }

  try {
    const event = JSON.parse(body)

    if (event.event === "invoice.paid") {
      const invoice = event.data

      await ctx.runMutation(api.transactions.updateStatus, {
        xenditInvoiceId: invoice.id,
        status: "PAID",
        paidAt: new Date(invoice.paid_at).getTime(),
      })

      await ctx.runMutation(api.subscriptions.activate, {
        externalId: invoice.external_id,
        userId: invoice.user_id,
        startedAt: new Date(invoice.paid_at).getTime(),
      })

      await ctx.runAction(api.emails.sendPaymentConfirmation, {
        userId: invoice.user_id,
        amount: invoice.amount,
        invoiceUrl: invoice.invoice_url,
      })
    } else if (event.event === "invoice.expired") {
      await ctx.runMutation(api.transactions.updateStatus, {
        xenditInvoiceId: event.data.id,
        status: "EXPIRED",
      })
    }

    return new Response("Webhook processed", { status: 200 })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return new Response("Error processing webhook", { status: 500 })
  }
})
```

## Authentication & Authorization Architecture

### 1. User Management Functions

```typescript
// convex/users.ts
import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const createOrUpdate = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.clerkUserId))
      .first()

    const now = Date.now()

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        updatedAt: now,
      })
      return existingUser._id
    } else {
      return await ctx.db.insert("users", {
        clerkUserId: args.clerkUserId,
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        role: "free",
        subscriptionStatus: "trial",
        preferences: {
          language: "id",
          notifications: true,
          theme: "light",
        },
        createdAt: now,
        updatedAt: now,
      })
    }
  },
})

export const getByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()
  },
})

export const updateRole = mutation({
  args: {
    clerkUserId: v.string(),
    role: v.union(v.literal("free"), v.literal("pro"), v.literal("admin")),
    adminClerkUserId: v.string(), // Authorizing admin
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.adminClerkUserId))
      .first()

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized")
    }

    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), args.clerkUserId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    })

    return user._id
  },
})
```

### 2. Permission Management

```typescript
// convex/permissions.ts
import { query } from "./_generated/server"
import { v } from "convex/values"

export const hasAccess = {
  news: async (ctx: any, clerkUserId: string, newsId: string) => {
    const news = await ctx.db.get(newsId as any)
    if (!news || !news.isPublished) {
      return false
    }

    if (!news.isPremium) {
      return true
    }

    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    return user?.role === "pro" || user?.role === "admin"
  },

  admin: async (ctx: any, clerkUserId: string) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    return user?.role === "admin"
  },

  pro: async (ctx: any, clerkUserId: string) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    return user?.role === "pro" || user?.role === "admin"
  },

  playground: async (ctx: any, clerkUserId: string) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    return !!user // All registered users can access playground
  },
}
```

## Payment & Subscription Architecture

### 1. Transaction Management

```typescript
// convex/transactions.ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import Xendit from "xendit-node"

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
})

export const createInvoice = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    description: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { userId, amount, description, clerkUserId }) => {
    // Verify user permissions
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    try {
      const externalId = `INV_${Date.now()}_${userId}`
      const { invoice } = await xenditClient.Invoice.create({
        externalId,
        amount,
        description,
        payerEmail: user.email,
        shouldSendEmail: true,
        customer: {
          given_names: user.name || user.email,
          email: user.email,
        },
        items: [
          {
            name: description,
            price: amount,
            quantity: 1,
          },
        ],
        successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?invoice_id=${externalId}`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/failed?invoice_id=${externalId}`,
      })

      const transactionId = await ctx.db.insert("transactions", {
        userId: user._id,
        xenditInvoiceId: invoice.id,
        amount,
        currency: invoice.currency || "IDR",
        status: "PENDING",
        description,
        externalId,
        paymentUrl: invoice.invoiceUrl,
        expiresAt: new Date(invoice.expiryDate).getTime(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      return {
        transactionId,
        paymentUrl: invoice.invoiceUrl,
        expiresAt: invoice.expiryDate,
      }
    } catch (error) {
      console.error("Invoice creation error:", error)
      throw new Error("Failed to create invoice")
    }
  },
})

export const updateStatus = mutation({
  args: {
    xenditInvoiceId: v.string(),
    status: v.union(v.literal("PENDING"), v.literal("PAID"), v.literal("EXPIRED"), v.literal("FAILED")),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, { xenditInvoiceId, status, paidAt }) => {
    const transaction = await ctx.db
      .query("transactions")
      .filter(q => q.eq(q.field("xenditInvoiceId"), xenditInvoiceId))
      .first()

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    await ctx.db.patch(transaction._id, {
      status,
      paidAt,
      updatedAt: Date.now(),
    })

    // If paid, activate subscription
    if (status === "PAID") {
      await ctx.runMutation(api.subscriptions.createFromTransaction, {
        transactionId: transaction._id,
      })
    }

    return transaction._id
  },
})
```

### 2. Subscription Management

```typescript
// convex/subscriptions.ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createFromTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, { transactionId }) => {
    const transaction = await ctx.db.get(transactionId)
    if (!transaction || transaction.status !== "PAID") {
      throw new Error("Invalid transaction")
    }

    const now = Date.now()
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000) // 30 days

    // Check if user already has an active subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .filter(q =>
        q.and(
          q.eq(q.field("userId"), transaction.userId),
          q.eq(q.field("status"), "active"),
          q.gt(q.field("expiresAt"), now)
        )
      )
      .first()

    if (existingSubscription) {
      // Extend existing subscription
      await ctx.db.patch(existingSubscription._id, {
        expiresAt: existingSubscription.expiresAt + (30 * 24 * 60 * 60 * 1000),
        nextBillingAt: existingSubscription.expiresAt + (30 * 24 * 60 * 60 * 1000),
        lastPaymentAt: now,
        updatedAt: now,
      })
    } else {
      // Create new subscription
      await ctx.db.insert("subscriptions", {
        userId: transaction.userId,
        plan: transaction.amount >= 500000 ? "pro_yearly" : "pro_monthly",
        status: "active",
        startedAt: now,
        expiresAt,
        lastPaymentAt: now,
        nextBillingAt: expiresAt,
        createdAt: now,
        updatedAt: now,
      })
    }

    // Update user role
    await ctx.db.patch(transaction.userId, {
      role: "pro",
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
      updatedAt: now,
    })

    return transactionId
  },
})

export const checkAndExpire = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const expiredSubscriptions = await ctx.db
      .query("subscriptions")
      .filter(q =>
        q.and(
          q.eq(q.field("status"), "active"),
          q.lt(q.field("expiresAt"), now)
        )
      )
      .collect()

    for (const subscription of expiredSubscriptions) {
      await ctx.db.patch(subscription._id, {
        status: "expired",
        updatedAt: now,
      })

      await ctx.db.patch(subscription.userId, {
        role: "free",
        subscriptionStatus: "expired",
        updatedAt: now,
      })
    }

    return expiredSubscriptions.length
  },
})
```

## Learning Management System Architecture

### 1. Course & Content Management

```typescript
// convex/courses.ts
import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {
    level: v.optional(v.union(v.literal("basic"), v.literal("intermediate"), v.literal("advanced"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let coursesQuery = ctx.db.query("courses").filter(q =>
      q.eq(q.field("isPublished"), true)
    )

    if (args.level) {
      coursesQuery = coursesQuery.filter(q => q.eq(q.field("level"), args.level))
    }

    return await coursesQuery
      .order("desc")
      .take(args.limit || 50)
  },
})

export const getById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const course = await ctx.db.get(id)
    if (!course || !course.isPublished) {
      throw new Error("Course not found")
    }

    // Get modules
    const modules = await ctx.db
      .query("modules")
      .filter(q =>
        q.and(
          q.eq(q.field("courseId"), id),
          q.eq(q.field("isActive"), true)
        )
      )
      .order("order")
      .collect()

    return { course, modules }
  },
})
```

### 2. Progress Tracking

```typescript
// convex/progress.ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const startLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { lessonId, clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const lesson = await ctx.db.get(lessonId)
    if (!lesson || !lesson.isActive) {
      throw new Error("Lesson not found")
    }

    // Check if lesson is free preview or user is pro
    if (!lesson.isFreePreview && user.role !== "pro" && user.role !== "admin") {
      throw new Error("Premium lesson requires subscription")
    }

    // Check if progress already exists
    const existingProgress = await ctx.db
      .query("userProgress")
      .filter(q =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("lessonId"), lessonId)
        )
      )
      .first()

    if (existingProgress) {
      return existingProgress._id
    }

    // Get module and course info
    const module = await ctx.db.get(lesson.moduleId)
    const course = await ctx.db.get(module!.courseId)

    // Create progress record
    const progressId = await ctx.db.insert("userProgress", {
      userId: user._id,
      lessonId,
      moduleId: lesson.moduleId,
      courseId: course!._id,
      status: "started",
      timeSpent: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return progressId
  },
})

export const completeLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    score: v.optional(v.number()),
    timeSpent: v.number(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { lessonId, score, timeSpent, clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const progress = await ctx.db
      .query("userProgress")
      .filter(q =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("lessonId"), lessonId)
        )
      )
      .first()

    if (!progress) {
      throw new Error("Progress not found")
    }

    const now = Date.now()
    await ctx.db.patch(progress._id, {
      status: "completed",
      score,
      completedAt: now,
      timeSpent,
      updatedAt: now,
    })

    // Update lesson completion count
    const lesson = await ctx.db.get(lessonId)
    if (lesson) {
      await ctx.db.patch(lessonId, {
        completionCount: lesson.completionCount + 1,
        updatedAt: now,
      })
    }

    // Check if module is completed
    await ctx.runMutation(api.progress.checkModuleCompletion, {
      userId: user._id,
      moduleId: progress.moduleId,
    })

    // Check if course is completed
    await ctx.runMutation(api.progress.checkCourseCompletion, {
      userId: user._id,
      courseId: progress.courseId,
    })

    return progress._id
  },
})
```

## Search & Analytics Architecture

### 1. Search Functionality

```typescript
// convex/search.ts
import { query } from "./_generated/server"
import { v } from "convex/values"

export const searchContent = query({
  args: {
    query: v.string(),
    type: v.optional(v.union(v.literal("news"), v.literal("research"), v.literal("all"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { query: searchQuery, type = "all", limit = 20 } = args

    const results: any = {
      news: [],
      research: [],
      total: 0,
    }

    if (type === "all" || type === "news") {
      const newsResults = await ctx.db
        .query("news")
        .withSearchIndex("search_title", q => q.search("title", searchQuery))
        .filter(q => q.eq(q.field("isPublished"), true))
        .take(limit)

      results.news = newsResults
    }

    if (type === "all" || type === "research") {
      const researchResults = await ctx.db
        .query("research")
        .withSearchIndex("search_title", q => q.search("title", searchQuery))
        .filter(q => q.eq(q.field("isPublished"), true))
        .take(limit)

      results.research = researchResults
    }

    results.total = results.news.length + results.research.length
    return results
  },
})
```

### 2. Analytics Functions

```typescript
// convex/analytics.ts
import { query } from "./_generated/server"
import { v } from "convex/values"

export const getDashboardStats = query({
  args: {
    clerkUserId: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, { clerkUserId, days = 30 }) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("clerkUserId"), clerkUserId))
      .first()

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized")
    }

    const now = Date.now()
    const daysAgo = now - (days * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      newUsers,
      activeUsers,
      totalNews,
      totalResearch,
      totalCourses,
      totalRevenue,
    ] = await Promise.all([
      ctx.db.query("users").collect().then(users => users.length),
      ctx.db
        .query("users")
        .filter(q => q.gt(q.field("createdAt"), daysAgo))
        .collect().then(users => users.length),
      ctx.db
        .query("userProgress")
        .filter(q => q.gt(q.field("updatedAt"), daysAgo))
        .collect().then(progress => progress.length),
      ctx.db.query("news").collect().then(news => news.length),
      ctx.db.query("research").collect().then(research => research.length),
      ctx.db.query("courses").collect().then(courses => courses.length),
      ctx.db
        .query("transactions")
        .filter(q =>
          q.and(
            q.eq(q.field("status"), "PAID"),
            q.gt(q.field("paidAt"), daysAgo)
          )
        )
        .collect()
        .then(transactions =>
          transactions.reduce((sum, t) => sum + t.amount, 0)
        ),
    ])

    return {
      totalUsers,
      newUsers,
      activeUsers,
      totalNews,
      totalResearch,
      totalCourses,
      totalRevenue,
    }
  },
})
```

This backend architecture provides a comprehensive, scalable foundation for the Reimaji AI Literacy Platform, with clear separation of concerns, robust security patterns, and efficient data management through Convex's unified backend solution.
