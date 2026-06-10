import { Home, LayoutDashboard, MessageSquare, Calendar } from "lucide-react"

export const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: LayoutDashboard },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Tasks", href: "/dashboard/tasks", icon: Calendar },
]

export const sidebarColors = [
  { bg: "bg-blue-500/15 border-blue-500/20", text: "text-blue-500" },
  { bg: "bg-emerald-500/15 border-emerald-500/20", text: "text-emerald-500" },
  { bg: "bg-violet-500/15 border-violet-500/20", text: "text-violet-500" },
  { bg: "bg-amber-500/15 border-amber-500/20", text: "text-amber-500" },
  { bg: "bg-rose-500/15 border-rose-500/20", text: "text-rose-500" },
]

export function getUserInitials(
  profileFullName: string | null | undefined,
  userEmail: string | null | undefined,
): string {
  if (profileFullName) {
    return profileFullName
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }
  return userEmail?.substring(0, 2).toUpperCase() || "U"
}

export function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname === "/dashboard/projects") return "Projects"
  if (pathname === "/dashboard/chat") return "AI Chat"
  if (pathname === "/dashboard/tasks") return "Tasks"
  if (pathname === "/dashboard/settings") return "Settings"
  if (pathname === "/dashboard/profile") return "Profile"
  if (pathname === "/dashboard/notifications") return "Notifications"
  if (pathname.includes("/dashboard/projects/")) return "Project Details"
  return "Dashboard"
}

export function computeSidebarProjectInitials(projectName: string): string {
  return projectName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}
