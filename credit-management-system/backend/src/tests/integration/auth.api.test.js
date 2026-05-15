// src/tests/integration/auth.api.test.js
// Integration tests for Auth API endpoints

const request = require('supertest');
const app = require('../../app');
const prisma = require('../../config/db');

// Set env vars for test
process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_long_here';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_minimum_32_characters_long';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.NODE_ENV = 'test';

const testUser = {
  name: 'Test Owner',
  phone: '+233244999001',
  password: 'testpass123',
  shopName: "Test Shop",
};

let accessToken;
let refreshToken;

beforeAll(async () => {
  // Clean up test user if exists
  await prisma.shop.deleteMany({ where: { owner: { phone: testUser.phone } } });
  await prisma.user.deleteMany({ where: { phone: testUser.phone } });
});

afterAll(async () => {
  await prisma.shop.deleteMany({ where: { owner: { phone: testUser.phone } } });
  await prisma.user.deleteMany({ where: { phone: testUser.phone } });
  await prisma.$disconnect();
});

describe('POST /api/v1/auth/register', () => {
  it('should register a new shop owner', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.phone).toBe(testUser.phone);

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('should reject duplicate phone number', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid phone format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...testUser, phone: '12345', name: 'Other User', shopName: 'Other Shop' });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test' });

    expect(res.status).toBe(422);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ phone: testUser.phone, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ phone: testUser.phone, password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('should reject non-existent phone', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ phone: '+233000000000', password: 'anypass' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('should return current user profile', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.phone).toBe(testUser.phone);
    expect(res.body.data).toHaveProperty('shop');
  });

  it('should reject request without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  it('should refresh the access token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should reject invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'fake.refresh.token' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('should logout successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Logged out');
  });
});
