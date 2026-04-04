# NexusAI — Architecture

## Overview
NexusAI is a full-stack AI Model Hub platform. Users can discover, compare, and chat with 400+ AI models from a single interface. Guest users get a 3-hour session; authenticated users get permanent history and a full dashboard.

## System Diagram

```
Browser
  │
  ├── Next.js 16 (frontend-app, port 3001)
  │     ├── App Router pages
  │     ├── Redux RTK Query → HTTP → backend-app
  │     └── Guest sessions in localStorage
  │
  └── NestJS 11 (backend-app, port 3000)
        ├── Auth module (JWT in-memory)
        ├── Chat module (Kimi API / mock fallback)
        ├── Models module (mock + MongoDB)
        └── Upload / Forms / Dashboard
              │
              └── MongoDB (optional for dev — mock-db.ts in-memory by default)
```

## Frontend Architecture

### Page Layout
```
Navbar (sticky rounded pill)
├── / (Landing)              → animated hero, 14 action cards, 7 content sections
├── /chat (Chat Hub)         → 3-column: models sidebar | chat | right panel
├── /marketplace             → filter grid: 420 models, sidebar filters
├── /discover                → trending, new releases, providers, prompts
├── /agents                  → pre-built agent launcher cards
├── /auth/login              → login form → Redux authSlice
├── /auth/signup             → signup form → Redux authSlice
└── /dashboard/*             → ProtectedRoute → stats, history, settings, billing
```

### State Management
- **Redux Toolkit** for auth, chat, agents, UI state
- **RTK Query** for all API calls (auto cache, optimistic updates)
- **Guest session** in localStorage with 3h TTL (no Redux)

### Design System
- MUI 7 with custom theme (`lib/theme/theme.ts`)
- Color tokens: Primary `#C8622A`, Background `#F7F3EC`
- Animated floating orbs in homepage background (CSS keyframes)
- Framer Motion for card hover lift + staggered entrance animations
- LordIcon animated icons (Lottie-based, CDN hosted)
- Glass-morphism navbar: `backdrop-filter: blur(20px)`

## Backend Architecture

### Module Boundaries
```
AppModule
├── AuthModule     → /api/auth/*
├── UsersModule    → internal (no public routes)
├── ChatModule     → /api/chat/*
├── ModelsModule   → /api/models/*
├── UploadModule   → /api/upload/*
├── DashboardModule→ /api/dashboard/*
└── FormsModule    → /api/forms/*
```

### Auth Flow
1. `POST /api/auth/signup` → stores user in `authStore`, returns `{ accessToken, refreshToken, user }`
2. Frontend stores tokens in Redux + cookies
3. Protected routes: `Authorization: Bearer <accessToken>` header
4. `GET /api/auth/me` validates token via `getUserByAccessToken()`
5. Token refresh: `POST /api/auth/refresh` with refreshToken

### Chat Flow (Guest)
1. Frontend creates a guest session via `createGuestSessionState()` in localStorage
2. Chat messages stored locally for 3 hours
3. `guestSessionId` sent as header to backend for AI replies
4. On login: `POST /api/chat/import` migrates local sessions to user account

### Chat Flow (Auth)
1. `POST /api/chat/session` creates server session
2. `POST /api/chat/send` sends message → calls Kimi API → returns reply
3. `GET /api/chat/history` returns user's sessions
4. Model ID in payload determines which model context is used

### AI Provider
- **Kimi API** (Moonshot) is the primary provider
- Set `KIMI_API_KEY` + `KIMI_API_BASE_URL` in `.env`
- Without API key: `buildMockAssistantReply()` in `mock-db.ts` generates realistic mock responses
- Model switching: `modelId` in chat payload selects context/pricing/system prompt

## Data Models

### User
```typescript
{ id, name, email, password, plan: 'free'|'pro'|'enterprise', createdAt }
```

### ChatSession
```typescript
{ id, userId?, guestSessionId?, modelId, title, messages[], usage, createdAt }
```

### Message
```typescript
{ id, role: 'user'|'assistant'|'system', content, modelId, timestamp, attachments? }
```

### Model (47 real + 420 generated)
```typescript
{ id, name, provider, contextWindow, priceInput, priceOutput, rating, tags, capabilities, category }
```

## Work Order
design → component structure → data contract → implementation → QA review

## Dev Setup
```bash
# Terminal 1 — Backend
cd backend-app && npm install && npm run start:dev

# Terminal 2 — Frontend  
cd frontend-app && npm install && npm run dev

# Open
# App:     http://localhost:3001
# API:     http://localhost:3000/api
# Swagger: http://localhost:3000/docs
```
