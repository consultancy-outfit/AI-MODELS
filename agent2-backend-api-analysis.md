# Backend API Analysis — NexusAI Backend App

> Generated: 2026-04-04 | Analyzer: QA Automation Agent (Claude Sonnet 4.6)

---

## Section 1: Backend Architecture Overview

### Tech Stack

| Component | Technology | Version / Notes |
|---|---|---|
| Framework | NestJS | v11 |
| Language | TypeScript | v5 |
| ODM / DB | Mongoose + MongoDB | v9; in-memory mock store for dev |
| Auth | Custom JWT (HMAC-SHA256) | No passport or jwt library — hand-rolled |
| API Documentation | Swagger / OpenAPI | UI at `/docs`, JSON at `/docs-json` |
| HTTP Client | Axios | Used for ML team proxy calls |
| Validation | class-validator + NestJS ValidationPipe | whitelist: true, forbidNonWhitelisted: true |
| Config | @nestjs/config + validateEnvironment | All env vars validated at startup |

### Module Structure

```
AppModule
├── AuthModule       — signup, login, refresh, me, sessions, verify, logout, forgot-password
├── UsersModule      — internal user lookup (no public controller)
├── ModelsModule     — model catalog (public, paginated, home-feed)
├── ChatModule       — sessions, messages, history, delete, import guest
├── UploadModule     — file/image upload (mock + ML proxy)
├── DashboardModule  — overview, history, settings, billing (all protected)
└── FormsModule      — contact form, feedback form (both public)
```

### Auth Mechanism

- **Access Token**: Custom HS256 JWT, 15-minute TTL, signed with `JWT_ACCESS_TOKEN_SECRET`
- **Refresh Token**: Custom HS256 JWT, 30-day TTL, signed with `JWT_REFRESH_TOKEN_SECRET`, stored in `httpOnly` cookie (`refreshToken`)
- **Verification Token**: Custom HS256 JWT, 24-hour TTL, signed with `JWT_VERIFICATION_TOKEN_SECRET`
- **Global Guard**: `AccessTokenGuard` applied to ALL routes via `APP_GUARD`
- **Public Routes**: Decorated with `@Public()` — guard still attaches user if token present (optional auth)
- **Refresh Route**: Protected by `RefreshTokenGuard` (reads cookie, verifies refresh token type)
- **Token Storage**: In-memory `mockDb.authSessions` array (dev); Mongoose persistence layer called for sync

### Data Storage (Dev Mode)

- All data lives in `src/apps/store/mock-db.ts` in-memory arrays
- Seed user: `demo@nexusai.app` / `password123` (plan: `pro`)
- 8 seeded AI models; `mock-models.ts` provides 47 models for catalog
- Guest sessions identified by `guestSessionId` header/body param or `nexusai_guest_expires` cookie presence

### Swagger / Base URL

| Item | Value |
|---|---|
| API Base Prefix | `/api` |
| Swagger UI | `http://localhost:3000/docs` |
| OpenAPI JSON | `http://localhost:3000/docs-json` |
| Default Port | `3000` |

---

## Section 2: Complete API Endpoint Inventory

| # | Method | Endpoint | Controller | Auth Required | Public Decorator | Description |
|---|---|---|---|---|---|---|
| 1 | POST | `/api/auth/signup` | AuthController | No | `@Public()` | Register new user; sets `refreshToken` cookie |
| 2 | POST | `/api/auth/login` | AuthController | No | `@Public()` | Authenticate user; sets `refreshToken` cookie |
| 3 | POST | `/api/auth/refresh` | AuthController | RefreshTokenGuard (cookie) | `@Public()` + `@UseGuards(RefreshTokenGuard)` | Rotate access + refresh tokens |
| 4 | GET | `/api/auth/me` | AuthController | Yes (Bearer) | — | Return current authenticated user profile |
| 5 | GET | `/api/auth/sessions` | AuthController | Yes (Bearer) | — | List active sessions for the current user |
| 6 | POST | `/api/auth/verification-token` | AuthController | Yes (Bearer) | — | Issue a 24-hour verification JWT |
| 7 | POST | `/api/auth/verify` | AuthController | No | `@Public()` | Verify a verification JWT token |
| 8 | POST | `/api/auth/forgot-password` | AuthController | No | `@Public()` | Trigger forgot-password flow |
| 9 | POST | `/api/auth/logout` | AuthController | Yes (Bearer) | — | Invalidate refresh token session; clears cookie |
| 10 | GET | `/api/models` | ModelsController | No | `@Public()` (class-level) | List AI models with search/category/pagination |
| 11 | GET | `/api/models/home-feed` | ModelsController | No | `@Public()` | Aggregated home feed (featured, trending, labs) |
| 12 | GET | `/api/models/:id` | ModelsController | No | `@Public()` | Single model detail by ID |
| 13 | POST | `/api/chat/session` | ChatController | No (optional) | `@Public()` | Create new chat session |
| 14 | POST | `/api/chat/sessions` | ChatController | No (optional) | `@Public()` | Alias for `POST /chat/session` |
| 15 | POST | `/api/chat/session/import` | ChatController | Yes (Bearer) | — | Import guest sessions into authenticated account |
| 16 | POST | `/api/chat/send` | ChatController | No (optional) | `@Public()` | Send message; receive AI reply |
| 17 | POST | `/api/chat/message` | ChatController | No (optional) | `@Public()` | Alias for `POST /chat/send` |
| 18 | GET | `/api/chat/history` | ChatController | No (optional) | `@Public()` | List sessions or single session by query param |
| 19 | GET | `/api/chat/:sessionId` | ChatController | No (optional) | `@Public()` | Get single session by path param |
| 20 | DELETE | `/api/chat/session/:id` | ChatController | Yes (Bearer) | — | Delete a chat session |
| 21 | POST | `/api/upload` | UploadController | No (optional) | `@Public()` | Upload file metadata; proxy to ML team |
| 22 | GET | `/api/dashboard` | DashboardController | Yes (Bearer) | — | Dashboard overview (usage, recent sessions) |
| 23 | GET | `/api/dashboard/history` | DashboardController | Yes (Bearer) | — | Full session history for authenticated user |
| 24 | GET | `/api/dashboard/settings` | DashboardController | Yes (Bearer) | — | User profile + preferences |
| 25 | GET | `/api/dashboard/billing` | DashboardController | Yes (Bearer) | — | Plan, usage, invoices, limits |
| 26 | POST | `/api/forms/contact` | FormsController | No | `@Public()` (class-level) | Submit contact form |
| 27 | POST | `/api/forms/feedback` | FormsController | No | `@Public()` (class-level) | Submit feedback form |

**Total: 27 endpoints** (25 unique paths + 2 aliases)

---

## Section 3: Frontend → Backend API Mapping

| Frontend Module | Frontend Flow / Page | API Endpoint | Method | Notes |
|---|---|---|---|---|
| Login | User submits credentials | `/api/auth/login` | POST | Returns `accessToken` + sets `refreshToken` cookie |
| Login | Continue as Guest | No backend call | — | Guest session is client-side only (localStorage + cookie) |
| Signup | User registers | `/api/auth/signup` | POST | Duplicate email → 401 `Email already registered.` |
| Forgot Password | User requests reset link | `/api/auth/forgot-password` | POST | Mock mode always returns a message string |
| Navbar / Auth State | App hydration / token refresh | `/api/auth/refresh` | POST | Uses `refreshToken` httpOnly cookie |
| Navbar / Auth State | Get current user | `/api/auth/me` | GET | Called after login to hydrate Redux user state |
| Logout | User logs out | `/api/auth/logout` | POST | Clears session + cookie |
| Email Verification | Verify JWT token | `/api/auth/verify` | POST | Verifies verification token from email link |
| Dashboard → Home | Overview stats | `/api/dashboard` | GET | Protected; returns usage counts + recent sessions |
| Dashboard → History | Session history list | `/api/dashboard/history` | GET | Protected; returns all sessions for user |
| Dashboard → Settings | Profile + preferences | `/api/dashboard/settings` | GET | Protected; returns profile + static preferences |
| Dashboard → Billing | Plan, cost, invoices | `/api/dashboard/billing` | GET | Protected; returns plan, usage, mock invoices |
| Chat | Create new session | `/api/chat/session` | POST | Requires `modelId`; guestSessionId optional |
| Chat | Send message | `/api/chat/send` | POST | Requires `sessionId`, `modelId`, `content` |
| Chat | Load history | `/api/chat/history` | GET | Filter by `sessionId` or `guestSessionId` query param |
| Chat | Get single session | `/api/chat/:sessionId` | GET | 404 if not found |
| Chat | Delete session | `/api/chat/session/:id` | DELETE | Protected; ownership check via userId |
| Chat (post-login) | Import guest sessions | `/api/chat/session/import` | POST | Protected; links guest sessions to user account |
| Chat | File attachment upload | `/api/upload` | POST | Public; sends metadata (no actual binary) |
| Marketplace / Models | Browse AI models | `/api/models` | GET | `q`, `category`, `page`, `limit` query params |
| Marketplace / Models | Model detail page | `/api/models/:id` | GET | Returns null (not 404) if model not found |
| Home / Discover | Home feed data | `/api/models/home-feed` | GET | Cached 15 min; falls back to dummy data |
| Contact / Footer | Contact form | `/api/forms/contact` | POST | No DTO validation (accepts any object) |
| Contact / Footer | Feedback form | `/api/forms/feedback` | POST | No DTO validation (accepts any object) |
| Agents Page | Agent data (static) | No backend endpoint | — | Agents are frontend-static; no `/api/agents` route |
| Discover Page | Discover data | `/api/models/home-feed` + `/api/models` | GET | Discover sections consume models feed |

---

## Section 4: Backend/API Test Scenarios

### AUTH Module Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-AUTH-001 | Auth | POST /api/auth/signup | Valid signup creates user and returns tokens | No user with this email exists | 1. POST `/api/auth/signup` with valid body | `{ "email": "new@test.com", "password": "Secret123", "name": "Test User" }` | 201/200: `{ accessToken, user: { id, name, email, plan, createdAt } }` + `Set-Cookie: refreshToken` httpOnly | Happy Path |
| TC-API-AUTH-002 | Auth | POST /api/auth/signup | Signup with missing email field | — | 1. POST `/api/auth/signup` omitting `email` | `{ "password": "Secret123" }` | 400: validation error mentioning `email` | Negative |
| TC-API-AUTH-003 | Auth | POST /api/auth/signup | Signup with invalid email format | — | 1. POST `/api/auth/signup` with bad email | `{ "email": "notanemail", "password": "Secret123" }` | 400: `email must be an email` | Negative |
| TC-API-AUTH-004 | Auth | POST /api/auth/signup | Signup with password shorter than 6 chars | — | 1. POST `/api/auth/signup` with short password | `{ "email": "x@test.com", "password": "ab1" }` | 400: `password must be longer than or equal to 6 characters` | Negative |
| TC-API-AUTH-005 | Auth | POST /api/auth/signup | Signup with name shorter than 2 chars | — | 1. POST `/api/auth/signup` with short name | `{ "email": "x@test.com", "password": "Secret123", "name": "A" }` | 400: `name must be longer than or equal to 2 characters` | Negative |
| TC-API-AUTH-006 | Auth | POST /api/auth/signup | Duplicate email returns 401 | User already exists with this email | 1. POST `/api/auth/signup` with existing email | `{ "email": "demo@nexusai.app", "password": "Secret123" }` | 401: `Email already registered.` | Negative / Conflict |
| TC-API-AUTH-007 | Auth | POST /api/auth/signup | Extra (non-whitelisted) fields are stripped | — | 1. POST with extra field `role: "admin"` | `{ "email": "y@test.com", "password": "Secret123", "role": "admin" }` | 400: `property role should not exist` (forbidNonWhitelisted) | Security |
| TC-API-AUTH-008 | Auth | POST /api/auth/signup | Name is optional — omitting name succeeds | — | 1. POST without `name` | `{ "email": "noname@test.com", "password": "Secret123" }` | 200/201: user created with `name: "New User"` (default) | Happy Path |
| TC-API-AUTH-009 | Auth | POST /api/auth/login | Valid credentials return tokens | User exists in mockDb | 1. POST `/api/auth/login` with correct credentials | `{ "email": "demo@nexusai.app", "password": "password123" }` | 200: `{ accessToken, user }` + `Set-Cookie: refreshToken` | Happy Path |
| TC-API-AUTH-010 | Auth | POST /api/auth/login | Wrong password returns 401 | User exists | 1. POST `/api/auth/login` with wrong password | `{ "email": "demo@nexusai.app", "password": "WrongPass" }` | 401: `Invalid credentials.` | Negative |
| TC-API-AUTH-011 | Auth | POST /api/auth/login | Non-existent email returns 401 | — | 1. POST `/api/auth/login` with unknown email | `{ "email": "ghost@test.com", "password": "Secret123" }` | 401: `Invalid credentials.` | Negative |
| TC-API-AUTH-012 | Auth | POST /api/auth/login | Missing password field | — | 1. POST `/api/auth/login` without password | `{ "email": "demo@nexusai.app" }` | 400: validation error for `password` | Negative |
| TC-API-AUTH-013 | Auth | POST /api/auth/login | Case-insensitive email match | User registered with lowercase email | 1. Login with UPPERCASE version of email | `{ "email": "DEMO@NEXUSAI.APP", "password": "password123" }` | 200: successful login (email lowercased internally) | Edge Case |
| TC-API-AUTH-014 | Auth | GET /api/auth/me | Valid Bearer token returns user profile | User logged in, token not expired | 1. GET `/api/auth/me` with `Authorization: Bearer <accessToken>` | valid access token | 200: `{ id, name, email, plan, createdAt }` | Happy Path |
| TC-API-AUTH-015 | Auth | GET /api/auth/me | Missing Authorization header returns 401 | — | 1. GET `/api/auth/me` without Bearer token | no Authorization header | 401: `Unauthorized.` | Negative |
| TC-API-AUTH-016 | Auth | GET /api/auth/me | Expired access token returns 401 | Token is expired (>15 min old) | 1. Use an expired token in Authorization header | expired JWT | 401: `Token has expired.` | Negative |
| TC-API-AUTH-017 | Auth | GET /api/auth/me | Tampered token signature returns 401 | — | 1. Modify token payload and send | mangled JWT | 401: `Invalid token signature.` | Security |
| TC-API-AUTH-018 | Auth | GET /api/auth/me | Refresh token used as Bearer (wrong type) returns 401 | User has valid refresh token | 1. Use refresh token as Bearer access token | refresh JWT in Authorization header | 401: `Invalid token type.` | Security |
| TC-API-AUTH-019 | Auth | POST /api/auth/refresh | Valid refresh cookie rotates tokens | User logged in, refresh cookie set | 1. POST `/api/auth/refresh` with `refreshToken` cookie | valid `refreshToken` httpOnly cookie | 200: new `{ accessToken, user }` + new `Set-Cookie: refreshToken` | Happy Path |
| TC-API-AUTH-020 | Auth | POST /api/auth/refresh | Missing refresh cookie returns 401 | — | 1. POST `/api/auth/refresh` without cookie | no `refreshToken` cookie | 401: `Token is required.` | Negative |
| TC-API-AUTH-021 | Auth | POST /api/auth/refresh | Expired refresh token returns 401 | Refresh token is >30 days old | 1. POST with expired refresh cookie | expired refresh JWT | 401: `Token has expired.` | Negative |
| TC-API-AUTH-022 | Auth | POST /api/auth/refresh | Revoked session (after logout) returns 401 | User previously logged out | 1. Logout 2. Attempt refresh with old cookie | revoked refresh token | 401: `Invalid refresh token.` | Security |
| TC-API-AUTH-023 | Auth | POST /api/auth/forgot-password | Valid registered email returns success message | User exists with this email | 1. POST `/api/auth/forgot-password` with registered email | `{ "email": "demo@nexusai.app" }` | 200: `{ message: "Reset link generated in mock mode." }` | Happy Path |
| TC-API-AUTH-024 | Auth | POST /api/auth/forgot-password | Unregistered email returns generic message | User does NOT exist | 1. POST `/api/auth/forgot-password` with unknown email | `{ "email": "ghost@nowhere.com" }` | 200: `{ message: "If the email exists, a reset link has been generated." }` | Security (no user enumeration) |
| TC-API-AUTH-025 | Auth | POST /api/auth/forgot-password | Invalid email format returns 400 | — | 1. POST with malformed email | `{ "email": "notvalid" }` | 400: validation error for `email` | Negative |
| TC-API-AUTH-026 | Auth | POST /api/auth/forgot-password | Empty email body returns 400 | — | 1. POST with empty body | `{}` | 400: `email must be an email` | Negative |
| TC-API-AUTH-027 | Auth | POST /api/auth/logout | Valid logout clears session and cookie | User is authenticated | 1. POST `/api/auth/logout` with valid Bearer token | valid access token + refresh cookie | 200: `{ success: true }` + `Set-Cookie: refreshToken=; Max-Age=0` | Happy Path |
| TC-API-AUTH-028 | Auth | POST /api/auth/logout | Logout without token returns 401 | — | 1. POST `/api/auth/logout` without Authorization | no auth | 401: `Unauthorized.` | Negative |
| TC-API-AUTH-029 | Auth | GET /api/auth/sessions | Returns list of active sessions for user | User is authenticated with at least 1 session | 1. Login 2. GET `/api/auth/sessions` with Bearer token | valid access token | 200: array of `{ id, createdAt, lastActiveAt, userAgent }` | Happy Path |
| TC-API-AUTH-030 | Auth | POST /api/auth/verification-token | Issues verification token for authenticated user | User is authenticated | 1. GET `/api/auth/verification-token` with Bearer | valid access token | 200: `{ verificationToken: "<jwt>" }` | Happy Path |
| TC-API-AUTH-031 | Auth | POST /api/auth/verify | Valid verification token returns user | Verification token is valid and not expired | 1. POST `/api/auth/verify` with valid token | `{ "token": "<verificationJwt>" }` | 200: `{ verified: true, user: { ... } }` | Happy Path |
| TC-API-AUTH-032 | Auth | POST /api/auth/verify | Expired verification token returns 401 | Token is >24h old | 1. POST `/api/auth/verify` with expired token | expired verification JWT | 401: `Token has expired.` | Negative |
| TC-API-AUTH-033 | Auth | POST /api/auth/verify | Access token used as verification token fails | — | 1. POST `/api/auth/verify` with access JWT | access JWT | 401: `Invalid token type.` | Security |

### MODELS Module Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-MODELS-001 | Models | GET /api/models | Default list returns paginated models | Models seeded in mock store | 1. GET `/api/models` | no params | 200: `{ items: [...], total: N, page: 1, totalPages: N }` | Happy Path |
| TC-API-MODELS-002 | Models | GET /api/models | Search by model name filters results | — | 1. GET `/api/models?q=GPT` | `q=GPT` | 200: `items` array contains only models with "GPT" in name or provider | Happy Path |
| TC-API-MODELS-003 | Models | GET /api/models | Filter by category returns matching models | — | 1. GET `/api/models?category=code` | `category=code` | 200: all `items` have `category === "code"` | Happy Path |
| TC-API-MODELS-004 | Models | GET /api/models | Pagination returns correct page slice | Total models > default limit (24) | 1. GET `/api/models?page=2&limit=5` | `page=2&limit=5` | 200: `items` has max 5 entries; `page === 2` | Happy Path |
| TC-API-MODELS-005 | Models | GET /api/models | Search with no match returns empty items | — | 1. GET `/api/models?q=nonexistentmodel999` | `q=nonexistentmodel999` | 200: `{ items: [], total: 0, totalPages: 1 }` | Edge Case |
| TC-API-MODELS-006 | Models | GET /api/models | Page 0 or negative page defaults to page 1 | — | 1. GET `/api/models?page=0` | `page=0` | 200: page treated as 1 (Number(0) → falls back via `|| 1`) | Edge Case |
| TC-API-MODELS-007 | Models | GET /api/models | Non-numeric page param defaults gracefully | — | 1. GET `/api/models?page=abc` | `page=abc` | 200: page defaults to 1 (NaN → 0 → `|| 1`) | Edge Case |
| TC-API-MODELS-008 | Models | GET /api/models | Large limit returns all matching models | — | 1. GET `/api/models?limit=1000` | `limit=1000` | 200: all models returned in single page | Edge Case |
| TC-API-MODELS-009 | Models | GET /api/models | No auth required (public endpoint) | — | 1. GET `/api/models` with no Authorization header | no token | 200: models returned without auth | Happy Path |
| TC-API-MODELS-010 | Models | GET /api/models/home-feed | Home feed returns expected sections | — | 1. GET `/api/models/home-feed` | no params | 200: `{ featuredModels, builtForEveryBuilder, browseByAiLab, flagshipModelComparison, trendingThisWeek, firstModelsByBudget, quickStartUseCases, refreshedAt, source }` | Happy Path |
| TC-API-MODELS-011 | Models | GET /api/models/home-feed | Home feed is cached for 15 minutes | First call populates cache | 1. Call once 2. Modify mock data 3. Call again within 15 min | — | Second call returns same cached response (source: 'dummy') | Performance |
| TC-API-MODELS-012 | Models | GET /api/models/:id | Valid model ID returns model detail | Model exists in mock store | 1. GET `/api/models/nexus-reasoner-pro` | `id=nexus-reasoner-pro` | 200: full model object | Happy Path |
| TC-API-MODELS-013 | Models | GET /api/models/:id | Unknown model ID returns null (not 404) | — | 1. GET `/api/models/unknown-model-id` | `id=unknown-model-id` | 200: `null` (not a 404 — `find` returns undefined → null) | Edge Case / Bug Candidate |
| TC-API-MODELS-014 | Models | GET /api/models/:id | Special characters in ID handled | — | 1. GET `/api/models/model%20with%20space` | URL-encoded ID | 200: `null` (no match found; no crash) | Edge Case |

### CHAT Module Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-CHAT-001 | Chat | POST /api/chat/session | Authenticated user creates session | User has valid Bearer token | 1. POST `/api/chat/session` with valid modelId | `{ "modelId": "nexus-reasoner-pro" }` | 200: session object with `id`, `modelId`, `title`, `messages: [system]`, `usage` | Happy Path |
| TC-API-CHAT-002 | Chat | POST /api/chat/session | Guest creates session using guestSessionId | No Bearer token | 1. POST `/api/chat/session` without auth | `{ "modelId": "nexus-reasoner-pro", "guestSessionId": "guest_abc123" }` | 200: session with `guestSessionId` set, `userId` undefined | Happy Path |
| TC-API-CHAT-003 | Chat | POST /api/chat/session | Unknown modelId returns 404 | — | 1. POST `/api/chat/session` with invalid model | `{ "modelId": "nonexistent-model" }` | 404: `Model nonexistent-model not found.` | Negative |
| TC-API-CHAT-004 | Chat | POST /api/chat/session | Missing modelId returns error | — | 1. POST `/api/chat/session` without modelId | `{}` | 404 or 500: `requireModel` called with `undefined` | Negative |
| TC-API-CHAT-005 | Chat | POST /api/chat/session | Custom title and systemPrompt are respected | — | 1. POST with `title` and `systemPrompt` | `{ "modelId": "nexus-reasoner-pro", "title": "My Session", "systemPrompt": "Be concise" }` | 200: `session.title === "My Session"`, system message uses custom prompt | Happy Path |
| TC-API-CHAT-006 | Chat | POST /api/chat/session | Title defaults to model name if not provided | — | 1. POST without `title` | `{ "modelId": "nexus-reasoner-pro" }` | 200: `session.title === "Nexus Reasoner Pro"` | Edge Case |
| TC-API-CHAT-007 | Chat | POST /api/chat/send | Send message to existing session | Session exists, modelId valid | 1. Create session 2. POST `/api/chat/send` | `{ "sessionId": "<id>", "modelId": "nexus-reasoner-pro", "content": "Hello" }` | 200: `{ session, assistantMessage, usage, model, forwardedToMl }` | Happy Path |
| TC-API-CHAT-008 | Chat | POST /api/chat/send | Send to non-existent sessionId auto-creates session | — | 1. POST `/api/chat/send` with unknown sessionId | `{ "sessionId": "fake-session-123", "modelId": "nexus-reasoner-pro", "content": "Hello" }` | 200: new session created with provided sessionId | Edge Case |
| TC-API-CHAT-009 | Chat | POST /api/chat/send | Invalid modelId returns 404 | — | 1. POST with non-existent model | `{ "sessionId": "s1", "modelId": "bad-model", "content": "Hello" }` | 404: `Model bad-model not found.` | Negative |
| TC-API-CHAT-010 | Chat | POST /api/chat/send | Missing content field | — | 1. POST without `content` | `{ "sessionId": "s1", "modelId": "nexus-reasoner-pro" }` | Likely 200 with empty content or `estimateTokens` error; verify graceful handling | Negative |
| TC-API-CHAT-011 | Chat | POST /api/chat/send | XSS payload in content stored as plain text | — | 1. POST with script tag as content | `{ ..., "content": "<script>alert(1)</script>" }` | 200: content stored verbatim; no execution on retrieval | Security |
| TC-API-CHAT-012 | Chat | POST /api/chat/send | Very long message (10,000 chars) | — | 1. POST with 10k character content | content: `"A".repeat(10000)` | 200: message stored; token estimate = 2500 | Edge Case |
| TC-API-CHAT-013 | Chat | POST /api/chat/send | Attachments array is included in user message | — | 1. POST with `attachments` array | `{ ..., "content": "See attached", "attachments": [{ "url": "http://..." }] }` | 200: `assistantMessage` returned; attachments stored in user message | Happy Path |
| TC-API-CHAT-014 | Chat | GET /api/chat/history | Authenticated user gets their sessions | User has sessions | 1. GET `/api/chat/history` with Bearer token | Authorization: Bearer valid token | 200: `{ items: [...sessions], total: N }` | Happy Path |
| TC-API-CHAT-015 | Chat | GET /api/chat/history | Guest user gets sessions by guestSessionId | Guest sessions exist | 1. GET `/api/chat/history?guestSessionId=guest_abc123` | `guestSessionId=guest_abc123` | 200: `{ items: [...], total: N }` | Happy Path |
| TC-API-CHAT-016 | Chat | GET /api/chat/history | Filter by specific sessionId returns single session | Session exists | 1. GET `/api/chat/history?sessionId=<id>` | `sessionId=<valid_id>` | 200: single session object (not array) | Happy Path |
| TC-API-CHAT-017 | Chat | GET /api/chat/history | No matching sessions returns empty list | — | 1. GET `/api/chat/history?guestSessionId=no-such-guest` | `guestSessionId=no-such-guest` | 200: `{ items: [], total: 0 }` | Edge Case |
| TC-API-CHAT-018 | Chat | GET /api/chat/:sessionId | Valid sessionId returns session | Session exists | 1. GET `/api/chat/<valid_id>` | path param: valid session UUID | 200: full session object with messages | Happy Path |
| TC-API-CHAT-019 | Chat | GET /api/chat/:sessionId | Non-existent sessionId returns 404 | — | 1. GET `/api/chat/nonexistent-session-id` | unknown UUID | 404: `Chat session not found.` | Negative |
| TC-API-CHAT-020 | Chat | DELETE /api/chat/session/:id | Authenticated owner deletes own session | User owns session | 1. Create session as user 2. DELETE `/api/chat/session/<id>` | valid session id, valid Bearer | 200: `{ deleted: true }` | Happy Path |
| TC-API-CHAT-021 | Chat | DELETE /api/chat/session/:id | Unauthenticated delete returns 401 | — | 1. DELETE `/api/chat/session/<id>` without token | no Bearer | 401: `Unauthorized.` | Negative |
| TC-API-CHAT-022 | Chat | DELETE /api/chat/session/:id | Non-existent session returns 404 | User authenticated | 1. DELETE `/api/chat/session/fake-uuid` with valid token | unknown id | 404: `Session not found.` | Negative |
| TC-API-CHAT-023 | Chat | DELETE /api/chat/session/:id | User cannot delete another user's session | Two different users | 1. Create session as User A 2. DELETE as User B | other user's session id | 404: not found (ownership check: `entry.userId === userId`) | Security / Authorization |
| TC-API-CHAT-024 | Chat | POST /api/chat/session/import | Import guest sessions into authenticated account | User authenticated, guest sessions exist | 1. POST `/api/chat/session/import` with sessions array | `{ "guestSessionId": "guest_abc", "sessions": [{ "modelId": "nexus-reasoner-pro", "messages": [...] }] }` | 200: `{ imported: N, sessions: [...] }` | Happy Path |
| TC-API-CHAT-025 | Chat | POST /api/chat/session/import | Unauthenticated import returns 401 | — | 1. POST import without token | no Bearer | 401: `Unauthorized.` | Negative |
| TC-API-CHAT-026 | Chat | POST /api/chat/session/import | Import with invalid modelId inside session | — | 1. POST import with bad modelId in sessions array | `{ ..., "sessions": [{ "modelId": "bad-model" }] }` | 404: `Model bad-model not found.` | Negative |
| TC-API-CHAT-027 | Chat | POST /api/chat/session/import | Import empty sessions array | — | 1. POST import with `sessions: []` | `{ "guestSessionId": "g1", "sessions": [] }` | 200: `{ imported: 0, sessions: [] }` | Edge Case |

### UPLOAD Module Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-UPLOAD-001 | Upload | POST /api/upload | Valid file metadata upload | — | 1. POST `/api/upload` with full body | `{ "filename": "test.pdf", "mimeType": "application/pdf", "size": 204800 }` | 200: `{ id, filename, mimeType, url, previewUrl, sizeLabel, isImage: false, ... }` | Happy Path |
| TC-API-UPLOAD-002 | Upload | POST /api/upload | Image upload sets isImage and previewUrl | — | 1. POST with image mimeType | `{ "filename": "photo.jpg", "mimeType": "image/jpeg", "size": 512000 }` | 200: `isImage: true`; `previewUrl: "/uploads/previews/photo.jpg"` | Happy Path |
| TC-API-UPLOAD-003 | Upload | POST /api/upload | Empty body uses defaults | — | 1. POST with empty body `{}` | `{}` | 200: `filename: "mock-file"`, `mimeType: "application/octet-stream"`, `sizeLabel: "0 B"` | Edge Case |
| TC-API-UPLOAD-004 | Upload | POST /api/upload | Upload by authenticated user stores uploadedBy userId | User is authenticated | 1. POST upload with Bearer token | valid token + `{ "filename": "doc.pdf" }` | 200: `uploadedBy: "<userId>"` | Happy Path |
| TC-API-UPLOAD-005 | Upload | POST /api/upload | Upload by guest has null uploadedBy | No token | 1. POST upload without token | no auth + body | 200: `uploadedBy: null` | Happy Path |
| TC-API-UPLOAD-006 | Upload | POST /api/upload | sizeLabel formats correctly for various sizes | — | 1. POST with size=0; 2. size=1536; 3. size=1048576; 4. size=1073741824 | sizes: 0, 1536, 1048576, 1073741824 | `"0 B"`, `"1.5 KB"`, `"1.0 MB"`, `"1.0 GB"` respectively | Edge Case |
| TC-API-UPLOAD-007 | Upload | POST /api/upload | sessionId and modelId are passed through in response | — | 1. POST with sessionId and modelId | `{ "sessionId": "s1", "modelId": "nexus-reasoner-pro" }` | 200: `sessionId: "s1"`, `modelId: "nexus-reasoner-pro"` in response | Happy Path |
| TC-API-UPLOAD-008 | Upload | POST /api/upload | Filename with special characters is URL-encoded | — | 1. POST with spaces/special chars in filename | `{ "filename": "my file (1).pdf" }` | 200: `url` contains `encodeURIComponent` encoded filename | Edge Case |

### DASHBOARD Module Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-DASH-001 | Dashboard | GET /api/dashboard | Authenticated user gets overview | User authenticated with sessions | 1. GET `/api/dashboard` with Bearer | valid token | 200: `{ user, usage: { requests, sessions, totalTokens, estimatedCost }, recentSessions, profile }` | Happy Path |
| TC-API-DASH-002 | Dashboard | GET /api/dashboard | Unauthenticated returns 401 | — | 1. GET `/api/dashboard` without token | no auth | 401: `Unauthorized.` | Negative |
| TC-API-DASH-003 | Dashboard | GET /api/dashboard | Overview with no sessions returns zero usage | New user with no chat sessions | 1. Signup new user 2. GET `/api/dashboard` | fresh user token | 200: `usage: { requests: 0, sessions: 0, totalTokens: 0, estimatedCost: 0 }`, `recentSessions: []` | Edge Case |
| TC-API-DASH-004 | Dashboard | GET /api/dashboard/history | Authenticated user gets history list | User has chat sessions | 1. GET `/api/dashboard/history` with Bearer | valid token + existing sessions | 200: `{ items: [...sessions sorted by updatedAt desc], total: N }` | Happy Path |
| TC-API-DASH-005 | Dashboard | GET /api/dashboard/history | Unauthenticated returns 401 | — | 1. GET `/api/dashboard/history` without token | no auth | 401: `Unauthorized.` | Negative |
| TC-API-DASH-006 | Dashboard | GET /api/dashboard/history | Empty history returns empty array | User has no sessions | 1. Signup new user 2. GET history | fresh user token | 200: `{ items: [], total: 0 }` | Edge Case |
| TC-API-DASH-007 | Dashboard | GET /api/dashboard/settings | Returns profile and preferences | User authenticated | 1. GET `/api/dashboard/settings` with Bearer | valid token | 200: `{ profile: { id, name, email, plan }, preferences: { theme, language, guestMode, notifications } }` | Happy Path |
| TC-API-DASH-008 | Dashboard | GET /api/dashboard/settings | Unauthenticated returns 401 | — | 1. GET `/api/dashboard/settings` without token | no auth | 401: `Unauthorized.` | Negative |
| TC-API-DASH-009 | Dashboard | GET /api/dashboard/billing | Returns plan, usage, invoices and limits | User authenticated | 1. GET `/api/dashboard/billing` with Bearer | valid token | 200: `{ plan, usage: { requests, totalTokens, estimatedCost }, invoices: [...], limits: { monthlyRequests, modelAccess } }` | Happy Path |
| TC-API-DASH-010 | Dashboard | GET /api/dashboard/billing | Unauthenticated returns 401 | — | 1. GET `/api/dashboard/billing` without token | no auth | 401: `Unauthorized.` | Negative |
| TC-API-DASH-011 | Dashboard | GET /api/dashboard/billing | Expired token returns 401 | Token is expired | 1. GET billing with expired JWT | expired Bearer token | 401: `Token has expired.` | Negative |
| TC-API-DASH-012 | Dashboard | GET /api/dashboard/billing | Billing usage aggregates all user sessions | User has multiple sessions | 1. Create 3 sessions + send messages 2. GET billing | multiple chat sessions | 200: `usage.requests` = sum of all session requests; `estimatedCost` = aggregate | Happy Path |

### FORMS Module Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-FORMS-001 | Forms | POST /api/forms/contact | Valid contact submission | — | 1. POST `/api/forms/contact` with contact data | `{ "name": "Alice", "email": "alice@test.com", "message": "Hello" }` | 200: `{ submitted: true }` | Happy Path |
| TC-API-FORMS-002 | Forms | POST /api/forms/contact | Empty body is accepted (no DTO validation) | — | 1. POST `/api/forms/contact` with `{}` | `{}` | 200: `{ submitted: true }` — FormsService accepts any object | Edge Case / Bug Candidate |
| TC-API-FORMS-003 | Forms | POST /api/forms/contact | XSS payload in form fields stored as-is | — | 1. POST with XSS payload in name | `{ "name": "<script>alert(1)</script>" }` | 200: stored verbatim; note: no server-side sanitization in controller | Security |
| TC-API-FORMS-004 | Forms | POST /api/forms/contact | No auth required | — | 1. POST without Authorization header | no token | 200: success (public endpoint) | Happy Path |
| TC-API-FORMS-005 | Forms | POST /api/forms/feedback | Valid feedback submission | — | 1. POST `/api/forms/feedback` with feedback data | `{ "rating": 5, "comment": "Great platform!" }` | 200: `{ submitted: true }` | Happy Path |
| TC-API-FORMS-006 | Forms | POST /api/forms/feedback | Multiple concurrent submissions | — | 1. Send 10 concurrent POST requests | 10 identical feedback bodies | 200 for all; `mockDb.feedbackForms.length += 10` | Load / Edge Case |

### CROSS-CUTTING / INFRASTRUCTURE Tests

| Test Case ID | Module | Endpoint | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Test Type |
|---|---|---|---|---|---|---|---|---|
| TC-API-INFRA-001 | CORS | Any endpoint | Request from allowed origin succeeds | Server running | 1. Send request with `Origin: http://localhost:3001` | CORS origin: localhost:3001 | 200 + correct CORS headers | Security |
| TC-API-INFRA-002 | CORS | Any endpoint | Request from disallowed origin returns error | Server running | 1. Send request with `Origin: http://evil.com` | CORS origin: evil.com | CORS error — request blocked | Security |
| TC-API-INFRA-003 | CORS | Any endpoint | Preflight OPTIONS is allowed | Server running | 1. Send OPTIONS request to `/api/auth/login` | OPTIONS + origin header | 204/200 with CORS headers | Security |
| TC-API-INFRA-004 | Validation | Any endpoint | Non-whitelisted fields cause 400 | — | 1. POST any validated endpoint with extra field | e.g., `{ "email": "...", "adminFlag": true }` | 400: `property adminFlag should not exist` | Security |
| TC-API-INFRA-005 | Validation | Any endpoint | Type coercion works for strings | — | 1. POST signup with number as email | `{ "email": 12345, "password": "abc123" }` | 400: class-validator email check fails | Security |
| TC-API-INFRA-006 | Auth | Protected routes | Token with unknown userId (deleted user) returns 401 | User deleted from mock store | 1. Generate valid token 2. Remove user from mockDb 3. Make request | valid signed JWT but user not in DB | 401: `Unauthorized.` | Security |

---

## Section 5: Missing Backend Coverage

The following frontend flows from the CSV have **no corresponding backend endpoint**:

| Frontend Module | Frontend Flow | Missing Backend Support | Severity |
|---|---|---|---|
| Agents Page (`/agents`) | View featured agents, launch agent | No `/api/agents` endpoint; agent data is fully static on frontend | Medium — agents are UI-only |
| Agents Page | Create Custom Agent / Build This | Redirects to `/chat?mode=agent-builder`; no backend agent creation API | Medium |
| Discover Page | Browse discover sections (trending, new releases, providers) | Partially served by `/api/models/home-feed` but Discover also uses local static data | Low |
| Chat (`/chat`) | File attachment upload (TC-CHAT-014) | Upload API exists (`POST /api/upload`) but accepts only metadata — no binary file content | Medium |
| Auth | Reset password via link | `POST /api/auth/forgot-password` exists but there is NO `/api/auth/reset-password` endpoint to actually change password | High — flow is incomplete |
| Auth | Email verification flow (TC-SIGNUP-*) | `POST /api/auth/verify` exists but no email delivery; signup does NOT require verification; no resend endpoint | Medium |
| Settings Page | Update profile / Change password | No `PATCH /api/dashboard/settings` or `PUT /api/users/:id` endpoint; settings are read-only | High |
| Settings Page | Update preferences (theme, language, notifications) | Preferences are hardcoded static values; no write endpoint | Medium |
| Chat | Streaming AI responses | `POST /api/chat/send` returns a single complete response; no SSE/WebSocket streaming | Medium |
| Home / Marketplace | Global search (TC-HOME-003) | Frontend search bar; no dedicated `/api/search` endpoint; models endpoint has `q` param as partial substitute | Low |
| Dashboard | Session delete from history page | DELETE endpoint exists at `/api/chat/session/:id` but no `/api/dashboard/history/:id` DELETE alias | Low |

---

## Section 6: Test Automation Notes

### Recommended Stack

- **Framework**: Jest (already in NestJS project) + `@nestjs/testing` + Supertest
- **Alternative**: Postman / Newman collections for contract/integration testing

### Setup Pattern (Jest + Supertest)

```typescript
// test/helpers/app.helper.ts
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

export async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.init();
  return app;
}
```

### Auth Helper Pattern

```typescript
async function getAuthTokens(app: INestApplication, email = 'demo@nexusai.app', password = 'password123') {
  const res = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password });
  return {
    accessToken: res.body.accessToken,
    refreshCookie: res.headers['set-cookie'],
  };
}
```

### Key Automation Considerations

| Area | Note |
|---|---|
| Mock DB state isolation | Reset `mockDb` arrays in `beforeEach` to prevent test pollution across cases |
| Token expiry testing | Use `jest.useFakeTimers()` + `jest.advanceTimersByTime()` to simulate expired tokens without waiting |
| HttpOnly cookie testing | Supertest agent (`.agent()`) needed to persist cookies across requests for refresh token flow |
| CORS testing | Set `Origin` header in Supertest; validate response `Access-Control-Allow-Origin` |
| ML proxy tests | Mock `axios.post` with `jest.spyOn` to test fallback behavior when ML_TEAM_API_URL is unset |
| Guest session tests | Pass `guestSessionId` in body or simulate `nexusai_guest_expires` cookie header |
| Parallel test safety | Each test suite should create isolated sessions; use unique email addresses per signup test |
| Swagger validation | Run a snapshot test against `GET /docs-json` to detect unintentional API contract changes |

### Suggested Test File Organization

```
backend-app/
└── test/
    ├── auth.e2e-spec.ts          # All 33 auth test cases
    ├── models.e2e-spec.ts        # 14 models test cases
    ├── chat.e2e-spec.ts          # 27 chat test cases
    ├── upload.e2e-spec.ts        # 8 upload test cases
    ├── dashboard.e2e-spec.ts     # 12 dashboard test cases
    ├── forms.e2e-spec.ts         # 6 forms test cases
    ├── infrastructure.e2e-spec.ts # CORS, validation, security (6 cases)
    └── helpers/
        ├── app.helper.ts
        ├── auth.helper.ts
        └── db.helper.ts          # mockDb reset utilities
```

### CI Integration

```yaml
# .github/workflows/test.yml (example)
- name: Run API tests
  run: npm run test:e2e
  env:
    PORT: 3001
    JWT_ACCESS_TOKEN_SECRET: test-secret-access
    JWT_REFRESH_TOKEN_SECRET: test-secret-refresh
    JWT_VERIFICATION_TOKEN_SECRET: test-secret-verify
```

---

## Summary Statistics

| Category | Count |
|---|---|
| Total API endpoints documented | 27 |
| Auth test scenarios | 33 |
| Models test scenarios | 14 |
| Chat test scenarios | 27 |
| Upload test scenarios | 8 |
| Dashboard test scenarios | 12 |
| Forms test scenarios | 6 |
| Infrastructure/security scenarios | 6 |
| **Total test scenarios generated** | **106** |
| Frontend flows with no backend coverage | 11 |
