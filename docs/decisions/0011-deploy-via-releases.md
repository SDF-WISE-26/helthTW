# 0011: Deploy only via releases

- **Status:** accepted · **Date:** 2026-10-30 · **Involved:** @Lezhor, @behritt · **Ref:** #110
- **Decision:** Only a published GitHub release whose commit is on `main` goes to the prod-vm. The team creates releases manually. GitHub generates the release notes from the PR titles since the last release. Apart from that, only the rollback is manual.
- **Why:** Different people develop frontend and backend at their own pace, not every state of `main` fits together. The team decides each time when a state goes live, e.g. right after a merge, after a specific feature or at the Sunday deadline.
- **Rejected:** Deploy on every merge and automatic releases on Sunday (see above). Grouped notes via `.github/release.yml` (the list of PR titles is enough). Preview of `main` on its own instance (postponed to #107).
- **Caution:** PR titles end up in the release notes and must be understandable there.
