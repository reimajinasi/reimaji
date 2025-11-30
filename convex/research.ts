import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ensureRole, getUserByClerkId } from './permissions'
import sanitizeHtml from 'sanitize-html'

export const list = query({
  args: {
    q: v.optional(v.string()),
    tag: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query('research')
      .withIndex('by_isPublished', (q) => q.eq('isPublished', true))
      .filter((q) => q.eq(q.field('deletedAt'), undefined))

    let results = await q.collect()
    if (args.tag) results = results.filter((n) => (n.tags || []).includes(args.tag!))
    if (args.q && args.q.trim().length > 0) {
      const text = args.q.toLowerCase()
      results = results.filter((n) =>
        [n.title, n.summary, n.content, n.implication].some((vv) =>
          vv?.toLowerCase().includes(text)
        )
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
    const items = await ctx.db.query('research').collect()
    return items.filter((n) => !n.deletedAt)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query('research')
      .filter((q) => q.eq(q.field('slug'), args.slug))
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
    implication: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    paperUrl: v.optional(v.string()),
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
    const id = await ctx.db.insert('research', {
      title: args.title,
      slug,
      summary: sanitizeHtml(args.summary),
      implication: sanitizeHtml(args.implication),
      content: sanitizeHtml(args.content),
      tags: args.tags,
      paperUrl: args.paperUrl,
      imageUrl: args.imageUrl,
      isPremium: args.isPremium,
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? now : undefined,
      createdBy: author._id,
      viewCount: 0,
      citationCount: 0,
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
    id: v.id('research'),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    implication: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    paperUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isPremium: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (args.title) patch.title = args.title
    if (args.summary) patch.summary = sanitizeHtml(args.summary)
    if (args.implication) patch.implication = sanitizeHtml(args.implication)
    if (args.content) patch.content = sanitizeHtml(args.content)
    if (args.tags) patch.tags = args.tags
    if (args.paperUrl) patch.paperUrl = args.paperUrl
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
  args: { clerkUserId: v.string(), id: v.id('research') },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    await ctx.db.patch(args.id, { deletedAt: Date.now(), isPublished: false })
    return args.id
  },
})

export const stats = query({
  args: { clerkUserId: v.string(), limitTop: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await ensureRole(ctx, args.clerkUserId, ['admin', 'superadmin'])
    const items = await ctx.db.query('research').collect()
    const valid = items.filter((n) => !n.deletedAt)
    const totalPublished = valid.filter((n) => n.isPublished).length
    const totalDraft = valid.length - totalPublished
    const tagFreq: Record<string, number> = {}
    for (const n of valid) for (const t of n.tags || []) tagFreq[t] = (tagFreq[t] ?? 0) + 1
    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, args.limitTop ?? 5)
      .map(([tag, count]) => ({ tag, count }))
    const topByViews = [...valid]
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
      .slice(0, args.limitTop ?? 5)
      .map((n) => ({ id: n._id, title: n.title, viewCount: n.viewCount }))
    return { totalPublished, totalDraft, topTags, topByViews }
  },
})
