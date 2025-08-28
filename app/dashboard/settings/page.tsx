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

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
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
                <motion.div
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  key="profile-content"
                >
                  <motion.div variants={item} className="flex flex-col gap-6 sm:flex-row">
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="relative h-20 w-20 overflow-hidden rounded-full"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <img
                            src="/placeholder.svg?height=80&width=80"
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={item} className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" defaultValue="John" />
                        </motion.div>
                        <motion.div variants={item} className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" defaultValue="Doe" />
                        </motion.div>
                      </div>
                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      defaultValue="Freelance web developer specializing in React and Next.js. I help businesses create modern, responsive web applications."
                      className="min-h-[100px]"
                    />
                  </motion.div>
                  <motion.div variants={item} className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" defaultValue="Web Developer" />
                  </motion.div>
                  <motion.div variants={item} className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="e.g. JavaScript, React, UI/UX Design"
                      defaultValue="JavaScript, React, Next.js, TypeScript, Tailwind CSS, Node.js"
                      className="min-h-[100px]"
                    />
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <Label>Experience level</Label>
                    <RadioGroup defaultValue="intermediate">
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
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <Label>Work Preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="remote" defaultChecked />
                        <Label htmlFor="remote">Remote Work</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="contract" defaultChecked />
                        <Label htmlFor="contract">Contract Work</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="fulltime" />
                        <Label htmlFor="fulltime">Full-time Opportunities</Label>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading} className="relative overflow-hidden group">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <motion.span
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          animate={isLoading ? { x: "100%" } : { x: "-100%" }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                        />
                      </>
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
                    <Label>Preferred AI Assistant</Label>
                    <RadioGroup defaultValue="gpt4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gpt4" id="gpt4" />
                        <Label htmlFor="gpt4" className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-blue-500" />
                          <span>GPT-4 (Balanced capabilities)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="claude" id="claude" />
                        <Label htmlFor="claude" className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-purple-500" />
                          <span>Claude (Detailed explanations)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gemini" id="gemini" />
                        <Label htmlFor="gemini" className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-green-500" />
                          <span>Gemini (Creative solutions)</span>
                        </Label>
                      </div>
                    </RadioGroup>
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
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading} className="relative overflow-hidden group">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <motion.span
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          animate={isLoading ? { x: "100%" } : { x: "-100%" }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                        />
                      </>
                    )}
                  </Button>
                </div>
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
                          <span className="text-2xl font-bold">Pro</span>
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">$29/month, billed monthly</p>
                      </div>
                      <Button
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Change Plan
                      </Button>
                    </div>
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <h3 className="font-medium">Payment Method</h3>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-md bg-muted p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Add Payment Method
                    </Button>
                  </motion.div>
                  <Separator />
                  <motion.div variants={item} className="space-y-2">
                    <h3 className="font-medium">Billing History</h3>
                    <div className="rounded-lg border">
                      <div className="flex items-center justify-between border-b p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-sm text-muted-foreground">Apr 1, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$29.00</p>
                          <p className="text-sm text-green-500">Paid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-sm text-muted-foreground">Mar 1, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$29.00</p>
                          <p className="text-sm text-green-500">Paid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-sm text-muted-foreground">Feb 1, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$29.00</p>
                          <p className="text-sm text-green-500">Paid</p>
                        </div>
                      </div>
                    </div>
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
