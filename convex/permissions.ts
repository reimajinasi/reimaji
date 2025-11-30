import { v } from 'convex/values'
import type { MutationCtx, QueryCtx } from './_generated/server'

export const Role = v.union(
  v.literal('guest'),
  v.literal('free'),
  v.literal('pro'),
  v.literal('admin'),
  v.literal('superadmin')
)
export type RoleType = 'guest' | 'free' | 'pro' | 'admin' | 'superadmin'

export async function getUserByClerkId(ctx: QueryCtx | MutationCtx, clerkUserId: string) {
  return await ctx.db
    .query('users')
    .filter(q => q.eq(q.field('clerkUserId'), clerkUserId))
    .first()
}

export async function ensureRole(
  ctx: QueryCtx | MutationCtx,
  clerkUserId: string,
  allowed: Array<'guest' | 'free' | 'pro' | 'admin' | 'superadmin'>
) {
  const user = await getUserByClerkId(ctx, clerkUserId)
  if (!user) throw new Error('Unauthorized: user not found')
  if (!allowed.includes(user.role as RoleType)) throw new Error('Forbidden: insufficient role')
  return user
}
