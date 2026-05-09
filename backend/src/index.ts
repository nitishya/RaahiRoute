// RaahiRoute Backend - Phase 5 Testing Setup
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { tripRoutes } from './routes/trips';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// TypeScript augmentation for JWT
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; email: string };
    user: { userId: string; email: string };
  }
}

export async function buildApp() {
  const fastify = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'RaahiRoute API',
        description: 'Travel planning application backend API',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-this-in-production',
  });

  await fastify.register(healthRoutes);
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(tripRoutes, { prefix: '/trips' });

  // Root route to prevent 404 on Cloud Run base URL
  fastify.get('/', async () => {
    return { 
      name: 'RaahiRoute API', 
      status: 'running',
      version: '1.0.0',
      message: 'Welcome to the RaahiRoute Backend API. Please use the frontend application to interact with this service.'
    };
  });


  return fastify;
}

if (require.main === module) {
  buildApp().then(async (fastify) => {
    try {
      const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
      const host = '0.0.0.0';
      await fastify.listen({ port, host });
      console.log(`Server listening on http://${host}:${port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}
