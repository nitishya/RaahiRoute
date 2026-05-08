import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { buildApp } from '../index';
import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma';

// Mock Prisma
vi.mock('../lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('Auth Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('test@example.com');
  });

  it('should fail to register an existing user', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'user-1' });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'existing@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe('User already exists');
  });
});
