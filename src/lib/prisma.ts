import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Tell TypeScript about our custom global property
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
} else {
    // 2. Create a standard node-postgres connection pool using your local/production URL
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 3. Wrap it in Prisma's PostgreSQL adapter
    const adapter = new PrismaPg(pool);

    // 4. Instantiate the client by passing the adapter and your logging choices
    prismaInstance = new PrismaClient({
        adapter: adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    // 5. Cache the instance globally in local development to preserve hot-reloading
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
    }
}

export const prisma = prismaInstance;