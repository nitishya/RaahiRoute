// RaahiRoute Backend - Phase 1 MVP
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { tripRoutes } from './routes/trips';
import { healthRoutes } from './routes/health';

const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  try {
    await fastify.register(cors, {
      origin: true,
    });

    await fastify.register(healthRoutes);
    await fastify.register(tripRoutes, { prefix: '/trips' });

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    const host = '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();
