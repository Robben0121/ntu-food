import { PrismaClient } from "@prisma/client";

// 开发环境下热重载会重复实例化 PrismaClient，这里用 globalThis 缓存单例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
