import Groq from "groq-sdk"
import { z } from "zod"

function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured")
  }

  return new Groq({ apiKey })
}

export const ProjectPlanSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: z.enum(["Low", "Medium", "High"]),
      estimatedDuration: z.string(),
    }),
  ),
  estimatedTime: z.string(),
  breakdown: z.string(),
  techRecommendations: z.array(z.string()),
  resources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      description: z.string(),
    }),
  ),
})

export type ProjectPlan = z.infer<typeof ProjectPlanSchema>

export async function generateProjectPlan(
  projectName: string,
  projectDescription: string,
  projectType: string,
  techStack: string,
  experienceLevel: "beginner" | "intermediate" | "expert",
  projectGoals = "",
  targetAudience = "",
  budget = "",
): Promise<ProjectPlan> {
  const groq = createGroqClient()

  try {
    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a senior software project planner. Always respond with valid JSON only, following the exact structure requested by the user.",
        },
        {
          role: "user",
          content: `
Generate a detailed project plan for a ${projectType} project named "${projectName}".

Project Description: ${projectDescription}
Primary Technology: ${techStack}
Developer Experience Level: ${experienceLevel}
Project Goals: ${projectGoals}
Target Audience: ${targetAudience}
Budget Range: ${budget}

Please provide:
1. A list of 5-8 tasks with name, description, priority (Low, Medium, High), and estimated duration
2. Overall estimated time to complete the project
3. A brief breakdown of the project approach
4. 3-5 technology recommendations that would complement ${techStack}
5. 3 learning resources (tutorials, documentation, courses) relevant to this project

Respond with a JSON object with this exact structure:
{
  "tasks": [
    {
      "name": "Task name",
      "description": "Task description",
      "priority": "High",
      "estimatedDuration": "X days/hours"
    }
  ],
  "estimatedTime": "Total estimated time",
  "breakdown": "Project approach breakdown",
  "techRecommendations": ["Tech 1", "Tech 2", "Tech 3"],
  "resources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "description": "Brief description"
    }
  ]
}
          `.trim(),
        },
      ],
    })

    const text = completion.choices[0]?.message?.content || "{}"
    const parsedProjectPlan = ProjectPlanSchema.safeParse(JSON.parse(text))

    if (!parsedProjectPlan.success) {
      console.error("Invalid Groq project plan response:", parsedProjectPlan.error.flatten())
      throw new Error("Groq returned an invalid project plan response")
    }

    return parsedProjectPlan.data
  } catch (error) {
    console.error("Error generating project plan:", error)

    // Return a fallback plan if the API call fails
    return {
      tasks: [
        {
          name: "Project Setup",
          description: "Initialize repository and set up development environment",
          priority: "High",
          estimatedDuration: "1-2 days",
        },
        {
          name: "Design System",
          description: "Create design system and component library",
          priority: "High",
          estimatedDuration: "3-5 days",
        },
        {
          name: "Core Functionality",
          description: "Implement core features and functionality",
          priority: "High",
          estimatedDuration: "1-2 weeks",
        },
        {
          name: "Testing",
          description: "Perform unit and integration testing",
          priority: "Medium",
          estimatedDuration: "3-5 days",
        },
        {
          name: "Deployment",
          description: "Set up CI/CD pipeline and deploy to production",
          priority: "Medium",
          estimatedDuration: "1-2 days",
        },
      ],
      estimatedTime: "3-4 weeks",
      breakdown: `This ${projectType} project will be built using ${techStack}. Based on your ${experienceLevel} experience level, we estimate it will take approximately 3-4 weeks to complete.`,
      techRecommendations: ["TypeScript", "Tailwind CSS", "Jest"],
      resources: [
        {
          title: "Official Documentation",
          url: "",
          description: `Review the official documentation for ${techStack} and any frameworks you choose for this project.`,
        },
        {
          title: "Getting Started Tutorial",
          url: "",
          description: `Use a current beginner-friendly tutorial for ${techStack} that matches your project type and experience level.`,
        },
        {
          title: "Best Practices Guide",
          url: "",
          description: `Look for recent best-practice guidance on architecture, testing, accessibility, and deployment for ${techStack}.`,
        },
      ],
    }
  }
}
