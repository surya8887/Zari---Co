# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies (for bcrypt or native modules if needed)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

# Copy codebase
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production Run
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy generated Prisma Client files
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY public ./public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/health').then(res => res.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["npm", "run", "start"]
