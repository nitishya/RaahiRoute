# RaahiRoute

Smart Travel Planning & Experience Engine

## Project Overview
RaahiRoute is an iterative travel planning application built with modern technologies.

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Fastify, TypeScript
- **Database**: PostgreSQL, Prisma
- **Orchestration**: Docker, Docker Compose

## Getting Started

### Prerequisites
- Docker and Docker Compose installed.

### Installation & Running
1. Clone the repository.
2. Run the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Access the frontend at `http://localhost:3000`.

## Phase 1 Status: COMPLETED
- [x] Basic Fastify backend with Health and Trip APIs.
- [x] Next.js frontend with Homepage and Trip Form.
- [x] Prisma schema for Trips.
- [x] Docker setup for all services.