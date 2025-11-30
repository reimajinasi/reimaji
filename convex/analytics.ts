import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const trackPageView = mutation({
  args: {
    path: v.string(),
    loadTime: v.optional(v.number()),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    let userId
    if (identity) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', identity.subject))
        .first()
      userId = user?._id
    }

    await ctx.db.insert('page_views', {
      userId,
      path: args.path,
      loadTime: args.loadTime,
      referrer: args.referrer,
      userAgent: args.userAgent,
      timestamp: Date.now(),
      createdAt: Date.now(),
    })
  },
})

export const trackUserAction = mutation({
  args: {
    action: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return // Only track authenticated user actions for now

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', identity.subject))
      .first()
    if (!user) return

    await ctx.db.insert('user_actions', {
      userId: user._id,
      action: args.action,
      metadata: args.metadata,
      timestamp: Date.now(),
      createdAt: Date.now(),
    })
  },
})

export const trackConversion = mutation({
  args: {
    conversionType: v.union(
      v.literal('signup'),
      v.literal('subscription_start'),
      v.literal('subscription_cancel'),
      v.literal('course_start'),
      v.literal('course_complete'),
      v.literal('content_upgrade')
    ),
    value: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', identity.subject))
      .first()
    if (!user) return

    await ctx.db.insert('conversions', {
      userId: user._id,
      conversionType: args.conversionType,
      value: args.value,
      metadata: args.metadata,
      timestamp: Date.now(),
      createdAt: Date.now(),
    })
  },
})

export const getKPIs = mutation({
  // Changed to mutation to allow reading internal tables if needed, but query is better if possible. Using mutation for consistency with other admin tools that might need to write logs. Actually query is fine.
  args: {},
  handler: async (ctx) => {
    // Simple aggregation - in production might want to pre-calculate or use specialized analytics service
    const users = await ctx.db.query('users').collect()
    const totalUsers = users.length

    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

    // Active users (based on page views in last 30 days) - this is expensive, optimization: use a separate daily_active_users table
    // For MVP/Scale phase 1, we'll just count users created in last 30 days as "New Users" proxy for activity if page_views is too large
    const newUsers = users.filter((u) => u.createdAt > thirtyDaysAgo).length

    const conversions = await ctx.db.query('conversions').collect()
    const courseCompletions = conversions.filter(
      (c) => c.conversionType === 'course_complete'
    ).length
    const subscriptions = conversions.filter(
      (c) => c.conversionType === 'subscription_start'
    ).length

    return {
      totalUsers,
      newUsersLast30Days: newUsers,
      totalCourseCompletions: courseCompletions,
      totalSubscriptions: subscriptions,
    }
  },
})
