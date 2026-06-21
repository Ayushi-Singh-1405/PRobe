# Workflow

## User Flow

```
1. User visits Landing page
       │
       ▼
2. User registers or logs in
       │
       ▼
3. User pastes a GitHub PR URL
       │
       ▼
4. Backend validates URL, fetches PR data from GitHub API
       │
       ▼
5. Backend sends PR diff + metadata to Claude (via OpenRouter)
       │
       ▼
6. Claude returns structured JSON review
       │
       ▼
7. Review is saved to PostgreSQL, returned to frontend
       │
       ▼
8. User sees score, issues list, positives, metrics
```

## PR Analysis Flow (Detailed)

```
Client                          Server                          GitHub API         Claude/OpenRouter
  │                               │                               │                     │
  │  POST /api/analyze            │                               │                     │
  │  { prUrl }                    │                               │                     │
  │──────────────────────────────▶│                               │                     │
  │                               │                               │                     │
  │                               │  Parse PR URL                 │                     │
  │                               │  (owner/repo/pull/number)     │                     │
  │                               │                               │                     │
  │                               │  GET /repos/{owner}/{repo}/pulls/{number}           │
  │                               │──────────────────────────────▶│                     │
  │                               │◀──────────────────────────────│                     │
  │                               │     PR metadata               │                     │
  │                               │                               │                     │
  │                               │  GET /repos/{owner}/{repo}/pulls/{number}/files     │
  │                               │──────────────────────────────▶│                     │
  │                               │◀──────────────────────────────│                     │
  │                               │     File list + diffs         │                     │
  │                               │                               │                     │
  │                               │  POST /v1/chat/completions    │                     │
  │                               │───────────────────────────────────────────────────▶│
  │                               │◀───────────────────────────────────────────────────│
  │                               │     Structured JSON review    │                     │
  │                               │                               │                     │
  │                               │  Save to PostgreSQL           │                     │
  │                               │                               │                     │
  │◀──────────────────────────────│                               │                     │
  │  { review result }           │                               │                     │
```

## Auth Flow

```
Registration:
  1. Client sends email + username + password
  2. Server hashes password with bcrypt
  3. Server creates User in PostgreSQL
  4. Server returns JWT token + user data
  5. Client stores token in localStorage

Login:
  1. Client sends email + password
  2. Server compares bcrypt hash
  3. Server returns JWT token + user data
  4. Client stores token in localStorage

Authenticated Request:
  1. Client attaches `Authorization: Bearer <token>` header
  2. Auth middleware verifies JWT signature
  3. Middleware attaches `req.user` with decoded payload
  4. Route handler uses `req.user.id` for DB queries
```

## Retry Logic (429 Rate Limiting)

The `claudeService.js` implements automatic retry when the AI API returns a 429 (Too Many Requests) status:

- Up to **3 retry attempts**
- **30-second delay** between retries
- If all retries are exhausted, the error propagates to the caller
