import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export class ChatController {
  async sendMessage(req: Request, res: Response) {
    try {
      const { message, sessionId } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({
          error: "Message is required",
        });
      }

      if (message.trim().length === 0) {
        return res.status(400).json({
          error: "Message cannot be empty",
        });
      }

      if (message.length > 5000) {
        return res.status(400).json({
          error: "Message too long",
        });
      }

      const response = await chatService.sendMessage(message, sessionId);

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
  async getHistory(req: Request, res: Response) {
    try {
      const sessionId = req.params.sessionId;

      if (!sessionId || Array.isArray(sessionId)) {
        return res.status(400).json({
          error: "Invalid sessionId",
        });
      }

      const messages = await chatService.getConversationHistory(sessionId);

      return res.status(200).json(messages);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
