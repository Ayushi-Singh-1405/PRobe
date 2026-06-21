# Architecture

## Overview

PRobe follows a **client-server architecture** with a React single-page application (SPA) frontend and a Node.js/Express REST API backend. Communication happens over HTTP/JSON.

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Browser   │────▶│  Vite/React  │────▶│  Express API  │
│  (Vercel)   │◀────│   (Client)   │◀────│   (Render)    │
└─────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
                    ┌─────────────────────────────┼─────────────┐
                    │                             │             │
                    ▼                             ▼             ▼
            ┌──────────────┐           ┌───────────────┐   ┌────────┐
            │  PostgreSQL  │           │  GitHub REST  │   │Claude  │
            │  (Neon/Railway)│         │    API v3     │   │via     │
            └──────────────┘           └───────────────┘   │OpenRouter│
                                                           └────────┘
```

## Frontend Architecture

- **React 18** with functional components and hooks
- **Vite** as build tool (fast HMR, optimized production builds)
- **Tailwind CSS** for styling (dark mode via class strategy)
- **React Router v6** for client-side routing
- **Axios** instance with request/response interceptors for JWT auth
- **Context API** for global state (AuthContext, ToastContext)

### Route Design

| Route          | Component      | Auth Required |
|----------------|----------------|---------------|
| `/`            | Landing        | No            |
| `/login`       | Login          | No            |
| `/register`    | Register       | No            |
| `/dashboard`   | Dashboard      | Yes           |
| `/review/:id`  | ReviewDetail   | Yes           |

## Backend Architecture

- **Node.js + Express.js** REST API on port 5000
- **JWT** authentication with bcrypt password hashing
- **Prisma ORM** for PostgreSQL database access
- **Middleware-based** architecture (auth, CORS, JSON parsing)

### API Endpoints

| Method | Path              | Auth | Description              |
|--------|-------------------|------|--------------------------|
| POST   | /api/register     | No   | Create a new user        |
| POST   | /api/login        | No   | Login, returns JWT       |
| GET    | /api/me           | Yes  | Get current user profile |
| POST   | /api/analyze      | Yes  | Analyze a PR URL         |
| GET    | /api/history      | Yes  | List user's reviews      |
| GET    | /api/review/:id   | Yes  | Get single review detail |
| DELETE | /api/review/:id   | Yes  | Delete a review          |
| PUT    | /api/user/github-token | Yes | Save user's GitHub token |
| GET    | /api/user/stats   | Yes  | Get user statistics      |
| GET    | /api/health       | No   | Health check             |

## Database Schema

### User
- `id` (UUID, PK)
- `email` (unique)
- `username`
- `password` (bcrypt hashed)
- `githubToken` (optional, encrypted)
- `createdAt`

### Review
- `id` (UUID, PK)
- `userId` (FK → User)
- `prUrl`
- `title`
- `body`
- `author`
- `changedFiles`
- `additions`
- `deletions`
- `result` (JSON — full AI review output)
- `createdAt`
