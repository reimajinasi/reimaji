'use client'

import { useMutation } from 'convex/react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { useReportWebVitals } from 'next/web-vitals'

export function PerformanceMonitor() {
  const trackPageView = useMutation(api.analytics.trackPageView)
  const trackUserAction = useMutation(api.analytics.trackUserAction) // Assuming this mutation exists for generic actions
  const pathname = usePathname()

  // Track basic page view on initial load
  useEffect(() => {
    // Small delay to ensure page is interactive
    const timer = setTimeout(() => {
      trackPageView({
        path: pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        loadTime: performance.now(),
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, trackPageView])

  useReportWebVitals((metric) => {
    // Log Web Vitals to Convex via user_actions
    // We use a specific action name 'web_vital'
    trackUserAction({
      action: 'web_vital',
      metadata: {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        path: pathname,
      },
    })
  })

  return null
}
