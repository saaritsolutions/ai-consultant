# AI Consultant — Banking & Leasing Platform

A production-ready full-stack web application for an AI Consultant specializing in Banking and Leasing domains.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | TailwindCSS |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Notifications** | react-hot-toast |
| **Backend** | ASP.NET Core Web API (.NET 8) |
| **ORM** | Entity Framework Core 8 |
| **Database** | PostgreSQL 16 |
| **Authentication** | JWT Bearer tokens |
| **Container** | Docker + Docker Compose |

---

## Project Structure

```
ai-consultant/
├── backend/
│   ├── AiConsultant.sln
│   ├── AiConsultant.Core/          # Domain entities, DTOs, interfaces
│   ├── AiConsultant.Infrastructure/ # EF Core, repositories, services
│   └── AiConsultant.API/           # Controllers, middleware, Program.cs
├── frontend/
│   ├── src/
│   │   ├── api/                    # Axios API clients
│   │   ├── components/             # Layout & common components
│   │   ├── context/                # Auth context
│   │   ├── pages/                  # Public + admin pages
│   │   └── types/                  # TypeScript types
│   └── ...
├── docker-compose.yml              # Full stack Docker
├── docker-compose.dev.yml          # DB-only for local dev
└── README.md
```

---

## Quick Start with Docker

The easiest way to run the full stack:

```bash
# Clone the repository
git clone <repo-url>
cd ai-consultant

# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up -d --build

# Wait ~30 seconds for the backend to migrate the database and seed the admin user

# Access the app:
# Frontend → http://localhost:3000
# Backend API → http://localhost:5000
# Swagger UI → http://localhost:5000/swagger
```

**Default admin credentials:**
- Email: `admin@aiconsultant.com`
- Password: `Admin@123`

---

## Local Development Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/) (or use Docker for just the DB)

### 1. Start the Database

```bash
# Option A: Use Docker for PostgreSQL only
docker-compose -f docker-compose.dev.yml up -d

# Option B: Use your local PostgreSQL
# Create a database named "aiconsultant"
```

### 2. Backend Setup

```bash
cd backend

# Restore packages
dotnet restore

# Set environment variables (or update appsettings.Development.json)
# The default connection string points to: Host=localhost;Port=5432;Database=aiconsultant;Username=postgres;Password=postgres123

# Run database migrations
dotnet ef database update --project AiConsultant.Infrastructure --startup-project AiConsultant.API

# Start the backend (runs on http://localhost:5000)
dotnet run --project AiConsultant.API
```

> The backend automatically runs migrations and seeds the admin user on startup.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
# (or leave it as-is — Vite's dev server proxies /api to localhost:5000)

# Start the dev server (runs on http://localhost:5173)
npm run dev
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | Public | Admin login, returns JWT |

### Blog
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blogs` | Public | List all posts (optional `?category=`) |
| GET | `/blogs/categories` | Public | List distinct categories |
| GET | `/blogs/{slug}` | Public | Get post by slug |
| GET | `/blogs/admin/{id}` | Admin | Get post by ID (for editing) |
| POST | `/blogs` | Admin | Create blog post |
| PUT | `/blogs/{id}` | Admin | Update blog post |
| DELETE | `/blogs/{id}` | Admin | Delete blog post |

### Videos
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/videos` | Public | List all videos |
| GET | `/videos/{id}` | Public | Get video by ID |
| POST | `/videos` | Admin | Add video |
| PUT | `/videos/{id}` | Admin | Update video |
| DELETE | `/videos/{id}` | Admin | Delete video |

### Consultations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/consultations` | Public | Submit consultation request |
| GET | `/consultations` | Admin | List all consultations |
| PATCH | `/consultations/{id}/status` | Admin | Update consultation status |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Admin | Get stats & recent consultations |

Interactive Swagger docs: **http://localhost:5000/swagger**

---

## Database Schema

```sql
-- Users (admin accounts)
CREATE TABLE "Users" (
    "Id" UUID PRIMARY KEY,
    "Email" VARCHAR(256) UNIQUE NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" VARCHAR(50) NOT NULL DEFAULT 'Admin',
    "CreatedAt" TIMESTAMPTZ NOT NULL
);

-- Blog Posts
CREATE TABLE "BlogPosts" (
    "Id" UUID PRIMARY KEY,
    "Title" VARCHAR(300) NOT NULL,
    "Slug" VARCHAR(350) UNIQUE NOT NULL,
    "Content" TEXT NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "Tags" TEXT NOT NULL DEFAULT '',   -- comma-separated
    "CreatedAt" TIMESTAMPTZ NOT NULL,
    "UpdatedAt" TIMESTAMPTZ NOT NULL
);

-- Videos
CREATE TABLE "Videos" (
    "Id" UUID PRIMARY KEY,
    "Title" VARCHAR(300) NOT NULL,
    "Description" TEXT NOT NULL DEFAULT '',
    "YouTubeUrl" TEXT NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL
);

-- Consultations
CREATE TABLE "Consultations" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(200) NOT NULL,
    "Email" VARCHAR(256) NOT NULL,
    "Organization" TEXT NOT NULL DEFAULT '',
    "Message" TEXT NOT NULL,
    "Type" VARCHAR(10) NOT NULL,        -- 'Free' or 'Paid'
    "Status" VARCHAR(10) NOT NULL,      -- 'Pending' or 'Completed'
    "PreferredDate" TIMESTAMPTZ NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL
);
```

---

## EF Core Migrations

```bash
# From the backend/ directory:

# Add new migration
dotnet ef migrations add <MigrationName> \
  --project AiConsultant.Infrastructure \
  --startup-project AiConsultant.API

# Apply migrations
dotnet ef database update \
  --project AiConsultant.Infrastructure \
  --startup-project AiConsultant.API

# Generate SQL script
dotnet ef migrations script \
  --project AiConsultant.Infrastructure \
  --startup-project AiConsultant.API \
  --output migration.sql
```

---

## Configuration

### Backend (`appsettings.json`)

| Key | Description | Default |
|-----|-------------|---------|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string | localhost |
| `JwtSettings:SecretKey` | JWT signing key (min 32 chars) | **Change this!** |
| `JwtSettings:Issuer` | JWT issuer | `AiConsultantAPI` |
| `JwtSettings:Audience` | JWT audience | `AiConsultantClient` |
| `JwtSettings:ExpirationHours` | Token lifetime | `24` |
| `AdminSettings:Email` | Seeded admin email | `admin@aiconsultant.com` |
| `AdminSettings:Password` | Seeded admin password | `Admin@123` |
| `AllowedOrigins` | CORS origins (comma-separated) | `http://localhost:5173` |

### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api` (Docker) or `http://localhost:5000/api` (dev) |

---

## Production Checklist

Before going live:

- [ ] Change `JwtSettings:SecretKey` to a secure random string (32+ chars)
- [ ] Change `AdminSettings:Password` to a strong password
- [ ] Set `POSTGRES_PASSWORD` to a strong password
- [ ] Configure a real email service in `EmailService.cs` (SendGrid, SMTP, etc.)
- [ ] Set up HTTPS / TLS termination
- [ ] Configure backups for PostgreSQL volume
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Review CORS `AllowedOrigins` for your production domain

---

## Admin Panel

Access the admin panel at `/admin/login`.

Features:
- Dashboard with statistics
- Full CRUD for blog posts (HTML content editor)
- Full CRUD for YouTube videos
- View and manage consultation requests
- Mark consultations as completed

---

## Email Notifications

The `EmailService` is a placeholder that logs to the console. To use a real provider:

1. Open `backend/AiConsultant.Infrastructure/Services/EmailService.cs`
2. Replace the `SendConsultationNotificationAsync` implementation with your provider's SDK (SendGrid, Mailgun, SMTP, etc.)
3. Add the provider's NuGet package to `AiConsultant.Infrastructure.csproj`

---

## License

MIT
