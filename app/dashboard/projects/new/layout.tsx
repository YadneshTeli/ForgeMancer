import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "New Project",
  description: "Create a new project workspace utilizing ForgeMancer AI automation tools.",
}

export default function NewProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
