# Decisions

Append new decisions at the bottom, numbered consecutively and in the same structure as the existing ones: Status (proposed, accepted or superseded by 00xx), Date, Involved, Decision, Why, Rejected and optionally Caution.

## 0001: Vite+ as toolchain

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** Dev server, build, lint, format, tests and monorepo tasks run through `vp`.
- **Why:** Everyone has the same rules and commands, without their own configs.
- **Rejected:** Individual tools like ESLint and Prettier (more coordination). Nx, Turborepo (too heavy for us).
- **Caution:** Vite+ is young (1.3), AI agents barely know it, hence `AGENTS.md`.

## 0002: Hono as backend framework

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** The backend is a Hono app in TypeScript on Node.
- **Why:** Same language as the frontend. Quick to learn. Streaming and WebSockets for chat and voice built in.
- **Rejected:** Express (no types, no RPC). NestJS (lots of boilerplate). Python (AI services run separately behind HTTP anyway).
- **Caution:** No prescribed code structure, see #17.

## 0003: Hono RPC between frontend and backend

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** The frontend calls the backend through `hc<AppType>` with the types of the backend routes.
- **Why:** If a route changes, TypeScript immediately reports every affected place in the frontend.
- **Rejected:** tRPC (same benefit, its own logic instead of HTTP routes). OpenAPI codegen (extra step).
- **Caution:** Write routes chained. The client does not throw on HTTP errors, check `res.ok`.

## 0004: PostgreSQL as database

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** PostgreSQL 17, locally via Docker Compose.
- **Why:** Relational data (users, roles, conversations, check-ins). JSONB for loose data, pgvector later for embeddings.
- **Rejected:** MongoDB (relations are cumbersome). MySQL (no pgvector). SQLite (weak with concurrent writes).
- **Caution:** The image does not include pgvector.

## 0005: Drizzle as ORM

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert
- **Decision:** Schema in TypeScript (`apps/backend/src/db/schema.ts`), migrations with drizzle-kit.
- **Why:** Types from the schema flow all the way into the frontend. Queries look like SQL.
- **Rejected:** Prisma (its own schema language, codegen). TypeORM (weaker types).
- **Caution:** Version 1.0.0-rc.4 is a release candidate. `db:push` and `db:seed` only locally, the seed deletes all data.

## 0006: TanStack Query for server data

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert
- **Decision:** TanStack Query loads and caches backend data, requests go through the Hono client.
- **Why:** Cache, loading and error states and invalidation after writes are built in.
- **Rejected:** SWR (less invalidation). `useEffect` with `useState` (a poor rebuild of the same).
- **Caution:** The `queryFn` must throw itself on `!res.ok`.

## 0007: TanStack Router

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert
- **Decision:** File-based routing in `apps/frontend/src/routes/`.
- **Why:** Type-safe routes. Loaders preload data through Query. Role guards via `beforeLoad`.
- **Rejected:** React Router (less type-safe, more loosely connected to Query).
- **Caution:** `routeTree.gen.ts` is generated, never edit it by hand.

## 0008: Tailwind and shadcn/ui

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert, @LilGravyyyy
- **Decision:** Styling with Tailwind 4, components from shadcn/ui based on Radix (style `radix-nova`).
- **Why:** Tailwind runs as a Vite plugin without config. shadcn components are customizable, accessible and have a dark mode. Radix instead of Base UI because there are more examples and information for it.
- **Rejected:** Mantine, MUI (hard to move away from the default look). Base UI (shadcn default since July 2026, benefits are rather long-term).
- **Caution:** Always call `shadcn init` with `-b radix`, otherwise it switches to Base UI. Added with #30.

## 0009: Project docs in the repo under docs/

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @LilGravyyyy, @justingebert · **Ref:** #28
- **Decision:** Docs live as Markdown in `docs/`: workflow in `workflow.md`, all decisions in one file `decisions.md`, specs per area in `specs/`. Entry point and maintenance rules are in `AGENTS.md`.
- **Why:** Versioned with the code and findable in one place for the team and AI agents. Few, short files, so the repo does not get cluttered.
- **Rejected:** One file per decision (too many files). Wiki or external tools (separate from the code). `README.md` in `docs/` (there should be only one README in the repo).

## 0010: Deployment on HTW VMs

- **Status:** accepted, trigger superseded by 0011 · **Date:** 2026-10-27 · **Involved:** @Lezhor · **Ref:** #18, #24, #34, #102
- **Decision:** Two VMs in the HTW network. On the ops-vm, a self-hosted GitHub runner builds both images and sends them via `docker save | ssh` to the prod-vm, where `deploy/deploy.sh` starts them with Docker Compose. Deploy on every merge to `main`, Sundays at 23:00 and manually. For now HTTP only and reachable only from the HTW network. Setup and operations in [`deployment.md`](deployment.md).
- **Why:** The runner opens the connection to GitHub itself, no port has to be opened into the HTW network. Without a registry, no credentials are needed in GitHub. On the prod-vm, the deploy key may only start `deploy.sh`; `compose.yml` and `deploy.sh` are root-owned there and never arrive via SSH: a compromised ops-vm could start its own images, but not with more privileges than `compose.yml` allows.
- **Rejected:** Builds on GitHub's runners (they cannot reach the HTW network). A registry like GHCR (token on the prod-vm, more parts). Preview deploys per PR (postponed to #103).
- **Caution:** The runner is attached to the repo because GitHub Free has no runner groups. Anyone with write access can use it with a workflow on their own branch. Never use `pull_request` as a trigger in `deploy.yml`. A rollback only restores the code, migrations stay. HTTPS and backups are still missing.

## 0011: Deploy only via releases

- **Status:** accepted · **Date:** 2026-10-30 · **Involved:** @Lezhor, @behritt · **Ref:** #110
- **Decision:** Only a published GitHub release whose commit is on `main` goes to the prod-vm. The team creates releases manually. GitHub generates the release notes from the PR titles since the last release. Apart from that, only the rollback is manual.
- **Why:** Different people develop frontend and backend at their own pace, not every state of `main` fits together. The team decides each time when a state goes live, e.g. right after a merge, after a specific feature or at the Sunday deadline.
- **Rejected:** Deploy on every merge and automatic releases on Sunday (see above). Grouped notes via `.github/release.yml` (the list of PR titles is enough). Preview of `main` on its own instance (postponed to #107).
- **Caution:** PR titles end up in the release notes and must be understandable there.

## 0012: Version numbers

- **Status:** accepted · **Date:** 2026-10-30 · **Involved:** @Lezhor, @behritt · **Ref:** #110
- **Decision:** Release tags are named `v0.MINOR.PATCH`, the first release is `v0.1.0`. The major version stays 0 for the whole prototype. Minor goes up when new features are included, patch when only bugs are fixed.
- **Why:** The team has not yet agreed on a final scheme. Everyone knows major, minor and patch, the 0 shows that it is a prototype.
- **Rejected:** A date as tag, e.g. `v2026.11.01` (not decided yet). Starting at `v1.0.0` (it remains a prototype).
- **Caution:** The `production` environment only allows tags `v0.*.*` to deploy. For a `v1.0.0`, change the tag rule there.

## 0013: Frontend code by area

- **Status:** accepted · **Date:** 2026-10-29 · **Involved:** @LilGravyyyy · **Ref:** #25
- **Decision:** Each domain area has a folder `apps/frontend/src/features/<area>/` with its components, queries and hooks. An area owns its own data and logic, it is neither an epic nor a screen. Folder names are English, a folder is only created once someone works on it. A screen is a thin route in `routes/` and composes parts from one or more areas, e.g. home and settings. Shared code lives in `components/ui/` (shadcn), `components/layout/` (app shell, help button) and `lib/`. Fixed, reviewed texts such as the crisis screen live in `content/`.
- **Why:** Several people work in parallel without getting in each other's way. An area can be found, reviewed and deleted as a whole. Screens change often, domain areas rarely.
- **Rejected:** Folders by type (`components/`, `queries/`, `hooks/` for everything), becomes confusing with ten areas. One folder per epic (audit has no UI, contacts are used by many areas). One folder per screen (home and settings access many areas).
- **Caution:** Areas may import each other, but not in a cycle, e.g. `incidents` → `questionnaires`, never the other way around. `components/` and `lib/` never import from `features/`. Heavy parts like the avatar are only loaded on their route.

## 0014: PWA with vite-plugin-pwa

- **Status:** accepted · **Date:** 2026-10-29 · **Involved:** @LilGravyyyy · **Ref:** #25, #53
- **Decision:** The frontend is a PWA. `vite-plugin-pwa` generates the manifest and service worker at build time. The crisis screen is hard-coded and thus part of the cached app shell.
- **Why:** Offline help, installation and web push require a service worker. The plugin is the standard for Vite and generates both without custom caching code.
- **Rejected:** Hand-written service worker (caching is error-prone). Native app (second codebase).
- **Caution:** Still open is how info material and contacts get offline (service worker caches API responses, Query cache in IndexedDB or content in the build), #53 decides this together with #62. Push requires the `injectManifest` mode. Interaction with Vite+ not yet verified.

## 0015: React Hook Form with Zod

- **Status:** accepted · **Date:** 2026-10-29 · **Involved:** @LilGravyyyy · **Ref:** #25, #31
- **Decision:** Forms use React Hook Form, validated with Zod schemas via `@hookform/resolvers`.
- **Why:** Most widely used, many examples with shadcn, same trade-off as for Radix in 0008. Our forms are small, more type safety brings little there.
- **Rejected:** TanStack Form (fits Query and Router, but younger and fewer examples). `useState` by hand (we would rebuild validation and error states).
- **Caution:** Radix fields are controlled and need `Controller`. Schemas come from the shared package from #31.

## 0016: Backend code by module

- **Status:** accepted, reference module replaced by 0020 · **Date:** 2026-11-01 · **Involved:** @behritt · **Ref:** #17
- **Decision:** Each domain area has a folder `apps/backend/src/modules/<area>/` with `<area>.routes.ts` and `<area>.service.ts`. Routes only handle HTTP: validate, call the service, set the status. Services contain logic and Drizzle queries, receive plain values and never the Hono `Context`. Shared code lives in `lib/` and `middleware/`. The REST contract is in [`specs/backend.md`](specs/backend.md), `users` is the reference module.
- **Why:** Same reasoning as in the frontend (0013): several people work in parallel, an area can be found, reviewed and deleted as a whole.
- **Rejected:** Classic MVC (folders by type become confusing, there are no views). A separate repository layer (Drizzle is already thin, it would just be boilerplate).
- **Caution:** Write routes chained and mount them in `app.ts` via `.route()`, otherwise `AppType` breaks (0003). Thrown errors do not show up in the RPC types, the frontend still checks `res.ok` (0006). Modules may only import the services of other modules, not in a cycle. `lib/` and `middleware/` never import from `modules/`.

## 0017: Git-based content

- **Status:** proposed · **Date:** 2026-11-03 · **Involved:** @justingebert · **Ref:** #43, #54
- **Decision:** Info material and contacts live as files in the repo, as do our own images and PDFs. Changes go through PRs with review, a schema checks the files in CI. The data format and whether the backend syncs the files into the database or reads them directly is decided by #54.
- **Why:** Every change to health content is versioned and reviewed, the PR is the record. No extra service on the VMs. Content and code stay together.
- **Rejected:** Self-hosted headless CMS like Directus, Strapi or Payload (its own service with logins, updates and backups, changes outside Git). CMS as SaaS like Contentful or Sanity (external provider, limits, hard to justify before the GDPR review #91).
- **Caution:** The repo is public: link third-party PDFs and images instead of hosting them, unless they are freely licensed. `db:seed` deletes all data and is not a path for content in production. A Git-based CMS like Keystatic or Decap can be added later if non-developers maintain content.

## 0018: Service worker with injectManifest

- **Status:** accepted · **Date:** 2026-11-02 · **Involved:** @LilGravyyyy · **Ref:** #53, #62, #68
- **Decision:** `vite-plugin-pwa` runs in `injectManifest` mode with its own `src/sw.ts`. At build time, the service worker caches the whole app shell (all chunks and icons) and answers navigations except `/api/*` with `index.html`. A new version only takes over on the next start, without `skipWaiting`. It does not cache API data. The icons are placeholders, generated from `public/favicon.svg`.
- **Why:** Push (#68) needs its own service worker. A reload in the middle of a check-in or the hard-incident flow would lose input. How info material and contacts get offline depends on the data model and belongs to #62.
- **Rejected:** `generateSW` (would need restructuring for push later). `autoUpdate` (reloads all open tabs). A "New version, reload" notice (its own UI, can be added later).
- **Caution:** Service workers only run over HTTPS or on `localhost`, on the prod-vm only with #109. The dev server has none, test with `vp run frontend#build` and `vp preview`. After changes to `favicon.svg`, regenerate the icons with `vp run frontend#generate-pwa-assets`.

## 0019: Shared package as source

- **Status:** accepted · **Date:** 2026-11-04 · **Involved:** @justingebert · **Ref:** #31
- **Decision:** `packages/shared` holds code used by both frontend and backend, mostly Zod schemas. Rules for what belongs there are in its `README.md`. It has no build step: `exports` point at `src/<folder>/index.ts`, imported as `@helthtw/shared/<folder>`. Packages in `packages/` get the `@helthtw/` scope so imports are clearly ours, apps keep their short names for `vp run backend#…`. Vite bundles it into the frontend, the backend bundles it into `dist` via `deps.alwaysBundle`. Real schemas come with the tickets that need them (#54, #136), until then `@helthtw/shared/example` is a placeholder.
- **Why:** Only used inside this repo, so a build would just add a watcher in `dev` and stale `dist/` folders. One folder per area like 0013 and 0016, so parallel PRs do not collide on one index file.
- **Caution:** Without `alwaysBundle` the backend bundle keeps `@helthtw/shared` external and Node fails on the `.ts` files in production. Both Dockerfiles copy `packages/shared`, a new package under `packages/` needs the same.

## 0020: Anonymous account by device ID

- **Status:** accepted · **Date:** 2026-11-05 · **Involved:** @behritt · **Ref:** #92, #93, #145
- **Decision:** The `accounts` table (`id` uuid, `createdAt`) replaces `users`, there are no fields for name, email or phone. The device creates the ID with `crypto.randomUUID()`, stores it in `localStorage` and sends it as `X-Account-Id` with every request. `middleware/require-account.ts` rejects a missing or invalid ID with 401 and creates the account on its first request. `DELETE /api/v1/accounts/me` deletes it, other tables with account data reference `accounts.id` as `account_id` with `onDelete: "cascade"`. `accounts` replaces `users` as the reference module from 0016.
- **Why:** Use without registration (#49). Deliberately simple, so that check-ins and questionnaires (#44, #45) can save.
- **Rejected:** Token hash in an httpOnly cookie (moved to #145). Creating the account only on the first write (#92 asks for first open).
- **Caution:** Insecure, test data only: the ID is also the password and readable via XSS, Safari deletes `localStorage` after 7 days without use. Hardening in #145.
