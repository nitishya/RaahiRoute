# Multi-stage Dockerfile for RaahiRoute Monorepo

# Stage 1: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
COPY backend/prisma.config.ts ./
RUN npm install
COPY backend/ .
RUN npx prisma generate
RUN npm run build

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Set environment variable so Next.js builds with correct public URL (if needed)
ENV NEXT_PUBLIC_API_URL=/api
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 3: Production Image
FROM node:20-alpine

# Install root dependencies (like concurrently)
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Copy Backend Build
WORKDIR /app/backend
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copy Frontend Build
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/package*.json ./
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/node_modules ./node_modules

# Go back to root to run concurrently
WORKDIR /app
COPY package*.json ./

# Expose Next.js port
EXPOSE 8080

# Run both Next.js and Fastify using the script defined in root package.json
CMD ["npm", "start"]
