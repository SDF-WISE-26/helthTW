# helthTW

A progressive web app that supports emergency responders after stressful operations. Student project at HTW Berlin.

| Path              | What                                                            |
| ----------------- | --------------------------------------------------------------- |
| `apps/frontend`   | React PWA                                                       |
| `apps/backend`    | Hono API with PostgreSQL                                        |
| `packages/shared` | Code shared by frontend and backend                             |
| `content/`        | Info material and contacts, see its [README](content/README.md) |

## Prerequisites

- **Vite+ (`vp`):** [installation guide](https://viteplus.dev/guide/)
- **Node.js 24 LTS (24.11 or newer)**
- **Docker**

## Getting started

1. Install dependencies and the Git hooks:

```bash
vp install
```

2. Create the backend settings. The example values are enough to start, the chat needs real LLM values:

```bash
cp apps/backend/.env.example apps/backend/.env
```

3. Start the dev database (Postgres on `localhost:5432`):

```bash
docker compose up -d
```

4. Create the tables and fill them with dev data (CAREFUL! this wipes existing data):

```bash
vp run backend#db:push
vp run backend#db:seed
```

5. Start frontend and backend, then open http://localhost:5173:

```bash
vp run dev
```

## Development

- Check everything before pushing (the pre-push hook runs the same):

```bash
vp run ready
```

- Run the tests:

```bash
vp test
```

- Build the monorepo:

```bash
vp run -r build
```

## More

- [`AGENTS.md`](AGENTS.md): toolchain, project rules, where the docs are
- [`docs/workflow.md`](docs/workflow.md): branches, commits, PRs, automated checks
- [`docs/decisions/`](docs/decisions/): decisions with reasons
- [`docs/specs/`](docs/specs/): what each area must do
- [`docs/deployment.md`](docs/deployment.md): the HTW VMs, releases and rollback
