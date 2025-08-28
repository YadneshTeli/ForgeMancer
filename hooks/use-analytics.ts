"use client"

import { useCallback } from "react"
import { track } from "@vercel/analytics"

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    try {
      track(eventName, properties)
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  }, [])

  return { trackEvent }
}
