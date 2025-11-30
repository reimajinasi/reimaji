import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ensureRole } from './permissions'

export const listByModule = query({
  args: { moduleId: v.id('modules') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('lessons')
      .withIndex('by_module', q => q.eq('moduleId', args.moduleId))
      .filter(q => q.eq(q.field('isPublished'), true))
      .collect()
    items.sort((a, b) => a.order - b.order)
    return items
  },
})

export const getById = query({
  args: { id: v.id('lessons') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id)
    if (!item || item.deletedAt) return null
    return item
  },
})

export const create = mutation({
  args: {
    clerkUserId: v.string(),
    moduleId: v.id('modules'),
    title: v.string(),
    order: v.number(),
    content: v.string(),
    videoUrl: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const now = Date.now()
    const id = await ctx.db.insert('lessons', {
      moduleId: args.moduleId,
      title: args.title,
      order: args.order,
      content: args.content,
      videoUrl: args.videoUrl,
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? now : undefined,
      deletedAt: undefined,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },
})

export const update = mutation({
  args: {
    clerkUserId: v.string(),
    id: v.id('lessons'),
    title: v.optional(v.string()),
    order: v.optional(v.number()),
    content: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (args.title) patch.title = args.title
    if (typeof args.order === 'number') patch.order = args.order
    if (args.content) patch.content = args.content
    if (args.videoUrl) patch.videoUrl = args.videoUrl
    if (typeof args.isPublished === 'boolean') {
      patch.isPublished = args.isPublished
      patch.publishedAt = args.isPublished ? Date.now() : undefined
    }
    await ctx.db.patch(args.id, patch)
    return args.id
  },
})

export const remove = mutation({
  args: { clerkUserId: v.string(), id: v.id('lessons') },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    await ctx.db.patch(args.id, { deletedAt: Date.now(), isPublished: false })
    return args.id
  },
})
