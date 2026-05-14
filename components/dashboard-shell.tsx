"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Bell,
  Bot,
  Calendar,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  X,
  Flame,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getClientSupabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAnalytics } from "@/hooks/use-analytics"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const supabase = getClientSupabase()
  const { toast } = useToast()
  const { trackEvent } = useAnalytics()

  // Only render the component after it's mounted on the client
  useEffect(() => {
    setIsMounted(true)

    // Check if sidebar state is stored in localStorage (only on client side)
    if (typeof window !== "undefined") {
      const storedSidebarState = localStorage.getItem("sidebarCollapsed")
      if (storedSidebarState) {
        setSidebarCollapsed(storedSidebarState === "true")
      }
    }

    // Fetch user data
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Get user data
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUserData(user)

      // Get profile data
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

      if (profile) {
        setProfileData(profile)
      }

      // Fetch user's projects
      const { data: userProjects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!projectsError && userProjects) {
        setProjects(userProjects)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const handleLogout = async () => {
    try {
      trackEvent("logout")
      await supabase.auth.signOut()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profileData?.full_name) {
      return profileData.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return userData?.email?.substring(0, 2).toUpperCase() || "U"
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Menu"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg gradient-bg flex items-center justify-center glow-sm">
            <Flame className="h-3.5 w-3.5 text-white" fill="currentColor" strokeWidth={1} />
          </div>
          <span className="font-bold">ForgeMancer</span>
        </div>
        <div className="flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/notifications">
                <span>View all notifications</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {profileData?.avatar_url ? (
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={profileData.avatar_url || "/placeholder.svg"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">{getUserInitials()}</span>
                </div>
              )}
              <span className="sr-only">Toggle User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-bg flex items-center justify-center glow-sm">
                <Flame className="h-3.5 w-3.5 text-white" fill="currentColor" strokeWidth={1} />
              </div>
              <span className="font-bold">ForgeMancer</span>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close Menu" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          <nav className="grid gap-2 p-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/projects"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard/projects" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Projects</span>
            </Link>
            <Link
              href="/dashboard/chat"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard/chat" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquare className="h-5 w-5" />
              <span>AI Chat</span>
            </Link>
            <Link
              href="/dashboard/tasks"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard/tasks" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              <span>Tasks</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard/settings" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard/profile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/dashboard/notifications"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                pathname === "/dashboard/notifications" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Link>
          </nav>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex h-14 items-center gap-2 border-b px-4">
            <div className="h-7 w-7 rounded-lg gradient-bg flex items-center justify-center glow-sm">
              <Flame className="h-3.5 w-3.5 text-white" fill="currentColor" strokeWidth={1} />
            </div>
            {!isSidebarCollapsed && <span className="font-bold">ForgeMancer</span>}
          </div>
          {!isSidebarCollapsed && (
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
          <div className="flex-1 overflow-auto p-4">
            <nav className="flex flex-col space-y-6">
              <div>
                {!isSidebarCollapsed && <h3 className="mb-2 text-sm font-medium text-muted-foreground">Main</h3>}
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm ${
                      pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    title="Dashboard"
                  >
                    <Home className="h-5 w-5 shrink-0" />
                    {!isSidebarCollapsed && <span>Dashboard</span>}
                  </Link>
                  <Link
                    href="/dashboard/projects"
                    className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm ${
                      pathname === "/dashboard/projects" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    title="Projects"
                  >
                    <LayoutDashboard className="h-5 w-5 shrink-0" />
                    {!isSidebarCollapsed && <span>Projects</span>}
                  </Link>
                  <Link
                    href="/dashboard/chat"
                    className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm ${
                      pathname === "/dashboard/chat" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    title="AI Chat"
                  >
                    <MessageSquare className="h-5 w-5 shrink-0" />
                    {!isSidebarCollapsed && <span>AI Chat</span>}
                  </Link>
                  <Link
                    href="/dashboard/tasks"
                    className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm ${
                      pathname === "/dashboard/tasks" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    title="Tasks"
                  >
                    <Calendar className="h-5 w-5 shrink-0" />
                    {!isSidebarCollapsed && <span>Tasks</span>}
                  </Link>
                </div>
              </div>
              <div>
                {!isSidebarCollapsed && <h3 className="mb-2 text-sm font-medium text-muted-foreground">Projects</h3>}
                <div className="space-y-1">
                  {projects.length > 0 ? (
                    projects.slice(0, 5).map((project, index) => {
                      const colors = [
                        { bg: "bg-blue-500/20", text: "text-blue-500" },
                        { bg: "bg-green-500/20", text: "text-green-500" },
                        { bg: "bg-purple-500/20", text: "text-purple-500" },
                        { bg: "bg-orange-500/20", text: "text-orange-500" },
                        { bg: "bg-pink-500/20", text: "text-pink-500" },
                      ]
                      const color = colors[index % colors.length]
                      const initials = project.name
                        .split(" ")
                        .map((word: string) => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()

                      return (
                        <Link
                          key={project.id}
                          href={`/dashboard/projects/${project.id}`}
                          className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm hover:bg-muted`}
                          title={project.name}
                        >
                          <div className={`h-5 w-5 shrink-0 rounded-md ${color.bg} flex items-center justify-center`}>
                            <span className={`text-[10px] font-medium ${color.text}`}>{initials}</span>
                          </div>
                          {!isSidebarCollapsed && <span className="truncate">{project.name}</span>}
                        </Link>
                      )
                    })
                  ) : (
                    <p className={`text-xs text-muted-foreground py-2 ${isSidebarCollapsed ? "text-center px-0" : "px-3"}`}>No projects</p>
                  )}
                  <Link
                    href="/dashboard/projects/new"
                    className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm hover:bg-muted`}
                    title="New Project"
                  >
                    <Plus className="h-5 w-5 shrink-0" />
                    {!isSidebarCollapsed && <span>New Project</span>}
                  </Link>
                </div>
              </div>
              <div>
                {!isSidebarCollapsed && (
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">AI Assistant</h3>
                )}
                <div className="space-y-1">
                  <Link
                    href="/dashboard/chat"
                    className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-2 text-sm ${
                      pathname.startsWith("/dashboard/chat") ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    title="AI Chat (Groq)"
                  >
                    <Bot className="h-5 w-5 shrink-0 text-green-500" />
                    {!isSidebarCollapsed && <span>AI Chat</span>}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
          <div className="border-t p-4">
            {!isSidebarCollapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      {profileData?.avatar_url ? (
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <Image
                            src={profileData.avatar_url || "/placeholder.svg"}
                            alt="Profile"
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">{getUserInitials()}</span>
                        </div>
                      )}
                      <span>{profileData?.full_name || userData?.email?.split("@")[0] || "User"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ModeToggle />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/profile" title="Profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/settings" title="Settings">
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
                <ModeToggle />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
          <div className="hidden items-center justify-between border-b px-6 py-3 md:flex shrink-0 sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              <h1 className="text-xl font-semibold">
                {pathname === "/dashboard"
                  ? "Dashboard"
                  : pathname === "/dashboard/projects"
                    ? "Projects"
                    : pathname === "/dashboard/chat"
                      ? "AI Chat"
                      : pathname === "/dashboard/tasks"
                        ? "Tasks"
                        : pathname === "/dashboard/settings"
                          ? "Settings"
                          : pathname === "/dashboard/profile"
                            ? "Profile"
                            : pathname === "/dashboard/notifications"
                              ? "Notifications"
                              : pathname.includes("/dashboard/projects/")
                                ? "Project Details"
                                : "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/notifications">
                      <span>View all notifications</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </div>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
