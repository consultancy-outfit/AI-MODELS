# Workspace Routing

## Token Rules (STRICT)
- Read ONLY files needed for the current task. Nothing else.
- Never scan `node_modules`, `dist`, `.next`, `coverage`, lockfiles, or build output.
- Prefer `Grep`/`Glob` over broad reads. Max 3 files per lookup unless task requires more.
- Keep responses short and execution-focused. No summaries unless asked.
- **After every 10–15 assistant replies, output `/compact` as a standalone line before continuing.**

## Model Routing
| Task | Agent | Model |
|------|-------|-------|
| FE planning, MUI architecture, page layout | `frontend-lead` | sonnet |
| BE planning, API design, NestJS modules | `backend-lead` | sonnet |
| Bug review, regression, acceptance checks | `qa-lead` | sonnet |
| UI component building | `ui-builder` | haiku |
| React state, hooks, context | `state-manager` | haiku |
| API integration, typed contracts | `api-client` | haiku |
| NestJS controller/service/DTO | `api-architect` | haiku |
| Mongoose schema, indexes, queries | `db-engineer` | haiku |
| Auth guards, JWT, RBAC | `auth-specialist` | haiku |

## Cross-Agent Contract Format
When a lead agent hands off to a sub-agent or to another lead, include:
```
TASK: <one line>
SCOPE: <files or modules involved>
CONTRACT: <input shape / output shape if API boundary>
DEPENDS_ON: <other agent if blocked>
```

## Stack
- `frontend-app`: Next.js 16, React 19, MUI 7
- `backend-app`: NestJS 11, Mongoose, Swagger

## Work Order
design → component structure → data contract → implementation → QA review
