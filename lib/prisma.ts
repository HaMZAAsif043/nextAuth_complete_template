import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function normalizeConnectionString(urlString: string) {
  try {
    const parsed = new URL(urlString)
    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require')
    }

    const rejectUnauthorized = process.env.PG_SSL_REJECT_UNAUTHORIZED !== 'false'
    if (!rejectUnauthorized) {
      // Keep TLS enabled while allowing local/self-signed certificate chains.
      parsed.searchParams.set('uselibpqcompat', 'true')
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

const rejectUnauthorized = process.env.PG_SSL_REJECT_UNAUTHORIZED !== 'false'
const connectionString = normalizeConnectionString(rawConnectionString)

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized,
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
