"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function sendChatMessage(
  message: string,
  model: "gpt4" | "claude" | "gemini" = "gemini",
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "GEMINI_API_KEY is not configured" }
  }

  try {
    // For now, we'll implement Gemini only
    if (model === "gemini") {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" })

      // Build the conversation context
      let prompt = ""
      if (conversationHistory.length > 0) {
        prompt = conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n") + "\n"
      }
      prompt += `user: ${message}`

      const result = await geminiModel.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return { success: true, response: text, model: "gemini" }
    }

    // Placeholder for other models
    return { error: `Model ${model} is not yet implemented` }
  } catch (error: any) {
    console.error("Chat error:", error)
    return { error: error.message || "Failed to send message" }
  }
}
