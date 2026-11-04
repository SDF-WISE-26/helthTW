# Git workflow

Summary of the rules that Git hooks and CI enforce. The PR checks come with PR #27.

## Branches

- `main` is protected, nobody pushes to it directly.
- One branch per ticket, from `main`: `feature/<nr>`, `bug/<nr>` or `hotfix/<nr>`, with the ticket number only, e.g. `feature/28`.
- `doku/<name>` for docs-only changes: needs no ticket and may merge to `main`.
- `experiment/<name>` for trying things out: runs through CI but must not merge to `main`.
- The PR pipeline rejects any other name.
- Commits from these branches are squashed: exactly one commit per PR lands on `main`, to keep the history clean.

## Commits

Commit messages and PR titles follow the Conventional Commits standard: `<type>(<scope>): <description>`

- Allowed types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`
- The scope is required and lowercase, e.g. `frontend`, `backend`, `db`, `repo`
- Example: `feat(frontend): add login page`

## From ticket to merge

1. Take the ticket on the board.
2. Create a branch: `git switch -c feature/<nr>`
3. Work and commit.
4. Before the PR, squash to one commit yourself:
   `git fetch && git rebase origin/main`, then `git reset --soft origin/main` and commit again.
   After changes from the review, squash again and upload with `git push --force-with-lease`.
5. Move the ticket on the board to "In review".
6. Open a PR against `main`, title in commit format, at least one review.
7. After the merge, the pipeline moves the ticket to "PO Abnahme".

## What is checked automatically

| When                                           | What                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| before every commit                            | `vp check --fix` and secretlint on changed files; if `.ts`/`.tsx` are among them, all tests |
| commit message                                 | format as above                                                                             |
| before every push                              | `vp run ready`: check, secretlint, tests, build                                             |
| push to one of the branch types above          | CI: `vp run ready` and gitleaks over the whole history                                      |
| PR against `main`                              | title, branch name, ticket is in "In review", exactly one commit                            |
| merge to `main`                                | CI, then deploy to the prod-vm (see below)                                                  |
| Sundays 23:00, manually under Actions → Deploy | deploy of `main`, a rollback with a commit hash in the `rollback` field                     |

The local hooks are only active once `vp install` has run.

## Deployment and database

- A merge does not go live, only a release of `main` does. The team decides when. The release notes consist of the PR titles since the last release, so write PR titles that make sense there. If the new version does not come up, `deploy.sh` starts the previous one again and the job turns red. Release, rollback and VM setup: [`deployment.md`](deployment.md).
- Changing the schema: edit `apps/backend/src/db/schema.ts`, run `vp run backend#db:generate`, commit the generated migration in `apps/backend/drizzle/` in the same PR. The deploy applies it. Locally, `db:push` stays.
- A migration must also work with the previous version, because a rollback only restores the code: new columns nullable or with a default, drop columns only one release later. Never change applied migrations, create a new one instead.
- Whoever changes `deploy/compose.yml` or `deploy/deploy.sh` must install them manually on the prod-vm at the next release. Until then, the deploy aborts with a notice.
