# Git Workflow

## Branch Structure

```
main
│
│  (merged via PR when develop is stable)
│
develop  ◄──────────────────────────────────────────────────┐
│                                                            │
│  (each feature opens a PR into develop)                   │
│                                                            │
├── feature/EV-7-login                                       │
├── feature/EV-8-emailValidation                             │
├── feature/EV-10-adminCategoryManagement                    │
├── feature/EV-11-createEvent                                │
├── feature/EV-12-editAndCancelEvent                         │
├── feature/EV-14-eventStatusManagement  ───── PR ──────────┤
├── feature/EV-15-approveAndRejectEvents                     │
├── feature/EV-16-browserPublicEvents                        │
├── feature/EV-18-eventDetails                               │
├── feature/EV-19-eventRegistration                          │
├── feature/EV-20-duplicateRegistrationPrevention            │
├── feature/EV-22-dashboardAttendee                          │
├── feature/EV-23-reviewEvent                                │
└── feature/EV-41-loginWithGoogle                            │
```

## Flow Step-by-step

```
1. Create feature branch from develop
   develop ──► git checkout -b feature/EV-XX-featureName

2. Develop & commit on feature branch
   feature/EV-XX  ──► feat: add new feature
                  ──► fix: fix bug
                  ──► refactor: clean up code

3. Open Pull Request: feature/EV-XX ──► develop

4. Review & merge PR into develop

5. When develop is stable, merge into main (production)
   develop ──► main
```

## Branch Naming Convention

```
feature/EV-{ticket-id}-{feature-name}

Examples:
  feature/EV-23-reviewEvent
  feature/EV-19-eventRegistration
  feature/EV-41-loginWithGoogle
```

## Commit Message Convention (Conventional Commits)

| Prefix       | When to use                          |
|--------------|--------------------------------------|
| `feat:`      | New feature                          |
| `fix:`       | Bug fix                              |
| `refactor:`  | Code restructure, no behavior change |
| `wip:`       | Work in progress (not ready yet)     |
| `update:`    | General update/improvement           |

## CI/CD

- GitHub Actions runs on every **push** and every **PR**
- Checks: PHP 8.4, `composer install`, automated tests
- Config: `.github/workflows/ci.yml`
