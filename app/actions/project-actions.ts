"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { z } from "zod"
import { generateProjectPlan } from "@/lib/groq"

// Type for project insert
interface ProjectInsert {
  user_id: string
  name: string
  description: string | null
  client_name: string | null
  project_type: string
  tech_stack: string[]
  experience_level: string
  status: string
  due_date?: string
}

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(255),
  description: z.string().trim().max(2000).optional(),
  clientName: z.string().trim().max(255).optional(),
  projectType: z.string().trim().min(1, "Project type is required"),
  techStack: z
    .string()
    .trim()
    .min(1, "Tech stack is required")
    .transform((val) => val.split(",").map((tech) => tech.trim()).filter((tech) => tech.length > 0)),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"], { message: "Experience level must be beginner, intermediate, or expert" }),
  dueDate: z.string().optional(),
})

export async function createProject(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Extract and validate FormData
  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    clientName: formData.get("clientName") as string,
    projectType: formData.get("projectType") as string,
    techStack: formData.get("techStack") as string,
    experienceLevel: formData.get("experienceLevel") as string,
    dueDate: formData.get("dueDate") as string,
  }

  // Validate using Zod schema
  const validation = createProjectSchema.safeParse(rawData)
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || "Invalid project data"
    return { error: errorMessage }
  }

  const validatedData = validation.data

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Generate project plan using Groq
    let aiBreakdown: string | null = null
    try {
      const plan = await generateProjectPlan(
        validatedData.name,
        validatedData.description || "",
        validatedData.projectType,
        validatedData.techStack.join(", "),
        validatedData.experienceLevel,
      )
      aiBreakdown = JSON.stringify(plan)
    } catch (planError) {
      console.error("Error generating project plan:", planError)
      // Continue without AI breakdown if generation fails
    }

    const projectData = {
      user_id: user.id,
      name: validatedData.name,
      description: validatedData.description || null,
      client_name: validatedData.clientName || null,
      project_type: validatedData.projectType,
      tech_stack: validatedData.techStack,
      experience_level: validatedData.experienceLevel,
      status: "In Progress",
      due_date: validatedData.dueDate || null,
      ai_breakdown: aiBreakdown,
    }

    const response = await supabase.from("projects").insert([projectData] as any).select()
    const { error, data } = response

    if (error) {
      return { error: "Failed to create project" }
    }

    revalidatePath("/dashboard/projects")
    return { success: true, project: data?.[0] }
  } catch (error: any) {
    console.error("Project creation error:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { error } = await (supabase.from("tasks") as any).update({ status: status }).eq("id", taskId)

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
    const { data: project, error } = await supabase.from("projects").select("*").eq("id", id as any).single()

    if (error) {
      console.error("Error fetching project:", error)
      return { project: null, tasks: [], resources: [] }
    }

    const { data: tasks } = await supabase.from("tasks").select("*").eq("project_id", id as any).order("created_at")

    const { data: resources } = await supabase.from("resources").select("*").eq("project_id", id as any).order("created_at")

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
    } as any)

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return {}
  } catch (error: any) {
    return { error: error.message || "Failed to create task" }
  }
}
