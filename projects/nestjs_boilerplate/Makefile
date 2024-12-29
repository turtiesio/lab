# Makefile for NestJS Boilerplate Project

# Variables
APP_NAME=backend
TEST_APP_NAME=testapp
DOCKER_COMPOSE_FILE=./docker-compose.yml

# Install dependencies
install:
	yarn install

# Start development server
start:
	yarn start:dev

# Start development server for test app
start-testapp:
	yarn workspace @app/testapp start:dev

# Run all tests
test:
	yarn test

# Run e2e tests
test-e2e:
	yarn test:e2e

# Run migrations
migrate:
	yarn typeorm migration:run

# Generate new migration
migration:
	yarn typeorm migration:generate -n $(name)

# Lint code
lint:
	yarn lint

# Format code
format:
	yarn format

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf yarn.lock

# Start database services
db-up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop database services
db-down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Help command
help:
	@echo "Available commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make start          - Start development server"
	@echo "  make start-testapp  - Start test app development server"
	@echo "  make test           - Run all tests"
	@echo "  make test-e2e       - Run e2e tests"
	@echo "  make migrate        - Run migrations"
	@echo "  make migration name=<name> - Generate new migration"
	@echo "  make lint           - Lint code"
	@echo "  make format         - Format code"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make db-up          - Start database services"
	@echo "  make db-down        - Stop database services"