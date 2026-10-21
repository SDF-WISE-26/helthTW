# Entscheidungen

Neue Entscheidungen unten anhängen, fortlaufend nummeriert und im selben Aufbau wie die bestehenden: Status (vorgeschlagen, angenommen oder ersetzt durch 00xx), Datum, Beteiligt, Entscheidung, Warum, Verworfen und optional Achtung.

## 0001: Vite+ als Werkzeugkette

- **Status:** angenommen · **Datum:** 2026-10-19 · **Beteiligt:** @justingebert
- **Entscheidung:** Dev-Server, Build, Lint, Format, Tests und Monorepo-Tasks laufen über `vp`.
- **Warum:** Alle haben dieselben Regeln und Befehle, ohne eigene Configs.
- **Verworfen:** Einzelwerkzeuge wie ESLint und Prettier (mehr Abstimmung). Nx, Turborepo (zu schwer für uns).
- **Achtung:** Vite+ ist jung (1.3), KI-Agenten kennen es kaum, deshalb `AGENTS.md`.

## 0002: Hono als Backend-Framework

- **Status:** angenommen · **Datum:** 2026-10-19 · **Beteiligt:** @justingebert
- **Entscheidung:** Das Backend ist eine Hono-App in TypeScript unter Node.
- **Warum:** Gleiche Sprache wie im Frontend. Schnell gelernt. Streaming und WebSockets für Chat und Sprache eingebaut.
- **Verworfen:** Express (keine Typen, kein RPC). NestJS (viel Boilerplate). Python (KI-Dienste laufen ohnehin separat hinter HTTP).
- **Achtung:** Keine vorgegebene Code-Struktur, siehe #17.

## 0003: Hono RPC zwischen Frontend und Backend

- **Status:** angenommen · **Datum:** 2026-10-19 · **Beteiligt:** @justingebert
- **Entscheidung:** Das Frontend ruft das Backend über `hc<AppType>` mit den Typen der Backend-Routen auf.
- **Warum:** Ändert sich eine Route, meldet TypeScript sofort jede betroffene Stelle im Frontend.
- **Verworfen:** tRPC (gleicher Nutzen, eigene Logik statt HTTP-Routen). OpenAPI-Codegen (Zusatzschritt).
- **Achtung:** Routen verkettet schreiben. Der Client wirft bei HTTP-Fehlern nicht, `res.ok` prüfen.

## 0004: PostgreSQL als Datenbank

- **Status:** angenommen · **Datum:** 2026-10-19 · **Beteiligt:** @justingebert
- **Entscheidung:** PostgreSQL 17, lokal per Docker Compose.
- **Warum:** Relationale Daten (Nutzer, Rollen, Gespräche, Check-ins). JSONB für lose Daten, pgvector später für Embeddings.
- **Verworfen:** MongoDB (Beziehungen umständlich). MySQL (kein pgvector). SQLite (schwach bei parallelen Schreibzugriffen).
- **Achtung:** Das Image enthält kein pgvector.

## 0005: Drizzle als ORM

- **Status:** angenommen · **Datum:** 2026-10-20 · **Beteiligt:** @justingebert
- **Entscheidung:** Schema in TypeScript (`apps/backend/src/db/schema.ts`), Migrationen mit drizzle-kit.
- **Warum:** Typen aus dem Schema fließen bis ins Frontend. Abfragen sehen aus wie SQL.
- **Verworfen:** Prisma (eigene Schemasprache, Codegen). TypeORM (schwächere Typen).
- **Achtung:** Version 1.0.0-rc.4 ist ein Release Candidate. `db:push` und `db:seed` nur lokal, der Seed löscht alle Daten.

## 0006: TanStack Query für Serverdaten

- **Status:** angenommen · **Datum:** 2026-10-20 · **Beteiligt:** @justingebert
- **Entscheidung:** TanStack Query lädt und cacht Backend-Daten, die Anfragen laufen über den Hono-Client.
- **Warum:** Cache, Lade- und Fehlerzustände und Invalidierung nach Schreibvorgängen sind eingebaut.
- **Verworfen:** SWR (weniger Invalidierung). `useEffect` mit `useState` (baut das schlecht nach).
- **Achtung:** Die `queryFn` muss bei `!res.ok` selbst werfen.

## 0007: TanStack Router

- **Status:** angenommen · **Datum:** 2026-10-20 · **Beteiligt:** @justingebert
- **Entscheidung:** Dateibasiertes Routing in `apps/frontend/src/routes/`.
- **Warum:** Typsichere Routen. Loader laden Daten über Query vor. Rollen-Guards per `beforeLoad`.
- **Verworfen:** React Router (weniger typsicher, lockerer mit Query verbunden).
- **Achtung:** `routeTree.gen.ts` wird erzeugt, nie von Hand ändern.

## 0008: Tailwind und shadcn/ui

- **Status:** angenommen · **Datum:** 2026-10-20 · **Beteiligt:** @justingebert, @LilGravyyyy
- **Entscheidung:** Styling mit Tailwind 4, Komponenten aus shadcn/ui auf Basis von Radix (Stil `radix-nova`).
- **Warum:** Tailwind läuft als Vite-Plugin ohne Config. shadcn-Komponenten sind anpassbar, barrierefrei und haben einen dunklen Modus. Radix statt Base UI, weil es dazu mehr Beispiele und Informationen gibt.
- **Verworfen:** Mantine, MUI (schwer vom Standard-Look wegzubekommen). Base UI (seit Juli 2026 shadcn-Voreinstellung, Vorteile eher langfristig).
- **Achtung:** `shadcn init` immer mit `-b radix` aufrufen, sonst stellt es auf Base UI um. Eingebaut mit #30.

## 0009: Projektdoku im Repo unter docs/

- **Status:** angenommen · **Datum:** 2026-10-20 · **Beteiligt:** @LilGravyyyy, @justingebert · **Bezug:** #28
- **Entscheidung:** Doku liegt als Markdown in `docs/`: Workflow in `workflow.md`, alle Entscheidungen in einer Datei `decisions.md`, Specs pro Bereich in `specs/`. Einstieg und Pflegeregeln stehen in `AGENTS.md`.
- **Warum:** Versioniert mit dem Code und für Team und KI-Agenten an einer Stelle auffindbar. Wenige, kurze Dateien, damit das Repo nicht zugemüllt wird.
- **Verworfen:** Eine Datei pro Entscheidung (zu viele Dateien). Wiki oder externe Tools (getrennt vom Code). `README.md` in `docs/` (es soll nur eine README im Repo geben).
