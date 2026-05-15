// src/tests/setup.js
// Jest global setup

const prisma = require('../config/db');

beforeAll(async () => {
  // Ensure test DB connection
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
