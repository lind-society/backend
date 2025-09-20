# Lind Society Backend

NestJS Monorepo with RabbitMQ, MinIO, and PostgreSQL.

## Prerequisites

- Docker & Docker Compose
- Node.js 22+ (for local development)

## Quick Start

1. **Clone and setup**

   ```bash
   git clone <repository>
   cd lind-society
   cp .env.example .env
   ```

2. **Configure environment**
   Edit `.env` with your database and service configurations.

3. **Run services**

   ```bash
   make dev    # Development mode
   # or
   make prod   # Production mode
   ```

4. **Access services**
   - Main API: http://localhost:3000
   - External Gateway: http://localhost:3001
   - RabbitMQ Management: http://localhost:15672
   - MinIO Console: http://localhost:9001

## Available Commands

```bash
make init                   # run and Build all services
make build                  # Build all services
make up                     # Start services
make down                   # Stop services
make restart                # Restart services

make dev                    # Run app in development mode
make prod                   # Run app in production mode

make migrate                # Run database migrations
make db-seed                # Run database seeder

make logs                   # View all logs
make logs-<container name>  # View specific service logs (example : logs-main)

make clean                  # Remove containers and volumes
make clean-reset-all        # Remove containers and volumes

make status                 # Check service status
```

## Services

- **main** - Main API service (port 3000)
- **external-gateway** - External gateway (port 3001)
- **mail-service** - Email service
- **whatsapp-service** - WhatsApp service

## dependencies

- **rabbitmq** - Message broker
- **minio** - Object storage

## Development

```bash
# Install dependencies
pnpm install

# Start specific service
docker compose up main -d

# View logs
make logs-main
```

## Environment Variables

Key variables in `.env`:

- Database connection settings
- RabbitMQ configuration
- MinIO credentials
- Service-specific configurations
