"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Bell,
  Bot,
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:hidden">
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
            <div className="h-7 w-7 rounded-full gradient-bg flex items-center justify-center">
              <span className="font-bold text-white text-xs">F</span>
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
              <DropdownMenuItem>
                <span>New message from client</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Project deadline approaching</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Invoice payment received</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  width="32"
                />
                <span className="sr-only">Toggle User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
                <div className="h-7 w-7 rounded-full gradient-bg flex items-center justify-center">
                  <span className="font-bold text-white text-xs">F</span>
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
            </nav>
          </div>
        )}

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar className="hidden md:flex">
            <SidebarHeader>
              <div className="flex h-14 items-center gap-2 border-b px-4">
                <div className="h-7 w-7 rounded-full gradient-bg flex items-center justify-center">
                  <span className="font-bold text-white text-xs">F</span>
                </div>
                <span className="font-bold">ForgeMancer</span>
              </div>
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
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                        <Link href="/dashboard">
                          <Home className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/projects"}>
                        <Link href="/dashboard/projects">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Projects</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/chat"}>
                        <Link href="/dashboard/chat">
                          <MessageSquare className="h-5 w-5" />
                          <span>AI Chat</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/tasks"}>
                        <Link href="/dashboard/tasks">
                          <Calendar className="h-5 w-5" />
                          <span>Tasks</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/projects/website-redesign">
                          <div className="h-5 w-5 rounded-md bg-blue-500/20 flex items-center justify-center">
                            <span className="text-xs text-blue-500">W</span>
                          </div>
                          <span>Website Redesign</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/projects/mobile-app">
                          <div className="h-5 w-5 rounded-md bg-green-500/20 flex items-center justify-center">
                            <span className="text-xs text-green-500">M</span>
                          </div>
                          <span>Mobile App</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/projects/branding">
                          <div className="h-5 w-5 rounded-md bg-purple-500/20 flex items-center justify-center">
                            <span className="text-xs text-purple-500">B</span>
                          </div>
                          <span>Branding Project</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" className="w-full justify-start">
                          <Plus className="h-5 w-5" />
                          <span>New Project</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>AI Assistants</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/chat/gpt4">
                          <Bot className="h-5 w-5 text-blue-500" />
                          <span>GPT-4</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/chat/claude">
                          <Bot className="h-5 w-5 text-purple-500" />
                          <span>Claude</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/chat/gemini">
                          <Bot className="h-5 w-5 text-green-500" />
                          <span>Gemini</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=32&width=32" alt="Avatar" className="h-6 w-6 rounded-full" />
                        <span>John Doe</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Inbox className="mr-2 h-4 w-4" />
                      <span>Inbox</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ModeToggle />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1">
            <div className="hidden items-center justify-between border-b px-6 py-3 md:flex">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
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
                            : "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
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
                    <DropdownMenuItem>
                      <span>New message from client</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Project deadline approaching</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Invoice payment received</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
              </div>
            </div>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
