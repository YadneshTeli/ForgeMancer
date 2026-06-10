import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View alerts and project updates on ForgeMancer.",
}

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
