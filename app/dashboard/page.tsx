"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  FolderOpen,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { DashboardWelcome } from "@/components/dashboard-welcome"
import { PageTransition } from "@/components/page-transition"
import { getClientSupabase } from "@/lib/supabase"

interface Project {
  id: string
  name: string
  description: string | null
  client_name: string | null
  status: string
  project_type: string
  due_date: string | null
  created_at: string
}

interface Task {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  completed: boolean
  created_at: string
  project_id: string
  projects: { name: string } | null
}

interface ChatMessage {
  id: string
  message: string
  role: string
  created_at: string
  project_id: string | null
  projects: { name: string } | null
}

const projectColors = [
  { bg: "bg-violet-500/15", text: "text-violet-500", ring: "ring-violet-500/20" },
  { bg: "bg-emerald-500/15", text: "text-emerald-500", ring: "ring-emerald-500/20" },
  { bg: "bg-blue-500/15", text: "text-blue-500", ring: "ring-blue-500/20" },
  { bg: "bg-amber-500/15", text: "text-amber-500", ring: "ring-amber-500/20" },
  { bg: "bg-rose-500/15", text: "text-rose-500", ring: "ring-rose-500/20" },
  { bg: "bg-cyan-500/15", text: "text-cyan-500", ring: "ring-cyan-500/20" },
]

const statusColors: Record<string, string> = {
  "In Progress": "text-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/20",
  "Planning": "text-amber-500 bg-amber-500/10 ring-1 ring-amber-500/20",
  "Review": "text-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20",
  "Completed": "text-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500/20",
  "On Hold": "text-gray-500 bg-gray-500/10 ring-1 ring-gray-500/20",
}

const priorityColors: Record<string, string> = {
  "High": "bg-red-500",
  "Medium": "bg-amber-500",
  "Low": "bg-emerald-500",
}

const taskStatusColors: Record<string, string> = {
  "To Do": "text-amber-500 bg-amber-500/10",
  "In Progress": "text-blue-500 bg-blue-500/10",
  "Done": "text-emerald-500 bg-emerald-500/10",
  "Completed": "text-emerald-500 bg-emerald-500/10",
}

/* ── Stat card colour configs ── */
const statCardConfigs = [
  {
    title: "Active Projects",
    icon: LayoutDashboard,
    color: "text-violet-500",
    iconBg: "from-violet-500/12 to-violet-600/6",
    accentGradient: "from-violet-500 via-purple-500 to-indigo-500",
    watermarkColor: "text-violet-500",
  },
  {
    title: "Pending Tasks",
    icon: ListTodo,
    color: "text-amber-500",
    iconBg: "from-amber-500/12 to-orange-500/6",
    accentGradient: "from-amber-500 via-orange-500 to-yellow-500",
    watermarkColor: "text-amber-500",
  },
  {
    title: "AI Messages",
    icon: MessageSquare,
    color: "text-blue-500",
    iconBg: "from-blue-500/12 to-cyan-500/6",
    accentGradient: "from-blue-500 via-cyan-500 to-indigo-400",
    watermarkColor: "text-blue-500",
  },
  {
    title: "Completion Rate",
    icon: TrendingUp,
    color: "text-emerald-500",
    iconBg: "from-emerald-500/12 to-teal-500/6",
    accentGradient: "from-emerald-500 via-teal-500 to-green-400",
    watermarkColor: "text-emerald-500",
  },
]

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [stats, setStats] = useState({
    projectCount: 0,
    pendingTaskCount: 0,
    chatCount: 0,
    completedTaskCount: 0,
  })
  const supabase = getClientSupabase()

  useEffect(() => {
    setIsMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProjects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      const { data: userTasks } = await supabase
        .from("tasks")
        .select("*, projects(name)")
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false })

      const { data: userChats } = await supabase
        .from("chat_history")
        .select("*, projects(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      const projectsList = userProjects || []
      const tasksList = userTasks || []
      const chatsList = userChats || []

      setProjects(projectsList)
      setTasks(tasksList)
      setChatMessages(chatsList)

      setStats({
        projectCount: projectsList.length,
        pendingTaskCount: tasksList.filter((t) => !t.completed && t.status !== "Done").length,
        chatCount: chatsList.length,
        completedTaskCount: tasksList.filter((t) => t.completed || t.status === "Done").length,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (!isMounted) return null

  const pendingTasks = tasks.filter((t) => !t.completed && t.status !== "Done")
  const aiUserMessages = chatMessages.filter((m) => m.role === "user")
  const aiAssistantMessages = chatMessages.filter((m) => m.role === "assistant")

  const statValues = [
    { value: stats.projectCount, subtitle: `${stats.projectCount} total` },
    { value: stats.pendingTaskCount, subtitle: `${stats.completedTaskCount} completed` },
    { value: stats.chatCount, subtitle: `${stats.chatCount} conversations` },
    {
      value: tasks.length > 0
        ? `${Math.round((stats.completedTaskCount / tasks.length) * 100)}%`
        : "—",
      subtitle: tasks.length > 0 ? `${stats.completedTaskCount}/${tasks.length} tasks` : "No tasks yet",
    },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <DashboardWelcome />

        {/* ===== BENTO STAT CARDS — Asymmetric grid ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {statCardConfigs.map((cfg, index) => {
            const stat = statValues[index]
            const Icon = cfg.icon
            return (
              <div
                key={cfg.title}
                className={`bento-card relative p-5 lg:p-6 animate-fade-in stagger-${index} ${
                  index === 0 ? "lg:col-span-1 lg:row-span-1" : ""
                }`}
              >
                {/* Top gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.accentGradient} opacity-70`}
                />

                {/* Watermark icon */}
                <div className="stat-icon-watermark">
                  <Icon className={`h-20 w-20 ${cfg.watermarkColor}`} />
                </div>

                <div className="flex items-start justify-between mb-5">
                  <div className={`rounded-xl p-3 bg-gradient-to-br ${cfg.iconBg}`}>
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-3xl lg:text-4xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cfg.title}</p>
                  <p className="text-xs text-muted-foreground/60">{stat.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ===== TABS — Refined ===== */}
        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="projects"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              Projects{stats.projectCount > 0 && ` (${stats.projectCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              Tasks{stats.pendingTaskCount > 0 && ` (${stats.pendingTaskCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              AI Insights{stats.chatCount > 0 && ` (${stats.chatCount})`}
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project, index) => {
                  const color = projectColors[index % projectColors.length]
                  const initials = project.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                  const statusStyle = statusColors[project.status] || statusColors["In Progress"]

                  return (
                    <div key={project.id} className={`tab-card p-5 animate-fade-in stagger-${Math.min(index, 5)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${color.bg} flex items-center justify-center ring-1 ${color.ring}`}>
                            <span className={`text-sm font-semibold ${color.text}`}>{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm truncate max-w-[140px]">{project.name}</h3>
                            {project.client_name && (
                              <p className="text-xs text-muted-foreground truncate">{project.client_name}</p>
                            )}
                          </div>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                          {project.status}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        {project.due_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(project.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-muted-foreground/70 capitalize">{project.project_type?.replace("-", " ")}</span>
                      </div>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="flex items-center justify-center gap-2 w-full rounded-lg border py-2 text-xs font-medium hover:bg-accent hover:border-primary/20 transition-all group"
                      >
                        View Project
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="tab-card">
                <div className="empty-state">
                  <div className="empty-state-icon bg-muted">
                    <FolderOpen className="h-8 w-8 text-muted-foreground relative z-10" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md">
                    Create your first project and let AI generate a detailed plan for you.
                  </p>
                  <Link href="/dashboard/projects/new" className="pill-action-primary">
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </Link>
                </div>
              </div>
            )}
            {projects.length > 0 && (
              <Link href="/dashboard/projects/new" className="pill-action-primary inline-flex">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            )}
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                {pendingTasks.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTasks.slice(0, 8).map((task, index) => (
                      <div
                        key={task.id}
                        className={`tab-card p-4 animate-fade-in stagger-${Math.min(index, 5)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                            <div className={`h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-background ${priorityColors[task.priority] || "bg-gray-400"} ${task.priority === "High" ? "ring-red-500/30" : task.priority === "Medium" ? "ring-amber-500/30" : "ring-emerald-500/30"}`} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{task.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                {task.projects?.name && <span className="truncate max-w-[120px]">{task.projects.name}</span>}
                                {task.due_date && (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${taskStatusColors[task.status] || "text-gray-500 bg-gray-500/10"}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tab-card">
                    <div className="empty-state">
                      <div className="empty-state-icon bg-emerald-500/10">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 relative z-10" />
                      </div>
                      <h3 className="font-semibold mb-1">
                        {tasks.length > 0 ? "All tasks completed!" : "No tasks yet"}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {tasks.length > 0
                          ? "Great job — all your tasks are done."
                          : "Tasks will appear here when you create projects with AI-generated plans."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group"
            >
              View All Tasks
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-4">
            {chatMessages.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="tab-card animate-fade-in">
                  <div className="p-5 border-b">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Your Questions</h3>
                        <p className="text-xs text-muted-foreground">Recent prompts sent to AI</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {aiUserMessages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm line-clamp-2">{msg.message}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                            <span>{formatRelativeTime(msg.created_at)}</span>
                            {msg.projects?.name && (
                              <>
                                <span>·</span>
                                <span className="truncate">{msg.projects.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tab-card animate-fade-in stagger-1">
                  <div className="p-5 border-b">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">AI Responses</h3>
                        <p className="text-xs text-muted-foreground">Recent AI-generated insights</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {aiAssistantMessages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm line-clamp-2">{msg.message}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                            <span>{formatRelativeTime(msg.created_at)}</span>
                            {msg.projects?.name && (
                              <>
                                <span>·</span>
                                <span className="truncate">{msg.projects.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="tab-card">
                <div className="empty-state">
                  <div className="empty-state-icon bg-primary/10 animate-pulse-glow">
                    <Sparkles className="h-8 w-8 text-primary relative z-10 animate-float" />
                  </div>
                  <h3 className="font-semibold mb-2">Groq AI Chat</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md">
                    Get project advice, generate plans, brainstorm ideas, and more with our AI assistant.
                  </p>
                  <Link href="/dashboard/chat" className="pill-action-primary">
                    <MessageSquare className="h-4 w-4" />
                    Start a Conversation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group"
            >
              {chatMessages.length > 0 ? "Continue Chatting" : "Open AI Chat"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
