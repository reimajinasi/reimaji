import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ensureRole } from './permissions'

export const listByCourse = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('modules')
      .withIndex('by_course', q => q.eq('courseId', args.courseId))
      .collect()
    items.sort((a, b) => a.order - b.order)
    return items
  },
})

export const create = mutation({
  args: { clerkUserId: v.string(), courseId: v.id('courses'), title: v.string(), order: v.number(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const now = Date.now()
    const id = await ctx.db.insert('modules', {
      courseId: args.courseId,
      title: args.title,
      order: args.order,
      description: args.description,
      deletedAt: undefined,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },
})

export const update = mutation({
  args: { clerkUserId: v.string(), id: v.id('modules'), title: v.optional(v.string()), order: v.optional(v.number()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (args.title) patch.title = args.title
    if (typeof args.order === 'number') patch.order = args.order
    if (args.description) patch.description = args.description
    await ctx.db.patch(args.id, patch)
    return args.id
  },
})

export const remove = mutation({
  args: { clerkUserId: v.string(), id: v.id('modules') },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    await ctx.db.patch(args.id, { deletedAt: Date.now() })
    return args.id
  },
})
