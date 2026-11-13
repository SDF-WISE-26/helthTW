# 0005: Drizzle as ORM

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert
- **Decision:** Schema in TypeScript (`apps/backend/src/db/schema.ts`), migrations with drizzle-kit.
- **Why:** Types from the schema flow all the way into the frontend. Queries look like SQL.
- **Rejected:** Prisma (its own schema language, codegen). TypeORM (weaker types).
- **Caution:** Version 1.0.0-rc.4 is a release candidate. `db:push` and `db:seed` only locally, the seed deletes all data.
