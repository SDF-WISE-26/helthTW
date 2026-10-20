# Vite+ Monorepo Starter

A starter for creating a Vite+ monorepo.

## Prerequisites

- **Vite+ (`vp`):** [installation guide](https://viteplus.dev/guide/)
- **Node.js 24 LTS (24.11 or newer)**
- **Docker**

## Getting started

1. Install dependencies:

```bash
vp install
```

2. Start the dev database (Postgres on `localhost:5432`):

```bash
docker compose up -d
```

3. Create the tables and fill them with dev data (CAREFUL! this wipes existing data):

```bash
vp run backend#db:push
vp run backend#db:seed
```

4. Start frontend and backend:

```bash
vp run dev
```

## Development

- Check everything is ready:

```bash
vp run ready
```

- Run the tests:

```bash
vp run -r test
```

- Build the monorepo:

```bash
vp run -r build
```
