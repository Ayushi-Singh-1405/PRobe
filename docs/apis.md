# APIs Used

## GitHub REST API v3

Used to fetch Pull Request data for review.

### Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /repos/{owner}/{repo}/pulls/{number}` | Fetch PR metadata (title, body, author, stats) |
| `GET /repos/{owner}/{repo}/pulls/{number}/files` | Fetch changed files list and diffs |

### Authentication

- Public repos: no auth needed
- Private repos: optional `GITHUB_TOKEN` (user-specific or global default)
- Token stored per-user via `PUT /api/user/github-token`

### Rate Limits

- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour

## OpenRouter API (AI Gateway)

Used as the gateway to access Claude models for code review.

### Endpoint

`POST https://openrouter.ai/api/v1/chat/completions`

### Model

`qwen/qwen3-coder:free`

### Authentication

`Authorization: Bearer <OPENROUTER_API_KEY>` (server-side env var)

### Request Format

Standard OpenAI-compatible chat completions format:

```json
{
  "model": "qwen/qwen3-coder:free",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "max_tokens": 4096,
  "temperature": 0.2
}
```

### Response Parsing

The model is instructed to respond with pure JSON only. The server strips markdown code fences and parses the result:

```json
{
  "summary": "...",
  "overallScore": 1-10,
  "issues": [...],
  "positives": [...],
  "metrics": { ... }
}
```

### Rate Limit Handling

- 429 errors trigger automatic retry (up to 3 attempts, 30s delay)

## Environment Variables

| Variable | API | Source |
|---|---|---|
| `OPENROUTER_API_KEY` | OpenRouter | `.env` |
| `GITHUB_TOKEN` | GitHub API | Optional, `.env` |
| `JWT_SECRET` | Internal auth | `.env` |
| `DATABASE_URL` | PostgreSQL | `.env` |
