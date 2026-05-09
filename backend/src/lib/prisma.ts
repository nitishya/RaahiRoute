import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Only initialize the pool if DATABASE_URL is available (prevents immediate crashes in tests)
const connectionString = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (connectionString) {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  // Fallback for tests or missing env vars. Will throw if queried.
  // In Prisma 7, passing an empty object or undefined adapter throws immediately unless mocked.
  // We mock this file in our tests, so we can return a dummy object or let it be undefined.
  prisma = {} as PrismaClient; 
}

export default prisma;
