// src/test.ts

import { prisma } from "./config/prisma";

async function main() {
  await prisma.$connect();

  console.log("Connected successfully");

  await prisma.$disconnect();
}

main().catch(console.error);
