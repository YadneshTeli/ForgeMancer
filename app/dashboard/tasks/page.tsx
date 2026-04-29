"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/page-transition"
import { Calendar, CheckCircle2, Clock, FolderOpen, ListTodo, Plus, Search, Sparkles } from "lucide-react"
import { getClientSupabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { updateTaskStatus } from "@/app/actions/project-actions"

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

const priorityColors: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
}

export default function TasksPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getClientSupabase()
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("tasks")
        .select("*, projects(name)")
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  const toggleTaskCompletion = async (task: Task) => {
    const newCompleted = !task.completed
    const newStatus = newCompleted ? "Done" : "To Do"

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: newCompleted, status: newStatus } : t,
      ),
    )

    const result = await updateTaskStatus(task.id, newStatus)
    if (result?.error) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: task.completed, status: task.status } : t,
        ),
      )
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return "Today"
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.projects?.name || "").toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "today") return matchesSearch && isToday(task.due_date)
    if (filter === "upcoming") return matchesSearch && !task.completed && task.status !== "Done"
    if (filter === "completed") return matchesSearch && (task.completed || task.status === "Done")

    return matchesSearch
  })

  const pendingCount = tasks.filter((t) => !t.completed && t.status !== "Done").length
  const completedCount = tasks.filter((t) => t.completed || t.status === "Done").length

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03] gradient-bg blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ListTodo className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Task Manager</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tasks</h1>
                <p className="text-muted-foreground mt-1">
                  {loading
                    ? "Loading..."
                    : tasks.length > 0
                      ? `${pendingCount} pending · ${completedCount} completed`
                      : "No tasks yet — create a project to generate tasks"}
                </p>
              </div>
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity self-start"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks or projects..."
              className="pl-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all" onValueChange={setFilter}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task Content */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-3">
            {loading ? (
              <div className="bento-card p-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bento-card p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  {tasks.length === 0 ? (
                    <>
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-md">
                        Tasks are created automatically when you generate AI project plans.
                      </p>
                      <Link
                        href="/dashboard/projects/new"
                        className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                      >
                        <Sparkles className="h-4 w-4" />
                        Create a Project
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                      </div>
                      <h3 className="font-semibold mb-1">No matching tasks</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
                {filteredTasks.map((task) => {
                  const dueLabel = formatDueDate(task.due_date)
                  const isDone = task.completed || task.status === "Done"
                  return (
                    <motion.div
                      key={task.id}
                      className="bento-card p-4"
                      variants={item}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={task.id}
                          checked={isDone}
                          onCheckedChange={() => toggleTaskCompletion(task)}
                          className="shrink-0"
                        />
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${priorityColors[task.priority] || "bg-gray-400"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <label
                              htmlFor={task.id}
                              className={`font-medium text-sm cursor-pointer truncate ${isDone ? "text-muted-foreground line-through" : ""}`}
                            >
                              {task.name}
                            </label>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                task.status === "To Do"
                                  ? "text-amber-500 bg-amber-500/10 ring-1 ring-amber-500/20"
                                  : task.status === "In Progress"
                                    ? "text-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20"
                                    : "text-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/20"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            {task.projects?.name && (
                              <span className="truncate max-w-[160px]">{task.projects.name}</span>
                            )}
                            {task.projects?.name && dueLabel && <span>·</span>}
                            {dueLabel && (
                              <div className="flex items-center gap-1 shrink-0">
                                <Clock className="h-3 w-3" />
                                <span
                                  className={
                                    dueLabel === "Today"
                                      ? "text-red-500"
                                      : dueLabel === "Tomorrow"
                                        ? "text-amber-500"
                                        : ""
                                  }
                                >
                                  {dueLabel}
                                </span>
                              </div>
                            )}
                            {task.priority && (
                              <>
                                <span>·</span>
                                <span className={`font-medium ${
                                  task.priority === "High"
                                    ? "text-red-500"
                                    : task.priority === "Medium"
                                      ? "text-amber-500"
                                      : "text-emerald-500"
                                }`}>
                                  {task.priority}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <div className="bento-card p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p className="text-sm text-muted-foreground">Calendar view is coming soon.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
