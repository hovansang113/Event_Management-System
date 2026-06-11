# Project Structure

## Monorepo Overview

```
Event_Management-System/              ← root (pnpm + Turborepo)
│
├── apps/
│   ├── admin-fe/                     ← React/Vite — Admin dashboard
│   ├── organizer-fe/                 ← React/Vite — Organizer portal
│   ├── attendee-fe/                  ← React/Vite — Attendee portal
│   └── backend/                      ← Laravel — REST API
│
├── packages/
│   └── shared-ui/                    ← Shared UI components (reused across 3 frontends)
│
├── .github/workflows/ci.yml          ← GitHub Actions CI
├── docker-compose.yml                ← Dev environment
├── turbo.json                        ← Turborepo build pipeline
├── pnpm-workspace.yaml               ← pnpm workspace config
└── package.json
```

### Tooling

| Tool        | Role                                      |
|-------------|-------------------------------------------|
| pnpm        | Package manager with workspaces           |
| Turborepo   | Monorepo build/task orchestration + cache |
| Docker      | Dev environment via docker-compose        |
| GitHub Actions | CI on every push and PR              |

---

## Backend Folder Structure (`apps/backend/`)

```
backend/                              ← Laravel 11
│
├── app/
│   ├── Enums/
│   │   └── EventStatus.php           ← Enum: event status values
│   │
│   ├── Exceptions/
│   │   └── ApiException.php          ← Custom API exception
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── api/
│   │   │       ├── AuthController.php
│   │   │       ├── admin/
│   │   │       │   ├── AdminEventController.php
│   │   │       │   ├── CategoryController.php
│   │   │       │   └── DashboardController.php
│   │   │       ├── attendee/
│   │   │       │   ├── EventController.php
│   │   │       │   └── ReviewController.php
│   │   │       └── organizer/
│   │   │           └── EventController.php
│   │   │
│   │   ├── Middleware/
│   │   │   └── RoleMiddleware.php    ← Role-based access (admin/organizer/attendee)
│   │   │
│   │   ├── Requests/                 ← Form Request validation
│   │   │   ├── Auth/
│   │   │   ├── Category/
│   │   │   ├── Dashboard/
│   │   │   └── Event/
│   │   │
│   │   └── Resources/               ← API response transformation
│   │       ├── Base/
│   │       ├── Category/
│   │       ├── Dashboard/
│   │       ├── Event/
│   │       ├── Registration/
│   │       └── Review/
│   │
│   ├── Mail/                         ← Mailable classes (Brevo/SMTP)
│   │   ├── EventCancelledMail.php
│   │   ├── EventPromotedMail.php
│   │   ├── EventRegisterMail.php
│   │   ├── EventRejectionMail.php
│   │   └── VerificationMail.php
│   │
│   ├── Models/
│   │   ├── User.php
│   │   ├── Event.php
│   │   ├── Category.php
│   │   ├── Registration.php
│   │   └── Review.php
│   │
│   ├── Repositories/                 ← Repository Pattern
│   │   ├── Interfaces/               ← Contracts
│   │   │   ├── BaseRepositoryInterface.php
│   │   │   ├── CategoryRepositoryInterface.php
│   │   │   ├── DashboardRepositoryInterface.php
│   │   │   ├── EventRepositoryInterface.php
│   │   │   ├── RegistrationRepositoryInterface.php
│   │   │   ├── ReviewRepositoryInterface.php
│   │   │   └── UserRepositoryInterface.php
│   │   └── Eloquent/                 ← Implementations
│   │       ├── BaseRepository.php
│   │       ├── CategoryRepository.php
│   │       ├── DashboardRepository.php
│   │       ├── EventRepository.php
│   │       ├── RegistrationRepository.php
│   │       ├── ReviewRepository.php
│   │       └── UserRepository.php
│   │
│   ├── Services/                     ← Business logic layer
│   │   ├── BaseService.php
│   │   ├── AuthService.php
│   │   ├── CategoryService.php
│   │   ├── DashboardService.php
│   │   ├── EventService.php
│   │   ├── RegistrationService.php
│   │   └── ReviewService.php
│   │
│   ├── Traits/
│   │   └── ApiResponse.php           ← Standardised JSON response helper
│   │
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── RepositoryServiceProvider.php  ← Binds interfaces → implementations
│
├── database/
│   ├── migrations/                   ← Schema version history
│   ├── seeders/                      ← Seed data (User, Event, Category, Registration)
│   └── factories/
│
├── routes/
│   ├── api.php                       ← All API routes
│   ├── web.php
│   └── console.php
│
├── config/                           ← Laravel config files
│   ├── auth.php, jwt.php             ← JWT auth
│   ├── mail.php                      ← Brevo mailer
│   ├── queue.php                     ← Queue (for async email)
│   └── cors.php, services.php, ...
│
├── tests/                            ← PHPUnit tests
├── Dockerfile
└── docker/
```

### Backend Architecture Layers

```
Request
   │
   ▼
Middleware (RoleMiddleware)
   │
   ▼
Controller  (thin — validates input, calls Service)
   │
   ▼
Service     (business logic)
   │
   ▼
Repository  (data access via Interface)
   │
   ▼
Eloquent Model → Database
```

### Database Models

```
User ──┬── Registration ── Event ──┬── Category
       │                           ├── Review
       └── Review                  └── Registration
```
