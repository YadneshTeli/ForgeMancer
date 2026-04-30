"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { generateProjectPlan, ProjectPlanSchema, type ProjectPlan } from "@/lib/groq"
import type { Database } from "@/types/supabase"

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin configuration")
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function formatProjectPlanSummary(plan: ProjectPlan) {
  const sections = [
    plan.breakdown,
    plan.estimatedTime ? `Estimated time: ${plan.estimatedTime}` : null,
    plan.techRecommendations?.length ? `Recommended additions: ${plan.techRecommendations.join(", ")}` : null,
    plan.tasks?.length
      ? `Key tasks:\n${plan.tasks
          .slice(0, 5)
          .map((task) => `- ${task.name}: ${task.description} (${task.priority}, ${task.estimatedDuration})`)
          .join("\n")}`
      : null,
  ]

  return sections.filter(Boolean).join("\n\n")
}

function extractTasksFromSummary(summary: string): TaskInsert[] {
  const keyTasksSection = summary.split("Key tasks:")[1]
  if (!keyTasksSection) return []

  return keyTasksSection
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const taskText = line.replace(/^- /, "")
      const match = taskText.match(/^(.+?):\s*(.*?)(?:\s*\((Low|Medium|High),\s*([^)]+)\))?$/)

      return {
        name: match?.[1]?.trim() || taskText,
        description: match?.[2]?.trim() || "",
        priority: match?.[3] || "Medium",
        status: "To Do",
        completed: false,
        estimated_duration: match?.[4]?.trim() || null,
      }
    })
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
  projectGoals: z.string().min(1, "Select at least one project goal"),
  targetAudience: z.string().trim().min(1, "Target audience is required"),
  budget: z.string().trim().min(1, "Budget range is required"),
})

export async function generatePlanPreview(formData: FormData) {
  // Extract and validate FormData
  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    clientName: formData.get("clientName") as string,
    projectType: formData.get("projectType") as string,
    techStack: formData.get("techStack") as string,
    experienceLevel: formData.get("experienceLevel") as string,
    dueDate: formData.get("dueDate") ? (formData.get("dueDate") as string) : undefined,
    projectGoals: formData.get("projectGoals") as string,
    targetAudience: formData.get("targetAudience") as string,
    budget: formData.get("budget") as string,
  }

  const validation = createProjectSchema.safeParse(rawData)
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || "Invalid project data"
    return { error: errorMessage }
  }

  const validatedData = validation.data

  try {
    const plan = await generateProjectPlan(
      validatedData.name,
      validatedData.description || "",
      validatedData.projectType,
      validatedData.techStack.join(", "),
      validatedData.experienceLevel,
      validatedData.projectGoals || "",
      validatedData.targetAudience || "",
      validatedData.budget || ""
    )
    const aiBreakdown = formatProjectPlanSummary(plan)
    return { plan: aiBreakdown, projectPlan: plan }
  } catch (error: any) {
    console.error("Error generating project plan preview:", error)
    return { error: "Failed to generate AI project plan" }
  }
}

export async function saveProject(formData: FormData, aiBreakdown: string, generatedProjectPlan?: ProjectPlan | null) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    // Extract and validate FormData
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      clientName: formData.get("clientName") as string,
      projectType: formData.get("projectType") as string,
      techStack: formData.get("techStack") as string,
      experienceLevel: formData.get("experienceLevel") as string,
      dueDate: formData.get("dueDate") ? (formData.get("dueDate") as string) : undefined,
      projectGoals: formData.get("projectGoals") as string,
      targetAudience: formData.get("targetAudience") as string,
      budget: formData.get("budget") as string,
    }

    const validation = createProjectSchema.safeParse(rawData)
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Invalid project data"
      return { error: errorMessage }
    }

    const validatedData = validation.data
    const parsedProjectPlan = generatedProjectPlan
      ? ProjectPlanSchema.safeParse(generatedProjectPlan)
      : null
    const projectPlan = parsedProjectPlan?.success ? parsedProjectPlan.data : null

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const admin = createAdminClient()

    const projectData: ProjectInsert = {
      user_id: user.id,
      name: validatedData.name,
      description: validatedData.description || "",
      client_name: validatedData.clientName || "",
      project_type: validatedData.projectType,
      tech_stack: validatedData.techStack,
      experience_level: validatedData.experienceLevel,
      status: "In Progress",
      due_date: validatedData.dueDate || "",
      estimated_time: projectPlan?.estimatedTime || "",
      ai_breakdown: aiBreakdown || (projectPlan ? formatProjectPlanSummary(projectPlan) : ""),
    }

    const { data, error } = await admin.from("projects").insert([projectData]).select()

    if (error) {
      throw error
    }

    const project = data?.[0]
    if (!project) {
      return { error: "Project was not created" }
    }

    const generatedTasks: TaskInsert[] = projectPlan?.tasks?.length
      ? projectPlan.tasks.map((task) => ({
        project_id: project.id,
        name: task.name,
        description: task.description,
        priority: task.priority,
        status: "To Do",
        assigned_to: user.id,
        completed: false,
        estimated_duration: task.estimatedDuration,
      }))
      : extractTasksFromSummary(aiBreakdown).map((task) => ({
        ...task,
        project_id: project.id,
        assigned_to: user.id,
      }))

    if (generatedTasks.length) {
      const { error: tasksError } = await admin.from("tasks").insert(generatedTasks)
      if (tasksError) {
        console.error("Task creation error:", tasksError)
        return { error: `Project created, but tasks failed to save: ${tasksError.message}` }
      }
    }

    if (projectPlan?.resources?.length) {
      const resourceData = projectPlan.resources.map((resource) => ({
        project_id: project.id,
        title: resource.title,
        url: resource.url || "",
        description: resource.description,
      }))

      const { error: resourcesError } = await admin.from("resources").insert(resourceData)
      if (resourcesError) {
        console.error("Resource creation error:", resourcesError)
        return { error: `Project and tasks created, but resources failed to save: ${resourcesError.message}` }
      }
    }

    revalidatePath("/dashboard/projects")
    revalidatePath(`/dashboard/projects/${project.id}`)
    return { success: true, project }
  } catch (error: any) {
    console.error("Project creation error:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, project_id")
      .eq("id", taskId)
      .maybeSingle()

    if (taskError) {
      return { error: taskError.message }
    }

    if (!task?.project_id) {
      return { error: "Task not found" }
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", task.project_id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (projectError) {
      return { error: projectError.message }
    }

    if (!project) {
      return { error: "Not authorized to update this task" }
    }

    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId)
      .eq("project_id", task.project_id)

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
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { projects: [] }
    }

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
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
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { project: null, tasks: [], resources: [] }
    }

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching project:", error)
      return { project: null, tasks: [], resources: [] }
    }

    if (!project) {
      return { project: null, tasks: [], resources: [] }
    }

    const { data: tasks } = await supabase.from("tasks").select("*").eq("project_id", project.id).order("created_at")

    const { data: resources } = await supabase.from("resources").select("*").eq("project_id", project.id).order("created_at")

    return { project, tasks, resources }
  } catch (error: any) {
    console.error("Error fetching project:", error)
    return { project: null, tasks: [], resources: [] }
  }
}

export async function createTask(formData: FormData) {
  try {
    const cookieStore = await cookies()
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

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (projectError) {
      return { error: projectError.message }
    }

    if (!project) {
      return { error: "Not authorized to create tasks for this project" }
    }

    const taskData: TaskInsert = {
      project_id: projectId,
      name: name,
      description: description,
      priority: priority,
      status: "To Do",
      assigned_to: user.id,
    }

    const { error } = await supabase.from("tasks").insert(taskData)

    if (error) {
      return { error: error.message }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return {}
  } catch (error: any) {
    return { error: error.message || "Failed to create task" }
  }
}
