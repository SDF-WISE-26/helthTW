# 0007: TanStack Router

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert
- **Decision:** File-based routing in `apps/frontend/src/routes/`.
- **Why:** Type-safe routes. Loaders preload data through Query. Role guards via `beforeLoad`.
- **Rejected:** React Router (less type-safe, more loosely connected to Query).
- **Caution:** `routeTree.gen.ts` is generated, never edit it by hand.
