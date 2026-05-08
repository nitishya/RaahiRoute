import { PrismaClient } from '@prisma/client';

/**
 * Prisma 7 Client instantiation.
 * It will automatically pick up DATABASE_URL from the environment.
 */
const prisma = new PrismaClient();

export default prisma;
