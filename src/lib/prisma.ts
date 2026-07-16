// Polyfill URL.canParse for older Node.js versions
if (typeof URL !== 'undefined' && !URL.canParse) {
  URL.canParse = function (url: string | URL, base?: string | URL) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Handle connection cleanup on exit
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

