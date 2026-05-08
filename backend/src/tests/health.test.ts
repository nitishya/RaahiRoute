import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { buildApp } from '../index';
import { FastifyInstance } from 'fastify';

// Mock Prisma to prevent initialization error
vi.mock('../lib/prisma', () => ({
  default: {},
}));

describe('Health Check', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 OK for /health', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('OK');
    expect(body).toHaveProperty('timestamp');
  });
});
