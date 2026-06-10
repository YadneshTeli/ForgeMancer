import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your ForgeMancer workspace to manage your projects, tasks, and access the AI copilot.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
