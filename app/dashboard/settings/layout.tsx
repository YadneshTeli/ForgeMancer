import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your user credentials, integrations, and assistant preferences on ForgeMancer.",
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
