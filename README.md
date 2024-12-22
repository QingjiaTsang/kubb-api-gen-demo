# Kubb API Generation Demo

A full-stack TypeScript demo showcasing type-safe API integration using Kubb. This project demonstrates how to generate type-safe API clients from OpenAPI specifications, featuring React Query hooks with Zod validation.

## Key Demonstrations

- Automatic generation of type-safe React Query hooks from OpenAPI specs
- Integration of Zod for runtime type validation
- Automated operation ID generation for API routes
- MSW (Mock Service Worker) integration for API mocking
- Full-stack TypeScript setup with HonoJS and React

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- MSW for mocking
- Kubb for API generation

### Backend

- HonoJS
- TypeScript
- SQLite with Drizzle ORM
- OpenAPI/Swagger
- Pino Logger

## Project Structure

```
.
├── client/ # React frontend
├── server/ # HonoJS backend
├── package.json # Workspace root
└── README.md
```

## Prerequisites

- Node.js >= 18
- Package manager (npm, yarn, pnpm, or bun)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd task-management-system
   ```

2. Install dependencies:

   ```bash
   # Using bun (recommended)
   bun install
   ```

3. Set up environment variables:

   ```bash
   cd client
   cp .env.example .env

   cd server
   cp .env.example .env
   ```

4. Initialize database and seed data:

   ```bash
   bun db:migrate
   bun db:seed
   ```

5. Start development servers:

   ```bash
   bun dev
   ```

   This will start:

   - Frontend: http://localhost:5173
   - Backend: http://localhost:9999
   - API Documentation: http://localhost:9999/reference
   - API OpenAPI documentation: http://localhost:9999/doc

## Available Scripts

- `bun dev` - Start both frontend and backend in development mode
- `bun dev:client` - Start frontend only
- `bun dev:server` - Start backend only
- `bun build` - Build both frontend and backend
- `bun typecheck` - Run type checking
- `bun lint` - Run linting
- `bun db:migrate` - Run database migrations
- `bun db:seed` - Seed database with sample data

## Features

### API Code Generation

The project implements a streamlined API code generation workflow:

1. Backend routes are defined with OpenAPI specifications including operation IDs
2. The OpenAPI JSON/YAML file is downloaded and placed in the `client` directory
3. Running `bun kubb` generates:
   - Type-safe React Query hooks
   - Zod validation schemas
   - Complete TypeScript definitions

### Automated Operation ID Generation

The server includes a sophisticated operation ID generation system:

- Automatic generation of semantic operation IDs for each route
- CLI command `bun preview-routes` to inspect generated IDs
- Customizable naming conventions and validation rules
- Helps maintain consistent API naming patterns

### Mock Service Worker (MSW)

The client includes configurable API mocking:

- Toggle MSW via `VITE_ENABLE_MSW` in client's `.env`
- Seamlessly switch between real API and mocked responses
- Generated mock handlers maintain type safety
- Ideal for development and testing scenarios

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is a demo project created for learning purposes and to showcase full-stack development with kubb.