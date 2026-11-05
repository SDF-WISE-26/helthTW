# @helthtw/shared

Code used by both frontend and backend.

- **Belongs here:** input schemas for forms and request bodies, value lists as `z.enum`, schemas for content files, pure logic both sides run and maybe some Types
- **Not here:** response types (Hono RPC provides them), Drizzle, React, anything only one app uses.
- Runs in the browser and Node: no `fs`, no `window`, no env or secrets. Never imports from `apps/`.
