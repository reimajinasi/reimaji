import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUserByClerkId } from './permissions'

export const markLessonComplete = mutation({
  args: { clerkUserId: v.string(), courseId: v.id('courses'), lessonId: v.id('lessons') },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) throw new Error('User not found')
    const existing = await ctx.db
      .query('progress')
      .withIndex('by_user_lesson', q => q.eq('userId', user._id).eq('lessonId', args.lessonId))
      .first()
    if (existing) return existing._id
    const id = await ctx.db.insert('progress', {
      userId: user._id,
      courseId: args.courseId,
      lessonId: args.lessonId,
      completedAt: Date.now(),
    })
    return id
  },
})

export const getCourseProgress = query({
  args: { clerkUserId: v.string(), courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) return { completed: 0, total: 0, percent: 0 }
    const modules = await ctx.db
      .query('modules')
      .withIndex('by_course', q => q.eq('courseId', args.courseId))
      .collect()
    const lessonIds: string[] = []
    for (const m of modules) {
      const lessons = await ctx.db
        .query('lessons')
        .withIndex('by_module', q => q.eq('moduleId', m._id))
        .filter(q => q.eq(q.field('isPublished'), true))
        .collect()
      for (const l of lessons) lessonIds.push(l._id)
    }
    const total = lessonIds.length
    if (total === 0) return { completed: 0, total: 0, percent: 0 }
    const completed = await ctx.db
      .query('progress')
      .withIndex('by_user_course', q => q.eq('userId', user._id).eq('courseId', args.courseId))
      .collect()
    const percent = Math.round((completed.length / total) * 100)
    return { completed: completed.length, total, percent }
  },
})
