# syntax=docker/dockerfile:1
# Multi-stage build as in node_modules/vite-plus/docs/guide/docker.md.
# Build from the repo root: docker build -f apps/backend/Dockerfile .

# --- build: full toolchain, compiles the backend
FROM ghcr.io/voidzero-dev/vite-plus:1.3.0 AS build
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version ./
COPY --chown=vp:vp apps/backend/package.json apps/backend/
COPY --chown=vp:vp apps/frontend/package.json apps/frontend/
RUN vp install --frozen-lockfile --filter backend
COPY --chown=vp:vp apps/backend apps/backend
RUN vp run backend#build
# The exact Node.js that vp resolved from .node-version.
RUN cp "$(vp env which node | head -1)" /tmp/node

# --- deps: production dependencies of the backend only, without the toolchain
FROM ghcr.io/voidzero-dev/vite-plus:1.3.0 AS deps
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version ./
COPY --chown=vp:vp apps/backend/package.json apps/backend/
COPY --chown=vp:vp apps/frontend/package.json apps/frontend/
RUN vp install --frozen-lockfile --prod --filter backend

# --- runtime: Node.js and the built backend, nothing else
FROM debian:trixie-slim AS runtime
ENV NODE_ENV=production DOTENV_CONFIG_QUIET=true
COPY --from=build /tmp/node /usr/local/bin/node
WORKDIR /app/apps/backend
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/backend/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./dist
COPY apps/backend/drizzle ./drizzle
USER nobody
EXPOSE 3000
CMD ["node", "dist/index.mjs"]
