'use client'

import { useEffect } from 'react'
import { useTrackAction } from '@/hooks/use-track-action'

export function NewsTracker({ slug, title }: { slug: string; title: string }) {
  const { trackAction } = useTrackAction()

  useEffect(() => {
    // Track view after a small delay to ensure it's a real view
    const timer = setTimeout(() => {
      trackAction('news_view', { slug, title })
    }, 2000)

    return () => clearTimeout(timer)
  }, [slug, title, trackAction])

  return null
}
