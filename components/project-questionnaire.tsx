"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { savePendingProject, getPendingProject, hasPendingProject, clearPendingProject } from "@/lib/pending-project"
import { AuthGate } from "@/components/auth-gate"
import { getClientSupabase } from "@/lib/supabase"
import {
  TOTAL_STEPS,
  updateProgress as calcProgress,
  toggleProjectGoal,
  projectTypes,
  techStackOptions,
  projectGoals,
} from "./project-questionnaire.logic"

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

interface ProjectQuestionnaireProps {
  mode?: "authenticated" | "try"
}

export function ProjectQuestionnaire({ mode = "authenticated" }: ProjectQuestionnaireProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null)
  const [generatedProjectPlan, setGeneratedProjectPlan] = useState<ProjectPlan | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(mode === "authenticated")
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
  const totalSteps = TOTAL_STEPS

  // In "try" mode, check auth status on mount and handle pending project auto-resume
  useEffect(() => {
    if (mode !== "try") return

    const checkAuthAndPending = async () => {
      try {
        const supabase = getClientSupabase()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setIsAuthenticated(true)

          // If the user is authenticated AND has a pending project, auto-trigger plan generation
          const pending = getPendingProject()
          if (pending) {
            // Restore form data from pending project
            setValue("name", pending.name)
            setValue("description", pending.description)
            if (pending.clientName) setValue("clientName", pending.clientName)
            if (pending.dueDate) setValue("dueDate", new Date(pending.dueDate))
            setValue("projectType", pending.projectType)
            setValue("techStack", pending.techStack)
            setValue("experienceLevel", pending.experienceLevel)
            setValue("projectGoals", pending.projectGoals)
            setValue("targetAudience", pending.targetAudience)
            setValue("budget", pending.budget)

            // Jump to step 5 (AI plan preview)
            setStep(5)
            updateProgress(5)

            // Trigger AI plan generation inline using restored data
            setIsLoading(true)
            try {
              const formData = new FormData()
              formData.append("name", pending.name)
              formData.append("description", pending.description)
              formData.append("clientName", pending.clientName || "")
              formData.append("projectType", pending.projectType)
              formData.append("techStack", pending.techStack)
              formData.append("experienceLevel", pending.experienceLevel)
              formData.append("projectGoals", pending.projectGoals.join(", "))
              formData.append("targetAudience", pending.targetAudience || "")
              formData.append("budget", pending.budget || "")

              if (pending.dueDate) {
                formData.append("dueDate", pending.dueDate)
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
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to generate plan",
                variant: "destructive",
              })
            } finally {
              setIsLoading(false)
            }
          }
        }
      } catch {
        // Auth check failed — user is not authenticated
      }
    }

    checkAuthAndPending()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /** Generate the AI plan using current form data and advance to step 5 */
  const generatePlan = async () => {
    setIsLoading(true)
    try {
      const supabase = getClientSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Session Expired",
          description: "Please log in to generate your project plan.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

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
      setStep(5)
      updateProgress(5)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate plan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /** Called by AuthGate after successful signup/login in try mode */
  const handleAuthComplete = async () => {
    setIsAuthenticated(true)

    // Read pending project from localStorage and trigger plan generation
    const pending = getPendingProject()
    if (pending) {
      // Ensure form has the correct data (may have been restored already)
      setValue("name", pending.name)
      setValue("description", pending.description)
      if (pending.clientName) setValue("clientName", pending.clientName)
      if (pending.dueDate) setValue("dueDate", new Date(pending.dueDate))
      setValue("projectType", pending.projectType)
      setValue("techStack", pending.techStack)
      setValue("experienceLevel", pending.experienceLevel)
      setValue("projectGoals", pending.projectGoals)
      setValue("targetAudience", pending.targetAudience)
      setValue("budget", pending.budget)
    }

    // Generate the plan now that the user is authenticated
    await generatePlan()
  }

  const updateProgress = (currentStep: number) => {
    setProgress(calcProgress(currentStep, totalSteps))
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
        // In "try" mode, check auth before generating the plan
        if (mode === "try" && !isAuthenticated) {
          // Save form data to localStorage so it persists through auth flow
          const data = watch()
          savePendingProject({
            name: data.name,
            description: data.description,
            clientName: data.clientName || undefined,
            dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
            projectType: data.projectType,
            techStack: data.techStack,
            experienceLevel: data.experienceLevel,
            projectGoals: data.projectGoals,
            targetAudience: data.targetAudience || "",
            budget: data.budget || "",
          })
          // Go to step 5 which will show the auth gate
          setStep(step + 1)
          updateProgress(step + 1)
          return
        }

        // Authenticated flow — generate plan
        await generatePlan()
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
    setValue("projectGoals", toggleProjectGoal(currentGoals, goal))
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
        if (mode === "try") {
          clearPendingProject()
        }
        const projectId = result?.project?.id
        router.push(projectId ? `/dashboard/projects/${projectId}?tab=resources` : "/dashboard/projects")
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
    <div className="relative overflow-hidden rounded-2xl border border-[#7c3aed]/10 bg-white/60 dark:bg-[#0a0914]/85 backdrop-blur-xl shadow-lg max-w-3xl mx-auto">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03] gradient-bg blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.03] gradient-bg blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      {/* Header & Progress */}
      <div className="p-6 md:p-8 pb-0 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-primary/10">
              <CurrentStepIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-0.5">Step {step} of {totalSteps}</p>
              <h2 className="text-xl font-bold tracking-tight">
                {step === 1 && "Basic Information"}
                {step === 2 && "Project Type & Experience"}
                {step === 3 && "Tech Stack & Goals"}
                {step === 4 && "Final Details"}
                {step === 5 && "Review AI Plan"}
              </h2>
            </div>
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        <div className="w-full bg-muted/40 rounded-full h-2 mb-8 overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full gradient-bg"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="p-6 md:p-8 pt-0 relative z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 1: Basic Project Information */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Project Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      placeholder="e.g. Acme Corp Redesign"
                      {...register("name")}
                      className={`bg-background/50 focus:bg-background border-[#7c3aed]/10 dark:border-white/5 transition-all rounded-xl py-5 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Project Description <span className="text-destructive">*</span></Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project, its purpose, and what you hope to achieve..."
                      className={`min-h-[120px] bg-background/50 focus:bg-background border-[#7c3aed]/10 dark:border-white/5 transition-all rounded-xl resize-y ${errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("description")}
                    />
                    {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="client-name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Client Name (Optional)</Label>
                      <Input 
                        id="client-name" 
                        placeholder="Company or individual" 
                        {...register("clientName")} 
                        className="bg-background/50 focus:bg-background border-[#7c3aed]/10 dark:border-white/5 transition-all rounded-xl py-5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due-date" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Target Due Date (Optional)</Label>
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
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="project-type" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Project Type <span className="text-destructive">*</span></Label>
                    <Select onValueChange={(value) => setValue("projectType", value)} defaultValue={watch("projectType")}>
                      <SelectTrigger id="project-type" className={`bg-background/50 dark:bg-[#110f1c]/50 h-auto py-3.5 rounded-xl border-[#7c3aed]/10 dark:border-white/5 ${errors.projectType ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select the category that best fits your project" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="py-2.5 cursor-pointer rounded-lg">
                            <div className="flex flex-col">
                              <span className="font-bold text-xs">{type.label}</span>
                              <span className="text-[10px] text-muted-foreground mt-0.5">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.projectType && <p className="text-xs text-red-500 font-medium">{errors.projectType.message}</p>}
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Your Experience Level</Label>
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
                            <span className={`font-bold text-xs ${watch("experienceLevel") === level.value ? "text-primary" : ""}`}>{level.label}</span>
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${watch("experienceLevel") === level.value ? "border-primary" : "border-muted-foreground/30"}`}>
                              {watch("experienceLevel") === level.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold">{level.desc}</span>
                        </div>
                      ))}
                    </div>
                    {errors.experienceLevel && <p className="text-xs text-red-500 font-medium">{errors.experienceLevel.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Tech Stack and Goals */}
              {step === 3 && (
                <div className="space-y-6">
                  {projectType ? (
                    <div className="space-y-2">
                      <Label htmlFor="tech-stack" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Primary Technology <span className="text-destructive">*</span></Label>
                      <Select onValueChange={(value) => setValue("techStack", value)} defaultValue={watch("techStack")}>
                        <SelectTrigger id="tech-stack" className={`bg-background/50 rounded-xl border-[#7c3aed]/10 dark:border-white/5 ${errors.techStack ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="What's the main technology for this project?" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {techStackOptions[projectType]?.map((tech) => (
                            <SelectItem key={tech.value} value={tech.value} className="cursor-pointer rounded-lg py-2">
                              {tech.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.techStack && <p className="text-xs text-red-500 font-medium">{errors.techStack.message}</p>}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 flex items-start gap-2 font-semibold">
                      <ArrowLeft className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Please go back and select a Project Type first to see tailored technology options.</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Project Goals <span className="text-destructive">*</span></Label>
                      <span className="text-[10px] text-muted-foreground font-semibold">Select all that apply</span>
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
                              flex items-center justify-start text-left px-3 py-2.5 rounded-xl border text-xs transition-all hover-scale
                              ${isSelected 
                                ? "bg-primary/10 border-primary/30 text-foreground font-bold ring-1 ring-primary/20" 
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
                    {errors.projectGoals && <p className="text-xs text-red-500 font-medium">{errors.projectGoals.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 4: Additional Details */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="target-audience" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Target Audience <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="target-audience"
                        placeholder="Who are the end users?"
                        className={`min-h-[100px] bg-background/50 border-[#7c3aed]/10 dark:border-white/5 rounded-xl resize-y ${errors.targetAudience ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        {...register("targetAudience")}
                      />
                      {errors.targetAudience && <p className="text-xs text-red-500 font-medium">{errors.targetAudience.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Budget Range <span className="text-destructive">*</span></Label>
                      <Select onValueChange={(value) => setValue("budget", value, { shouldValidate: true })} defaultValue={watch("budget")}>
                        <SelectTrigger id="budget" className={`bg-background/50 rounded-xl border-[#7c3aed]/10 dark:border-white/5 ${errors.budget ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="low" className="cursor-pointer py-2 rounded-lg text-xs">Less than $5,000</SelectItem>
                          <SelectItem value="medium" className="cursor-pointer py-2 rounded-lg text-xs">$5,000 - $20,000</SelectItem>
                          <SelectItem value="high" className="cursor-pointer py-2 rounded-lg text-xs">$20,000 - $50,000</SelectItem>
                          <SelectItem value="enterprise" className="cursor-pointer py-2 rounded-lg text-xs">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.budget && <p className="text-xs text-red-500 font-medium">{errors.budget.message}</p>}
                    </div>
                  </div>

                  {/* Review Summary Bento Card */}
                  <div className="bento-card overflow-hidden mt-6 bg-gradient-to-br from-background to-muted/20 border border-[#7c3aed]/10 rounded-2xl shadow-inner">
                    <div className="p-4 border-b border-[#7c3aed]/10 bg-muted/10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary animate-float" />
                      <h3 className="font-bold text-xs uppercase tracking-wider">Review Project Summary</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Project Name</p>
                        <p className="font-semibold truncate text-foreground">{watch("name")}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Project Type</p>
                        <p className="font-semibold truncate text-foreground">
                          {projectTypes.find((type) => type.value === watch("projectType"))?.label || watch("projectType")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Tech Stack</p>
                        <p className="font-semibold truncate text-foreground">
                          {techStackOptions[watch("projectType")]?.find(t => t.value === watch("techStack"))?.label || watch("techStack")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Goals</p>
                        <p className="font-semibold truncate text-foreground">
                          {watch("projectGoals")?.length > 0 ? `${watch("projectGoals").length} selected` : "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review AI Generated Plan */}
              {step === 5 && (
                <>
                  {mode === "try" && !isAuthenticated ? (
                    <AuthGate onAuthComplete={handleAuthComplete} />
                  ) : (
                    <div className="space-y-6">
                      <div className="bento-card overflow-hidden mt-6 bg-white/40 dark:bg-black/40 border border-primary/20 rounded-2xl shadow-inner">
                        <div className="p-4 border-b border-[#7c3aed]/15 bg-muted/10 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary animate-float" />
                          <h3 className="font-bold text-xs uppercase tracking-wider">AI Generated Plan Preview</h3>
                        </div>
                        <div className="p-5 text-xs whitespace-pre-wrap font-mono bg-[#faf9ff]/20 dark:bg-[#03020c]/20 max-h-[400px] overflow-y-auto leading-relaxed border-0 select-text">
                          {generatedPlan}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-start gap-2.5 font-semibold leading-relaxed">
                        <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                        <p>Review the plan generated above. If you like it, save the project to unlock active tracking. Otherwise, you can go back and change your requirements or click the "Back" button to regenerate it with new details.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-border/40 relative z-20">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={isLoading} className="hover-scale rounded-xl px-5 border-[#7c3aed]/15 bg-background/50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div /> 
            )}

            {step < totalSteps - 1 ? (
              <Button type="button" onClick={handleNext} className="hover-scale gradient-bg border-0 text-white rounded-xl px-6">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : step === 4 ? (
              <Button type="button" disabled={isLoading} onClick={handleNext} className="hover-scale gradient-bg border-0 text-white rounded-xl px-6 min-w-[200px]">
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
              <Button type="submit" disabled={isLoading} className="hover-scale bg-green-600 hover:bg-green-700 border-0 text-white rounded-xl px-6 min-w-[200px]">
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
