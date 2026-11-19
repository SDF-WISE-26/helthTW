# 0002: Hono as backend framework

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** The backend is a Hono app in TypeScript on Node.
- **Why:** Same language as the frontend. Quick to learn. Streaming and WebSockets for chat and voice built in.
- **Rejected:** Express (no types, no RPC). NestJS (lots of boilerplate). Python (AI services run separately behind HTTP anyway).
- **Caution:** No prescribed code structure, see #17.
