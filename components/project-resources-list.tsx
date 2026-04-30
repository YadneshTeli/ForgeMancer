"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Edit, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/components/ui/use-toast"
import { createResource, deleteResource, updateResource } from "@/app/actions/project-actions"
import type { Database } from "@/types/supabase"

type Resource = Database["public"]["Tables"]["resources"]["Row"]

type ProjectResourcesListProps = {
  projectId: string
  initialResources: Resource[]
}

export function ProjectResourcesList({ projectId, initialResources }: ProjectResourcesListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources || [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateResource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    formData.set("projectId", projectId)

    try {
      const result = await createResource(formData)
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
        return
      }

      if (result.resource) {
        setResources((current) => [...current, result.resource])
      }
      toast({ title: "Resource added", description: "The resource was added to this project." })
      setIsCreateOpen(false)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateResource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingResource) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    formData.set("id", editingResource.id)
    formData.set("projectId", projectId)

    try {
      const result = await updateResource(formData)
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
        return
      }

      if (result.resource) {
        setResources((current) =>
          current.map((resource) => (resource.id === result.resource!.id ? result.resource! : resource)),
        )
      }
      toast({ title: "Resource updated", description: "The resource changes were saved." })
      setEditingResource(null)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResource = async () => {
    if (!deletingResource) return
    setIsSubmitting(true)

    try {
      const result = await deleteResource(deletingResource.id, projectId)
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
        return
      }

      setResources((current) => current.filter((resource) => resource.id !== deletingResource.id))
      toast({ title: "Resource deleted", description: "The resource was removed from this project." })
      setDeletingResource(null)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Learning Resources</CardTitle>
          <CardDescription>Helpful links, docs, tutorials, and courses for this project</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateResource}>
              <DialogHeader>
                <DialogTitle>Add Resource</DialogTitle>
                <DialogDescription>Add a link that supports this project.</DialogDescription>
              </DialogHeader>
              <ResourceFields />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Resource"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {resources.map((resource) => (
              <div key={resource.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span className="truncate">{resource.title}</span>
                    </a>
                    {resource.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingResource(resource)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit resource</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingResource(resource)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete resource</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
            <p className="text-sm text-muted-foreground">No resources available for this project yet.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Resource
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={Boolean(editingResource)} onOpenChange={(open) => !open && setEditingResource(null)}>
        <DialogContent>
          <form onSubmit={handleUpdateResource}>
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
              <DialogDescription>Update this project resource.</DialogDescription>
            </DialogHeader>
            <ResourceFields resource={editingResource} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingResource)} onOpenChange={(open) => !open && setDeletingResource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>This removes the resource from the project.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingResource(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteResource} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Resource"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function ResourceFields({ resource }: { resource?: Resource | null }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="resource-title">Title</Label>
        <Input id="resource-title" name="title" defaultValue={resource?.title || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="resource-url">URL</Label>
        <Input id="resource-url" name="url" type="url" defaultValue={resource?.url || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="resource-description">Description</Label>
        <Textarea
          id="resource-description"
          name="description"
          defaultValue={resource?.description || ""}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
