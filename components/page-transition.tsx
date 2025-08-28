"use client"

import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return <div className="animate-fade-in">{children}</div>
}
