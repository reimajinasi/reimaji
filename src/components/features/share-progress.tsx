"use client"
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import type { Id } from '../../../convex/_generated/dataModel'

export function ShareProgress({ courseId, courseTitle }: { courseId: Id<'courses'>; courseTitle: string }) {
  const { userId } = useAuth()
  const progress = useQuery(
    api.progress.getCourseProgress,
    userId ? { clerkUserId: userId, courseId } : 'skip'
  )

  async function share() {
    const text = `${courseTitle} — Progres: ${progress?.percent ?? 0}% (${progress?.completed ?? 0}/${progress?.total ?? 0})`
    if (navigator.share) {
      try { await navigator.share({ title: courseTitle, text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      alert('Progres disalin ke clipboard')
    }
  }

  if (!userId) return null
  return <Button size='sm' onClick={share}>Bagikan Progres</Button>
}
