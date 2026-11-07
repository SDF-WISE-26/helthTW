# 0019: Shared package as source

- **Status:** accepted · **Date:** 2026-11-04 · **Involved:** @justingebert · **Ref:** #31
- **Decision:** `packages/shared` holds code used by both frontend and backend, mostly Zod schemas. Rules for what belongs there are in its `README.md`. It has no build step: `exports` point at `src/<folder>/index.ts`, imported as `@helthtw/shared/<folder>`. Packages in `packages/` get the `@helthtw/` scope so imports are clearly ours, apps keep their short names for `vp run backend#…`. Vite bundles it into the frontend, the backend bundles it into `dist` via `deps.alwaysBundle`. Real schemas come with the tickets that need them (#54, #136), until then `@helthtw/shared/example` is a placeholder.
- **Why:** Only used inside this repo, so a build would just add a watcher in `dev` and stale `dist/` folders. One folder per area like 0013 and 0016, so parallel PRs do not collide on one index file.
- **Caution:** Without `alwaysBundle` the backend bundle keeps `@helthtw/shared` external and Node fails on the `.ts` files in production. Both Dockerfiles copy `packages/shared`, a new package under `packages/` needs the same.
