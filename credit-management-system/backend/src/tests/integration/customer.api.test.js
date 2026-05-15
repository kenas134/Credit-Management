// src/tests/integration/customer.api.test.js
// Integration tests for Customer API endpoints

const request = require('supertest');
const app = require('../../app');
const prisma = require('../../config/db');

process.env.JWT_SECRET = 'test_secret_key_minimum_32_characters_long_here';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_minimum_32_characters_long';
process.env.JWT_EXPIRES_IN = '15m';
process.env.NODE_ENV = 'test';

const ownerData = {
  name: 'Customer Test Owner',
  phone: '+233244999002',
  password: 'testpass123',
  shopName: 'Customer Test Shop',
};

let accessToken;
let createdCustomerId;

beforeAll(async () => {
  await prisma.shop.deleteMany({ where: { owner: { phone: ownerData.phone } } });
  await prisma.user.deleteMany({ where: { phone: ownerData.phone } });

  const res = await request(app).post('/api/v1/auth/register').send(ownerData);
  accessToken = res.body.data.accessToken;
});

afterAll(async () => {
  await prisma.shop.deleteMany({ where: { owner: { phone: ownerData.phone } } });
  await prisma.user.deleteMany({ where: { phone: ownerData.phone } });
  await prisma.$disconnect();
});

describe('POST /api/v1/customers', () => {
  it('should create a new customer', async () => {
    const res = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'Abena Test',
        phone: '+233244111999',
        address: 'Accra, Ghana',
        creditLimit: 2000,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.fullName).toBe('Abena Test');
    createdCustomerId = res.body.data.id;
  });

  it('should reject duplicate phone in same shop', async () => {
    const res = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ fullName: 'Duplicate', phone: '+233244111999' });

    expect(res.status).toBe(409);
  });

  it('should reject invalid phone format', async () => {
    const res = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ fullName: 'Bad Phone', phone: '12345' });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/customers', () => {
  it('should return paginated customer list', async () => {
    const res = await request(app)
      .get('/api/v1/customers')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body).toHaveProperty('pagination');
  });

  it('should filter by search term', async () => {
    const res = await request(app)
      .get('/api/v1/customers?search=Abena')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].fullName).toContain('Abena');
  });
});

describe('GET /api/v1/customers/:id', () => {
  it('should return a single customer with risk analysis', async () => {
    const res = await request(app)
      .get(`/api/v1/customers/${createdCustomerId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdCustomerId);
    expect(res.body.data).toHaveProperty('riskAnalysis');
  });

  it('should return 404 for unknown customer', async () => {
    const res = await request(app)
      .get('/api/v1/customers/nonexistent-id-12345')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/v1/customers/:id', () => {
  it('should update customer information', async () => {
    const res = await request(app)
      .put(`/api/v1/customers/${createdCustomerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nickname: 'Nana', address: 'Labone, Accra' });

    expect(res.status).toBe(200);
    expect(res.body.data.nickname).toBe('Nana');
  });
});
