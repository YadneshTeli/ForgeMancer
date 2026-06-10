"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Bot,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderOpen,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Plus,
  Sparkles,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import { DashboardWelcome } from "@/components/dashboard-welcome"
import { PageTransition } from "@/components/page-transition"
import { getClientSupabase } from "@/lib/supabase"

interface Project {
  id: string
  name: string
  description: string | null
  client_name: string | null
  status: string | null
  project_type: string | null
  due_date: string | null
  created_at: string
}

interface Task {
  id: string
  name: string
  description: string | null
  status: string | null
  priority: string | null
  due_date: string | null
  completed: boolean | null
  created_at: string
  project_id: string | null
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

interface Resource {
  id: string
  project_id: string
  title: string
  url: string
  description: string | null
  created_at: string
  projects: { id: string; name: string } | null
}

const projectColors = [
  { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
]

const statusColors: Record<string, string> = {
  "In Progress": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  "Planning": "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  "Review": "text-blue-500 bg-blue-500/10 border border-blue-500/20",
  "Completed": "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20",
  "On Hold": "text-muted-foreground bg-muted/40 border border-muted/50",
}

const priorityColors: Record<string, string> = {
  "High": "bg-red-500 shadow-sm shadow-red-500/20",
  "Medium": "bg-amber-500 shadow-sm shadow-amber-500/20",
  "Low": "bg-emerald-500 shadow-sm shadow-emerald-500/20",
}

const taskStatusColors: Record<string, string> = {
  "To Do": "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  "In Progress": "text-blue-500 bg-blue-500/10 border border-blue-500/20",
  "Done": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  "Completed": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
}

/* ── SVG Radial Progress Circle Component ── */
function ProgressRing({ percent, colorClass }: { percent: number; colorClass: string }) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(Math.max(percent, 0), 100) / 100) * circumference

  return (
    <svg className="h-10 w-10 transform -rotate-90 shrink-0">
      <circle
        cx="20"
        cy="20"
        r={radius}
        className="stroke-muted/20 dark:stroke-muted/10"
        strokeWidth="3"
        fill="transparent"
      />
      <circle
        cx="20"
        cy="20"
        r={radius}
        className={`${colorClass} transition-all duration-500 ease-out`}
        strokeWidth="3"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [resources, setResources] = useState<Resource[]>([])
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

      const { data: userResources } = await supabase
        .from("resources")
        .select("*, projects!inner(id, name, user_id)")
        .eq("projects.user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6)

      const projectsList = userProjects || []
      const tasksList = userTasks || []
      const chatsList = userChats || []
      const resourcesList = userResources || []

      setProjects(projectsList)
      setTasks(tasksList)
      setChatMessages(chatsList)
      setResources(resourcesList)

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

  const completionPercent = tasks.length > 0 
    ? Math.round((stats.completedTaskCount / tasks.length) * 100) 
    : 0

  /* ── Stats configuration for Bento grid ── */
  const bentoStats = [
    {
      title: "Active Projects",
      value: stats.projectCount,
      subtitle: `${stats.projectCount} total`,
      icon: LayoutDashboard,
      colorClass: "text-violet-500",
      accentBg: "from-violet-500/10 to-transparent",
      progress: stats.projectCount > 0 ? 100 : 0,
      circleStroke: "stroke-violet-500",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTaskCount,
      subtitle: `${stats.completedTaskCount} completed`,
      icon: ListTodo,
      colorClass: "text-amber-500",
      accentBg: "from-amber-500/10 to-transparent",
      progress: tasks.length > 0 ? Math.round(((tasks.length - stats.pendingTaskCount) / tasks.length) * 100) : 0,
      circleStroke: "stroke-amber-500",
    },
    {
      title: "Copilot Chats",
      value: stats.chatCount,
      subtitle: `${stats.chatCount} interactions`,
      icon: MessageSquare,
      colorClass: "text-blue-500",
      accentBg: "from-blue-500/10 to-transparent",
      progress: stats.chatCount > 0 ? Math.min(stats.chatCount * 10, 100) : 0,
      circleStroke: "stroke-blue-500",
    },
    {
      title: "Completion Rate",
      value: tasks.length > 0 ? `${completionPercent}%` : "—",
      subtitle: tasks.length > 0 ? `${stats.completedTaskCount}/${tasks.length} tasks` : "No tasks yet",
      icon: TrendingUp,
      colorClass: "text-emerald-500",
      accentBg: "from-emerald-500/10 to-transparent",
      progress: completionPercent,
      circleStroke: "stroke-emerald-500",
    },
  ]

  /* ── Dynamic Chart Data Grouping ── */
  const projectStatusData = [
    { name: "Planning", count: projects.filter(p => p.status === "Planning").length },
    { name: "In Progress", count: projects.filter(p => p.status === "In Progress").length },
    { name: "Review", count: projects.filter(p => p.status === "Review").length },
    { name: "Completed", count: projects.filter(p => p.status === "Completed").length },
  ]

  // Create a timeline of completed tasks over the last 7 days
  const getTaskCompletionTimeline = () => {
    const timeline: Record<string, number> = {}
    // Initialize last 5 days
    for (let i = 4; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      timeline[label] = 0
    }

    // Populate completed tasks
    tasks.forEach(t => {
      if (t.completed || t.status === "Done") {
        const dateLabel = new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        if (timeline[dateLabel] !== undefined) {
          timeline[dateLabel] += 1
        } else {
          // Fallback to today if outside range
          const todayLabel = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
          timeline[todayLabel] = (timeline[todayLabel] || 0) + 1
        }
      }
    })

    return Object.entries(timeline).map(([date, completed]) => ({ date, completed }))
  }

  const chartTimelineData = getTaskCompletionTimeline()

  return (
    <PageTransition>
      <div className="space-y-8 pb-8 font-sans">
        <DashboardWelcome />

        {/* ===== BENTO STAT CARDS — Premium grid ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bentoStats.map((cfg, idx) => {
            const Icon = cfg.icon
            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={cfg.title}
                className="bento-card relative p-5 bg-white dark:bg-[#0a0914]/85 border border-[#7c3aed]/10 dark:border-white/5 shadow-sm group overflow-hidden"
              >
                {/* Accent glow corner */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${cfg.accentBg} blur-xl pointer-events-none`} />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/30 to-transparent opacity-80" />

                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl p-2.5 bg-primary/5 border border-primary/10">
                    <Icon className={`h-5 w-5 ${cfg.colorClass}`} />
                  </div>
                  <ProgressRing percent={cfg.progress} colorClass={cfg.circleStroke} />
                </div>
                
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold tracking-tight font-mono">{cfg.value}</p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{cfg.title}</p>
                  <p className="text-xs text-muted-foreground/70">{cfg.subtitle}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ===== ANALYTICS VISUALIZATION PANEL ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Trend Chart */}
          <Card className="lg:col-span-2 border-[#7c3aed]/10 dark:border-white/5 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold tracking-tight">Task Completion Trend</CardTitle>
                  <CardDescription className="text-xs">Live metrics showing work items delivered</CardDescription>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">Live Feed</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {tasks.length > 0 ? (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartTimelineData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-white/5" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'currentColor', fontSize: 10 }}
                        className="text-muted-foreground font-semibold"
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10 }}
                        className="text-muted-foreground font-mono"
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 'semibold'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        name="Tasks Completed"
                        stroke="#7c3aed" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorCompleted)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No task timeline data available yet</p>
                  <p className="text-xs text-muted-foreground/80">Add tasks to your project blueprints to track trends.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Status Summary Chart */}
          <Card className="border-[#7c3aed]/10 dark:border-white/5 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-muted/30">
              <CardTitle className="text-sm font-bold tracking-tight">Projects by Status</CardTitle>
              <CardDescription className="text-xs">Overview of current pipeline volume</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {projects.length > 0 ? (
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectStatusData} margin={{ left: -10, right: 0, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-white/5" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 9 }}
                        className="text-muted-foreground font-semibold"
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10 }}
                        className="text-muted-foreground font-mono"
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
                        contentStyle={{ 
                          background: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
                        {projectStatusData.map((entry, index) => {
                          const colors = ["#818cf8", "#10b981", "#3b82f6", "#22c55e"]
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center text-center">
                  <FolderOpen className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No active project status charts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ===== RECOMMENDED LEARNING RESOURCES ===== */}
        {resources.length > 0 && (
          <div className="tab-card p-5 border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">Recommended Learning Links</h2>
                <p className="text-[11px] text-muted-foreground font-medium">Curated documentation gathered by AI from project blueprints</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.slice(0, 3).map((resource) => (
                <div key={resource.id} className="rounded-xl border border-muted/50 dark:border-white/5 p-4 bg-background/50 hover:border-primary/20 hover:shadow-md transition-all group flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-1.5 text-sm font-bold text-primary group-hover:underline"
                    >
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-105" />
                      <span className="line-clamp-1">{resource.title}</span>
                    </a>
                    {resource.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                    )}
                  </div>
                  {resource.projects && (
                    <Link
                      href={`/dashboard/projects/${resource.projects.id}?tab=resources`}
                      className="mt-3 inline-flex text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-wider"
                    >
                      {resource.projects.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB CONTENT SYSTEM ===== */}
        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-[#7c3aed]/5">
            <TabsTrigger
              value="projects"
              className="rounded-lg text-xs font-bold tracking-wide data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all px-4 py-2"
            >
              Projects{stats.projectCount > 0 && ` (${stats.projectCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-lg text-xs font-bold tracking-wide data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all px-4 py-2"
            >
              Pending Tasks{stats.pendingTaskCount > 0 && ` (${stats.pendingTaskCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="rounded-lg text-xs font-bold tracking-wide data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all px-4 py-2"
            >
              AI Insights{stats.chatCount > 0 && ` (${stats.chatCount})`}
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {projects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project, index) => {
                  const color = projectColors[index % projectColors.length]
                  const initials = project.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                  const statusStyle = statusColors[project.status ?? ""] || statusColors["In Progress"]

                  return (
                    <div key={project.id} className="tab-card p-5 border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm flex flex-col justify-between min-h-[200px]">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0 shadow-inner`}>
                              <span className={`text-sm font-bold ${color.text}`}>{initials}</span>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm truncate max-w-[140px] tracking-tight">{project.name}</h3>
                              {project.client_name && (
                                <p className="text-[10px] font-semibold text-muted-foreground truncate uppercase tracking-wider">{project.client_name}</p>
                              )}
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyle}`}>
                            {project.status}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                        )}
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between text-xs border-t border-muted/50 pt-3">
                          {project.due_date && (
                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{new Date(project.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>
                          )}
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60">{project.project_type?.replace("-", " ")}</span>
                        </div>
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#7c3aed]/10 bg-background/50 py-2.5 text-xs font-semibold hover:bg-accent hover:border-primary/20 transition-all group"
                        >
                          View Project Details
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="tab-card border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50">
                <div className="empty-state">
                  <div className="empty-state-icon bg-muted">
                    <FolderOpen className="h-8 w-8 text-muted-foreground relative z-10" />
                  </div>
                  <h3 className="text-base font-bold mb-2">No active projects</h3>
                  <p className="text-xs text-muted-foreground/85 mb-6 max-w-sm leading-relaxed">
                    Create your first client blueprint and let AI formulate a custom roadmap with milestones.
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
            {pendingTasks.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {pendingTasks.slice(0, 8).map((task, index) => (
                  <div
                    key={task.id}
                    className="tab-card p-4 border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm hover:border-primary/15 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0 mr-4">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ring-4 ring-offset-background ${priorityColors[task.priority ?? ""] || "bg-gray-400"} ${task.priority === "High" ? "ring-red-500/10" : task.priority === "Medium" ? "ring-amber-500/10" : "ring-emerald-500/10"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate tracking-tight">{task.name}</p>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5 font-medium">
                          {task.projects?.name && <span className="truncate max-w-[120px]">{task.projects.name}</span>}
                          {task.due_date && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${taskStatusColors[task.status ?? ""] || "text-gray-500 bg-gray-500/10"}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tab-card border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50">
                <div className="empty-state">
                  <div className="empty-state-icon bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 relative z-10" />
                  </div>
                  <h3 className="text-base font-bold mb-1">
                    {tasks.length > 0 ? "All tasks completed!" : "No tasks added"}
                  </h3>
                  <p className="text-xs text-muted-foreground/80 max-w-sm leading-relaxed">
                    {tasks.length > 0
                      ? "Splendid! All your task list items are cleared."
                      : "Tasks will show here when you construct project templates using AI."}
                  </p>
                </div>
              </div>
            )}
            
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group pt-2"
            >
              View All Tasks
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-4">
            {chatMessages.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* User Prompts */}
                <div className="tab-card border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm">
                  <div className="p-4 border-b border-muted/30">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm tracking-tight">Your Questions</h3>
                        <p className="text-[10px] text-muted-foreground font-medium">Recent queries sent to Forge Copilot</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-muted/30">
                    {aiUserMessages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                        <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed">{msg.message}</p>
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">
                            <span>{formatRelativeTime(msg.created_at)}</span>
                            {msg.projects?.name && (
                              <>
                                <span>·</span>
                                <span className="truncate max-w-[120px]">{msg.projects.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assistant Answers */}
                <div className="tab-card border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50 backdrop-blur-md shadow-sm">
                  <div className="p-4 border-b border-muted/30">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm tracking-tight">AI Generated Insights</h3>
                        <p className="text-[10px] text-muted-foreground font-medium">Recent blueprint reviews and code suggestions</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-muted/30">
                    {aiAssistantMessages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed text-muted-foreground">{msg.message}</p>
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">
                            <span>{formatRelativeTime(msg.created_at)}</span>
                            {msg.projects?.name && (
                              <>
                                <span>·</span>
                                <span className="truncate max-w-[120px]">{msg.projects.name}</span>
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
              <div className="tab-card border-[#7c3aed]/10 bg-white/50 dark:bg-[#0a0914]/50">
                <div className="empty-state">
                  <div className="empty-state-icon bg-primary/10 border border-primary/20 animate-pulse-glow">
                    <Sparkles className="h-8 w-8 text-primary relative z-10 animate-float" />
                  </div>
                  <h3 className="text-base font-bold mb-2">Groq AI Copilot Chat</h3>
                  <p className="text-xs text-muted-foreground/80 mb-6 max-w-sm leading-relaxed">
                    Brainstorm schemas, analyze client scopes, or generate boilerplate code blocks utilizing AI context.
                  </p>
                  <Link href="/dashboard/chat" className="pill-action-primary">
                    <MessageSquare className="h-4 w-4" />
                    Start Copilot Chat
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
            
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group pt-2"
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
