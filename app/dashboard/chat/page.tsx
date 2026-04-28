"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/page-transition"
import { ChatContent } from "@/components/chat-content"
import { useToast } from "@/components/ui/use-toast"

export default function ChatPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)

    // Check if GEMINI_API_KEY is configured
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-env")

        // Check response status before parsing JSON
        if (!response.ok) {
          console.error("API check failed with status:", response.status)
          toast({
            title: "Configuration error",
            description: "Unable to verify API configuration. Please check your environment variables.",
            variant: "destructive",
          })
          return
        }

        const data = await response.json()
        if (!data.geminiKeySet) {
          toast({
            title: "Configuration needed",
            description: "Please set GEMINI_API_KEY in your environment variables to use the AI chat",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        toast({
          title: "Configuration error",
          description: "Unable to verify API configuration. Please check your environment variables.",
          variant: "destructive",
        })
      }
    }

    checkApiKey()
  }, [toast])

  if (!isMounted) {
    return null
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">Chat with AI assistants to help with your projects</p>
        </div>
        <ChatContent />
      </div>
    </PageTransition>
  )
}
