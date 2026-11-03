# Copilot instructions

Gesta is a deliberately incomplete internship-management application. Check
`README.md`, `docs/architecture.md`, `docs/cdc_gesta_developpement.md`, and
`backend/API.md` for the intended behavior before extending a feature; the
requirements document includes functionality that is not implemented yet.

## Commands

Run commands from the repository root. The project requires Node.js 22.14 or
newer.

| Command | Purpose |
|---|---|
| `npm ci` | Install the locked workspace dependencies |
| `npm run setup` | Create `backend/.env` if needed and initialize/seed the local database |
| `npm run dev` | Run the API and Vite development server together |
| `npm run lint` | Run Oxlint in both workspaces; warnings are errors |
| `npm run typecheck` | Type-check both workspaces |
| `npm test` | Run all backend and frontend Vitest tests |
| `npm run build` | Build both workspaces |
| `npm run check` | Run lint, typecheck, tests, and build |
| `npm run db:init` | Apply database migrations and seed an empty database |
| `npm run db:reset` | Recreate the local database and demo data; stop the dev server first |

Run a single test file with `npm test --workspace backend -- tests/offers.test.ts`
or `npm test --workspace frontend -- tests/OffersPage.test.tsx`. Add
`-t "test name"` after the file path to select one test by name.

## Architecture

This is an npm-workspaces monorepo: `backend/` is a TypeScript/Express API backed
by local SQLite (`better-sqlite3`), and `frontend/` is a React/TypeScript app
served by Vite. The frontend calls `/api/...`; the Vite development proxy strips
`/api` and forwards requests to the API on port 3000. The frontend defaults to
port 5173. The API port is configured with `API_PORT`.

Backend request flow is `main.ts` → `app.ts` and middleware → controllers →
services → repositories → SQLite. `app.ts` composes dependencies using
`create...` factories; tests use the same composition with an in-memory DB.
Controllers handle HTTP input and responses, services contain business rules,
repositories own SQL, and mappers convert database rows/domain objects/API
DTOs. Keep `Request` and `Response` out of services. Report expected API errors
with `HttpError`; the centralized error middleware formats the JSON response.
For a cross-layer feature, follow the existing companies or offers path and
update its API tests and frontend tests as appropriate.

Frontend flow is pages → hooks → services/utils → models, with reusable
components below pages. `App.tsx` calls `useAuth` once and passes session props
to pages. Services make HTTP requests and validate unknown JSON with type
guards; hooks own loading/error state and call the unauthorized callback for
401 responses.

## Repository-specific conventions

- Backend relative TypeScript imports include the `.ts` extension; the build
  rewrites them to `.js`.
- Keep database access in repositories and authorization/business rules in
  services. Named permission predicates live in `backend/src/services/permissions.ts`;
  authenticate the request before protected routes and authorize where the
  operation requires it.
- The `Authorization` header contains the token directly, without a `Bearer`
  prefix. Tokens identify the user only; authentication reloads the active
  account and its roles/companies from the database on each request.
- Put schema changes in a new ordered `backend/src/db/migrations/NNN_name.sql`
  file; do not edit migrations that have already been applied. SQLite enforces
  relational constraints, while services enforce business rules.
- Store enum/status codes in English (for example `PUBLISHED`) and present
  French labels in the frontend. API errors use
  `{ "error": { "code", "message" } }`; preserve the documented status/code
  contract in `backend/API.md`.
- Backend tests use Vitest and Supertest with an in-memory SQLite database
  (`backend/tests/helpers/testApp.ts`); do not point tests at the development
  database. Seed IDs are centralized in `backend/src/db/seed/seedIds.ts`.
- Frontend tests use Vitest, jsdom, and Testing Library. Use
  `frontend/tests/helpers/fetchMock.ts` to stub API responses.
- Demo login is only for local development, has no password, and must not be
  treated as real authentication. Preserve the production-mode guard.
