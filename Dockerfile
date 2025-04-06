# --- Base image ---
ARG NODE_VERSION

FROM node:${NODE_VERSION}-slim AS base

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY tsconfig.json tsconfig.build.json package.json pnpm-lock.yaml ./

# Install dependencies (include devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# --- Build stage ---
FROM base AS builder

# Copy dependencies and source code from base stage
COPY --from=base /app /app

# Build the NestJS app
RUN pnpm run build

# --- Production stage ---
  FROM node:${NODE_VERSION}-slim AS production

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only production dependency files
COPY tsconfig.json tsconfig.build.json package.json pnpm-lock.yaml ./

# Install production-only dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application and production node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose application port
EXPOSE 3000

# Start the app
CMD ["sh", "-c", "pnpm migration:run && node dist/main"]
