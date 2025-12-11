import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const url = process.env.DATABASE_URL || (process.env.NODE_ENV === "production" ? "file:/app/data/prod.db" : "file:./dev.db")
console.log("Prisma connecting to:", url)

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma