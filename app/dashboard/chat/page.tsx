"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/page-transition"
import { Bot, Calendar, Code, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("gpt4")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="gpt4" className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-500" />
              <span>GPT-4</span>
            </TabsTrigger>
            <TabsTrigger value="claude" className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <span>Claude</span>
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-green-500" />
              <span>Gemini</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gpt4">
            <Card>
              <CardContent className="p-8">
                <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Bot className="h-12 w-12 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">GPT-4 Integration Coming Soon</h2>
                    <p className="text-muted-foreground mb-6">
                      We're working on integrating GPT-4 into ForgeMancer. This powerful AI assistant will help you
                      generate project plans, documentation, and code.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                      <Button asChild>
                        <Link href="/dashboard">Return to Dashboard</Link>
                      </Button>
                      <Button variant="outline">Get Notified</Button>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">Documentation</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">Code Generation</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">Project Planning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claude">
            <Card>
              <CardContent className="p-8">
                <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Bot className="h-12 w-12 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Claude Integration Coming Soon</h2>
                    <p className="text-muted-foreground mb-6">
                      We're working on integrating Claude into ForgeMancer. This AI assistant specializes in detailed
                      explanations and thoughtful analysis.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                      <Button asChild>
                        <Link href="/dashboard">Return to Dashboard</Link>
                      </Button>
                      <Button variant="outline">Get Notified</Button>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-sm font-medium">Detailed Analysis</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-sm font-medium">Content Creation</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-sm font-medium">Project Planning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gemini">
            <Card>
              <CardContent className="p-8">
                <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Bot className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Gemini Integration Coming Soon</h2>
                    <p className="text-muted-foreground mb-6">
                      We're working on integrating Gemini into ForgeMancer. This AI assistant specializes in creative
                      solutions and innovative approaches.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                      <Button asChild>
                        <Link href="/dashboard">Return to Dashboard</Link>
                      </Button>
                      <Button variant="outline">Get Notified</Button>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">Creative Solutions</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">Innovative Ideas</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">Project Planning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
