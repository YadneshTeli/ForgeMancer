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
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, FolderKanban, Code2, Target, Rocket } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { generatePlanPreview, saveProject } from "@/app/actions/project-actions"
import type { ProjectPlan } from "@/lib/groq"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  clientName: z.string().optional(),
  dueDate: z.date().optional(),
  projectType: z.string().min(1, "Project type is required"),
  techStack: z.string().min(1, "Tech stack is required"),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"]),
  projectGoals: z.array(z.string()).min(1, "Select at least one project goal"),
  targetAudience: z.string().min(1, "Target audience is required"),
  budget: z.string().min(1, "Budget range is required"),
})

type FormData = z.infer<typeof projectSchema>

export function ProjectQuestionnaire() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null)
  const [generatedProjectPlan, setGeneratedProjectPlan] = useState<ProjectPlan | null>(null)
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
  const totalSteps = 5

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
      case 4:
        fieldsToValidate = ["targetAudience", "budget"]
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && step < totalSteps) {
      if (step === 4) {
        setIsLoading(true)
        try {
          const data = watch()
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

          toast({
            title: "Generating plan...",
            description: "We're using AI to analyze your requirements. This may take a moment.",
          })

          const result = await generatePlanPreview(formData)

          if (result?.error) {
            toast({
              title: "Error",
              description: result.error,
              variant: "destructive",
            })
            return
          }

          setGeneratedPlan(result.plan || "")
          setGeneratedProjectPlan(result.projectPlan || null)
          setStep(step + 1)
          updateProgress(step + 1)
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to generate plan",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setStep(step + 1)
        updateProgress(step + 1)
      }
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
        title: "Saving project...",
        description: "Storing your project and plan securely.",
      })

      const result = await saveProject(formData, generatedPlan || "", generatedProjectPlan)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Project created!",
          description: "Your AI-generated project plan is ready.",
        })
        const projectId = result?.project?.id
        router.push(projectId ? `/dashboard/projects/${projectId}` : "/dashboard/projects")
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

  const stepIcons = [FolderKanban, Code2, Target, Rocket, Sparkles]
  const CurrentStepIcon = stepIcons[step - 1] ?? Sparkles

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm max-w-3xl mx-auto">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03] gradient-bg blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.03] gradient-bg blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      {/* Header & Progress */}
      <div className="p-6 md:p-8 pb-0 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
              <CurrentStepIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">Step {step} of {totalSteps}</p>
              <h2 className="text-xl font-bold tracking-tight">
                {step === 1 && "Basic Information"}
                {step === 2 && "Project Type & Experience"}
                {step === 3 && "Tech Stack & Goals"}
                {step === 4 && "Final Details"}
                {step === 5 && "Review AI Plan"}
              </h2>
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground hidden sm:block">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        <div className="w-full bg-muted/50 rounded-full h-2 mb-8 overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full gradient-bg transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6 md:p-8 pt-0 relative z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Basic Project Information */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground/80">Project Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g. Acme Corp Redesign"
                  {...register("name")}
                  className={`bg-background/50 focus:bg-background transition-colors ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground/80">Project Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its purpose, and what you hope to achieve..."
                  className={`min-h-[120px] bg-background/50 focus:bg-background transition-colors resize-y ${errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  {...register("description")}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="client-name" className="text-foreground/80">Client Name (Optional)</Label>
                  <Input 
                    id="client-name" 
                    placeholder="Company or individual" 
                    {...register("clientName")} 
                    className="bg-background/50 focus:bg-background transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due-date" className="text-foreground/80">Target Due Date (Optional)</Label>
                  <div className="block">
                    <DatePicker
                      id="due-date"
                      selected={watch("dueDate")}
                      onSelect={(date) => setValue("dueDate", date)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Type and Experience */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in stagger-1">
              <div className="space-y-2">
                <Label htmlFor="project-type" className="text-foreground/80">Project Type <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setValue("projectType", value)} defaultValue={watch("projectType")}>
                  <SelectTrigger id="project-type" className={`bg-background/50 h-auto py-3 ${errors.projectType ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select the category that best fits your project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="py-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectType && <p className="text-xs text-red-500">{errors.projectType.message}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-foreground/80">Your Experience Level</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: "beginner", label: "Beginner", desc: "0-2 years" },
                    { value: "intermediate", label: "Intermediate", desc: "2-5 years" },
                    { value: "expert", label: "Expert", desc: "5+ years" }
                  ].map((level) => (
                    <div
                      key={level.value}
                      onClick={() => setValue("experienceLevel", level.value as any)}
                      className={`
                        relative flex flex-col p-4 rounded-xl border cursor-pointer hover-scale transition-all
                        ${watch("experienceLevel") === level.value 
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" 
                          : "border-border bg-card hover:bg-accent/50 hover:border-border/80"}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${watch("experienceLevel") === level.value ? "text-primary" : ""}`}>{level.label}</span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${watch("experienceLevel") === level.value ? "border-primary" : "border-muted-foreground/30"}`}>
                          {watch("experienceLevel") === level.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{level.desc}</span>
                    </div>
                  ))}
                </div>
                {errors.experienceLevel && <p className="text-xs text-red-500">{errors.experienceLevel.message}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Tech Stack and Goals */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in stagger-1">
              {projectType ? (
                <div className="space-y-2">
                  <Label htmlFor="tech-stack" className="text-foreground/80">Primary Technology <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(value) => setValue("techStack", value)} defaultValue={watch("techStack")}>
                    <SelectTrigger id="tech-stack" className={`bg-background/50 ${errors.techStack ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="What's the main technology for this project?" />
                    </SelectTrigger>
                    <SelectContent>
                      {techStackOptions[projectType]?.map((tech) => (
                        <SelectItem key={tech.value} value={tech.value}>
                          {tech.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.techStack && <p className="text-xs text-red-500">{errors.techStack.message}</p>}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-600 flex items-start gap-2">
                  <ArrowLeft className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>Please go back and select a Project Type first to see tailored technology options.</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground/80">Project Goals <span className="text-destructive">*</span></Label>
                  <span className="text-xs text-muted-foreground">Select all that apply</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {projectGoals.map((goal) => {
                    const isSelected = watch("projectGoals")?.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleProjectGoalToggle(goal)}
                        className={`
                          flex items-center justify-start text-left px-3 py-2.5 rounded-lg border text-sm transition-all hover-scale
                          ${isSelected 
                            ? "bg-primary/10 border-primary/30 text-foreground font-medium ring-1 ring-primary/20" 
                            : "bg-background/50 border-border text-muted-foreground hover:bg-accent hover:text-foreground"}
                        `}
                      >
                        <div className={`mr-2.5 flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                          {isSelected && <CheckCircle2 className="h-3 w-3" />}
                        </div>
                        <span className="truncate">{goal}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.projectGoals && <p className="text-xs text-red-500">{errors.projectGoals.message}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in stagger-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="target-audience" className="text-foreground/80">Target Audience <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="target-audience"
                    placeholder="Who are the end users?"
                    className={`min-h-[100px] bg-background/50 resize-y ${errors.targetAudience ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    {...register("targetAudience")}
                  />
                  {errors.targetAudience && <p className="text-xs text-red-500">{errors.targetAudience.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-foreground/80">Budget Range <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(value) => setValue("budget", value, { shouldValidate: true })} defaultValue={watch("budget")}>
                    <SelectTrigger id="budget" className={`bg-background/50 ${errors.budget ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Less than $5,000</SelectItem>
                      <SelectItem value="medium">$5,000 - $20,000</SelectItem>
                      <SelectItem value="high">$20,000 - $50,000</SelectItem>
                      <SelectItem value="enterprise">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.budget && <p className="text-xs text-red-500">{errors.budget.message}</p>}
                </div>
              </div>

              {/* Review Summary Bento Card */}
              <div className="bento-card overflow-hidden mt-6 bg-gradient-to-br from-background to-muted/50">
                <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Review Project Summary</h3>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Project Name</p>
                    <p className="font-medium truncate">{watch("name")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Project Type</p>
                    <p className="font-medium truncate">
                      {projectTypes.find((type) => type.value === watch("projectType"))?.label || watch("projectType")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Tech Stack</p>
                    <p className="font-medium truncate">
                      {techStackOptions[watch("projectType")]?.find(t => t.value === watch("techStack"))?.label || watch("techStack")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Goals</p>
                    <p className="font-medium truncate">
                      {watch("projectGoals")?.length > 0 ? `${watch("projectGoals").length} selected` : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review AI Generated Plan */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in stagger-1">
              <div className="bento-card overflow-hidden mt-6 bg-gradient-to-br from-background to-muted/50 border border-primary/20">
                <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">AI Generated Plan Preview</h3>
                </div>
                <div className="p-4 text-sm whitespace-pre-wrap font-mono bg-muted/10 max-h-[400px] overflow-y-auto leading-relaxed">
                  {generatedPlan}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Review the plan generated above. If you like it, save the project. Otherwise, you can go back and change your requirements or click the "Back" button to regenerate it with new details.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-border/50">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={isLoading} className="hover-scale">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div /> // Empty div to maintain flex-between layout
            )}

            {step < totalSteps - 1 ? (
              <Button type="button" onClick={handleNext} className="hover-scale gradient-bg border-0 text-white">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : step === 4 ? (
              <Button type="button" disabled={isLoading} onClick={handleNext} className="hover-scale gradient-bg border-0 text-white min-w-[200px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Plan
                  </>
                )}
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="hover-scale bg-green-600 hover:bg-green-700 border-0 text-white min-w-[200px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Project
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
