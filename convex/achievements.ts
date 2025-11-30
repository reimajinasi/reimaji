import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUserByClerkId } from './permissions'

export const listByUser = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) return []
    const items = await ctx.db.query('user_badges').withIndex('by_user', x => x.eq('userId', user._id)).collect()
    const result = [] as Array<{ key: string; title: string; description: string; createdAt: number }>
    for (const ub of items) {
      const badge = await ctx.db.get(ub.badgeId)
      if (badge) result.push({ key: badge.key, title: badge.title, description: badge.description, createdAt: ub.createdAt })
    }
    return result
  },
})

export const awardBadge = mutation({
  args: { clerkUserId: v.string(), key: v.string(), title: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) throw new Error('User not found')
    const now = Date.now()
    let badge = await ctx.db.query('badges').withIndex('by_key', x => x.eq('key', args.key)).first()
    if (!badge) {
      const id = await ctx.db.insert('badges', { key: args.key, title: args.title, description: args.description, createdAt: now })
      badge = await ctx.db.get(id)
    }
    const existing = await ctx.db
      .query('user_badges')
      .withIndex('by_user', x => x.eq('userId', user._id))
      .filter(q => q.eq(q.field('badgeId'), badge!._id))
      .first()
    if (existing) return existing._id
    const ubId = await ctx.db.insert('user_badges', { userId: user._id, badgeId: badge!._id, createdAt: now })
    return ubId
  },
})
