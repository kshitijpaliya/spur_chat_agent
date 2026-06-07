import axios from "axios";
import type { ChatResponse, Message, SendMessageRequest } from "@/types/chat";

const chatClient = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  timeout: 30000,
});

export async function sendMessage(
  message: string,
  sessionId?: string,
): Promise<ChatResponse> {
  const payload: SendMessageRequest = {
    message,
    ...(sessionId ? { sessionId } : {}),
  };

  const response = await chatClient.post<ChatResponse>(
    "/chat/message",
    payload,
  );
  return response.data;
}

export async function getConversation(sessionId: string): Promise<Message[]> {
  const response = await chatClient.get<Message[]>(`/chat/${sessionId}`);
  return response.data;
}
