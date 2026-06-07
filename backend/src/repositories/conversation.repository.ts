import { prisma } from "../config/prisma";

export class ConversationRepository {
  async create() {
    return prisma.conversation.create({
      data: {},
    });
  }

  async findById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
    });
  }
}
