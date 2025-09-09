# apps/user-service/Dockerfile.prod
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

FROM base AS deps
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
COPY apps/*/package*.json ./apps/
COPY libs/*/package*.json ./libs/
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
RUN npm ci

# Copy shared libs + this specific app
COPY libs/ ./libs/
COPY apps/user-service/ ./apps/user-service/

# Build this specific app
RUN npm run build user-service

FROM base AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
RUN apk add --no-cache curl

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/user-service ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

# ============================================
# apps/booking-service/Dockerfile.prod
# ============================================
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

FROM base AS deps
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
COPY apps/*/package*.json ./apps/
COPY libs/*/package*.json ./libs/
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
RUN npm ci

COPY libs/ ./libs/
COPY apps/booking-service/ ./apps/booking-service/

RUN npm run build booking-service

FROM base AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
RUN apk add --no-cache curl

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/booking-service ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs
EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

# ============================================
# apps/payment-service/Dockerfile.prod
# ============================================
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

FROM base AS deps
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
COPY apps/*/package*.json ./apps/
COPY libs/*/package*.json ./libs/
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
RUN npm ci

COPY libs/ ./libs/
COPY apps/payment-service/ ./apps/payment-service/

RUN npm run build payment-service

FROM base AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
RUN apk add --no-cache curl

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/payment-service ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs
EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

# ============================================
# apps/workers/Dockerfile.prod (if you have background workers)
# ============================================
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

FROM base AS deps
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
COPY apps/*/package*.json ./apps/
COPY libs/*/package*.json ./libs/
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY nest-cli.json ./
RUN npm ci

COPY libs/ ./libs/
COPY apps/workers/ ./apps/workers/

RUN npm run build workers

FROM base AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/workers ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

# No EXPOSE needed for workers (they don't serve HTTP)
# No HEALTHCHECK needed for workers

ENTRYPOINT ["dumb-init", "--"]
# Use environment variable to determine worker type
CMD ["node", "dist/main.js"]