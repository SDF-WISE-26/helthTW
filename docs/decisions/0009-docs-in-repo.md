# 0009: Project docs in the repo under docs/

- **Status:** superseded by 2026-11-07-decisions-as-files · **Date:** 2026-10-20 · **Involved:** @LilGravyyyy, @justingebert · **Ref:** #28
- **Decision:** Docs live as Markdown in `docs/`: workflow in `workflow.md`, all decisions in one file `decisions.md`, specs per area in `specs/`. Entry point and maintenance rules are in `AGENTS.md`.
- **Why:** Versioned with the code and findable in one place for the team and AI agents. Few, short files, so the repo does not get cluttered.
- **Rejected:** One file per decision (too many files). Wiki or external tools (separate from the code). `README.md` in `docs/` (there should be only one README in the repo).
