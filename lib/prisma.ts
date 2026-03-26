import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'fs'
import path from 'path'

const rawConnectionString = process.env.DATABASE_URL || process.env.DIRECT_URL

if (!rawConnectionString) {
  throw new Error('Missing database connection string.')
}

// Load the Supabase CA certificate from project root
const caCert = fs.readFileSync(path.join(process.cwd(), 'prod-ca-2021.crt')).toString()

import { Pool } from 'pg'

// Strip sslmode from the connection string to prevent it from overriding the pg Pool ssl config
const url = new URL(rawConnectionString)
url.searchParams.delete('sslmode')
const connectionString = url.toString()

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED === 'true',
  },
})

const adapter = new PrismaPg(pool as any)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma