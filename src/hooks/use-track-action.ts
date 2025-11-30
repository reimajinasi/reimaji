'use client'

import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useCallback } from 'react'

export function useTrackAction() {
  const trackActionMutation = useMutation(api.analytics.trackUserAction)
  const trackConversionMutation = useMutation(api.analytics.trackConversion)

  const trackAction = useCallback(
    (action: string, metadata?: Record<string, unknown>) => {
      trackActionMutation({ action, metadata })
    },
    [trackActionMutation]
  )

  const trackConversion = useCallback(
    (
      conversionType:
        | 'signup'
        | 'subscription_start'
        | 'subscription_cancel'
        | 'course_start'
        | 'course_complete'
        | 'content_upgrade',
      value?: number,
      metadata?: Record<string, unknown>
    ) => {
      trackConversionMutation({ conversionType, value, metadata })
    },
    [trackConversionMutation]
  )

  return { trackAction, trackConversion }
}
