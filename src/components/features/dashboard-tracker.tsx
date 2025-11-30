'use client'

import { useEffect } from 'react'
import { useTrackAction } from '@/hooks/use-track-action'

export function DashboardTracker() {
  const { trackAction } = useTrackAction()

  useEffect(() => {
    // Track dashboard view (proxy for active session)
    trackAction('dashboard_view')
  }, [trackAction])

  return null
}
