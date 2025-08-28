"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bot, FileText, Loader2, Send, Sparkles, X } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  model?: "gpt4" | "claude" | "gemini"
  timestamp: Date
}

export function ChatContent() {
  const [activeTab, setActiveTab] = useState("gpt4")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you with your projects today?",
      model: "gpt4",
      timestamp: new Date(),
    },
  ])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        gpt4: "I've analyzed your request and can help with that. Let me generate some ideas for your project based on the latest best practices.",
        claude:
          "Thanks for sharing that. I'd be happy to assist with your project. Let me think through this systematically to provide you with the most helpful response.",
        gemini:
          "Great question! I can definitely help with that. Let me explore some creative approaches to solve this challenge for your project.",
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[activeTab as keyof typeof responses],
        model: activeTab as "gpt4" | "claude" | "gemini",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hi there! I'm your AI assistant. How can I help you with your projects today?",
        model: activeTab as "gpt4" | "claude" | "gemini",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
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
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <X className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
          </div>
          <TabsContent value="gpt4" className="mt-0">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="flex h-[calc(100vh-16rem)] flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user" ? "gradient-bg text-white" : "glass-card"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="mb-2 flex items-center gap-2">
                              <Bot className="h-5 w-5 text-blue-500" />
                              <span className="font-medium">GPT-4</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="mt-2 text-right text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="glass-card max-w-[80%] rounded-lg p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">GPT-4</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p>Thinking...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex items-end gap-2">
                      <Textarea
                        placeholder="Ask anything about your projects..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-[80px] resize-none"
                      />
                      <Button
                        className="h-10 w-10 rounded-full p-0"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        <span>AI can generate project plans, documentation, and code</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>Attach files</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="claude" className="mt-0">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="flex h-[calc(100vh-16rem)] flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex justify-start">
                      <div className="glass-card max-w-[80%] rounded-lg p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Bot className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">Claude</span>
                        </div>
                        <p>
                          Hello! I'm Claude, an AI assistant specialized in detailed explanations and thoughtful
                          analysis. How can I assist with your projects today?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <div className="flex items-end gap-2">
                      <Textarea
                        placeholder="Ask Claude for detailed explanations..."
                        className="min-h-[80px] resize-none"
                      />
                      <Button className="h-10 w-10 rounded-full p-0">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        <span>Claude excels at detailed documentation and analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>Attach files</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gemini" className="mt-0">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="flex h-[calc(100vh-16rem)] flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex justify-start">
                      <div className="glass-card max-w-[80%] rounded-lg p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Bot className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Gemini</span>
                        </div>
                        <p>
                          Hi there! I'm Gemini, an AI assistant that specializes in creative solutions and innovative
                          approaches. How can I help with your projects today?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <div className="flex items-end gap-2">
                      <Textarea
                        placeholder="Ask Gemini for creative solutions..."
                        className="min-h-[80px] resize-none"
                      />
                      <Button className="h-10 w-10 rounded-full p-0">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        <span>Gemini excels at creative problem-solving</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>Attach files</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
