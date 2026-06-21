# Session Summary

## Project: PRobe — AI-powered GitHub PR Review Tool

Full-stack monorepo at `probe-ai/` with React + Vite frontend and Node.js + Express backend.

---

## What Was Built

### Backend (`server/`)

| File | Purpose |
|---|---|
| `src/index.js` | Express server on port 5000, CORS, health check, mounts all routes |
| `src/lib/prisma.js` | Singleton PrismaClient export |
| `prisma/schema.prisma` | User and Review models (PostgreSQL) |
| `src/middleware/authMiddleware.js` | JWT Bearer token verification, attaches `req.user` |
| `src/routes/auth.js` | POST `/register`, POST `/login`, GET `/me` |
| `src/routes/review.js` | POST `/analyze`, GET `/history`, GET `/:id`, DELETE `/:id` |
| `src/routes/user.js` | PUT `/github-token`, GET `/stats` |
| `src/services/githubService.js` | `parsePRUrl()`, `fetchPRData()` — fetches PR metadata, diff, files from GitHub API |
| `src/services/claudeService.js` | `analyzeCode()` — sends PR data to Gemini AI (`gemini-1.5-flash`) for structured code review |

### Frontend (`client/`)

**Config:** Vite + React 18 + Tailwind CSS (dark mode: class), dev proxy `/api` -> `localhost:5000`, favicon as magnifying glass emoji

**Context:**
- `AuthContext.jsx` — user state, login/register/logout, session restore from localStorage
- `ToastContext.jsx` — bottom-right toast notifications, auto-dismiss 3s, types: success/error/info

**Services:**
- `api.js` — Axios instance with `VITE_API_URL` base, auth interceptor, 401 redirect

**Components:**
- `ProtectedRoute.jsx` — redirects to /login if unauthenticated, spinner while loading
- `LoadingSpinner.jsx` — animated spinner with optional message
- `SeverityBadge.jsx` — red/yellow/green pill badges for CRITICAL/WARNING/SUGGESTION
- `IssueCard.jsx` — collapsible card with left border color, shows category, title, file, expanded description + suggestion
- `ReviewOutput.jsx` — PR metadata bar, score card (green/yellow/red), issue counts row, empty state ("No issues found"), issues list sorted by severity, positives section
- `Navbar.jsx` — sticky top nav with logo, auth links, username display

**Pages:**
- `Landing.jsx` — hero with PR URL input, features cards, CTA to register
- `Login.jsx` — email + password form, error handling, redirect if already logged in
- `Register.jsx` — email + username + password form
- `Dashboard.jsx` — two-column layout, sidebar with stats + history list + delete, main area with PR input + analyze + multi-step progress + ReviewOutput, mobile hamburger drawer
- `ReviewDetail.jsx` — full page review view with fetch by ID, back/delete buttons, error/not-found states

### Deployment

- `client/vercel.json` — SPA rewrites
- `server/package.json` — `build` and `start` scripts for Render
- `README.md` — full setup guide with env vars table and deployment steps
- Migration files created in `prisma/migrations/`

### Git

37 commits pushed to `origin/main`, each file committed individually in logical order.

---

## Where We Left Off

All core features are implemented and building cleanly. The app is ready for:

### Remaining / Next Steps

1. **Live testing** — deploy frontend to Vercel and backend to Render, test end-to-end
2. **Private repo support** — the `githubToken` input and `PUT /api/user/github-token` route exist but need testing
3. **Bonus features** from the original spec:
   - GitHub OAuth login
   - Export review as PDF
   - Share review via public link (no login required)
   - Side-by-side diff view with inline issue markers
   - Team mode: invite teammates to share review history
4. **Add `hooks/` directory** — currently empty, `useReview.js` was planned in the original docs
5. **Polish** — loading skeletons, animations, keyboard shortcuts

### Key Env Vars Needed

| Variable | Where |
|---|---|
| `DATABASE_URL` | server/.env |
| `JWT_SECRET` | server/.env |
| `GEMINI_API_KEY` | server/.env |
| `CLIENT_URL` | server/.env |
| `VITE_API_URL` | client/.env |

### Quick Start

```bash
# server
cd probe-ai/server
cp .env.example .env   # fill in values
npm install
npx prisma migrate dev --name init
npm run dev

# client
cd probe-ai/client
cp .env.example .env
npm install
npm run dev
```
