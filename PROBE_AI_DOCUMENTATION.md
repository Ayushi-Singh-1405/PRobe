# PRobe — Full Project Documentation
### Hackathon Build Guide for OpenCode

---

## 📌 Project Overview

**PRobe** is a full-stack web application that allows developers to paste any GitHub Pull Request URL and receive an instant, structured AI-powered code review. It identifies bugs, security vulnerabilities, performance issues, and style improvements — and maintains a per-user history of all PR reviews via a database.

**Target Users:** Developers, open source contributors, bootcamp students, engineering teams.
**Impact:** Useful to millions of developers globally who submit or review PRs daily.

---

## 🎯 Core Features

1. **PR Review Engine** — Paste a GitHub PR URL → get AI review in seconds
2. **Diff Viewer** — See changed files with syntax-highlighted diffs
3. **Severity Badges** — Issues tagged as 🔴 Critical / 🟡 Warning / 🟢 Suggestion
4. **User Authentication** — Sign up / Login (JWT-based)
5. **Review History** — Each user's past PR queries saved to DB with timestamps
6. **Dashboard** — Overview of past reviews, stats (total reviews, issues found, etc.)
7. **Private Repo Support** — Optional: user pastes their GitHub token for private repos

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Prisma ORM |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| GitHub Data | GitHub REST API v3 (public, no auth needed for public repos) |
| Deployment | Vercel (frontend) + Render (backend + DB) |

---

## 📁 Full Project Structure

```
probe-ai/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PRInput.jsx           # URL input form
│   │   │   ├── ReviewCard.jsx        # Single issue card
│   │   │   ├── DiffViewer.jsx        # Syntax highlighted diff
│   │   │   ├── SeverityBadge.jsx     # 🔴🟡🟢 badges
│   │   │   ├── HistoryList.jsx       # Sidebar with past reviews
│   │   │   ├── StatsBar.jsx          # Dashboard stats
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Home / hero page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx         # Main app page
│   │   │   └── ReviewDetail.jsx      # Full review for one PR
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state
│   │   ├── hooks/
│   │   │   └── useReview.js          # Custom hook for review logic
│   │   ├── services/
│   │   │   └── api.js                # Axios instance + all API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── prisma/
│   │   └── schema.prisma            # DB schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js              # /api/auth/*
│   │   │   ├── github.js            # /api/github/*
│   │   │   ├── review.js            # /api/review/*
│   │   │   └── user.js              # /api/user/*
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification
│   │   ├── services/
│   │   │   ├── githubService.js     # GitHub API calls
│   │   │   └── claudeService.js     # Claude AI calls
│   │   └── index.js                 # Express app entry
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  githubToken   String?
  createdAt     DateTime  @default(now())
  reviews       Review[]
}

model Review {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  prUrl           String
  prTitle         String
  repoName        String
  prNumber        Int
  authorLogin     String
  filesChanged    Int
  additions       Int
  deletions       Int
  reviewData      Json
  issueCount      Int
  criticalCount   Int
  warningCount    Int
  suggestionCount Int
  createdAt       DateTime @default(now())

  @@index([userId])
}
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, username, password }` | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | Login, returns JWT |
| GET | `/api/auth/me` | — (JWT header) | Get current user info |

### Review Routes — `/api/review`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/review/analyze` | `{ prUrl, githubToken? }` | Fetch PR + run AI review |
| GET | `/api/review/history` | — (JWT header) | Get all reviews for logged-in user |
| GET | `/api/review/:id` | — (JWT header) | Get single review by ID |
| DELETE | `/api/review/:id` | — (JWT header) | Delete a review from history |

### User Routes — `/api/user`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| PUT | `/api/user/github-token` | `{ githubToken }` | Save user's GitHub PAT |
| GET | `/api/user/stats` | — (JWT header) | Get user stats |

---

## 🔧 Environment Variables

### Server `.env`
```env
DATABASE_URL=postgresql://user:password@host:5432/probe
JWT_SECRET=your_super_secret_jwt_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GITHUB_TOKEN=your_optional_default_github_token
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## 🤖 Claude AI Prompt (Core Logic)

```javascript
const systemPrompt = `You are an expert senior software engineer conducting a thorough code review.
Analyze GitHub PR diffs and respond ONLY with a valid JSON object — no markdown, no backticks, no extra text.

JSON format:
{
  "summary": "2-3 sentence overall assessment",
  "overallScore": <1-10>,
  "issues": [
    {
      "id": "unique string",
      "severity": "critical|warning|suggestion",
      "category": "bug|security|performance|style|logic|documentation",
      "file": "filename",
      "line": <number or null>,
      "title": "short title",
      "description": "detailed explanation",
      "suggestion": "how to fix"
    }
  ],
  "positives": ["positive 1", "positive 2"],
  "metrics": { "bugCount": 0, "securityCount": 0, "performanceCount": 0, "styleCount": 0 }
}`;

const userPrompt = (prData) => `
Review this Pull Request:

Title: ${prData.title}
Description: ${prData.body || 'No description provided'}
Author: ${prData.user.login}
Files Changed: ${prData.changedFiles}
Additions: +${prData.additions} | Deletions: -${prData.deletions}

--- DIFF ---
${prData.diff}
--- END DIFF ---

Provide a thorough code review following the JSON format specified.`;
```

---

## 🐙 GitHub API Integration

```javascript
// Parse PR URL: https://github.com/owner/repo/pull/123
function parsePRUrl(url) {
  const regex = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid GitHub PR URL');
  return { owner: match[1], repo: match[2], prNumber: match[3] };
}

// Endpoints to call:
// GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}
// GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number} (with Accept: application/vnd.github.v3.diff)
// GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/files
```

**Rate Limits:**
- Unauthenticated: 60 req/hour
- Authenticated (token): 5000 req/hour
- Always pass `Authorization: Bearer <token>` when available
- Truncate diff to 12,000 characters to fit Claude context window

---

## 🎨 UI Design Direction

### Visual Identity
- **Theme:** Dark mode first — deep navy/charcoal (`#0D1117`)
- **Accent:** Electric indigo/violet (`#6C63FF`) for CTAs and highlights
- **Critical:** Rose red (`#EF4444`)
- **Warning:** Amber (`#F59E0B`)
- **Success/Suggestion:** Emerald green (`#10B981`)
- **Font:** `JetBrains Mono` for code/diffs, `Inter` for UI text
- **Feel:** Premium developer tool — clean, dense, information-rich

### Key UI Screens

**1. Landing Page**
- Hero: "PRobe" + tagline "Probe every line. Ship with confidence."
- PR URL input right on the hero
- Features section: 3 cards (Instant AI Review, Security Scanner, Review History)
- CTA to sign up

**2. Auth Pages (Login / Register)**
- Minimal centered card
- Email + password fields

**3. Dashboard (Main App)**
- Left sidebar: review history list (repo, PR#, issue count badge, date)
- Center: PR URL input + review output area
- Stats bar at top of sidebar (total reviews, total issues)

**4. Review Output**
- PR metadata bar (title, author, files changed, +/- lines)
- Overall score card (color-coded 1–10)
- Issues list grouped by severity: Critical → Warning → Suggestion
- Each issue: expandable card with file, description, fix suggestion
- Positives section at bottom

**5. Review Detail Page**
- Full page view of a saved review
- Back button to dashboard
- Delete review button

---

## ✅ Build Checklist

- [ ] Scaffold created (client + server)
- [ ] Prisma schema + migration done
- [ ] Auth endpoints working (register/login/me)
- [ ] GitHub service fetching PR data
- [ ] Claude service returning structured review
- [ ] Review endpoints working + saving to DB
- [ ] Auth context + protected routes in frontend
- [ ] Landing, Login, Register pages done
- [ ] Dashboard with PR input + review output
- [ ] History sidebar working
- [ ] Review detail page working
- [ ] Loading + error states polished
- [ ] Mobile responsive
- [ ] Deployed to Vercel + Render
- [ ] README complete with live link

---

## 🧪 Test PRs to Demo

- `https://github.com/facebook/react/pull/31223`
- `https://github.com/vercel/next.js/pull/72300`
- `https://github.com/expressjs/express/pull/5944`
- Any of your own public GitHub PRs

---

## 💡 Bonus Features (if time allows)

- GitHub OAuth login
- Export review as PDF
- Share review via public link (no login required to view)
- Side-by-side diff view with inline issue markers
- Team mode: invite teammates to share review history

---

*PRobe — Hackathon Submission | Deadline: Sunday 21st June, 11:59 PM*
