import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ensureRole, getUserByClerkId } from './permissions'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query('courses')
      .filter(q => q.eq(q.field('isPublished'), true))
      .filter(q => q.eq(q.field('deletedAt'), undefined))
      .collect()
    items.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
    return items
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query('courses')
      .filter(q => q.eq(q.field('slug'), args.slug))
      .first()
    if (!item || item.deletedAt) return null
    return item
  },
})

export const create = mutation({
  args: {
    clerkUserId: v.string(),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const author = await getUserByClerkId(ctx, args.clerkUserId)
    if (!author) throw new Error('Author not found')
    const now = Date.now()
    const id = await ctx.db.insert('courses', {
      title: args.title,
      slug: args.slug,
      description: args.description,
      imageUrl: args.imageUrl,
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? now : undefined,
      createdBy: author._id,
      tags: args.tags,
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
    id: v.id('courses'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (args.title) patch.title = args.title
    if (args.description) patch.description = args.description
    if (args.imageUrl) patch.imageUrl = args.imageUrl
    if (args.tags) patch.tags = args.tags
    if (typeof args.isPublished === 'boolean') {
      patch.isPublished = args.isPublished
      patch.publishedAt = args.isPublished ? Date.now() : undefined
    }
    await ctx.db.patch(args.id, patch)
    return args.id
  },
})

export const remove = mutation({
  args: { clerkUserId: v.string(), id: v.id('courses') },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    await ctx.db.patch(args.id, { deletedAt: Date.now(), isPublished: false })
    return args.id
  },
})
