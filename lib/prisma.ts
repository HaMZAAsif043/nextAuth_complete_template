import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function ensureSslMode(urlString: string) {
  try {
    const parsed = new URL(urlString)
    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require')
    }
    return parsed.toString()
  } catch {
    return urlString
  }
}

const rawConnectionString = process.env.DATABASE_URL || process.env.DIRECT_URL

if (!rawConnectionString) {
  throw new Error('Missing database connection string. Set DATABASE_URL or DIRECT_URL in your .env file.')
}

const connectionString = ensureSslMode(rawConnectionString)

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Bypass self-signed certificate errors for both local and Supabase
  },
})

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
