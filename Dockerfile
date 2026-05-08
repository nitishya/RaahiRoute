# This root Dockerfile is a proxy for the backend service to satisfy 
# default Google Cloud Build triggers that look for a Dockerfile in the root.

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
COPY backend/prisma.config.ts ./

RUN npm install

COPY backend/ .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["npm", "start"]
