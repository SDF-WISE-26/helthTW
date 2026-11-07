# Decisions in separate files, read on request

- **Status:** accepted · **Date:** 2026-11-07 · **Involved:** @LilGravyyyy · **Ref:** #170
- **Decision:** Supersedes 0009. Docs stay Markdown in `docs/`: workflow in `workflow.md`, specs per area in `specs/`, entry point and maintenance rules in `AGENTS.md`. Decisions live in `docs/decisions/`, one file each, named `<YYYY-MM-DD>-<topic>.md`. 0001 to 0019 keep their number as name. Superseded decisions stay in the folder, their status line names the successor. Agents only read decisions when a human asks them to, and suggest recording new ones.
- **Why:** In one file, everyone appended the next number at the bottom, so parallel PRs conflicted and numbers had to be changed. `AGENTS.md` sent agents to all decisions, which biased every chat and brainstorming from the start.
- **Rejected:** Ticket number in the file name (not every decision has a ticket). Keeping one file with Git's `merge=union` (numbers still collide). Numbers assigned by a GitHub Action after the merge (extra automation, commits on `main`). A `superseded/` folder (extra step, breaks links, partly superseded decisions like 0010 do not fit).
- **Caution:** Two decisions on the same day need different topics.
