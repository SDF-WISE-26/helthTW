# 0001: Vite+ as toolchain

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** Dev server, build, lint, format, tests and monorepo tasks run through `vp`.
- **Why:** Everyone has the same rules and commands, without their own configs.
- **Rejected:** Individual tools like ESLint and Prettier (more coordination). Nx, Turborepo (too heavy for us).
- **Caution:** Vite+ is young (1.3), AI agents barely know it, hence `AGENTS.md`.
