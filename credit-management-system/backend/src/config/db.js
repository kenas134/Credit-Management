// src/config/db.js
// Prisma client singleton — use this throughout the app

const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error']
    : ['warn', 'error'],
});

// Log slow queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    if (e.duration > 1000) {
      logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
