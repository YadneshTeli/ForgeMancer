"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function createProject(formData: FormData) {
  return { error: "Not implemented" }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { error } = await supabase.from("tasks").update({ status: status }).eq("id", taskId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard/projects/[id]", "page")
    return {}
  } catch (error: any) {
    return { error: error.message || "Failed to update task status" }
  }
}

export async function getProjects() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { projects: [] }
    }

    return { projects }
  } catch (error: any) {
    console.error("Error fetching projects:", error)
    return { projects: [] }
  }
}

export async function getProject(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return { project: null, tasks: [], resources: [] }
    }

    const { data: tasks } = await supabase.from("tasks").select("*").eq("project_id", id).order("created_at")

    const { data: resources } = await supabase.from("resources").select("*").eq("project_id", id).order("created_at")

    return { project, tasks, resources }
  } catch (error: any) {
    console.error("Error fetching project:", error)
    return { project: null, tasks: [], resources: [] }
  }
}

export async function createTask(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const projectId = formData.get("projectId") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    const { error } = await supabase.from("tasks").insert({
      project_id: projectId,
      name: name,
      description: description,
      priority: priority,
      status: "To Do",
      assigned_to: user.id,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return {}
  } catch (error: any) {
    return { error: error.message || "Failed to create task" }
  }
}
