import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUserByClerkId } from './permissions'

export const listByUser = query({
  args: { clerkUserId: v.string(), kind: v.optional(v.union(v.literal('news'), v.literal('research'), v.literal('lesson'))) },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) return []
    const q = ctx.db.query('bookmarks').withIndex('by_user', x => x.eq('userId', user._id))
    const items = await q.collect()
    return args.kind ? items.filter(b => b.kind === args.kind) : items
  },
})

export const isBookmarked = query({
  args: { clerkUserId: v.string(), kind: v.union(v.literal('news'), v.literal('research'), v.literal('lesson')), entityId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) return false
    const item = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', x => x.eq('userId', user._id))
      .filter(q => q.eq(q.field('kind'), args.kind))
      .filter(q => q.eq(q.field('entityId'), args.entityId))
      .first()
    return !!item
  },
})

export const toggle = mutation({
  args: { clerkUserId: v.string(), kind: v.union(v.literal('news'), v.literal('research'), v.literal('lesson')), entityId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) throw new Error('User not found')
    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_user', x => x.eq('userId', user._id))
      .filter(q => q.eq(q.field('kind'), args.kind))
      .filter(q => q.eq(q.field('entityId'), args.entityId))
      .first()
    if (existing) {
      await ctx.db.delete(existing._id)
      return { bookmarked: false }
    }
    await ctx.db.insert('bookmarks', { userId: user._id, kind: args.kind, entityId: args.entityId, createdAt: Date.now() })
    return { bookmarked: true }
  },
})
