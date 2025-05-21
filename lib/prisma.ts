import { PrismaClient } from "@/generated/prisma/client"

// PrismaClient est attaché au global object en développement pour éviter
// d'épuiser la limite de connexions à la base de données
declare global {
  var prismaGlobal: PrismaClient | undefined
}

export const prisma = global.prismaGlobal || new PrismaClient()

if (process.env.NODE_ENV !== "production") global.prismaGlobal = prisma
