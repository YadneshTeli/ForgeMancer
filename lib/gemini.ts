import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export type ProjectPlan = {
  tasks: {
    name: string
    description: string
    priority: "Low" | "Medium" | "High"
    estimatedDuration: string
  }[]
  estimatedTime: string
  breakdown: string
  techRecommendations: string[]
  resources: {
    title: string
    url: string
    description: string
  }[]
}

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
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create the prompt for the AI
    const prompt = `
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
      
      Format the response as a JSON object with the following structure:
      {
        "tasks": [
          {
            "name": "Task name",
            "description": "Task description",
            "priority": "High/Medium/Low",
            "estimatedDuration": "X days/hours"
          }
        ],
        "estimatedTime": "Total estimated time",
        "breakdown": "Project approach breakdown",
        "techRecommendations": ["Tech 1", "Tech 2", "Tech 3"],
        "resources": [
          {
            "title": "Resource title",
            "url": "Resource URL",
            "description": "Brief description"
          }
        ]
      }
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/)

    let jsonString = ""
    if (jsonMatch) {
      jsonString = jsonMatch[0].replace(/```json\n|```\n|```/g, "")
    } else {
      jsonString = text
    }

    // Parse the JSON
    const projectPlan = JSON.parse(jsonString) as ProjectPlan
    return projectPlan
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
          url: `https://example.com/${techStack.toLowerCase()}/docs`,
          description: `The official ${techStack} documentation`,
        },
        {
          title: "Getting Started Tutorial",
          url: `https://example.com/tutorials/${techStack.toLowerCase()}`,
          description: `A comprehensive tutorial for ${techStack}`,
        },
        {
          title: "Best Practices Guide",
          url: `https://example.com/best-practices/${techStack.toLowerCase()}`,
          description: `Best practices for ${techStack} development`,
        },
      ],
    }
  }
}
