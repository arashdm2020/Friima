.PHONY: help build run test clean docker-build docker-up docker-down migrate

# Variables
APP_NAME=fariima-api
GO=go
GOFLAGS=-v
DOCKER_COMPOSE=docker-compose

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the application
	$(GO) build $(GOFLAGS) -o bin/$(APP_NAME) ./cmd/api

run: ## Run the application
	$(GO) run ./cmd/api/main.go

test: ## Run tests
	$(GO) test -v ./...

test-coverage: ## Run tests with coverage
	$(GO) test -v -coverprofile=coverage.out ./...
	$(GO) tool cover -html=coverage.out -o coverage.html

clean: ## Clean build artifacts
	rm -rf bin/
	rm -f coverage.out coverage.html

deps: ## Download dependencies
	$(GO) mod download
	$(GO) mod tidy

# Docker commands
docker-build: ## Build Docker image
	$(DOCKER_COMPOSE) build

docker-up: ## Start Docker containers
	$(DOCKER_COMPOSE) up -d

docker-down: ## Stop Docker containers
	$(DOCKER_COMPOSE) down

docker-logs: ## View Docker logs
	$(DOCKER_COMPOSE) logs -f

docker-restart: ## Restart Docker containers
	$(DOCKER_COMPOSE) restart

docker-clean: ## Remove Docker containers and volumes
	$(DOCKER_COMPOSE) down -v

# Database commands
check-postgres: ## Check PostgreSQL installation and status
	@bash scripts/check-postgres.sh

setup-db: ## Setup PostgreSQL database and create tables
	@bash scripts/setup-db.sh

migrate-up: ## Run database migrations
	$(GO) run cmd/migrate/main.go up

migrate-down: ## Rollback database migrations
	$(GO) run cmd/migrate/main.go down

migrate-fresh: ## Drop all tables and recreate
	$(GO) run cmd/migrate/main.go fresh

# Development
dev: ## Run in development mode with hot reload
	air

lint: ## Run linter
	golangci-lint run

fmt: ## Format code
	$(GO) fmt ./...

# Production
deploy: ## Deploy to production
	@echo "Deploying to production..."
	# Add your deployment commands here

.DEFAULT_GOAL := help
