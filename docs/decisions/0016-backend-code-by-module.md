# 0016: Backend code by module

- **Status:** accepted, reference module replaced by 0020 · **Date:** 2026-11-01 · **Involved:** @behritt · **Ref:** #17
- **Decision:** Each domain area has a folder `apps/backend/src/modules/<area>/` with `<area>.routes.ts` and `<area>.service.ts`. Routes only handle HTTP: validate, call the service, set the status. Services contain logic and Drizzle queries, receive plain values and never the Hono `Context`. Shared code lives in `lib/` and `middleware/`. The REST contract is in [`specs/backend.md`](../specs/backend.md), `users` is the reference module.
- **Why:** Same reasoning as in the frontend (0013): several people work in parallel, an area can be found, reviewed and deleted as a whole.
- **Rejected:** Classic MVC (folders by type become confusing, there are no views). A separate repository layer (Drizzle is already thin, it would just be boilerplate).
- **Caution:** Write routes chained and mount them in `app.ts` via `.route()`, otherwise `AppType` breaks (0003). Thrown errors do not show up in the RPC types, the frontend still checks `res.ok` (0006). Modules may only import the services of other modules, not in a cycle. `lib/` and `middleware/` never import from `modules/`.
