"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import { generateProjectPlan } from "@/lib/gemini"

/**
 * Server Action: Create a new project
 * - Authenticates the user (Supabase)
 * - Generates an AI project plan (Gemini)
 * - Saves project, tasks, and resources
 * - Revalidates cache and redirects to projects list
 */
export async function createProject(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Ensure user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Not authenticated" }
  }

  // Extract form fields
  const name = (formData.get("name") as string) || ""
  const description = (formData.get("description") as string) || ""
  const clientName = (formData.get("clientName") as string) || ""
  const dueDate = (formData.get("dueDate") as string) || ""
  const projectType = (formData.get("projectType") as string) || ""
  const techStack = (formData.get("techStack") as string) || ""
  const experienceLevel = (formData.get("experienceLevel") as "beginner" | "intermediate" | "expert") || "intermediate"
  const projectGoals = (formData.get("projectGoals") as string) || "" // comma-separated list
  const targetAudience = (formData.get("targetAudience") as string) || ""
  const budget = (formData.get("budget") as string) || ""

  if (!name || !description || !projectType || !techStack) {
    return { error: "Missing required fields" }
  }

  try {
    // 1) Generate AI project plan from Gemini
    const plan = await generateProjectPlan(
      name,
      description,
      projectType,
      techStack,
      experienceLevel,
      projectGoals,
      targetAudience,
      budget,
    )

    // 2) Insert the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        client_name: clientName || null,
        project_type: projectType,
        tech_stack: [techStack, ...(plan.techRecommendations || [])],
        experience_level: experienceLevel,
        due_date: dueDate || null,
        user_id: user.id,
        status: "Planning",
        ai_breakdown: plan.breakdown,
        estimated_time: plan.estimatedTime,
      })
      .select()
      .single()

    if (projectError || !project) {
      console.error("Error creating project:", projectError)
      return { error: "Failed to create project" }
    }

    // 3) Insert tasks (best-effort)
    if (Array.isArray(plan.tasks) && plan.tasks.length > 0) {
      const tasksToInsert = plan.tasks.map((t) => ({
        project_id: project.id,
        name: t.name,
        description: t.description,
        priority: t.priority, // expects "High" | "Medium" | "Low"
        status: "To Do",
        assigned_to: user.id,
        estimated_duration: t.estimatedDuration,
      }))

      const { error: tasksError } = await supabase.from("tasks").insert(tasksToInsert)
      if (tasksError) {
        // Log and continue
        console.error("Error inserting tasks:", tasksError)
      }
    }

    // 4) Insert resources (best-effort)
    if (Array.isArray(plan.resources) && plan.resources.length > 0) {
      const resourcesToInsert = plan.resources.map((r) => ({
        project_id: project.id,
        title: r.title,
        description: r.description,
        url: r.url,
      }))

      const { error: resourcesError } = await supabase.from("resources").insert(resourcesToInsert)
      if (resourcesError) {
        // Log and continue
        console.error("Error inserting resources:", resourcesError)
      }
    }

    // 5) Revalidate and redirect
    revalidatePath("/dashboard/projects")
    redirect("/dashboard/projects")
  } catch (err: any) {
    console.error("Error during project creation:", err)
    return { error: err?.message || "Failed to create project" }
  }
}

/**
 * Update a task status
 */
export async function updateTaskStatus(taskId: string, status: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard/projects/[id]", "page")
    return {}
  } catch (error: any) {
    return { error: error.message || "Failed to update task status" }
  }
}

/**
 * Fetch all projects
 */
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

/**
 * Fetch a single project with tasks and resources
 */
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

    return { project, tasks: tasks || [], resources: resources || [] }
  } catch (error: any) {
    console.error("Error fetching project:", error)
    return { project: null, tasks: [], resources: [] }
  }
}

/**
 * Create a task
 */
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
      name,
      description,
      priority,
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
