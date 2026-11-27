# Frontend

The helthTW PWA. Setup and the shared commands are in the [root README](../../README.md).

React with TanStack Router and Query, Tailwind and shadcn/ui, React Hook Form with Zod, vite-plugin-pwa. The reasons are in [`docs/decisions/`](../../docs/decisions/).

## Layout

| Path                      | What                                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| `src/routes/`             | Thin screens, file-based routing. `routeTree.gen.ts` is generated      |
| `src/features/<area>/`    | Components, queries and hooks of one area (decision 0013)              |
| `src/components/ui/`      | shadcn/ui components                                                   |
| `src/components/layout/`  | App shell                                                              |
| `src/content/`            | Fixed texts in code, e.g. the crisis screen                            |
| `src/api.ts`              | Typed Hono client for the backend                                      |
| `src/sw.ts`               | Service worker                                                         |
| `content-collections.ts`  | Schemas for the files in [`content/`](../../content/README.md)         |
| `Dockerfile`, `Caddyfile` | Image for the prod-vm, see [`deployment.md`](../../docs/deployment.md) |

## Commands

Run from the repo root:

- Generate the types for `content/` without a full build:

```bash
vp run frontend#content
```

- Try the PWA: the service worker and manifest only exist in the build:

```bash
vp run frontend#build
vp run frontend#preview
```

- Regenerate the icons in `public/` after changing `public/favicon.svg`:

```bash
vp run frontend#generate-pwa-assets
```
