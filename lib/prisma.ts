import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Mengambil URL dari file .env
const connectionString = `${process.env.DATABASE_URL}`;

// Membuat "Corong" (Pool & Adapter)
const pool = new Pool({ connectionString });
// @ts-expect-error: Terjadi bentrok versi tipe data Pool antara Prisma dan pg
const adapter = new PrismaPg(pool);

// Singleton Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'], // Menampilkan log query SQL di terminal untuk debugging
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
