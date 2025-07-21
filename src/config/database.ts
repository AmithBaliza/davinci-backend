import { PrismaClient } from "@prisma/client";
import logger from "./logger";

// Create Prisma client with production-ready configuration
const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "stdout" },
    { level: "info", emit: "stdout" },
    { level: "warn", emit: "stdout" },
  ],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Log slow queries in production
prisma.$on("query", (e) => {
  if (e.duration > 1000) {
    // Log queries taking more than 1 second
    logger.warn(`Slow query detected: ${e.duration}ms`, {
      query: e.query,
      params: e.params,
    });
  }
});

// Handle connection errors gracefully
prisma.$connect().catch((e) => {
  logger.error("Database connection error:", e);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
