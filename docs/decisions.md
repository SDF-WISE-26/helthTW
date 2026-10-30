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

## 0010: Deployment auf HTW-VMs

- **Status:** angenommen, Auslöser ersetzt durch 0011 · **Datum:** 2026-10-27 · **Beteiligt:** @Lezhor · **Bezug:** #18, #24, #34, #102
- **Entscheidung:** Zwei VMs im HTW-Netz. Auf der ops-vm baut ein selbst gehosteter GitHub-Runner beide Images und schickt sie per `docker save | ssh` an die prod-vm, dort startet `deploy/deploy.sh` sie mit Docker Compose. Deploy bei jedem Merge auf `main`, sonntags um 23:00 und von Hand. Vorerst nur HTTP und nur aus dem HTW-Netz erreichbar. Einrichtung und Betrieb in [`deployment.md`](deployment.md).
- **Warum:** Der Runner baut die Verbindung zu GitHub selbst auf, ins HTW-Netz muss kein Port geöffnet werden. Ohne Registry braucht es keine Zugangsdaten in GitHub. Der Deploy-Schlüssel darf auf der prod-vm nur `deploy.sh` starten, `compose.yml` und `deploy.sh` liegen dort root-eigen und kommen nie über SSH: Eine übernommene ops-vm könnte eigene Images starten, aber nicht mit mehr Rechten, als `compose.yml` erlaubt.
- **Verworfen:** Builds auf GitHubs Runnern (die erreichen das HTW-Netz nicht). Eine Registry wie GHCR (Token auf der prod-vm, mehr Teile). Vorschau-Deploys pro PR (verschoben auf #103).
- **Achtung:** Der Runner hängt am Repo, weil GitHub Free keine Runner-Gruppen hat. Wer Schreibrechte hat, kann ihn mit einem Workflow auf dem eigenen Branch nutzen. Nie `pull_request` als Auslöser in `deploy.yml`. Ein Rollback holt nur den Code zurück, Migrationen bleiben. HTTPS und Backups fehlen noch.

## 0011: Deploy nur über Releases

- **Status:** angenommen · **Datum:** 2026-10-30 · **Beteiligt:** @Lezhor, @behritt · **Bezug:** #110
- **Entscheidung:** Auf die prod-vm kommt nur ein veröffentlichtes GitHub-Release, dessen Commit auf `main` liegt. Releases legt das Team von Hand an. Die Release-Notizen erzeugt GitHub aus den Titeln der PRs seit dem letzten Release. Von Hand gibt es sonst nur den Rollback.
- **Warum:** Frontend und Backend entwickeln verschiedene Leute in eigenem Tempo, nicht jeder Stand von `main` passt zusammen. Das Team entscheidet jedes Mal, wann ein Stand live geht, z. B. direkt nach einem Merge, nach einem bestimmten Feature oder zur Sonntagsfrist.
- **Verworfen:** Deploy bei jedem Merge und automatische Releases am Sonntag (s. o.). Gruppierte Notizen per `.github/release.yml` (die Liste der PR-Titel reicht). Vorschau von `main` auf eigener Instanz (verschoben auf #107).
- **Achtung:** PR-Titel landen in den Release-Notizen und müssen dort verständlich sein.

## 0012: Versionsnummern

- **Status:** angenommen · **Datum:** 2026-10-30 · **Beteiligt:** @Lezhor, @behritt · **Bezug:** #110
- **Entscheidung:** Release-Tags heißen `v0.MINOR.PATCH`, das erste Release ist `v0.1.0`. Die Major-Version bleibt für den ganzen Prototyp 0. Minor steigt, wenn neue Funktionen dabei sind, Patch, wenn nur Fehler behoben sind.
- **Warum:** Auf ein endgültiges Schema hat sich das Team noch nicht geeinigt. Major, Minor und Patch kennt jeder, die 0 zeigt, dass es ein Prototyp ist.
- **Verworfen:** Ein Datum als Tag, z. B. `v2026.11.01` (noch nicht entschieden). Start bei `v1.0.0` (es bleibt ein Prototyp).
- **Achtung:** Das Environment `production` lässt nur Tags `v0.*.*` deployen. Für eine `v1.0.0` dort die Tag-Regel ändern.

## 0013: Frontend-Code nach Bereichen

- **Status:** angenommen · **Datum:** 2026-10-29 · **Beteiligt:** @LilGravyyyy · **Bezug:** #25
- **Entscheidung:** Jeder Fachbereich hat einen Ordner `apps/frontend/src/features/<bereich>/` mit seinen Komponenten, Queries und Hooks. Dateien in `routes/` bleiben dünn: Loader und Feature-Komponenten, keine eigene Logik. Geteiltes liegt in `components/ui/` (shadcn), `components/layout/` (App-Shell, Hilfe-Button) und `lib/`. Feste, geprüfte Texte wie der Krisenbildschirm liegen in `content/`.
- **Warum:** Die Bereiche folgen den Epics, so arbeiten mehrere Leute parallel, ohne sich in die Quere zu kommen. Ein Bereich lässt sich als Ganzes finden, prüfen und löschen.
- **Verworfen:** Ordner nach Typ (`components/`, `queries/`, `hooks/` für alles), wird mit zehn Bereichen unübersichtlich.
- **Achtung:** Bereiche dürfen sich gegenseitig importieren, `components/` und `lib/` importieren nie aus `features/`. Schwere Teile wie der Avatar werden nur auf ihrer Route geladen.

## 0014: PWA mit vite-plugin-pwa

- **Status:** angenommen · **Datum:** 2026-10-29 · **Beteiligt:** @LilGravyyyy · **Bezug:** #25, #53
- **Entscheidung:** Das Frontend ist eine PWA. Manifest und Service Worker erzeugt `vite-plugin-pwa` beim Build. Der Krisenbildschirm steckt fest im Code und damit in der gecachten App-Shell.
- **Warum:** Offline-Hilfe, Installation und Web Push setzen einen Service Worker voraus. Das Plugin ist der Standard für Vite und erzeugt beides ohne eigenen Caching-Code.
- **Verworfen:** Service Worker von Hand (Caching ist fehleranfällig). Native App (zweite Codebasis).
- **Achtung:** Offen ist, wie Infomaterial und Kontakte offline kommen (Service Worker cacht API-Antworten, Query-Cache in IndexedDB oder Inhalte im Build), das entscheidet #53 mit #62. Für Push braucht es den Modus `injectManifest`. Zusammenspiel mit Vite+ noch ungeprüft.

## 0015: React Hook Form mit Zod

- **Status:** angenommen · **Datum:** 2026-10-29 · **Beteiligt:** @LilGravyyyy · **Bezug:** #25, #31
- **Entscheidung:** Formulare laufen über React Hook Form, validiert mit Zod-Schemas über `@hookform/resolvers`.
- **Warum:** Am weitesten verbreitet, viele Beispiele mit shadcn, gleiche Abwägung wie bei Radix in 0008. Unsere Formulare sind klein, mehr Typsicherheit bringt dort wenig.
- **Verworfen:** TanStack Form (passt zu Query und Router, aber jünger und weniger Beispiele). `useState` von Hand (Validierung und Fehlerzustände bauen wir nach).
- **Achtung:** Radix-Felder sind kontrolliert und brauchen `Controller`. Schemas kommen aus dem gemeinsamen Paket aus #31.
