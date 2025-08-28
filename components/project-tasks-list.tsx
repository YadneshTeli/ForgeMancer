"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, Clock, Plus } from "lucide-react"
import { createTask, updateTaskStatus } from "@/app/actions/project-actions"

type Task = {
  id: string
  name: string
  description: string
  priority: string
  status: string
  estimated_duration?: string
}

type ProjectTasksListProps = {
  projectId: string
  initialTasks: Task[]
}

export function ProjectTasksList({ projectId, initialTasks }: ProjectTasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append("projectId", projectId)

    try {
      const result = await createTask(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Task created successfully",
        })
        setIsDialogOpen(false)
        // Refresh the tasks list
        window.location.reload()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      const result = await updateTaskStatus(taskId, status)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Update the local state
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
        toast({
          title: "Success",
          description: "Task status updated",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const priorityColors: Record<string, string> = {
    High: "text-red-500",
    Medium: "text-yellow-500",
    Low: "text-green-500",
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your project. Fill out the details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Task Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="Medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{task.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority} Priority
                  </span>
                  {task.estimated_duration && (
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.estimated_duration}
                    </span>
                  )}
                </div>
                <Select defaultValue={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No tasks yet</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
