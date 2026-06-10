"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
import {
  getUserInitials,
  getPageTitle,
  computeSidebarProjectInitials,
  mainNavigation,
  sidebarColors,
} from "./dashboard-shell.logic"

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

  useEffect(() => {
    setIsMounted(true)

    if (typeof window !== "undefined") {
      const storedSidebarState = localStorage.getItem("sidebarCollapsed")
      if (storedSidebarState) {
        setSidebarCollapsed(storedSidebarState === "true")
      }
    }

    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUserData(user)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

      if (profile) {
        setProfileData(profile)
      }

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

  const getInitials = () => {
    return getUserInitials(profileData?.full_name, userData?.email)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#faf8ff] text-[#1e1b4b] dark:bg-[#03020a] dark:text-[#f3f0ff] font-sans antialiased transition-colors duration-300">
      
      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-50 flex h-14 w-full items-center gap-4 border-b border-[#7c3aed]/10 bg-white/70 dark:bg-[#07050f]/75 backdrop-blur-md px-4 md:hidden">
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
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary glow-sm"></span>
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
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-primary/20">
                {profileData?.avatar_url ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden relative">
                    <Image
                      src={profileData.avatar_url}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="text-xs font-bold">{getInitials()}</span>
                  </div>
                )}
                <span className="sr-only">Toggle User Menu</span>
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
        </div>
      </header>

      {/* ── Mobile Menu Modal ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf8ff] dark:bg-[#03020a] md:hidden">
          <div className="flex h-14 items-center justify-between border-b border-[#7c3aed]/10 px-4">
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
          <nav className="grid gap-2.5 p-4 font-medium">
            {mainNavigation.map((item) => {
              const isActive = item.href === "/dashboard"
                ? (pathname === "/dashboard" || pathname === "/dashboard/")
                : (pathname === item.href || pathname.startsWith(item.href + "/"))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                    isActive ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/15" : "hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* ── Desktop View Wrapper ── */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* ── Sidebar ── */}
        <div
          className={`hidden md:flex flex-col border-r border-[#7c3aed]/10 dark:border-white/5 bg-white/60 dark:bg-[#07050f]/80 backdrop-blur-xl transition-all duration-300 relative ${
            isSidebarCollapsed ? "w-18" : "w-66"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex h-16 items-center gap-2 border-b border-[#7c3aed]/10 dark:border-white/5 px-5">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center glow-sm shadow-md">
              <Flame className="h-4.5 w-4.5 text-white" fill="currentColor" strokeWidth={1} />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                ForgeMancer
              </span>
            )}
          </div>

          {/* Quick Search */}
          {!isSidebarCollapsed && (
            <div className="p-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Quick search..."
                  className="w-full rounded-lg border border-[#7c3aed]/10 bg-background/50 dark:bg-card/40 py-2 pl-9 pr-3 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              {!isSidebarCollapsed && (
                <h3 className="mb-2.5 px-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
                  Main Portal
                </h3>
              )}
              <div className="space-y-1">
                {mainNavigation.map((item) => {
                  const isActive = item.href === "/dashboard"
                    ? (pathname === "/dashboard" || pathname === "/dashboard/")
                    : (pathname === item.href || pathname.startsWith(item.href + "/"))
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center ${
                        isSidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
                      } rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                        isActive 
                          ? "text-primary dark:text-primary-foreground font-bold" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={item.name}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarNav"
                          className="absolute inset-0 bg-primary/10 dark:bg-primary/15 rounded-lg border border-primary/15 dark:border-primary/20 -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Projects Submenu */}
            <div>
              {!isSidebarCollapsed && (
                <h3 className="mb-2.5 px-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
                  Active Projects
                </h3>
              )}
              <div className="space-y-1">
                {projects.length > 0 ? (
                  projects.slice(0, 5).map((project, index) => {
                    const color = sidebarColors[index % sidebarColors.length]
                    const initials = computeSidebarProjectInitials(project.name)

                    const isProjectActive = pathname === `/dashboard/projects/${project.id}`

                    return (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className={`relative flex items-center ${
                          isSidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
                        } rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isProjectActive 
                            ? "text-primary dark:text-primary-foreground font-bold" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title={project.name}
                      >
                        {isProjectActive && (
                          <motion.div
                            layoutId="activeSidebarNav"
                            className="absolute inset-0 bg-primary/10 dark:bg-primary/15 rounded-lg border border-primary/15 dark:border-primary/20 -z-10 shadow-sm"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <div className={`h-5 w-5 shrink-0 rounded-md ${color.bg} border flex items-center justify-center shadow-inner`}>
                          <span className={`text-[9px] font-bold ${color.text}`}>{initials}</span>
                        </div>
                        {!isSidebarCollapsed && <span className="truncate">{project.name}</span>}
                      </Link>
                    )
                  })
                ) : (
                  <p className={`text-[10px] text-muted-foreground/60 py-2 ${isSidebarCollapsed ? "text-center px-0" : "px-3.5 font-medium"}`}>
                    No projects found
                  </p>
                )}
                
                <Link
                  href="/dashboard/projects/new"
                  className={`flex items-center ${
                    isSidebarCollapsed ? "justify-center px-0 py-2" : "gap-3 px-3.5 py-2"
                  } rounded-lg text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/5`}
                  title="New Project"
                >
                  <Plus className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>New Project</span>}
                </Link>
              </div>
            </div>

            {/* AI Assistant Section */}
            <div>
              {!isSidebarCollapsed && (
                <h3 className="mb-2.5 px-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
                  Copilot Portal
                </h3>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/chat"
                  className={`flex items-center ${
                    isSidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
                  } rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    pathname.startsWith("/dashboard/chat") 
                      ? "text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10" 
                      : "text-muted-foreground hover:text-[#10b981]"
                  }`}
                  title="AI Copilot"
                >
                  <Bot className="h-4.5 w-4.5 shrink-0 text-emerald-500 animate-float" />
                  {!isSidebarCollapsed && <span>Ask Copilot</span>}
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Footer Account menu */}
          <div className="border-t border-[#7c3aed]/10 dark:border-white/5 p-4">
            {!isSidebarCollapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rounded-xl py-5 border-[#7c3aed]/15 shadow-sm bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {profileData?.avatar_url ? (
                        <div className="h-6.5 w-6.5 rounded-full overflow-hidden border border-primary/20 shrink-0">
                          <Image
                            src={profileData.avatar_url}
                            alt="Profile"
                            width={26}
                            height={26}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-6.5 w-6.5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          <span className="text-[10px] font-extrabold">{getUserInitials(profileData?.full_name, userData?.email)}</span>
                        </div>
                      )}
                      <span className="truncate font-semibold text-xs tracking-tight">
                        {profileData?.full_name || userData?.email?.split("@")[0] || "User"}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuLabel>My Workspace</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/notifications" className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-500 hover:text-rose-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="rounded-lg hover:bg-muted">
                  <Link href="/dashboard/profile" title="Profile">
                    <User className="h-4.5 w-4.5 text-muted-foreground" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="rounded-lg hover:bg-muted">
                  <Link href="/dashboard/settings" title="Settings">
                    <Settings className="h-4.5 w-4.5 text-muted-foreground" />
                  </Link>
                </Button>
                <ModeToggle />
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content Container ── */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
          {/* Header on Desktop */}
          <div className="hidden items-center justify-between border-b border-[#7c3aed]/10 dark:border-white/5 px-6 py-4 md:flex shrink-0 sticky top-0 z-40 bg-white/70 dark:bg-[#03020a]/85 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="mr-2 rounded-lg" onClick={toggleSidebar}>
                <Menu className="h-4.5 w-4.5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                {getPageTitle(pathname)}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button size="sm" className="rounded-full px-4 gradient-bg shadow-sm hover:opacity-95" asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  New Project
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative border border-[#7c3aed]/10 hover:bg-muted/50">
                    <Bell className="h-4.5 w-4.5" />
                    <span className="sr-only">Notifications</span>
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary glow-sm"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-xl">
                  <DropdownMenuLabel className="text-xs">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer text-xs">
                    <Link href="/dashboard/notifications">
                      <span>View all notifications</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 p-6 max-w-[1600px] w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
