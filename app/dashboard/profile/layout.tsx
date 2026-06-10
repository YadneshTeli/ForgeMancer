import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile credentials on ForgeMancer.",
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
