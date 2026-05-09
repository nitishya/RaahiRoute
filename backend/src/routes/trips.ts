import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { getTravelRecommendations, getTripItinerary } from '../services/ai';

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

  // GET /trips/:id/recommendations
  fastify.get('/:id/recommendations', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const trip = await prisma.trip.findUnique({
        where: { id, userId: request.user.userId }
      });

      if (!trip) {
        return reply.status(404).send({ message: 'Trip not found' });
      }

      const recommendations = await getTravelRecommendations(trip.destination, trip.budget);
      return recommendations;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Failed to fetch recommendations' });
    }
  });

  // GET /trips/:id/itinerary
  fastify.get('/:id/itinerary', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const trip = await prisma.trip.findUnique({
        where: { id, userId: request.user.userId }
      });

      if (!trip) {
        return reply.status(404).send({ message: 'Trip not found' });
      }

      const diffTime = Math.abs(trip.endDate.getTime() - trip.startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const itinerary = await getTripItinerary(trip.destination, diffDays, trip.budget);
      return itinerary;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Failed to generate itinerary' });
    }
  });
}
