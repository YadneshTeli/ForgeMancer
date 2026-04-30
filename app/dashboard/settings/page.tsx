"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PageTransition } from "@/components/page-transition"
import { Bot, CreditCard, Loader2, User } from "lucide-react"
import { getClientSupabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { saveProfile } from "@/app/actions/profile-actions"

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    full_name: "",
    bio: "",
    profession: "",
    skills: "",
    experience_level: "intermediate",
    work_style: "",
    email: "",
  })
  const supabase = getClientSupabase()
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setProfileData({
          full_name: profile.full_name || "",
          bio: profile.bio || "",
          profession: profile.profession || "",
          skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "",
          experience_level: profile.experience_level || "intermediate",
          work_style: profile.work_style || "",
          email: user.email || "",
        })
      } else {
        setProfileData((prev) => ({ ...prev, email: user.email || "" }))
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setProfileLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const skillsArray = profileData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const result = await saveProfile({
        fullName: profileData.full_name,
        bio: profileData.bio,
        profession: profileData.profession,
        skills: skillsArray,
        experienceLevel: profileData.experience_level,
        workStyle: profileData.work_style,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Settings saved",
          description: "Your profile has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const nameParts = profileData.full_name.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>AI Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <motion.div
                    className="space-y-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key="profile-content"
                  >
                    <motion.div variants={item} className="flex flex-col gap-6 sm:flex-row">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div variants={item} className="space-y-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                              id="first-name"
                              value={firstName}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  full_name: `${e.target.value} ${lastName}`.trim(),
                                }))
                              }
                              placeholder="First name"
                            />
                          </motion.div>
                          <motion.div variants={item} className="space-y-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                              id="last-name"
                              value={lastName}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  full_name: `${firstName} ${e.target.value}`.trim(),
                                }))
                              }
                              placeholder="Last name"
                            />
                          </motion.div>
                        </div>
                        <motion.div variants={item} className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={profileData.email} disabled className="bg-muted" />
                          <p className="text-xs text-muted-foreground">Email is managed through your auth provider</p>
                        </motion.div>
                      </div>
                    </motion.div>
                    <Separator />
                    <motion.div variants={item} className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        value={profileData.bio}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </motion.div>
                    <motion.div variants={item} className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={profileData.profession}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, profession: e.target.value }))}
                        placeholder="e.g. Web Developer"
                      />
                    </motion.div>
                    <motion.div variants={item} className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        placeholder="e.g. JavaScript, React, UI/UX Design"
                        value={profileData.skills}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, skills: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </motion.div>
                    <Separator />
                    <motion.div variants={item} className="space-y-2">
                      <Label>Experience level</Label>
                      <RadioGroup
                        value={profileData.experience_level}
                        onValueChange={(val) => setProfileData((prev) => ({ ...prev, experience_level: val }))}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <Label htmlFor="beginner">Beginner (0-2 years)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermediate" id="intermediate" />
                          <Label htmlFor="intermediate">Intermediate (2-5 years)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expert" id="expert" />
                          <Label htmlFor="expert">Expert (5+ years)</Label>
                        </div>
                      </RadioGroup>
                    </motion.div>
                  </motion.div>
                )}
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading || profileLoading} className="relative overflow-hidden group">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
                <CardDescription>Customize your AI assistant experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div className="space-y-4" variants={container} initial="hidden" animate="show" key="ai-content">
                  <motion.div variants={item} className="space-y-2">
                    <Label>AI Provider</Label>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Groq (Llama 3.1 8B)</p>
                          <p className="text-sm text-muted-foreground">Fast, efficient AI responses powered by Groq</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <Label>AI Interaction Style</Label>
                    <RadioGroup defaultValue="balanced">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="concise" id="concise" />
                        <Label htmlFor="concise">Concise (Brief, to-the-point responses)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced">Balanced (Mix of detail and brevity)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed">Detailed (Comprehensive explanations)</Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <Label>AI Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-suggestions">Auto Suggestions</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive AI-powered suggestions while working on projects
                          </p>
                        </div>
                        <Switch id="auto-suggestions" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-documentation">Auto Documentation</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically generate documentation from your project data
                          </p>
                        </div>
                        <Switch id="auto-documentation" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="ai-notifications">AI Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive AI-powered insights and reminders</p>
                        </div>
                        <Switch id="ai-notifications" defaultChecked />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  key="billing-content"
                >
                  <motion.div variants={item} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Current Plan</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">Free</span>
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Free tier with AI-powered project planning</p>
                      </div>
                    </div>
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="flex flex-col items-center justify-center py-8 text-center">
                    <CreditCard className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium mb-1">Premium plans coming soon</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Upgrade options with additional AI models, higher usage limits, and team collaboration features will be available soon.
                    </p>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
