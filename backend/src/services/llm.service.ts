import { GoogleGenAI } from "@google/genai";
import { STORE_KNOWLEDGE } from "../constants/knowledge";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

export class LLMService {
  async generateReply(
    history: ChatHistory[],
    userMessage: string,
  ): Promise<string> {
    try {
      const conversationHistory = history
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
        )
        .join("\n");

      const prompt = `
Instructions:
- You are a customer support agent.
- Only answer questions related to the store.
- Use the provided store knowledge whenever possible.
- If the question is unrelated to the store, politely explain that you only assist with store-related inquiries.
- If you don't know the answer, say so honestly.
- Be concise and professional.

Store Knowledge:
${STORE_KNOWLEDGE}

Conversation History:
${conversationHistory}

Current User Message:
${userMessage}

Instructions:
- Be helpful and concise.
- Use the store knowledge whenever relevant.
- If you don't know something, say so honestly.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

      return (
        response.text ?? "Sorry, I couldn't generate a response right now."
      );
    } catch (error) {
      console.error("Gemini Error:", error);

      return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
  }
}
