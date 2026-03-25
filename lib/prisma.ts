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

const adapter = new PrismaPg({
  connectionString: rawConnectionString,
  ssl: {
    rejectUnauthorized: true,  
    ca: caCert,                
  },
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma