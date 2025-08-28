"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { createProject } from "@/app/actions/project-actions"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  clientName: z.string().optional(),
  dueDate: z.date().optional(),
  projectType: z.string().min(1, "Project type is required"),
  techStack: z.string().min(1, "Tech stack is required"),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"]),
})

type FormData = z.infer<typeof projectSchema>

export function CreateProjectForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const { trackEvent } = useAnalytics()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      experienceLevel: "intermediate",
    },
  })

  const projectType = watch("projectType")

  // Tech stack options based on project type
  const techStackOptions: Record<string, string[]> = {
    "web-app": ["React", "Next.js", "Vue", "Angular", "Node.js", "Express", "MongoDB", "PostgreSQL"],
    "mobile-app": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    "e-commerce": ["Shopify", "WooCommerce", "Magento", "Next.js", "Stripe"],
    portfolio: ["HTML/CSS", "JavaScript", "React", "Next.js", "Gatsby"],
    blog: ["WordPress", "Ghost", "Next.js", "Sanity", "Contentful"],
    dashboard: ["React", "Next.js", "D3.js", "Chart.js", "Tailwind CSS"],
  }

  const handleNext = async () => {
    const isValid = await trigger(["name", "description", "clientName", "dueDate"])
    if (isValid) {
      setStep(2)
    }
  }

  const handlePrevious = () => {
    setStep(1)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("clientName", data.clientName || "")
      formData.append("projectType", data.projectType)
      formData.append("techStack", data.techStack)
      formData.append("experienceLevel", data.experienceLevel)

      if (data.dueDate) {
        formData.append("dueDate", data.dueDate.toISOString())
      }

      trackEvent("project_created", {
        projectType: data.projectType,
        experienceLevel: data.experienceLevel,
      })

      toast({
        title: "Creating project...",
        description: "We're using AI to generate your project plan. This may take a moment.",
      })

      const result = await createProject(formData)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="flex items-center space-x-2 bg-background px-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`text-sm font-medium ${step >= 1 ? "text-primary-foreground" : ""}`}>1</span>
              </div>
              <div className="w-12 border-t"></div>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`text-sm font-medium ${step >= 2 ? "text-primary-foreground" : ""}`}>2</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project and its goals"
                  className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name (Optional)</Label>
                <Input id="client-name" placeholder="Client or Company Name" {...register("clientName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date (Optional)</Label>
                <DatePicker id="due-date" selected={watch("dueDate")} onSelect={(date) => setValue("dueDate", date)} />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Select onValueChange={(value) => setValue("projectType", value)} defaultValue={watch("projectType")}>
                  <SelectTrigger id="project-type" className={errors.projectType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-app">Web Application</SelectItem>
                    <SelectItem value="mobile-app">Mobile Application</SelectItem>
                    <SelectItem value="e-commerce">E-commerce Site</SelectItem>
                    <SelectItem value="portfolio">Portfolio Website</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                  </SelectContent>
                </Select>
                {errors.projectType && <p className="text-sm text-red-500">{errors.projectType.message}</p>}
              </div>

              {projectType && (
                <div className="space-y-2">
                  <Label htmlFor="tech-stack">Tech Stack</Label>
                  <Select onValueChange={(value) => setValue("techStack", value)} defaultValue={watch("techStack")}>
                    <SelectTrigger id="tech-stack" className={errors.techStack ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select primary technology" />
                    </SelectTrigger>
                    <SelectContent>
                      {techStackOptions[projectType]?.map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.techStack && <p className="text-sm text-red-500">{errors.techStack.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("experienceLevel", value as "beginner" | "intermediate" | "expert")
                  }
                  defaultValue={watch("experienceLevel")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-sm text-red-500">{errors.experienceLevel.message}</p>}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
