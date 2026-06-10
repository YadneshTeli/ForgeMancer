import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Projects",
  description: "View and manage your current projects on ForgeMancer.",
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
