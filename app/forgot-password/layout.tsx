import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your ForgeMancer workspace password.",
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
