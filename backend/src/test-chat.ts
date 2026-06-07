import "dotenv/config";

import { ChatService } from "./services/chat.service";

async function main() {
  const chatService = new ChatService();

  const firstMessage = await chatService.sendMessage(
    "What is your return policy?",
  );

  console.log("\nFIRST RESPONSE:");
  console.log(firstMessage);

  const secondMessage = await chatService.sendMessage(
    "Can I return after 15 days?",
    firstMessage.sessionId,
  );

  console.log("\nSECOND RESPONSE:");
  console.log(secondMessage);
}

main();
