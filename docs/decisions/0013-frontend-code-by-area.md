# 0013: Frontend code by area

- **Status:** accepted · **Date:** 2026-10-29 · **Involved:** @LilGravyyyy · **Ref:** #25
- **Decision:** Each domain area has a folder `apps/frontend/src/features/<area>/` with its components, queries and hooks. An area owns its own data and logic, it is neither an epic nor a screen. Folder names are English, a folder is only created once someone works on it. A screen is a thin route in `routes/` and composes parts from one or more areas, e.g. home and settings. Shared code lives in `components/ui/` (shadcn), `components/layout/` (app shell, help button) and `lib/`. Fixed, reviewed texts such as the crisis screen live in `content/`.
- **Why:** Several people work in parallel without getting in each other's way. An area can be found, reviewed and deleted as a whole. Screens change often, domain areas rarely.
- **Rejected:** Folders by type (`components/`, `queries/`, `hooks/` for everything), becomes confusing with ten areas. One folder per epic (audit has no UI, contacts are used by many areas). One folder per screen (home and settings access many areas).
- **Caution:** Areas may import each other, but not in a cycle, e.g. `incidents` → `questionnaires`, never the other way around. `components/` and `lib/` never import from `features/`. Heavy parts like the avatar are only loaded on their route.
