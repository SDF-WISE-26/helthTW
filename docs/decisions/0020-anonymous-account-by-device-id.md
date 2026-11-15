# 0020: Anonymous account by device ID

- **Status:** accepted · **Date:** 2026-11-05 · **Involved:** @behritt · **Ref:** #92, #93, #145
- **Decision:** The `accounts` table (`id` uuid, `createdAt`) replaces `users`, there are no fields for name, email or phone. The device creates the ID with `crypto.randomUUID()`, stores it in `localStorage` and sends it as `X-Account-Id` with every request. `middleware/require-account.ts` rejects a missing or invalid ID with 401 and creates the account on its first request. `DELETE /api/v1/accounts/me` deletes it, other tables with account data reference `accounts.id` as `account_id` with `onDelete: "cascade"`. `accounts` replaces `users` as the reference module from 0016, requirements in [`specs/accounts.md`](../specs/accounts.md).
- **Why:** Use without registration (#49). Deliberately simple, so that check-ins and questionnaires (#44, #45) can save.
- **Rejected:** Token hash in an httpOnly cookie (moved to #145). Creating the account only on the first write (#92 asks for first open).
- **Caution:** Insecure, test data only: the ID is also the password and readable via XSS, Safari deletes `localStorage` after 7 days without use. Hardening in #145.
