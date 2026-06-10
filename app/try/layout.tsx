import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Get Started",
  description: "Test drive ForgeMancer project generator, task tracking, and AI components without an account.",
}

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
