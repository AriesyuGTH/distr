# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Distr** is an open-source software distribution platform for managing self-hosted deployments of software applications. It provides a complete solution for distributing, deploying, and managing applications across Docker and Kubernetes environments.

The system consists of multiple interconnected components:
- **Hub**: Central control plane (Go backend + Angular frontend)
- **Agents**: Docker and Kubernetes agents for deployment management
- **OCI Registry**: Container registry for storing artifacts
- **MCP Server**: Model Context Protocol server for AI/LLM integration
- **SDK**: JavaScript SDK for API integration

## Quick Reference

```bash
# Development
make run                    # Start development server
make watch                  # Watch mode for development

# Building
make build                  # Build all components
make build-frontend         # Build Angular frontend only
make build-backend          # Build Go backend only

# Testing
make test                   # Run all tests
make test-go               # Run Go tests only
make test-frontend         # Run Angular tests only
go test ./internal/specific/package  # Run specific package tests

# Linting & Formatting
make lint                  # Lint all code (Go + frontend)
make fmt                   # Format Go code

# Database
make init-db              # Initialize PostgreSQL database
make migrate-up           # Run database migrations

# Docker
docker-compose up -d      # Start dependencies (PostgreSQL, etc.)
docker-compose down       # Stop dependencies
```

## Development Setup

### Prerequisites

- **Go**: 1.25+ (specified in go.mod)
- **Node.js**: 24.x (specified in .tool-versions)
- **PostgreSQL**: For database
- **Docker**: For running dependencies
- **mise** (optional): Tool version manager (see .tool-versions)

### Initial Setup

```bash
# 1. Install dependencies
make deps

# 2. Start PostgreSQL (via Docker)
docker-compose up -d

# 3. Initialize database
make init-db

# 4. Run development server
make run
```

## Architecture & Components

### System Architecture

Distr uses a hub-and-spoke architecture where the Hub acts as the central control plane, coordinating with Agents deployed on target infrastructure:

```
┌─────────────────────────────────────────┐
│           Distr Hub                     │
│  (Control Plane: Go + Angular)          │
│  - REST API                             │
│  - Web UI                               │
│  - OCI Registry                         │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼────┐          ┌───▼────┐
│ Docker │          │  K8s   │
│ Agent  │          │ Agent  │
└────────┘          └────────┘
```

### Component Breakdown

#### 1. Distr Hub (`cmd/hub/`)
- Main entry point for the control plane
- Combines backend API server and Angular frontend
- Manages deployments, artifacts, and configurations
- Serves the web UI for administrators

#### 2. Docker Agent (`cmd/docker-agent/`)
- Runs on Docker hosts
- Communicates with Hub via gRPC
- Manages container deployments on Docker
- Handles image pulling, container lifecycle

#### 3. Kubernetes Agent (`cmd/kubernetes-agent/`)
- Runs in Kubernetes clusters
- Manages application deployments via Kubernetes API
- Handles Helm charts and Kubernetes manifests
- Reports cluster status back to Hub

#### 4. OCI Registry
- Built-in container registry (OCI-compliant)
- Stores application artifacts and images
- Integrated with Hub for artifact management
- Code in `internal/registry/`

#### 5. MCP Server (`cmd/mcp/`)
- Model Context Protocol server
- Enables AI/LLM integration with Distr
- Provides structured API for AI assistants
- Located at `cmd/mcp/`

#### 6. JavaScript SDK (`sdk/js/`)
- Client library for Distr API
- TypeScript definitions included
- Used for programmatic access to Hub

## Key Directories

- **`cmd/`** - Main entry points for all binaries (hub, agents, mcp)
- **`internal/`** - Internal Go packages (40+ modules):
  - `internal/hub/` - Hub-specific logic
  - `internal/agent/` - Agent implementations
  - `internal/registry/` - OCI registry implementation
  - `internal/migrations/` - Database migrations (PostgreSQL)
  - `internal/apiserver/` - REST API server
  - `internal/grpc/` - gRPC services
- **`frontend/ui/`** - Angular web application
- **`api/`** - API type definitions and protobuf files
- **`sdk/js/`** - JavaScript/TypeScript SDK
- **`deploy/`** - Deployment configurations:
  - `deploy/docker/` - Docker Compose files
  - `deploy/helm/` - Kubernetes Helm charts
- **`docs/`** - Documentation

## Tech Stack

- **Backend**: Go 1.25+
- **Frontend**: Angular 19+ with TypeScript
- **Database**: PostgreSQL with golang-migrate
- **Container Runtime**: Docker, Kubernetes
- **API**: REST + gRPC
- **Protocol Buffers**: For API definitions
- **Build Tools**: Make, npm
- **Linting**: golangci-lint (Go), prettier (frontend)
- **Testing**: Go testing, Karma/Jasmine (Angular)

## Development Workflow

### Running Locally

The Hub combines backend and frontend into a single binary:

```bash
# Start all dependencies
docker-compose up -d

# Run in development mode (with hot reload)
make run

# Or run specific components
make run-hub           # Hub only
make run-docker-agent  # Docker agent only
```

### Frontend Development

The Angular frontend is embedded in the Go binary but can be developed separately:

```bash
cd frontend/ui
npm install
npm start              # Development server with hot reload
npm run build          # Production build
```

### Working with the Database

Migrations are in `internal/migrations/`:

```bash
# Create new migration
make migrate-create NAME=add_new_table

# Apply migrations
make migrate-up

# Rollback
make migrate-down
```

## Testing

### Go Tests

```bash
# Run all Go tests
make test-go

# Run specific package tests
go test ./internal/hub/...

# Run specific test
go test -run TestSpecificFunction ./internal/package

# Run with coverage
go test -cover ./...

# Verbose output
go test -v ./internal/package
```

### Frontend Tests

```bash
cd frontend/ui

# Run tests once
npm test

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- --include='**/component.spec.ts'
```

### Integration Tests

Integration tests may require running dependencies:

```bash
docker-compose up -d    # Start PostgreSQL
make test              # Run all tests including integration
```

## Building

### Development Builds

```bash
make build             # Build all components
make build-hub         # Build Hub only
make build-agents      # Build agents only
```

### Production Builds

```bash
# Build optimized binaries
make build-prod

# Build Docker images
make docker-build

# Build for specific platforms
GOOS=linux GOARCH=amd64 make build
```

## Deployment

### Docker Deployment

Use the provided Docker Compose files:

```bash
cd deploy/docker
docker-compose up -d
```

### Kubernetes Deployment

Helm charts are available in `deploy/helm/`:

```bash
# Install Hub
helm install distr-hub deploy/helm/distr-hub

# Install Docker Agent
helm install distr-agent deploy/helm/distr-agent \
  --set hub.url=https://your-hub-url
```

## Important Configuration Files

- **`Makefile`** - All build, test, and development commands
- **`docker-compose.yml`** - Local development dependencies
- **`.tool-versions`** - Specifies tool versions (Go, Node, etc.)
- **`go.mod`** - Go dependencies
- **`frontend/ui/package.json`** - Frontend dependencies
- **`.golangci.yml`** - Go linting configuration
- **`internal/migrations/`** - Database schema migrations

## API Development

### Adding New Endpoints

1. Define API types in `api/` directory
2. Implement handler in `internal/apiserver/`
3. Add route registration
4. Update OpenAPI specs if applicable
5. Add tests in corresponding `_test.go` file

### gRPC Services

Protocol buffer definitions are in `api/`:

```bash
# Regenerate gRPC code after modifying .proto files
make proto-gen
```

## Contributing

See `CONTRIBUTING.md` for contribution guidelines and code review process.

## MCP Server

The Model Context Protocol server enables AI integration:

```bash
# Run MCP server
make run-mcp

# Or directly
go run cmd/mcp/main.go
```

The MCP server provides structured access to Distr's API for AI assistants and LLM applications.
