# PRobe

**Probe every line. Ship with confidence.**

PRobe is a full-stack web application that lets developers paste any GitHub Pull Request URL and receive an instant, structured AI-powered code review. It identifies bugs, security vulnerabilities, performance issues, and style improvements — and maintains a per-user history of all PR reviews.

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Frontend     | React 18 + Vite + Tailwind CSS                |
| Backend      | Node.js + Express.js                          |
| Database     | PostgreSQL + Prisma ORM                       |
| Auth         | JWT + bcrypt                                  |
| AI           | Anthropic Claude API (claude-sonnet-4-6)      |
| GitHub       | GitHub REST API v3                            |

## Project Structure

```
probe-ai/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # Auth & Toast contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # API client
│   ├── vercel.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # Auth, Review, User routes
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── services/        # GitHub & Claude integrations
│   │   └── lib/             # Prisma client singleton
│   └── prisma/
│       └── schema.prisma
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- Anthropic API key

### 1. Clone and install

```bash
git clone <repo-url>
cd probe-ai

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment variables

**server/.env**

| Variable           | Description                          |
| ------------------ | ------------------------------------ |
| `DATABASE_URL`     | PostgreSQL connection string         |
| `JWT_SECRET`       | Secret key for JWT signing           |
| `ANTHROPIC_API_KEY`| Claude API key                       |
| `GITHUB_TOKEN`     | (Optional) Default GitHub token      |
| `PORT`             | Server port (default: 5000)          |
| `CLIENT_URL`       | Frontend URL (default: localhost:5173)|

**client/.env**

| Variable         | Description               |
| ---------------- | ------------------------- |
| `VITE_API_URL`   | Backend URL               |

### 3. Database setup

```bash
cd server
npx prisma migrate dev --name init
```

### 4. Run locally

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Client runs on `http://localhost:5173`, server on `http://localhost:5000`.

## Deployment

### Frontend — Vercel

1. Push the `client/` folder as a Vercel project (or set root directory to `client`)
2. Add environment variable: `VITE_API_URL=<your-render-backend-url>`
3. Deploy — Vercel auto-detects Vite and uses `dist/` output

### Backend — Render

1. Create a new Web Service, point at the `server/` directory
2. **Build Command:**
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
3. **Start Command:**
   ```bash
   npm start
   ```
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ANTHROPIC_API_KEY`
   - `CLIENT_URL` (your Vercel frontend URL)
   - `NODE_ENV=production`

## Live Demo

<!-- Add your live demo link here once deployed -->

---

Built for OpenCode Hackathon — June 2026
