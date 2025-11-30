import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ensureRole, getUserByClerkId } from './permissions'

export const list = query({
  args: {
    q: v.optional(v.string()),
    type: v.optional(v.union(v.literal('tool'), v.literal('use_case'), v.literal('regulation'))),
    tag: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query('news')
      .filter(q => q.eq(q.field('isPublished'), true))
      .filter(q => q.eq(q.field('deletedAt'), undefined))

    if (args.type) q = q.filter(qr => qr.eq(qr.field('type'), args.type))

    let results = await q.collect()
    if (args.tag) results = results.filter(n => (n.tags || []).includes(args.tag!))
    if (args.q && args.q.trim().length > 0) {
      const text = args.q.toLowerCase()
      results = results.filter(n =>
        [n.title, n.summary, n.content].some(vv => vv?.toLowerCase().includes(text))
      )
    }
    results.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
    if (args.limit && args.limit > 0) results = results.slice(0, args.limit)
    return results
  },
})

export const listAll = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const items = await ctx.db.query('news').collect()
    return items.filter(n => !n.deletedAt)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query('news')
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
    summary: v.string(),
    content: v.string(),
    type: v.union(v.literal('tool'), v.literal('use_case'), v.literal('regulation')),
    tags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const author = await getUserByClerkId(ctx, args.clerkUserId)
    if (!author) throw new Error('Author not found')
    const now = Date.now()
    const slug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    const id = await ctx.db.insert('news', {
      title: args.title,
      slug,
      summary: args.summary,
      content: args.content,
      type: args.type,
      tags: args.tags,
      sourceUrl: args.sourceUrl,
      imageUrl: args.imageUrl,
      isPremium: args.isPremium,
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? now : undefined,
      createdBy: author._id,
      viewCount: 0,
      likeCount: 0,
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
    id: v.id('news'),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.union(v.literal('tool'), v.literal('use_case'), v.literal('regulation'))),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (args.title) patch.title = args.title
    if (args.summary) patch.summary = args.summary
    if (args.content) patch.content = args.content
    if (args.type) patch.type = args.type
    if (args.tags) patch.tags = args.tags
    if (args.sourceUrl) patch.sourceUrl = args.sourceUrl
    if (args.imageUrl) patch.imageUrl = args.imageUrl
    if (typeof args.isPremium === 'boolean') patch.isPremium = args.isPremium
    if (typeof args.isPublished === 'boolean') {
      patch.isPublished = args.isPublished
      patch.publishedAt = args.isPublished ? Date.now() : undefined
    }
    await ctx.db.patch(args.id, patch)
    return args.id
  },
})

export const remove = mutation({
  args: { clerkUserId: v.string(), id: v.id('news') },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    await ctx.db.patch(args.id, { deletedAt: Date.now(), isPublished: false })
    return args.id
  },
})
