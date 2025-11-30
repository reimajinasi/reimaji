'use client'

import { useEffect } from 'react'
import { useTrackAction } from '@/hooks/use-track-action'

export function LessonTracker({
  courseId,
  moduleId,
  lessonId,
  title,
}: {
  courseId: string
  moduleId: string
  lessonId: string
  title: string
}) {
  const { trackAction } = useTrackAction()

  useEffect(() => {
    trackAction('lesson_start', { courseId, moduleId, lessonId, title })
  }, [courseId, moduleId, lessonId, title, trackAction])

  return null
}
