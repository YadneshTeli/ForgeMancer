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
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
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
  projectGoals: z.array(z.string()).min(1, "Select at least one project goal"),
  targetAudience: z.string().optional(),
  budget: z.string().optional(),
})

type FormData = z.infer<typeof projectSchema>

export function ProjectQuestionnaire() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
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
      projectGoals: [],
    },
  })

  const projectType = watch("projectType")
  const totalSteps = 4

  // Project types with descriptions
  const projectTypes = [
    {
      value: "web-app",
      label: "Web Application",
      description: "Interactive web applications with user authentication and database",
    },
    {
      value: "mobile-app",
      label: "Mobile Application",
      description: "Native or cross-platform mobile apps for iOS and Android",
    },
    {
      value: "e-commerce",
      label: "E-commerce Site",
      description: "Online store with product catalog, cart, and payment processing",
    },
    {
      value: "portfolio",
      label: "Portfolio Website",
      description: "Showcase your work, skills, and experience",
    },
    {
      value: "blog",
      label: "Blog",
      description: "Content management system for publishing articles",
    },
    {
      value: "dashboard",
      label: "Dashboard",
      description: "Data visualization and analytics interface",
    },
    {
      value: "blockchain",
      label: "Blockchain Application",
      description: "Decentralized applications using blockchain technology",
    },
    {
      value: "digital-marketing",
      label: "Digital Marketing",
      description: "SEO, content marketing, and social media campaigns",
    },
    {
      value: "ai-ml",
      label: "AI/ML Project",
      description: "Machine learning models and AI-powered applications",
    },
  ]

  // Tech stack options based on project type
  const techStackOptions: Record<string, { value: string; label: string }[]> = {
    "web-app": [
      { value: "React", label: "React" },
      { value: "Next.js", label: "Next.js" },
      { value: "Vue", label: "Vue.js" },
      { value: "Angular", label: "Angular" },
      { value: "Node.js", label: "Node.js" },
      { value: "Django", label: "Django" },
      { value: "Ruby on Rails", label: "Ruby on Rails" },
      { value: "Laravel", label: "Laravel" },
    ],
    "mobile-app": [
      { value: "React Native", label: "React Native" },
      { value: "Flutter", label: "Flutter" },
      { value: "Swift", label: "Swift (iOS)" },
      { value: "Kotlin", label: "Kotlin (Android)" },
      { value: "Xamarin", label: "Xamarin" },
    ],
    "e-commerce": [
      { value: "Shopify", label: "Shopify" },
      { value: "WooCommerce", label: "WooCommerce" },
      { value: "Magento", label: "Magento" },
      { value: "Next.js Commerce", label: "Next.js Commerce" },
      { value: "Saleor", label: "Saleor" },
    ],
    portfolio: [
      { value: "HTML/CSS/JS", label: "HTML/CSS/JavaScript" },
      { value: "React", label: "React" },
      { value: "Next.js", label: "Next.js" },
      { value: "Gatsby", label: "Gatsby" },
      { value: "WordPress", label: "WordPress" },
    ],
    blog: [
      { value: "WordPress", label: "WordPress" },
      { value: "Ghost", label: "Ghost" },
      { value: "Next.js", label: "Next.js" },
      { value: "Gatsby", label: "Gatsby" },
      { value: "Medium", label: "Medium" },
    ],
    dashboard: [
      { value: "React", label: "React" },
      { value: "Next.js", label: "Next.js" },
      { value: "Vue", label: "Vue.js" },
      { value: "D3.js", label: "D3.js" },
      { value: "Grafana", label: "Grafana" },
    ],
    blockchain: [
      { value: "Ethereum", label: "Ethereum" },
      { value: "Solidity", label: "Solidity" },
      { value: "Web3.js", label: "Web3.js" },
      { value: "Hardhat", label: "Hardhat" },
      { value: "Solana", label: "Solana" },
    ],
    "digital-marketing": [
      { value: "Google Ads", label: "Google Ads" },
      { value: "Facebook Ads", label: "Facebook Ads" },
      { value: "SEO", label: "SEO" },
      { value: "Content Marketing", label: "Content Marketing" },
      { value: "Email Marketing", label: "Email Marketing" },
    ],
    "ai-ml": [
      { value: "TensorFlow", label: "TensorFlow" },
      { value: "PyTorch", label: "PyTorch" },
      { value: "scikit-learn", label: "scikit-learn" },
      { value: "Hugging Face", label: "Hugging Face" },
      { value: "OpenAI API", label: "OpenAI API" },
    ],
  }

  // Project goals
  const projectGoals = [
    "Increase revenue",
    "Improve user experience",
    "Expand market reach",
    "Automate processes",
    "Reduce costs",
    "Enhance security",
    "Improve performance",
    "Add new features",
    "Rebrand/redesign",
    "Launch new product",
    "Educational/learning",
    "Personal portfolio",
  ]

  const updateProgress = (currentStep: number) => {
    setProgress((currentStep / totalSteps) * 100)
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = []

    switch (step) {
      case 1:
        fieldsToValidate = ["name", "description", "clientName"]
        break
      case 2:
        fieldsToValidate = ["projectType", "experienceLevel"]
        break
      case 3:
        fieldsToValidate = ["techStack", "projectGoals"]
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && step < totalSteps) {
      setStep(step + 1)
      updateProgress(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      updateProgress(step - 1)
    }
  }

  const handleProjectGoalToggle = (goal: string) => {
    const currentGoals = watch("projectGoals") || []
    if (currentGoals.includes(goal)) {
      setValue(
        "projectGoals",
        currentGoals.filter((g) => g !== goal),
      )
    } else {
      setValue("projectGoals", [...currentGoals, goal])
    }
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
      formData.append("projectGoals", data.projectGoals.join(", "))
      formData.append("targetAudience", data.targetAudience || "")
      formData.append("budget", data.budget || "")

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
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2.5 mb-6">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Project Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Basic Project Information</h2>
                <p className="text-sm text-muted-foreground">Let's start with the basics of your project.</p>
              </div>

              <div className="space-y-4">
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
                  <DatePicker
                    id="due-date"
                    selected={watch("dueDate")}
                    onSelect={(date) => setValue("dueDate", date)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Type and Experience */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Project Type & Experience</h2>
                <p className="text-sm text-muted-foreground">Tell us about the type of project and your experience.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select onValueChange={(value) => setValue("projectType", value)} defaultValue={watch("projectType")}>
                    <SelectTrigger id="project-type" className={errors.projectType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div>{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectType && <p className="text-sm text-red-500">{errors.projectType.message}</p>}
                </div>

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
                      <SelectItem value="beginner">
                        <div>
                          <div>Beginner (0-2 years)</div>
                          <div className="text-xs text-muted-foreground">New to this type of project</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="intermediate">
                        <div>
                          <div>Intermediate (2-5 years)</div>
                          <div className="text-xs text-muted-foreground">Some experience with similar projects</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="expert">
                        <div>
                          <div>Expert (5+ years)</div>
                          <div className="text-xs text-muted-foreground">Extensive experience in this field</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experienceLevel && <p className="text-sm text-red-500">{errors.experienceLevel.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tech Stack and Goals */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Tech Stack & Goals</h2>
                <p className="text-sm text-muted-foreground">Select technologies and define your project goals.</p>
              </div>

              <div className="space-y-4">
                {projectType && (
                  <div className="space-y-2">
                    <Label htmlFor="tech-stack">Primary Technology</Label>
                    <Select onValueChange={(value) => setValue("techStack", value)} defaultValue={watch("techStack")}>
                      <SelectTrigger id="tech-stack" className={errors.techStack ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select primary technology" />
                      </SelectTrigger>
                      <SelectContent>
                        {techStackOptions[projectType]?.map((tech) => (
                          <SelectItem key={tech.value} value={tech.value}>
                            {tech.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.techStack && <p className="text-sm text-red-500">{errors.techStack.message}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Project Goals (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {projectGoals.map((goal) => (
                      <div key={goal} className="flex items-center">
                        <Button
                          type="button"
                          variant={watch("projectGoals")?.includes(goal) ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleProjectGoalToggle(goal)}
                        >
                          {watch("projectGoals")?.includes(goal) && <CheckCircle2 className="mr-2 h-4 w-4" />}
                          <span>{goal}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  {errors.projectGoals && <p className="text-sm text-red-500">{errors.projectGoals.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Additional Details</h2>
                <p className="text-sm text-muted-foreground">
                  These optional details will help our AI generate a more tailored project plan.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience (Optional)</Label>
                  <Textarea
                    id="target-audience"
                    placeholder="Who is this project intended for?"
                    className="min-h-[80px]"
                    {...register("targetAudience")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Select onValueChange={(value) => setValue("budget", value)} defaultValue={watch("budget")}>
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Less than $5,000</SelectItem>
                      <SelectItem value="medium">$5,000 - $20,000</SelectItem>
                      <SelectItem value="high">$20,000 - $50,000</SelectItem>
                      <SelectItem value="enterprise">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Project Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Project Name:</div>
                      <div>{watch("name")}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Project Type:</div>
                      <div>
                        {projectTypes.find((type) => type.value === watch("projectType"))?.label ||
                          watch("projectType")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Tech Stack:</div>
                      <div>{watch("techStack")}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Experience Level:</div>
                      <div>{watch("experienceLevel")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Project Plan...
                  </>
                ) : (
                  "Generate AI Project Plan"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
