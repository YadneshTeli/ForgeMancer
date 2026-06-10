import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free ForgeMancer account today and start managing your freelance projects with AI magic.",
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
