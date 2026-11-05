# syntax=docker/dockerfile:1
# Multi-stage build as in node_modules/vite-plus/docs/guide/docker.md.
# Build from the repo root: docker build -f apps/frontend/Dockerfile .

# --- build: compiles the frontend, needs the backend and shared sources for the API types
FROM ghcr.io/voidzero-dev/vite-plus:1.3.0 AS build
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version ./
COPY --chown=vp:vp apps/backend/package.json apps/backend/
COPY --chown=vp:vp apps/frontend/package.json apps/frontend/
COPY --chown=vp:vp packages/shared/package.json packages/shared/
RUN vp install --frozen-lockfile --filter "frontend..."
COPY --chown=vp:vp packages/shared packages/shared
COPY --chown=vp:vp apps/backend apps/backend
COPY --chown=vp:vp apps/frontend apps/frontend
RUN vp run frontend#build

# --- runtime: Caddy serves the files and forwards /api to the backend
FROM caddy:2.11.7-alpine AS runtime
COPY apps/frontend/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/frontend/dist /srv
USER nobody
EXPOSE 8080
