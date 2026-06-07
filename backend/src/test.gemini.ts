import "dotenv/config";

import { LLMService } from "./services/llm.service";

async function main() {
  const llm = new LLMService();

  const reply = await llm.generateReply([], "What is your return policy?");

  console.log("\nAI Reply:");
  console.log(reply);
}

main();
