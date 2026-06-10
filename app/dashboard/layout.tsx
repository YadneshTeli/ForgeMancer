import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard-shell"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Workspace",
  description: "ForgeMancer active workspace dashboard.",
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
