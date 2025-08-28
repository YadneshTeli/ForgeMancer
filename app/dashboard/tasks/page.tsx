"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/page-transition"
import { Calendar, Clock, Plus, Search } from "lucide-react"

type Task = {
  id: string
  title: string
  project: string
  dueDate: string
  priority: "Low" | "Medium" | "High"
  status: "To Do" | "In Progress" | "Done"
  completed: boolean
}

const tasks: Task[] = [
  {
    id: "task-1",
    title: "Finalize homepage design",
    project: "Website Redesign",
    dueDate: "Today",
    priority: "High",
    status: "In Progress",
    completed: false,
  },
  {
    id: "task-2",
    title: "Client meeting for Mobile App",
    project: "Mobile App",
    dueDate: "Tomorrow",
    priority: "Medium",
    status: "To Do",
    completed: false,
  },
  {
    id: "task-3",
    title: "Create content strategy document",
    project: "Content Strategy",
    dueDate: "Apr 3, 2025",
    priority: "Medium",
    status: "To Do",
    completed: false,
  },
  {
    id: "task-4",
    title: "Review branding assets",
    project: "Branding Project",
    dueDate: "Apr 5, 2025",
    priority: "Low",
    status: "To Do",
    completed: false,
  },
  {
    id: "task-5",
    title: "Implement user authentication",
    project: "E-commerce Platform",
    dueDate: "Apr 10, 2025",
    priority: "High",
    status: "In Progress",
    completed: false,
  },
  {
    id: "task-6",
    title: "Design social media graphics",
    project: "Marketing Campaign",
    dueDate: "Apr 15, 2025",
    priority: "Medium",
    status: "To Do",
    completed: false,
  },
  {
    id: "task-7",
    title: "Write product descriptions",
    project: "E-commerce Platform",
    dueDate: "Apr 20, 2025",
    priority: "Low",
    status: "To Do",
    completed: false,
  },
  {
    id: "task-8",
    title: "Develop landing page",
    project: "Marketing Campaign",
    dueDate: "Mar 25, 2025",
    priority: "Medium",
    status: "Done",
    completed: true,
  },
]

export default function TasksPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const toggleTaskCompletion = (taskId: string) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed, status: !task.completed ? "Done" : "To Do" } : task,
      ),
    )
  }

  const filteredTasks = localTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "today") return matchesSearch && task.dueDate === "Today"
    if (filter === "upcoming") return matchesSearch && task.dueDate !== "Today" && !task.completed
    if (filter === "completed") return matchesSearch && task.completed

    return matchesSearch
  })

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage and track all your tasks</p>
          </div>
          <Button className="group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            New Task
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
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
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Manage your tasks and track progress</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                  {filteredTasks.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">No tasks found</p>
                        <Button variant="link" className="mt-2 group">
                          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                          Add a new task
                        </Button>
                      </div>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        variants={item}
                        whileHover={{ backgroundColor: "rgba(var(--muted), 0.1)", borderRadius: "0.375rem" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id={task.id}
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <label
                              htmlFor={task.id}
                              className={`font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}
                            >
                              {task.title}
                            </label>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{task.project}</span>
                              <span className="text-muted-foreground">•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span
                                  className={`${
                                    task.dueDate === "Today"
                                      ? "text-red-500"
                                      : task.dueDate === "Tomorrow"
                                        ? "text-amber-500"
                                        : "text-muted-foreground"
                                  }`}
                                >
                                  {task.dueDate}
                                </span>
                              </div>
                              <span className="text-muted-foreground">•</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  task.priority === "High"
                                    ? "bg-red-500/10 text-red-500"
                                    : task.priority === "Medium"
                                      ? "bg-amber-500/10 text-amber-500"
                                      : "bg-green-500/10 text-green-500"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              task.status === "To Do"
                                ? "bg-muted text-muted-foreground"
                                : task.status === "In Progress"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-green-500/10 text-green-500"
                            }`}
                          >
                            {task.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            Edit
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>View your tasks in a calendar format</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="flex h-[400px] items-center justify-center rounded-md border border-dashed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Calendar View</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Calendar view is coming soon</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
