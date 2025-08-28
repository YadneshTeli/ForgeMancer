"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"

const onboardingSchema = z.object({
  profession: z.string().min(1, "Profession is required"),
  bio: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.string().min(1, "Experience level is required"),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  location: z.string().optional(),
  phone: z.string().optional(),
  preferredTools: z.array(z.string()).optional(),
  workStyle: z.string().optional(),
  goals: z.string().optional(),
})

type FormData = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const { trackEvent } = useAnalytics()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      profession: "",
      bio: "",
      skills: [],
      experience: "",
      interests: [],
      location: "",
      phone: "",
      preferredTools: [],
      workStyle: "",
      goals: "",
    },
  })

  const totalSteps = 4

  const updateProgress = (currentStep: number) => {
    setProgress((currentStep / totalSteps) * 100)
  }

  const handleNext = () => {
    if (step < totalSteps) {
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

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to complete onboarding",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          profession: data.profession,
          bio: data.bio,
          skills: data.skills,
          experience_level: data.experience,
          interests: data.interests,
          location: data.location,
          phone: data.phone,
          preferred_tools: data.preferredTools,
          work_style: data.workStyle,
          goals: data.goals,
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      trackEvent("onboarding_complete", {})
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfessionSelect = (value: string) => {
    setValue("profession", value)
  }

  const handleExperienceSelect = (value: string) => {
    setValue("experience", value)
  }

  const handleWorkStyleSelect = (value: string) => {
    setValue("workStyle", value)
  }

  const handleSkillSelect = (skill: string) => {
    const currentSkills = watch("skills") || []
    if (currentSkills.includes(skill)) {
      setValue(
        "skills",
        currentSkills.filter((s) => s !== skill),
      )
    } else {
      setValue("skills", [...currentSkills, skill])
    }
  }

  const handleInterestSelect = (interest: string) => {
    const currentInterests = watch("interests") || []
    if (currentInterests.includes(interest)) {
      setValue(
        "interests",
        currentInterests.filter((i) => i !== interest),
      )
    } else {
      setValue("interests", [...currentInterests, interest])
    }
  }

  const handleToolSelect = (tool: string) => {
    const currentTools = watch("preferredTools") || []
    if (currentTools.includes(tool)) {
      setValue(
        "preferredTools",
        currentTools.filter((t) => t !== tool),
      )
    } else {
      setValue("preferredTools", [...currentTools, tool])
    }
  }

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "HTML/CSS",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "DevOps",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "SQL",
    "NoSQL",
    "MongoDB",
    "PostgreSQL",
    "Firebase",
    "Mobile Development",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Blockchain",
    "Smart Contracts",
    "Solidity",
    "Web3.js",
    "Ethereum",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "NLP",
  ]

  const interests = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "DevOps",
    "Cloud Computing",
    "Blockchain",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Game Development",
    "IoT",
    "Cybersecurity",
    "Digital Marketing",
    "E-commerce",
    "Fintech",
    "Healthtech",
    "Edtech",
  ]

  const tools = [
    "VS Code",
    "IntelliJ IDEA",
    "PyCharm",
    "Sublime Text",
    "Atom",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Jira",
    "Trello",
    "Asana",
    "Slack",
    "Discord",
    "Microsoft Teams",
    "Zoom",
    "Google Meet",
    "Figma",
    "Sketch",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "Postman",
    "Insomnia",
    "Docker",
    "Kubernetes",
    "Jenkins",
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Tell us about yourself to personalize your experience</CardDescription>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2.5 mt-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Getting Started</span>
            <span>Almost Done</span>
          </div>
        </CardHeader>

        <CardContent>
          <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="profession">What best describes you?</Label>
                  <Select onValueChange={handleProfessionSelect} value={watch("profession")}>
                    <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="product_manager">Product Manager</SelectItem>
                      <SelectItem value="marketer">Marketer</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.profession && <p className="text-sm text-red-500">{errors.profession.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={handleExperienceSelect} value={watch("experience")}>
                    <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a bit about yourself"
                    {...register("bio")}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label>Skills (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {skills.map((skill) => (
                      <div key={skill} className="flex items-center">
                        <Button
                          type="button"
                          variant={watch("skills")?.includes(skill) ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleSkillSelect(skill)}
                        >
                          {watch("skills")?.includes(skill) && <CheckCircle2 className="mr-2 h-4 w-4" />}
                          <span>{skill}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label>Interests (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center">
                        <Button
                          type="button"
                          variant={watch("interests")?.includes(interest) ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleInterestSelect(interest)}
                        >
                          {watch("interests")?.includes(interest) && <CheckCircle2 className="mr-2 h-4 w-4" />}
                          <span>{interest}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  {errors.interests && <p className="text-sm text-red-500">{errors.interests.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workStyle">Preferred Work Style</Label>
                  <Select onValueChange={handleWorkStyleSelect} value={watch("workStyle")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your work style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Work</SelectItem>
                      <SelectItem value="team">Team Collaboration</SelectItem>
                      <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label>Preferred Tools (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {tools.map((tool) => (
                      <div key={tool} className="flex items-center">
                        <Button
                          type="button"
                          variant={watch("preferredTools")?.includes(tool) ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleToolSelect(tool)}
                        >
                          {watch("preferredTools")?.includes(tool) && <CheckCircle2 className="mr-2 h-4 w-4" />}
                          <span>{tool}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Professional Goals (optional)</Label>
                  <Textarea
                    id="goals"
                    placeholder="What are you hoping to achieve?"
                    {...register("goals")}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input id="location" placeholder="City, Country" {...register("location")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" {...register("phone")} />
                </div>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious} disabled={isLoading}>
              Previous
            </Button>
          )}
          {step < totalSteps ? (
            <Button onClick={handleNext} className={step === 1 ? "w-full" : "ml-auto"}>
              Next
            </Button>
          ) : (
            <Button type="submit" form="onboarding-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
