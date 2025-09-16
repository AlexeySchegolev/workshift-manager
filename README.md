# Workshift Manager

A comprehensive workshift management application designed for healthcare and workplace scheduling. Built with React (TypeScript) frontend and Express/PostgreSQL backend.

## 🚀 Features

- **Employee Management** - Complete CRUD operations for staff management
- **Location-based Scheduling** - Multi-location support with specific configurations  
- **Role Management** - Define roles with permissions and requirements
- **Shift Planning** - Automated shift planning with constraint validation
- **Dashboard** - Statistics and overview with quick actions
- **PostgreSQL Database** - Robust data storage with JSONB support
- **Docker Support** - Containerized PostgreSQL for development

## 🏗️ Architecture

- **Frontend**: React 19+ with TypeScript, Material-UI (MUI), Vite
- **Backend**: Express.js with TypeScript, PostgreSQL, Zod validation
- **Database**: PostgreSQL 15 with automatic migrations and seeding
- **Development**: Docker Compose, automatic database setup

## 📋 Prerequisites

- Node.js (latest LTS version)
- Docker and Docker Compose
- npm or yarn package manager

## 🛠️ Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd workshift-manager

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies  
cd ../server && npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp server/.env.example server/.env

# Configure your database settings in server/.env
# The default values work with the Docker setup
```

### 3. Start Development

```bash
# Start both frontend and backend (recommended)
npm run dev

# Or start individually:

# Backend only (includes automatic DB setup)
cd server && npm run dev

# Frontend only  
cd frontend && npm run dev
```

The `npm run dev` command automatically:
1. 🐳 Starts PostgreSQL in Docker
2. ⏳ Waits for database to be ready
3. 🔧 Runs database migrations
4. 🌱 Seeds initial data (if not already present)
5. 🚀 Starts both backend and frontend servers

## 📊 Database Management

### Automatic Setup (Recommended)
Development servers automatically handle database setup including Docker, migrations, and seeding.

### Manual Database Commands

```bash
cd server

# Docker Management
npm run docker:up      # Start PostgreSQL container
npm run docker:down    # Stop containers
npm run docker:reset   # Reset with fresh data

# Database Operations
npm run db:setup       # Full setup (Docker + Migration)
npm run db:reset       # Reset database with fresh schema
npm run migrate        # Run migrations only
npm run seed          # Run seeding only
```

### Database Configuration

PostgreSQL runs in Docker with the following defaults:
- **Host**: localhost
- **Port**: 5432
- **Database**: workshift_manager
- **Username**: workshift_user
- **Password**: workshift_password

## 🏃‍♂️ Available Scripts

### Root Directory
- `npm run dev` - Start both backend and frontend
- `npm run build` - Build both projects
- `npm run test` - Run all tests
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only

### Backend (server/)
- `npm run dev` - Start with automatic DB setup
- `npm run dev:server-only` - Start server without DB setup
- `npm run build` - Compile TypeScript
- `npm run test` - Run backend tests

### Frontend (frontend/)
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Create production build
- `npm run test` - Run frontend tests

## 🗄️ Database Schema

### Core Tables
- **employees** - Staff information with roles and working hours
- **locations** - Practice locations with operating hours and equipment
- **shift_definitions** - Available shift types and configurations
- **shift_rules** - Constraint rules for shift planning
- **shift_plans** - Monthly shift plans with assignments
- **shift_assignments** - Individual shift assignments

### Key Features
- **UUID Primary Keys** for employees and plans
- **JSONB Fields** for flexible data storage (operating hours, equipment, etc.)
- **Foreign Key Constraints** ensuring data integrity
- **Automatic Timestamps** with PostgreSQL triggers

## 🌱 Seed Data

The application includes comprehensive seed data:
- **27 Employees** across 3 roles (ShiftLeader, Specialist, Assistant)
- **2 Locations** (Dialysepraxis Elmshorn, Dialysepraxis Uetersen)
- **6 Shift Definitions** with location-specific configurations
- **Default Shift Rules** for constraint validation

Seed data is automatically loaded on first run and skipped if data already exists.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests only
npm run test:frontend

# Backend tests only  
cd server && npm run test

# Watch mode
cd server && npm run test:watch
```

## 🚀 Production Build

```bash
# Build everything
npm run build

# Backend build
cd server && npm run build

# Frontend build  
npm run build:frontend
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```bash
# Database (Required - no fallback values)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=workshift_manager
DATABASE_USER=workshift_user
DATABASE_PASSWORD=workshift_password
DATABASE_SSL=false

# Server
NODE_ENV=development
PORT=3001

# CORS  
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Docker Configuration

PostgreSQL is configured via `docker-compose.yml`:
- **Main DB**: Port 5432 for development
- **Test DB**: Port 5433 for testing
- **Health Checks**: Automatic readiness detection
- **Persistent Storage**: Data survives container restarts

## 📝 API Documentation

### Core Endpoints
- `GET /api/employees` - List employees with filtering and pagination
- `GET /api/locations` - List practice locations
- `GET /api/shift-plans` - Monthly shift plans
- `GET /api/shift-configuration` - Shift planning constraints
- `GET /health` - Health check endpoint

### API Features
- **Request Validation** with Zod schemas
- **Error Handling** with detailed logging
- **Rate Limiting** for API protection
- **CORS Support** for frontend integration

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
npm run docker:reset

# Check logs
docker logs workshift-postgres
```

### Port Conflicts
- Backend: Change `PORT` in `server/.env`
- Frontend: Modify `vite.config.ts`
- Database: Update `DATABASE_PORT` and docker-compose.yml

### Migration Issues
```bash
# Reset database completely
cd server && npm run docker:reset
```

## 🤝 Development Guidelines

1. **Always run tests** after making changes
2. **Use TypeScript strictly** - avoid `any` types
3. **Follow existing patterns** for new features
4. **Test both API endpoints and UI** functionality  
5. **Ensure database changes include migrations**

## 📂 Project Structure

```
workshift-manager/
├── frontend/               # React TypeScript frontend
│   ├── src/components/    # UI components
│   ├── src/models/        # TypeScript interfaces
│   └── public/           # Static assets
├── server/                # Express TypeScript backend  
│   ├── src/routes/       # API endpoints
│   ├── src/database/     # Database layer
│   ├── src/services/     # Business logic
│   └── src/validation/   # Request schemas
├── docker-compose.yml    # PostgreSQL setup
└── README.md            # This file
```

## 🚀 Getting Started Quickly

```bash
# One-command setup
git clone <repo> && cd workshift-manager && npm install && npm run dev
```

This will:
1. Install all dependencies
2. Start PostgreSQL in Docker
3. Set up the database schema
4. Load initial data
5. Start both frontend (port 3000) and backend (port 3001)

Visit http://localhost:3000 to see the application!

## 📧 Support

For questions or issues, please check the troubleshooting section above or create an issue in the repository.