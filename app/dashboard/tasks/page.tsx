"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/page-transition"
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  FolderOpen,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check
} from "lucide-react"
import { getClientSupabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { updateTaskStatus } from "@/app/actions/project-actions"

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

const priorityColors: Record<string, string> = {
  High: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  Medium: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  Low: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
}

const priorityGlowClasses: Record<string, string> = {
  High: "border-red-500/20 hover:border-red-500/40 shadow-[0_0_20px_-3px_rgba(239,68,68,0.08)] dark:shadow-[0_0_20px_-3px_rgba(239,68,68,0.15)]",
  Medium: "border-amber-500/20 hover:border-amber-500/40 shadow-[0_0_20px_-3px_rgba(245,158,11,0.08)] dark:shadow-[0_0_20px_-3px_rgba(245,158,11,0.15)]",
  Low: "border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.08)] dark:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
}

export default function TasksPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date())
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
    } else {
      toast({
        title: newCompleted ? "Task completed!" : "Task reopened",
        description: `"${task.name}" has been updated.`,
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
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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

  // Calendar Helpers
  const currentYear = currentCalendarDate.getFullYear()
  const currentMonth = currentCalendarDate.getMonth()

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startDayOfWeek = firstDayOfMonth.getDay() // 0: Sun, 1: Mon, etc.
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(currentYear, currentMonth, i + 1)
  })

  // Calendar padded start
  const paddingDays = Array.from({ length: startDayOfWeek }, () => null)
  const calendarGrid = [...paddingDays, ...calendarDays]

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false
      const d = new Date(task.due_date)
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      )
    })
  }

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header - Premium Glass Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl p-6 md:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.08] gradient-bg blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-[0.05] bg-indigo-500 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <ListTodo className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Workspace Manager
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75">
                Tasks
              </h1>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {loading ? (
                  "Loading tasks..."
                ) : tasks.length > 0 ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {pendingCount} pending · {completedCount} completed
                  </span>
                ) : (
                  "No tasks yet — create a project to generate tasks"
                )}
              </p>
            </div>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-3 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_20px_-4px_rgba(124,58,237,0.3)] self-start cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </div>
        </div>

        {/* Search & Filter - Glassmorphic Inputs */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
            <Input
              type="search"
              placeholder="Search tasks or projects..."
              className="pl-10 bg-card/40 border-white/10 dark:border-white/5 backdrop-blur-md focus-visible:ring-primary/50 rounded-xl h-11 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Select defaultValue="all" onValueChange={setFilter}>
              <SelectTrigger className="w-[160px] bg-card/40 border-white/10 dark:border-white/5 backdrop-blur-md rounded-xl h-11 focus:ring-primary/50">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/10">
                <SelectItem value="all" className="cursor-pointer">All Tasks</SelectItem>
                <SelectItem value="today" className="cursor-pointer">Due Today</SelectItem>
                <SelectItem value="upcoming" className="cursor-pointer">Upcoming</SelectItem>
                <SelectItem value="completed" className="cursor-pointer">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task Content Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="bg-muted/30 border border-white/10 dark:border-white/5 p-1 rounded-xl backdrop-blur-md">
            <TabsTrigger
              value="list"
              className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              List View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {loading ? (
              <div className="glass-card p-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing workspace...</span>
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="glass-card p-16 border-dashed border-white/10">
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                  {tasks.length === 0 ? (
                    <>
                      <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                        <FolderOpen className="h-7 w-7 text-indigo-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No tasks generated</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Tasks are created automatically when you generate AI project plans. Get started by initializing your first project.
                      </p>
                      <Link
                        href="/dashboard/projects/new"
                        className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        Create a Project
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No tasks fit the criteria</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search query or reset the filter selection to view all tasks.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                className="grid gap-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => {
                    const dueLabel = formatDueDate(task.due_date)
                    const isDone = task.completed || task.status === "Done"
                    const priority = task.priority ?? "Low"

                    return (
                      <motion.div
                        key={task.id}
                        variants={item}
                        layoutId={`task-${task.id}`}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`glass-card p-4 border transition-all ${priorityGlowClasses[priority]} hover:-translate-y-0.5`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center shrink-0">
                            <Checkbox
                              id={task.id}
                              checked={isDone}
                              onCheckedChange={() => toggleTaskCompletion(task)}
                              className="h-5 w-5 rounded-md border-white/20 dark:border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all cursor-pointer"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                              <label
                                htmlFor={task.id}
                                className={`font-semibold text-sm cursor-pointer select-none truncate transition-colors ${
                                  isDone ? "text-muted-foreground/50 line-through" : "text-foreground/90 hover:text-primary"
                                }`}
                              >
                                {task.name}
                              </label>

                              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    task.status === "To Do"
                                      ? "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                                      : task.status === "In Progress"
                                        ? "text-indigo-500 bg-indigo-500/10 border border-indigo-500/20"
                                        : "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground mt-2 font-medium">
                              {task.projects?.name && (
                                <span className="text-foreground/70 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                  {task.projects.name}
                                </span>
                              )}
                              {task.projects?.name && (dueLabel || task.priority) && (
                                <span className="opacity-40">·</span>
                              )}
                              {dueLabel && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 opacity-70" />
                                  <span
                                    className={
                                      dueLabel === "Today"
                                        ? "text-red-500/95 font-semibold"
                                        : dueLabel === "Tomorrow"
                                          ? "text-amber-500/95 font-semibold"
                                          : ""
                                    }
                                  >
                                    {dueLabel}
                                  </span>
                                </div>
                              )}
                              {dueLabel && task.priority && <span className="opacity-40">·</span>}
                              {task.priority && (
                                <div className="flex items-center gap-1.5">
                                  <span className={`h-2 w-2 rounded-full ${priorityColors[priority]}`} />
                                  <span className="font-semibold text-[11px]">{priority} Priority</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="glass-card p-6 border-white/10 dark:border-white/5">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    className="h-8 w-8 rounded-lg border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-md cursor-pointer hover:bg-white/5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="h-8 w-8 rounded-lg border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-md cursor-pointer hover:bg-white/5"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-muted-foreground tracking-wider uppercase">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarGrid.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="h-24 rounded-lg bg-muted/10 opacity-30 border border-transparent" />
                  }

                  const dateTasks = getTasksForDate(date)
                  const isTodayDate = date.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={`day-${date.getTime()}`}
                      className={`h-28 rounded-lg p-2 flex flex-col justify-between border transition-all ${
                        isTodayDate
                          ? "bg-primary/5 border-primary/45 shadow-[0_0_15px_-5px_rgba(124,58,237,0.2)]"
                          : "bg-card/25 border-white/10 dark:border-white/5 hover:bg-card/40 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-extrabold flex items-center justify-center h-6 w-6 rounded-full ${
                            isTodayDate ? "bg-primary text-white" : "text-foreground/80"
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {dateTasks.length > 0 && (
                          <span className="text-[10px] font-bold text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                            {dateTasks.length} {dateTasks.length === 1 ? "task" : "tasks"}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-1 mt-1.5 pr-0.5 scrollbar-thin">
                        {dateTasks.map((t) => (
                          <div
                            key={t.id}
                            className={`text-[9px] font-semibold truncate rounded px-1.5 py-0.5 border cursor-pointer ${
                              t.completed || t.status === "Done"
                                ? "bg-muted/30 text-muted-foreground/60 border-muted/20 line-through"
                                : t.priority === "High"
                                  ? "bg-red-500/10 text-red-500 border-red-500/25"
                                  : t.priority === "Medium"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                            }`}
                            onClick={() => toggleTaskCompletion(t)}
                            title={t.name}
                          >
                            {t.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
