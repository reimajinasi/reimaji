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
})
