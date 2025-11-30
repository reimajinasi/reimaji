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
    const modules = await ctx.db.query('modules').withIndex('by_course', q => q.eq('courseId', args.courseId)).collect()
    let total = 0
    for (const m of modules) {
      const lessons = await ctx.db
        .query('lessons')
        .withIndex('by_module', q => q.eq('moduleId', m._id))
        .filter(q => q.eq(q.field('isPublished'), true))
        .collect()
      total += lessons.length
    }
    const completed = await ctx.db
      .query('progress')
      .withIndex('by_user_course', q => q.eq('userId', user._id).eq('courseId', args.courseId))
      .collect()
    if (total > 0 && completed.length >= total) {
      const key = 'course_complete'
      let badge = await ctx.db.query('badges').withIndex('by_key', x => x.eq('key', key)).first()
      if (!badge) {
        const bid = await ctx.db.insert('badges', { key, title: 'Course Complete', description: 'Menyelesaikan kursus', createdAt: Date.now() })
        badge = await ctx.db.get(bid)
      }
      const existing = await ctx.db
        .query('user_badges')
        .withIndex('by_user', x => x.eq('userId', user._id))
        .filter(q => q.eq(q.field('badgeId'), badge!._id))
        .first()
      if (!existing) await ctx.db.insert('user_badges', { userId: user._id, badgeId: badge!._id, createdAt: Date.now() })
    }
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

export const courseStats = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) return { byCourse: [] }
    const progress = await ctx.db.query('progress').collect()
    const map: Record<string, { users: Set<string>; completions: number; title?: string }> = {}
    for (const p of progress) {
      const key = p.courseId as unknown as string
      if (!map[key]) map[key] = { users: new Set(), completions: 0, title: undefined }
      map[key].users.add((p.userId as unknown as string))
      map[key].completions++
    }
    const courses = await ctx.db.query('courses').collect()
    const titleMap: Record<string, string> = {}
    for (const c of courses) titleMap[c._id as unknown as string] = c.title
    const byCourse = [] as Array<{ courseId: string; title: string; uniqueUsers: number; completions: number }>
    for (const [courseId, data] of Object.entries(map)) {
      const title = titleMap[courseId] ?? 'Course'
      byCourse.push({ courseId, title, uniqueUsers: data.users.size, completions: data.completions })
    }
    return { byCourse }
  },
})
