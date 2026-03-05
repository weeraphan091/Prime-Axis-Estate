import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim()
  if (url) {
    return new PrismaClient({
      datasources: { db: { url } },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : undefined,
    })
  }
  return new PrismaClient()
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrisma()
}
export const prisma = globalForPrisma.prisma
