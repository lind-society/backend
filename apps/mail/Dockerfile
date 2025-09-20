# --- Stage 1: Base ---
FROM node:22-alpine AS base
WORKDIR /work
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Stage 2: Dependencies ---
FROM base AS deps
WORKDIR /work
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- Stage 3: Build ---
FROM base AS build
WORKDIR /work
ARG APP_NAME=mail

# Copy dependencies
COPY --from=deps /work/node_modules ./node_modules

# Copy source code and config files
COPY ./libs ./libs
COPY ./apps ./apps  
COPY package.json nest-cli.json tsconfig.json tsconfig.base.json tsconfig.build.json pnpm-workspace.yaml ./

# NestJS should automatically build dependencies when building the app
# The --verbose flag helps with debugging
RUN npx nest build ${APP_NAME}

# Verify the build succeeded and show structure
RUN echo "=== Build completed. Checking output structure ===" && \
    find dist -name "*.js" -type f | head -20 && \
    echo "=== Specifically looking for main.js ===" && \
    find dist -name "main.js" -type f

# --- Stage 4: Runtime ---
FROM node:22-alpine AS runtime
WORKDIR /app
ARG APP_NAME=mail

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output
COPY --from=build /work/dist ./dist

# Set ownership and switch to non-root user  
RUN chown -R app:app .
USER app

CMD ["node", "dist/apps/mail/apps/mail/src/main.js"]