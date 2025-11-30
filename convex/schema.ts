import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.union(
      v.literal('guest'),
      v.literal('free'),
      v.literal('pro'),
      v.literal('admin'),
      v.literal('superadmin')
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index('by_clerkUserId', ['clerkUserId'])
    .index('by_role', ['role']),

  news: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    content: v.string(),
    type: v.union(v.literal('tool'), v.literal('use_case'), v.literal('regulation')),
    tags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdBy: v.id('users'),
    viewCount: v.number(),
    likeCount: v.number(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_publishedAt', ['publishedAt'])
    .index('by_isPublished', ['isPublished'])
    .index('by_isPremium', ['isPremium'])
    .index('by_createdBy', ['createdBy']),

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
    createdBy: v.id('users'),
    viewCount: v.number(),
    citationCount: v.number(),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_publishedAt', ['publishedAt'])
    .index('by_isPublished', ['isPublished'])
    .index('by_isPremium', ['isPremium'])
    .index('by_createdBy', ['createdBy']),

  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdBy: v.id('users'),
    tags: v.array(v.string()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_isPublished', ['isPublished'])
    .index('by_createdBy', ['createdBy']),

  modules: defineTable({
    courseId: v.id('courses'),
    title: v.string(),
    order: v.number(),
    description: v.optional(v.string()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_course', ['courseId'])
    .index('by_order', ['courseId', 'order']),

  lessons: defineTable({
    moduleId: v.id('modules'),
    title: v.string(),
    order: v.number(),
    content: v.string(),
    videoUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_module', ['moduleId'])
    .index('by_order', ['moduleId', 'order'])
    .index('by_isPublished', ['isPublished']),

  progress: defineTable({
    userId: v.id('users'),
    courseId: v.id('courses'),
    lessonId: v.id('lessons'),
    completedAt: v.number(),
  })
    .index('by_user_course', ['userId', 'courseId'])
    .index('by_user_lesson', ['userId', 'lessonId']),

  quizzes: defineTable({
    lessonId: v.id('lessons'),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.optional(v.string()),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_lesson', ['lessonId'])
    .index('by_isPublished', ['isPublished']),

  bookmarks: defineTable({
    userId: v.id('users'),
    kind: v.union(v.literal('news'), v.literal('research'), v.literal('lesson')),
    entityId: v.string(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_entity', ['entityId']),

  onboarding: defineTable({
    userId: v.id('users'),
    steps: v.optional(
      v.object({
        news: v.optional(v.boolean()),
        research: v.optional(v.boolean()),
        lms: v.optional(v.boolean()),
      })
    ),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  badges: defineTable({
    key: v.string(),
    title: v.string(),
    description: v.string(),
    createdAt: v.number(),
  }).index('by_key', ['key']),

  user_badges: defineTable({
    userId: v.id('users'),
    badgeId: v.id('badges'),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_badge', ['badgeId']),

  page_views: defineTable({
    userId: v.optional(v.id('users')),
    path: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    loadTime: v.optional(v.number()),
    timestamp: v.number(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_path', ['path'])
    .index('by_timestamp', ['timestamp']),

  user_actions: defineTable({
    userId: v.id('users'),
    action: v.string(),
    metadata: v.optional(v.object({})),
    timestamp: v.number(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_action', ['action'])
    .index('by_timestamp', ['timestamp']),

  conversions: defineTable({
    userId: v.id('users'),
    conversionType: v.union(
      v.literal('signup'),
      v.literal('subscription_start'),
      v.literal('subscription_cancel'),
      v.literal('course_start'),
      v.literal('course_complete'),
      v.literal('content_upgrade')
    ),
    value: v.optional(v.number()),
    metadata: v.optional(v.object({})),
    timestamp: v.number(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_conversionType', ['conversionType'])
    .index('by_timestamp', ['timestamp']),
})
