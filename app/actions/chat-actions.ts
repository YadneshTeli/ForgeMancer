"use server"

import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })
const MAX_MESSAGE_LENGTH = 5000
const MAX_HISTORY_TURNS = 20
const REQUEST_TIMEOUT_MS = 30000

// Validate and sanitize input
function validateChatInput(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
): { valid: boolean; error?: string; sanitized?: { message: string; history: typeof conversationHistory } } {
  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    return { valid: false, error: "Message cannot be empty" }
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` }
  }

  if (!Array.isArray(conversationHistory)) {
    return { valid: false, error: "Invalid conversation history format" }
  }

  if (conversationHistory.length > MAX_HISTORY_TURNS) {
    return { valid: false, error: `Conversation history exceeds maximum of ${MAX_HISTORY_TURNS} turns` }
  }

  const sanitizedHistory = conversationHistory
    .slice(0, MAX_HISTORY_TURNS)
    .map((item) => {
      if (!item.role || !item.content) return null
      if (item.role !== "user" && item.role !== "assistant") return null
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
  model: "gpt4" | "claude" | "groq" = "groq",
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
) {
  if (!process.env.GROQ_API_KEY) {
    return { error: "Failed to send message" }
  }

  const validation = validateChatInput(message, conversationHistory)
  if (!validation.valid) {
    return { error: validation.error || "Invalid input" }
  }

  const { message: sanitizedMessage, history: sanitizedHistory } = validation.sanitized!

  try {
    if (model === "groq") {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      try {
        const messages: Groq.Chat.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: "You are a helpful AI assistant for the ForgeMancer platform, a freelance training tool. Help users with project planning, client communication, and skill development.",
          },
          ...sanitizedHistory.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          { role: "user", content: sanitizedMessage },
        ]

        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages,
        })

        const text = completion.choices[0]?.message?.content || ""
        clearTimeout(timeoutId)

        return { success: true, response: text, model: "groq" }
      } catch (timeoutError: any) {
        clearTimeout(timeoutId)
        if (timeoutError.name === "AbortError" || timeoutError.message?.includes("abort")) {
          return { error: "Request timed out. Please try again." }
        }
        throw timeoutError
      }
    }

    return { error: "Failed to send message" }
  } catch (error: any) {
    const correlationId = Date.now().toString()
    console.error(`[Chat Error ${correlationId}]`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
    })

    return { error: "Failed to send message" }
  }
}
