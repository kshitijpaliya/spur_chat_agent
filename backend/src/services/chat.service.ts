import { Sender } from "@prisma/client";

import { ConversationRepository } from "../repositories/conversation.repository";
import { MessageRepository } from "../repositories/message.repository";
import { LLMService } from "./llm.service";
import { ChatHistory } from "./llm.service";

export class ChatService {
  private conversationRepository = new ConversationRepository();

  private messageRepository = new MessageRepository();

  private llmService = new LLMService();

  async sendMessage(message: string, sessionId?: string) {
    let conversationId = sessionId;

    // Create new conversation
    if (!conversationId) {
      const conversation = await this.conversationRepository.create();

      conversationId = conversation.id;
    }

    // Save user message
    await this.messageRepository.create(conversationId, Sender.USER, message);

    // Get history
    const messages =
      await this.messageRepository.getConversationMessages(conversationId);

    const history: ChatHistory[] = messages.map((msg) => ({
      role: msg.sender === Sender.USER ? "user" : "assistant",
      content: msg.content,
    }));

    // Gemini response
    const reply = await this.llmService.generateReply(history, message);

    // Save AI response
    await this.messageRepository.create(conversationId, Sender.AI, reply);

    return {
      reply,
      sessionId: conversationId,
    };
  }

  async getConversationHistory(sessionId: string) {
    return this.messageRepository.getConversationMessages(sessionId);
  }
}
