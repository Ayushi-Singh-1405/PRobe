# Project Structure

```
probe-ai/
├── client/                       # React frontend (Vite)
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── IssueCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReviewOutput.jsx
│   │   │   └── SeverityBadge.jsx
│   │   ├── context/              # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/                # Custom hooks (reserved)
│   │   ├── pages/                # Route pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ReviewDetail.jsx
│   │   ├── services/             # API client
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json               # SPA rewrites for Vercel
│   └── vite.config.js
├── server/                       # Express backend
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma         # User & Review models (PostgreSQL)
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.js         # Singleton PrismaClient
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT Bearer verification
│   │   ├── routes/
│   │   │   ├── auth.js           # POST /register, POST /login, GET /me
│   │   │   ├── review.js         # POST /analyze, GET /history, GET /:id, DELETE /:id
│   │   │   └── user.js           # PUT /github-token, GET /stats
│   │   ├── services/
│   │   │   ├── claudeService.js  # AI-powered code review via OpenRouter/Claude
│   │   │   └── githubService.js  # GitHub REST API integration
│   │   └── index.js              # Express entry point (port 5000)
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
├── docs/                         # Project documentation
│   ├── apis.md
│   ├── architecture.md
│   ├── deployment.md
│   ├── structure.md
│   ├── summary.md
│   └── workflow.md
└── README.md
```
