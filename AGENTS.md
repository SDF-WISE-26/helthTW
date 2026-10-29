<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Project Docs

| Path                                     | Content                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| [`docs/workflow.md`](docs/workflow.md)   | Branches, commits, PRs, automated checks                                 |
| [`docs/decisions.md`](docs/decisions.md) | Decisions with reasons, numbered. Read before changing the architecture. |
| [`docs/specs/`](docs/specs/)             | What each area must do, one file per area (e.g. `frontend.md`)           |

## Project Rules

- Branches: `feature/<ticket>`, `bug/<ticket>` or `hotfix/<ticket>`, ticket number only.
- Commits and PR titles follow Conventional Commits: `<type>(<scope>): <description>`. The scope is required, lowercase (e.g. `frontend`, `backend`, `db`, `repo`). Allowed types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`.
- A PR contains exactly one commit.
- Frontend code is grouped by area in `apps/frontend/src/features/<area>/`, routes stay thin (decision 0010).

## Maintaining Docs

- Keep everything as short as possible. New files only if the content fits nowhere else.
- Changes to `docs/` go through PRs like code.
- `decisions.md`: append at the bottom in the same structure. Only decisions that are expensive to reverse or were discussed. Accepted on merge. Never overwrite: add a new number and mark the old one "ersetzt durch 00xx".
- `specs/`: describe _what_ an area must do, not how it looks or is built.
- `workflow.md`: update in the same PR when hooks or pipelines change.
- The repo is public: no names, emails, credentials, interview or health data.
