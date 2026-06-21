# Deployment

## Frontend — Vercel

**Live URL:** [https://p-robe.vercel.app](https://p-robe.vercel.app)

### Setup

1. Connect GitHub repository to Vercel
2. Set **Root Directory** to `client/`
3. Vercel auto-detects Vite configuration
4. SPA rewrites handled by `client/vercel.json`

### Environment Variables

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<render-backend-url>` |

### Build Output

Vite outputs to `client/dist/`, Vercel serves it automatically.

## Backend — Render

### Setup

1. Create a new **Web Service** in Render dashboard
2. Point at the GitHub repository
3. Set **Root Directory** to `server/`

### Commands

| Setting | Value |
|---|---|
| **Build Command** | `npm install && npx prisma generate && npx prisma migrate deploy` |
| **Start Command** | `npm start` |

### Environment Variables

| Variable | Value |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon/Railway) |
| `JWT_SECRET` | Random secure string |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `CLIENT_URL` | `https://p-robe.vercel.app` |
| `NODE_ENV` | `production` |

## Database — Neon/Railway

PostgreSQL can be hosted on any provider:
- **Neon** (serverless, free tier available)
- **Railway** (managed PostgreSQL)
- **AWS RDS** / **Supabase**

## CI/CD

Both Vercel and Render automatically deploy on push to the `main` branch (default behavior).
