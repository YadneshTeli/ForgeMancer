import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Tasks",
  description: "View and organize tasks assigned to you in the workspace.",
}

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
