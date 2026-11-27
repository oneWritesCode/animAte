import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client";

// In dev, Next reloads files often. Keep one client so connections don't pile up.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;