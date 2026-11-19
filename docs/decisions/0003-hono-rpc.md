# 0003: Hono RPC between frontend and backend

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** The frontend calls the backend through `hc<AppType>` with the types of the backend routes.
- **Why:** If a route changes, TypeScript immediately reports every affected place in the frontend.
- **Rejected:** tRPC (same benefit, its own logic instead of HTTP routes). OpenAPI codegen (extra step).
- **Caution:** Write routes chained. The client does not throw on HTTP errors, check `res.ok`.
