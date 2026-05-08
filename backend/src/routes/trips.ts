import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createTripSchema = z.object({
  destination: z.string().min(1),
  budget: z.number().positive(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
});

export async function tripRoutes(fastify: FastifyInstance) {
  // Authentication pre-handler
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  // GET /trips
  fastify.get('/', async (request) => {
    try {
      const trips = await prisma.trip.findMany({
        where: { userId: request.user.userId },
        orderBy: { createdAt: 'desc' },
      });
      return trips;
    } catch (error) {
      fastify.log.error(error);
      throw new Error('Failed to fetch trips');
    }
  });

  // POST /trips
  fastify.post('/', async (request, reply) => {
    try {
      const validatedData = createTripSchema.parse(request.body);
      const trip = await prisma.trip.create({
        data: {
          ...validatedData,
          userId: request.user.userId,
        },
      });
      return reply.status(201).send(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Validation failed', errors: error.issues });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
