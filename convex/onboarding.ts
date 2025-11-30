import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUserByClerkId } from './permissions'

export const getStatus = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        const user = await getUserByClerkId(ctx, args.clerkUserId)
        if (!user) return null

        const onboarding = await ctx.db
            .query('onboarding')
            .withIndex('by_user', q => q.eq('userId', user._id))
            .first()

        return onboarding
    },
})

export const updateStep = mutation({
    args: {
        clerkUserId: v.string(),
        step: v.union(v.literal('news'), v.literal('research'), v.literal('lms')),
        completed: v.boolean()
    },
    handler: async (ctx, args) => {
        const user = await getUserByClerkId(ctx, args.clerkUserId)
        if (!user) throw new Error('User not found')

        const existing = await ctx.db
            .query('onboarding')
            .withIndex('by_user', q => q.eq('userId', user._id))
            .first()

        const now = Date.now()

        if (existing) {
            const steps = existing.steps || {}
            await ctx.db.patch(existing._id, {
                steps: { ...steps, [args.step]: args.completed },
                updatedAt: now
            })
            return existing._id
        } else {
            const id = await ctx.db.insert('onboarding', {
                userId: user._id,
                steps: { [args.step]: args.completed },
                updatedAt: now
            })
            return id
        }
    },
})

export const completeOnboarding = mutation({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        // This could be used to mark a "fully completed" flag on the user profile if needed
        // For now, we just ensure the onboarding record exists
        const user = await getUserByClerkId(ctx, args.clerkUserId)
        if (!user) throw new Error('User not found')

        const existing = await ctx.db
            .query('onboarding')
            .withIndex('by_user', q => q.eq('userId', user._id))
            .first()

        if (!existing) {
            await ctx.db.insert('onboarding', {
                userId: user._id,
                steps: { news: true, research: true, lms: true },
                updatedAt: Date.now()
            })
        }
    }
})
