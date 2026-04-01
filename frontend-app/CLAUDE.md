# Frontend App — CLAUDE.md

## Stack
- Next.js 16 (App Router), React 19, MUI 7, Redux Toolkit 2, Framer Motion 12, TypeScript 5

## Setup

```bash
cd frontend-app
npm install
cp .env.local.example .env.local   # create if missing
npm run dev                         # http://localhost:3001
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend base URL e.g. `http://localhost:8080/api` |

Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Run Commands

```bash
npm run dev       # dev server (port 3001 by default)
npm run build     # production build
npm run start     # serve production build
npm run lint      # ESLint check
```

## Routes

| Route | Auth | Description |
|---|---|---|
| `/` | Guest | Landing page with animated hero, model cards, sections |
| `/chat` | Guest/Auth | 3-column chat hub with model selector |
| `/marketplace` | Guest | Filter catalog of 420+ models |
| `/discover` | Guest | Trending, new releases, providers |
| `/agents` | Guest | Launch pre-built AI agents |
| `/auth/login` | Guest only | Login form |
| `/auth/signup` | Guest only | Signup form |
| `/dashboard` | Protected | Usage overview |
| `/dashboard/history` | Protected | Chat session history |
| `/dashboard/settings` | Protected | Account settings |
| `/dashboard/billing` | Protected | Billing and plan |

## Guest Sessions

- Unauthenticated users get a guest session stored in `localStorage` under key `nexusai_guest_session`
- Sessions auto-expire after **3 hours** (`GUEST_SESSION_DURATION_MS = 3 * 60 * 60 * 1000`)
- Guest banner in chat shows remaining time and prompts sign-in
- On login, `importGuestSessions` API call migrates guest history to the user's account
- `lib/utils/guestSession.ts` handles all read/write/expiry logic

## Key Files

```
app/page.tsx                    Landing page (animated background, hero actions)
app/chat/ChatPageClient.tsx     3-column chat hub (models | chat | right panel)
app/marketplace/page.tsx        Filterable model catalog
app/discover/page.tsx           Trending + new releases discovery
app/agents/page.tsx             Pre-built agent launcher
components/layout/Navbar.tsx    Sticky rounded navbar, language selector
lib/mock/platformData.ts        420 models, agents, prompts, quickActions
lib/utils/guestSession.ts       Guest session CRUD + expiry
lib/store/slices/authSlice.ts   Auth Redux state
lib/services/chatApi.ts         RTK Query chat endpoints
```

## Language Support (15 languages)
Arabic, Urdu trigger RTL mode. Language stored in `localStorage`. Provider in `components/providers/LanguageProvider.tsx`.

## Theme
Primary `#C8622A` (rust/orange), background `#F7F3EC` (warm beige). All tokens in `lib/theme/tokens.ts`.
