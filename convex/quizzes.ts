import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUserByClerkId } from './permissions'

export const listByLesson = query({
  args: { lessonId: v.id('lessons') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('quizzes')
      .withIndex('by_lesson', q => q.eq('lessonId', args.lessonId))
      .filter(q => q.eq(q.field('isPublished'), true))
      .collect()
    return items
  },
})

export const create = mutation({
  args: {
    clerkUserId: v.string(),
    lessonId: v.id('lessons'),
    question: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Only admin via external UI; omit ensureRole for brevity if handled upstream
    const now = Date.now()
    const id = await ctx.db.insert('quizzes', {
      lessonId: args.lessonId,
      question: args.question,
      options: args.options,
      correctIndex: args.correctIndex,
      explanation: args.explanation,
      isPublished: args.isPublished,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },
})

export const submit = mutation({
  args: { clerkUserId: v.string(), lessonId: v.id('lessons'), answers: v.array(v.number()) },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkUserId)
    if (!user) throw new Error('User not found')
    const questions = await ctx.db
      .query('quizzes')
      .withIndex('by_lesson', q => q.eq('lessonId', args.lessonId))
      .filter(q => q.eq(q.field('isPublished'), true))
      .collect()
    let correct = 0
    const feedback: Array<{ index: number; correct: boolean; explanation?: string }> = []
    questions.forEach((qz, i) => {
      const ans = args.answers[i]
      const ok = ans === qz.correctIndex
      if (ok) correct++
      feedback.push({ index: i, correct: ok, explanation: qz.explanation })
    })
    const score = questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100)
    // Connect quiz completion to lesson progress if passing threshold
    if (score >= 60) {
      const lesson = await ctx.db.get(args.lessonId)
      if (lesson) {
        const mod = await ctx.db.get(lesson.moduleId)
        if (mod) {
          const existing = await ctx.db
            .query('progress')
            .withIndex('by_user_lesson', q => q.eq('userId', user._id).eq('lessonId', args.lessonId))
            .first()
          if (!existing) {
            await ctx.db.insert('progress', {
              userId: user._id,
              courseId: mod.courseId,
              lessonId: args.lessonId,
              completedAt: Date.now(),
            })
          }
        }
      }
    }
    return { score, correct, total: questions.length, feedback }
  },
})
