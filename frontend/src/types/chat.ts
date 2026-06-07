export type MessageSender = "USER" | "AI";

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

