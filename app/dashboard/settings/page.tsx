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
import { Bot, CreditCard, Loader2, User, Settings2, ShieldCheck, Sparkles } from "lucide-react"
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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  const nameParts = profileData.full_name.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  return (
    <PageTransition>
      <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header - Premium Glass Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl p-6 md:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.08] gradient-bg blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-[0.05] bg-indigo-500 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Settings2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Control Panel
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75">
                Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                Manage your account credentials, preferences, and workspace features.
              </p>
            </div>
          </div>
        </div>

        {/* Setting Tabs */}
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/30 border border-white/10 dark:border-white/5 p-1 rounded-xl backdrop-blur-md">
            <TabsTrigger value="profile" className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all cursor-pointer">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all cursor-pointer">
              <Bot className="h-4 w-4" />
              <span>AI Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all cursor-pointer">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-card border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">Account Profile</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Update your personal credentials and professional profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing settings...</span>
                  </div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key="profile-content"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="first-name" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">First name</Label>
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
                          className="bg-card/30 border-white/10 dark:border-white/5 rounded-xl h-11 focus-visible:ring-primary/50"
                        />
                      </motion.div>
                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="last-name" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Last name</Label>
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
                          className="bg-card/30 border-white/10 dark:border-white/5 rounded-xl h-11 focus-visible:ring-primary/50"
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={item} className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted/30 border-white/10 dark:border-white/5 text-muted-foreground rounded-xl h-11"
                      />
                      <p className="text-[11px] text-muted-foreground/80 font-medium">Email cannot be modified directly as it is bound to your authentication provider.</p>
                    </motion.div>

                    <Separator className="bg-white/10 dark:bg-white/5" />

                    <motion.div variants={item} className="space-y-2">
                      <Label htmlFor="bio" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Short Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={profileData.bio}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[100px] bg-card/30 border-white/10 dark:border-white/5 rounded-xl focus-visible:ring-primary/50"
                      />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="profession" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Profession</Label>
                        <Input
                          id="profession"
                          value={profileData.profession}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, profession: e.target.value }))}
                          placeholder="e.g. Web Developer"
                          className="bg-card/30 border-white/10 dark:border-white/5 rounded-xl h-11 focus-visible:ring-primary/50"
                        />
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="skills" className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Skills (Comma-separated)</Label>
                        <Input
                          id="skills"
                          placeholder="e.g. JavaScript, React, Tailwind, UI/UX"
                          value={profileData.skills}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, skills: e.target.value }))}
                          className="bg-card/30 border-white/10 dark:border-white/5 rounded-xl h-11 focus-visible:ring-primary/50"
                        />
                      </motion.div>
                    </div>

                    <Separator className="bg-white/10 dark:bg-white/5" />

                    <motion.div variants={item} className="space-y-4">
                      <Label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Experience Level</Label>
                      <RadioGroup
                        value={profileData.experience_level}
                        onValueChange={(val) => setProfileData((prev) => ({ ...prev, experience_level: val }))}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                      >
                        {[
                          { id: "beginner", title: "Beginner", desc: "0-2 years of experience" },
                          { id: "intermediate", title: "Intermediate", desc: "2-5 years of experience" },
                          { id: "expert", title: "Expert", desc: "5+ years of experience" },
                        ].map((level) => {
                          const isActive = profileData.experience_level === level.id
                          return (
                            <label
                              key={level.id}
                              htmlFor={level.id}
                              className={`flex flex-col gap-1 border p-4 rounded-xl cursor-pointer transition-all select-none hover:bg-white/5 ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-[0_0_15px_-5px_rgba(124,58,237,0.2)]"
                                  : "border-white/10 dark:border-white/5 bg-card/20"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value={level.id} id={level.id} className="cursor-pointer border-white/30 dark:border-white/10 data-[state=checked]:border-primary data-[state=checked]:text-primary" />
                                <span className="text-sm font-bold text-foreground/90">{level.title}</span>
                              </div>
                              <span className="text-[11px] text-muted-foreground/80 pl-6">{level.desc}</span>
                            </label>
                          )
                        })}
                      </RadioGroup>
                    </motion.div>
                  </motion.div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading || profileLoading}
                    className="relative overflow-hidden group rounded-xl gradient-bg px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_20px_-4px_rgba(124,58,237,0.3)] cursor-pointer"
                  >
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
            <Card className="glass-card border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">AI Preferences</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Tailor and configure the AI planner and generation settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div className="space-y-6" variants={container} initial="hidden" animate="show" key="ai-content">
                  <motion.div variants={item} className="space-y-3">
                    <Label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Active AI Provider</Label>
                    <div className="rounded-xl border border-white/10 dark:border-white/5 bg-card/25 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-[0.03] bg-emerald-500 blur-2xl pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mt-0.5">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-foreground/95">Groq (Llama 3.1 8B)</p>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                              Connected
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground/80 font-medium mt-1">
                            High-velocity, instruction-tuned language intelligence for automated scheduling and tasks mapping.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <Separator className="bg-white/10 dark:bg-white/5" />

                  <motion.div variants={item} className="space-y-4">
                    <Label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">AI Response Customization</Label>
                    <RadioGroup defaultValue="balanced" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "concise", title: "Concise", desc: "Brief, bulleted summaries" },
                        { id: "balanced", title: "Balanced", desc: "Balanced details & clarity" },
                        { id: "detailed", title: "Detailed", desc: "Comprehensive blueprints" },
                      ].map((style) => (
                        <label
                          key={style.id}
                          htmlFor={style.id}
                          className="flex flex-col gap-1 border border-white/10 dark:border-white/5 bg-card/20 p-4 rounded-xl cursor-pointer hover:bg-white/5 select-none transition-all [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value={style.id} id={style.id} className="cursor-pointer border-white/30 dark:border-white/10 data-[state=checked]:border-primary data-[state=checked]:text-primary" />
                            <span className="text-sm font-bold text-foreground/90">{style.title}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground/80 pl-6">{style.desc}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </motion.div>

                  <Separator className="bg-white/10 dark:bg-white/5" />

                  <motion.div variants={item} className="space-y-4">
                    <Label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">AI Workflow Features</Label>
                    <div className="space-y-4">
                      {[
                        { id: "auto-suggestions", label: "Auto Suggestions", desc: "Receive AI-powered warnings and improvements while modifying milestones." },
                        { id: "auto-documentation", label: "Auto Documentation", desc: "Automatically draft markdown resources and descriptions from project schemas." },
                        { id: "ai-notifications", label: "AI Notifications", desc: "Allow autonomous agents to email reminders when milestones are near completion." },
                      ].map((feat) => (
                        <div key={feat.id} className="flex items-start justify-between gap-4 p-4 border border-white/5 bg-card/15 rounded-xl">
                          <div className="space-y-1">
                            <Label htmlFor={feat.id} className="text-sm font-bold text-foreground/90 cursor-pointer select-none">{feat.label}</Label>
                            <p className="text-xs text-muted-foreground/80 font-medium">
                              {feat.desc}
                            </p>
                          </div>
                          <Switch id={feat.id} defaultChecked className="data-[state=checked]:bg-primary cursor-pointer mt-1" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="glass-card border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Billing Subscription</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Review invoice history, premium features, and payment methods.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="space-y-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  key="billing-content"
                >
                  <motion.div variants={item} className="rounded-xl border border-white/10 dark:border-white/5 bg-gradient-to-br from-card/35 via-card/20 to-primary/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.05] bg-primary blur-3xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Tier</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold tracking-tight">Free Plan</span>
                        </div>
                        <p className="text-xs text-muted-foreground/80 font-medium mt-2">Free workspace containing AI orchestration up to 3 active projects.</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-500 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </div>
                  </motion.div>

                  <Separator className="bg-white/10 dark:bg-white/5" />

                  <motion.div variants={item} className="flex flex-col items-center justify-center py-12 text-center max-w-sm mx-auto">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-500">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Premium Tiers Coming Soon</h3>
                    <p className="text-xs text-muted-foreground/80 font-medium leading-relaxed mb-6">
                      Upgrade structures including unlimited GPT/Claude access, custom workflows matching git servers, and multi-user seats are launching soon.
                    </p>
                    <Button disabled className="rounded-xl bg-muted/40 border border-white/5 px-5 py-2.5 text-xs font-semibold text-muted-foreground/60">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Upgrades Locked
                    </Button>
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
