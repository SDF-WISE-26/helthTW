# 0012: Version numbers

- **Status:** accepted · **Date:** 2026-10-30 · **Involved:** @Lezhor, @behritt · **Ref:** #110
- **Decision:** Release tags are named `v0.MINOR.PATCH`, the first release is `v0.1.0`. The major version stays 0 for the whole prototype. Minor goes up when new features are included, patch when only bugs are fixed.
- **Why:** The team has not yet agreed on a final scheme. Everyone knows major, minor and patch, the 0 shows that it is a prototype.
- **Rejected:** A date as tag, e.g. `v2026.11.01` (not decided yet). Starting at `v1.0.0` (it remains a prototype).
- **Caution:** The `production` environment only allows tags `v0.*.*` to deploy. For a `v1.0.0`, change the tag rule there.
