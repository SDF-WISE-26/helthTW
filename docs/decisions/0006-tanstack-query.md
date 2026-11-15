# 0006: TanStack Query for server data

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert
- **Decision:** TanStack Query loads and caches backend data, requests go through the Hono client.
- **Why:** Cache, loading and error states and invalidation after writes are built in.
- **Rejected:** SWR (less invalidation). `useEffect` with `useState` (a poor rebuild of the same).
- **Caution:** The `queryFn` must throw itself on `!res.ok`.
