"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Bot, FileText, Loader2, Send, Sparkles, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sendChatMessage } from "@/app/actions/chat-actions"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  model?: "gpt4" | "claude" | "groq"
  timestamp: Date
}

export function ChatContent() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI assistant powered by Groq. How can I help you with your projects today?",
      model: "groq",
      timestamp: new Date(),
    },
  ])
  const { toast } = useToast()

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Get conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const result = await sendChatMessage(userInput, "groq", conversationHistory)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result?.response || "Unable to get response",
        model: "groq",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hi there! I'm your AI assistant powered by Groq. How can I help you with your projects today?",
        model: "groq",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex h-[calc(100vh-16rem)] flex-col">
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-green-500" />
              <span className="font-medium">Groq AI Assistant</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <X className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
          </div>

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
                      <Bot className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Groq</span>
                    </div>
                  )}
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/10 dark:prose-pre:bg-white/10 prose-pre:p-2 prose-pre:rounded-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
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
                    <Bot className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Groq</span>
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
                <span>AI can help with project planning, documentation, and problem-solving</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
