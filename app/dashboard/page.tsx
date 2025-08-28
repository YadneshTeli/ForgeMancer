"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Bot,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react"
import { DashboardWelcome } from "@/components/dashboard-welcome"
import { PageTransition } from "@/components/page-transition"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [progressValues, setProgressValues] = useState({
    website: 0,
    mobile: 0,
    branding: 0,
  })

  useEffect(() => {
    setIsMounted(true)

    // Animate progress bars
    const timer = setTimeout(() => {
      setProgressValues({
        website: 65,
        mobile: 25,
        branding: 90,
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to ForgeMancer, your AI-powered project management assistant</p>
        </div>
        <DashboardWelcome />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-forge-600 to-mancer-500" />
          </Card>

          <Card className="overflow-hidden animate-fade-in stagger-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 due today</p>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-forge-600 to-mancer-500" />
          </Card>

          <Card className="overflow-hidden animate-fade-in stagger-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-forge-600 to-mancer-500" />
          </Card>

          <Card className="overflow-hidden animate-fade-in stagger-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,850</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-forge-600 to-mancer-500" />
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="glass-card hover-lift animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-500">W</span>
                      </div>
                      <CardTitle>Website Redesign</CardTitle>
                    </div>
                    <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <CardDescription>Client: Acme Inc.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressValues.website}%</span>
                    </div>
                    <Progress value={progressValues.website} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due: Apr 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">3 members</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group" asChild>
                    <Link href="/dashboard/projects/website-redesign">
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift animate-fade-in stagger-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-green-500/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-green-500">M</span>
                      </div>
                      <CardTitle>Mobile App</CardTitle>
                    </div>
                    <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                      Planning
                    </span>
                  </div>
                  <CardDescription>Client: TechStart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressValues.mobile}%</span>
                    </div>
                    <Progress value={progressValues.mobile} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due: Jun 30, 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">2 members</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group" asChild>
                    <Link href="/dashboard/projects/mobile-app">
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift animate-fade-in stagger-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-purple-500/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-500">B</span>
                      </div>
                      <CardTitle>Branding Project</CardTitle>
                    </div>
                    <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
                      Review
                    </span>
                  </div>
                  <CardDescription>Client: Global Media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressValues.branding}%</span>
                    </div>
                    <Progress value={progressValues.branding} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due: Apr 5, 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">1 member</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group" asChild>
                    <Link href="/dashboard/projects/branding">
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Button asChild className="group">
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                New Project
              </Link>
            </Button>
          </TabsContent>
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your tasks for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4 animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <p className="font-medium">Finalize homepage design</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Due today</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Complete
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4 animate-fade-in stagger-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <p className="font-medium">Client meeting for Mobile App</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Tomorrow, 10:00 AM</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Reschedule
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4 animate-fade-in stagger-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="font-medium">Create content strategy document</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Apr 3, 2025</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Start
                    </Button>
                  </div>
                  <div className="flex items-center justify-between animate-fade-in stagger-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <p className="font-medium">Review branding assets</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Apr 5, 2025</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button asChild className="group">
              <Link href="/dashboard/tasks">
                View All Tasks
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>AI Assistant Activity</CardTitle>
                  <CardDescription>Recent interactions with your AI assistants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 border-b pb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">GPT-4</p>
                        <p className="text-sm text-muted-foreground">Generated project timeline for Website Redesign</p>
                        <p className="text-xs text-muted-foreground">Today, 9:32 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 border-b pb-4">
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Claude</p>
                        <p className="text-sm text-muted-foreground">Drafted client proposal for Mobile App project</p>
                        <p className="text-xs text-muted-foreground">Yesterday, 4:15 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Gemini</p>
                        <p className="text-sm text-muted-foreground">Analyzed branding assets and provided feedback</p>
                        <p className="text-xs text-muted-foreground">Apr 1, 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="animate-fade-in stagger-1">
                <CardHeader>
                  <CardTitle>AI-Generated Documents</CardTitle>
                  <CardDescription>Recently generated documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4 group">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Website Redesign Proposal</p>
                          <p className="text-xs text-muted-foreground">Generated by GPT-4 • Today</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4 group">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Mobile App Requirements</p>
                          <p className="text-xs text-muted-foreground">Generated by Claude • Yesterday</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Branding Guidelines</p>
                          <p className="text-xs text-muted-foreground">Generated by Gemini • Apr 1</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button asChild className="group">
              <Link href="/dashboard/chat">
                Open AI Chat
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
