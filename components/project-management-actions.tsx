"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/components/ui/use-toast"
import { deleteProject, updateProject } from "@/app/actions/project-actions"
import type { Database } from "@/types/supabase"

type Project = Database["public"]["Tables"]["projects"]["Row"]

type ProjectManagementActionsProps = {
  project: Project
}

const projectStatuses = ["Planning", "In Progress", "Completed", "Cancelled"] as const
const experienceLevels = ["beginner", "intermediate", "expert"] as const

function getDateValue(value: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function ProjectManagementActions({ project }: ProjectManagementActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(getDateValue(project.due_date))
  const router = useRouter()
  const { toast } = useToast()

  const handleUpdateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const formData = new FormData(event.currentTarget)
    formData.set("id", project.id)
    if (dueDate) {
      formData.set("dueDate", dueDate.toISOString())
    } else {
      formData.delete("dueDate")
    }

    try {
      const result = await updateProject(formData)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Project updated",
        description: "Your changes have been saved.",
      })
      setIsEditOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteProject(project.id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Project deleted",
        description: "The project and its related tasks/resources were removed.",
      })
      setIsDeleteOpen(false)
      router.push("/dashboard/projects")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => setIsEditOpen(true)}>
        <Pencil className="mr-2 h-4 w-4" />
        Edit Project
      </Button>
      <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <form onSubmit={handleUpdateProject}>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Update the project details, status, timeline, and AI breakdown.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" name="name" defaultValue={project.name} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={project.description || ""} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input id="clientName" name="clientName" defaultValue={project.client_name || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Input id="projectType" name="projectType" defaultValue={project.project_type || ""} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input id="techStack" name="techStack" defaultValue={project.tech_stack?.join(", ") || ""} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select name="experienceLevel" defaultValue={project.experience_level || "intermediate"}>
                    <SelectTrigger id="experienceLevel">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={project.status || "Planning"}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <DatePicker id="dueDate" selected={dueDate} onSelect={setDueDate} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estimatedTime">Estimated Time</Label>
                  <Input id="estimatedTime" name="estimatedTime" defaultValue={project.estimated_time || ""} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="aiBreakdown">AI Breakdown</Label>
                <Textarea
                  id="aiBreakdown"
                  name="aiBreakdown"
                  defaultValue={project.ai_breakdown || ""}
                  className="min-h-[180px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This will permanently delete the project, generated tasks, and resources. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteProject} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
