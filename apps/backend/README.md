# Backend

The helthTW API: Hono on Node, PostgreSQL through Drizzle. Setup and the shared commands are in the [root README](../../README.md), the REST contract in [`docs/specs/backend.md`](../../docs/specs/backend.md), the reasons in [`docs/decisions/`](../../docs/decisions/).

## Layout

| Path                          | What                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `src/index.ts`                | Starts the server on `PORT` (default 3000)                                             |
| `src/app.ts`                  | All routes under `/api`. The frontend's typed client uses its type `AppType`           |
| `src/modules/<area>/`         | `<area>.routes.ts` for HTTP, `<area>.service.ts` for logic and queries (decision 0016) |
| `src/lib/`, `src/middleware/` | Shared code, e.g. settings check, errors, `requireAccount`                             |
| `src/db/`                     | Drizzle schema, relations and the dev seed                                             |
| `drizzle/`                    | Generated migrations                                                                   |
| `src/migrate.ts`              | Applies the migrations before every start on the prod-vm                               |
| `Dockerfile`                  | Image for the prod-vm, see [`deployment.md`](../../docs/deployment.md)                 |

## Settings

Locally in `.env`, a copy of `.env.example`. `src/lib/env.ts` checks them at start and stops the backend if one is missing. A new setting goes into `.env.example` and `env.ts`, and on the prod-vm into `backend.env` (see [`deployment.md`](../../docs/deployment.md)).

## Database commands

Run from the repo root. When and how to change the schema is in [`workflow.md`](../../docs/workflow.md).

- After changing `src/db/schema.ts`, create the migration and commit it with the change:

```bash
vp run backend#db:generate
```

- Look into the local database in the browser:

```bash
vp run backend#db:studio
```
