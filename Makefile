.PHONY: help init build up down restart logs clean dev prod migrate db-seed

# Default target
help:
	@echo "Available commands:"
	@echo "  make init      								- Build and run all services"
	@echo "  make build     								- Build all services"
	@echo "  make up        								- Start all services"
	@echo "  make down      								- Stop all services"
	@echo "  make restart   								- Restart all services"
	@echo "  make logs      								- View all logs"
	@echo "  make logs-<container_name>     - View logs for specific container"
	@echo "  make dev       								- Start in development mode"
	@echo "  make prod      								- Start in production mode"
	@echo "  make clean     								- Clean containers and images only"
	@echo "  make clean-reset-all						- Clean containers, images and volumes"
	@echo "  make migrate   								- Run database migrations"
	@echo "  make db-seed   								- Seed database"

# Build all services
init:
	docker compose up -d --build

build:
	docker compose build

# Start all services
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Restart all services
restart:
	docker compose restart

# Build and start
dev: build up

# Production deployment
prod:
	docker compose up -d --build

# View logs
logs:
	docker compose logs -f

# View logs for specific service
logs-%:
	docker compose logs -f $*

# Clean everything except volume
clean:
	docker compose down --remove-orphans --rmi all

# Clean everything including image and volume
clean-reset-all:
	docker compose down -v --remove-orphans --rmi all
	docker system prune -f

# Database migration (if needed)
migrate:
	docker compose exec main npx typeorm migration:run -d dist/apps/main/apps/main/src/database/data-source.js

db-seed:
	docker compose exec main node dist/apps/main/apps/main/src/database/seeders/init.seeder.js

# Check service status
status:
	docker compose ps