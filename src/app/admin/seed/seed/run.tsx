"use client"
import { useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { seedNews, seedResearch, seedCourse, seedModules, seedLessons } from '../seeds'

export function SeedContent() {
  const { userId } = useAuth()
  const newsCreate = useMutation(api.news.create)
  const researchCreate = useMutation(api.research.create)
  const courseCreate = useMutation(api.courses.create)
  const moduleCreate = useMutation(api.modules.create)
  const lessonCreate = useMutation(api.lessons.create)

  async function handleSeed() {
    if (!userId) return
    // News
    for (const n of seedNews) {
      await newsCreate({ clerkUserId: userId, title: n.title, summary: n.summary, content: n.content, type: n.type as 'tool' | 'use_case' | 'regulation', tags: n.tags, isPremium: n.isPremium, isPublished: n.isPublished })
    }
    // Research
    for (const r of seedResearch) {
      await researchCreate({ clerkUserId: userId, title: r.title, summary: r.summary, implication: r.implication, content: r.content, tags: r.tags, isPremium: r.isPremium, isPublished: r.isPublished })
    }
    // Course
    const slug = seedCourse.slug
    const courseId = await courseCreate({ clerkUserId: userId, title: seedCourse.title, slug, description: seedCourse.description, tags: seedCourse.tags, isPublished: seedCourse.isPublished })
    let order = 1
    for (const m of seedModules) {
      const mid = await moduleCreate({ clerkUserId: userId, courseId, title: m.title, order: m.order, description: m.description })
      for (const l of seedLessons) {
        await lessonCreate({ clerkUserId: userId, moduleId: mid, title: `${l.title} (${m.title})`, order: order++, content: l.content, isPublished: l.isPublished })
      }
    }
    alert('Seed selesai')
  }

  return <Button onClick={handleSeed}>Seed Content</Button>
}
