// RaahiRoute Backend - Phase 3 Authentication
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { tripRoutes } from './routes/trips';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';

const fastify = Fastify({
  logger: true,
});

// TypeScript augmentation for JWT
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; email: string };
    user: { userId: string; email: string };
  }
}

async function bootstrap() {
  console.log('Starting RaahiRoute backend with Auth...');
  try {
    await fastify.register(cors, {
      origin: true,
    });

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'super-secret-key-change-this-in-production',
    });

    await fastify.register(healthRoutes);
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(tripRoutes, { prefix: '/trips' });

    const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
    const host = '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();
