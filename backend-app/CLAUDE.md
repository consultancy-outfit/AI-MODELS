# Backend App — CLAUDE.md

## Stack
- NestJS 11, Mongoose 9, MongoDB, Swagger/OpenAPI, JWT (no library — custom), TypeScript 5

## Setup

```bash
cd backend-app
npm install
cp .env.example .env   # edit values
npm run start:dev      # http://localhost:3000
```

## Environment Variables

```env
PORT=3000
SWAGGER_PATH=docs

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/backend_app
MONGODB_DB_NAME=backend_app

# JWT secrets — change for production
JWT_ACCESS_TOKEN_SECRET=change-me-access-token-secret
JWT_REFRESH_TOKEN_SECRET=change-me-refresh-token-secret
JWT_VERIFICATION_TOKEN_SECRET=change-me-verification-token-secret

# AI provider (optional — mock mode if absent)
KIMI_API_KEY=
KIMI_API_BASE_URL=https://api.moonshot.cn/v1
```

## Run Commands

```bash
npm run start:dev   # watch mode (port 3000)
npm run build       # compile
npm run start:prod  # production
npm run lint        # ESLint
```

## API Endpoints

All endpoints prefixed `/api`. Swagger UI at `http://localhost:3000/docs`.

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register + get tokens |
| POST | `/api/auth/login` | Public | Login + get tokens |
| GET | `/api/auth/me` | Bearer | Current user profile |
| POST | `/api/auth/refresh` | Bearer | Refresh access token |

### Models
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/models` | Public | List models (filter, paginate) |
| GET | `/api/models/:id` | Public | Single model details |

### Chat
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/chat/session` | Guest/Auth | Create chat session |
| GET | `/api/chat/history` | Guest/Auth | Get sessions list |
| POST | `/api/chat/send` | Guest/Auth | Send message + AI reply |
| DELETE | `/api/chat/session/:id` | Guest/Auth | Delete session |
| POST | `/api/chat/import` | Bearer | Import guest sessions |

### Upload
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Guest/Auth | Upload file/image |

### Forms
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/forms/contact` | Public | Contact form |
| POST | `/api/forms/feedback` | Public | Feedback form |

## Guest Mode
- Pass `guestSessionId` header or in request body
- Guest sessions are stored in-memory (`mock-db.ts`) with a 3-hour expiry
- Unlinked sessions not saved to DB permanently
- After login, frontend calls `POST /api/chat/import` with guest session data

## Data Storage
- **Development:** In-memory mock store (`src/apps/store/mock-db.ts`)
- **Models:** 47 realistic AI models in `src/apps/store/mock-models.ts`
- **Production:** MongoDB via Mongoose (schemas in each module's `*.schema.ts`)

## Module Structure
```
src/apps/modules/
├── auth/          Auth (signup, login, refresh, me)
├── users/         User CRUD
├── chat/          Sessions, messages, AI replies
├── models/        Model catalog
├── upload/        File upload handling
├── dashboard/     Protected user stats
└── forms/         Contact + feedback
```

## AI Integration
- Primary provider: Kimi API (Moonshot) via env `KIMI_API_KEY`
- Falls back to mock responses when `KIMI_API_KEY` is not set
- `chat.services.ts` handles provider selection
