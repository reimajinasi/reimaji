import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ensureRole } from './permissions'

export const create = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.union(v.literal('guest'), v.literal('free'), v.literal('pro'), v.literal('admin'), v.literal('superadmin')),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const id = await ctx.db.insert('users', {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },
})

export const getByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('clerkUserId'), args.clerkUserId))
      .first()
    return user
  },
})

export const upsertFromClerk = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailLower = args.email?.toLowerCase()
    const mapRole = (email?: string): 'guest' | 'free' | 'pro' | 'admin' | 'superadmin' => {
      switch (email) {
        case 'erik.supit@gmail.com':
          return 'superadmin'
        case 'reimajinasi@gmail.com':
          return 'admin'
        case '1200pixels@gmail.com':
          return 'pro'
        case 'tokayakuwi@gmail.com':
          return 'free'
        default:
          return 'free'
      }
    }
    const mappedRole = mapRole(emailLower)

    const existing = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('clerkUserId'), args.clerkUserId))
      .first()

    const now = Date.now()
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email ?? existing.email,
        firstName: args.firstName ?? existing.firstName,
        lastName: args.lastName ?? existing.lastName,
        role: mappedRole ?? existing.role,
        updatedAt: now,
      })
      return existing._id
    }

    const id = await ctx.db.insert('users', {
      clerkUserId: args.clerkUserId,
      email: args.email ?? undefined,
      firstName: args.firstName ?? undefined,
      lastName: args.lastName ?? undefined,
      role: mappedRole,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },
})

export const listAll = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const users = await ctx.db.query('users').collect()
    return users
  },
})

export const updateRole = mutation({
  args: {
    clerkUserId: v.string(),
    targetUserId: v.id('users'),
    role: v.union(
      v.literal('guest'),
      v.literal('free'),
      v.literal('pro'),
      v.literal('admin'),
      v.literal('superadmin')
    ),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    await ctx.db.patch(args.targetUserId, { role: args.role, updatedAt: Date.now() })
    return args.targetUserId
  },
})

export const roleStats = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const users = await ctx.db.query('users').collect()
    const counts: Record<string, number> = { guest: 0, free: 0, pro: 0, admin: 0, superadmin: 0 }
    for (const u of users) counts[u.role] = (counts[u.role] ?? 0) + 1
    const total = users.length
    return { total, counts }
  },
})
