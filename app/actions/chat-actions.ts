"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const MAX_MESSAGE_LENGTH = 5000
const MAX_HISTORY_TURNS = 20
const REQUEST_TIMEOUT_MS = 30000

// Validate and sanitize input
function validateChatInput(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
): { valid: boolean; error?: string; sanitized?: { message: string; history: typeof conversationHistory } } {
  // Validate message
  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    return { valid: false, error: "Message cannot be empty" }
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` }
  }

  // Validate conversation history
  if (!Array.isArray(conversationHistory)) {
    return { valid: false, error: "Invalid conversation history format" }
  }

  if (conversationHistory.length > MAX_HISTORY_TURNS) {
    return { valid: false, error: `Conversation history exceeds maximum of ${MAX_HISTORY_TURNS} turns` }
  }

  // Validate and truncate each history item
  const sanitizedHistory = conversationHistory
    .slice(0, MAX_HISTORY_TURNS)
    .map((item) => {
      if (!item.role || !item.content) {
        return null
      }

      if (item.role !== "user" && item.role !== "assistant") {
        return null
      }

      return {
        role: item.role as "user" | "assistant",
        content: item.content.substring(0, MAX_MESSAGE_LENGTH),
      }
    })
    .filter((item): item is { role: "user" | "assistant"; content: string } => item !== null)

  return {
    valid: true,
    sanitized: {
      message: trimmedMessage,
      history: sanitizedHistory,
    },
  }
}

export async function sendChatMessage(
  message: string,
  model: "gpt4" | "claude" | "gemini" = "gemini",
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "Failed to send message" }
  }

  // Validate inputs
  const validation = validateChatInput(message, conversationHistory)
  if (!validation.valid) {
    return { error: validation.error || "Invalid input" }
  }

  const { message: sanitizedMessage, history: sanitizedHistory } = validation.sanitized!

  try {
    // For now, we'll implement Gemini only
    if (model === "gemini") {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" })

      // Build the conversation context
      let prompt = ""
      if (sanitizedHistory.length > 0) {
        prompt = sanitizedHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n") + "\n"
      }
      prompt += `user: ${sanitizedMessage}`

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      try {
        const result = await geminiModel.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        clearTimeout(timeoutId)

        return { success: true, response: text, model: "gemini" }
      } catch (timeoutError: any) {
        clearTimeout(timeoutId)
        if (timeoutError.name === "AbortError" || timeoutError.message?.includes("abort")) {
          return { error: "Request timed out. Please try again." }
        }
        throw timeoutError
      }
    }

    // Placeholder for other models
    return { error: "Failed to send message" }
  } catch (error: any) {
    // Log full error server-side for debugging
    const correlationId = Date.now().toString()
    console.error(`[Chat Error ${correlationId}]`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
    })

    // Return generic client-safe error message
    return { error: "Failed to send message" }
  }
}
