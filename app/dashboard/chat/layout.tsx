import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "AI Copilot",
  description: "Chat with the ForgeMancer AI copilot in real time to plan architecture, debug errors, and generate documents.",
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
