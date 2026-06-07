import { prisma } from "../config/prisma";
import { Sender } from "@prisma/client";

export class MessageRepository {
  async create(conversationId: string, sender: Sender, content: string) {
    return prisma.message.create({
      data: {
        conversationId,
        sender,
        content,
      },
    });
  }

  async getConversationMessages(conversationId: string) {
    return prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
