// src/config/swagger.js
// Swagger/OpenAPI documentation configuration

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Credit Management System API',
      version: '1.0.0',
      description: `
REST API for the Credit Management System for Local Shops & Mini-Markets.
This API manages customers, credit accounts, transactions, and payments for informal shop credit ecosystems.

**Base URL:** \`/api/v1\`

**Authentication:** Bearer JWT token in Authorization header.
      `,
      contact: { name: 'API Support', email: 'support@creditmanager.app' },
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Development' },
      { url: 'https://api.creditmanager.app/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Customers', description: 'Customer management' },
      { name: 'Credit', description: 'Credit accounts and transactions' },
      { name: 'Payments', description: 'Payment recording and history' },
      { name: 'Reports', description: 'Analytics and reporting' },
      { name: 'Notifications', description: 'Alerts and reminders' },
      { name: 'Dashboard', description: 'KPIs and summary data' },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

module.exports = swaggerJsdoc(options);
