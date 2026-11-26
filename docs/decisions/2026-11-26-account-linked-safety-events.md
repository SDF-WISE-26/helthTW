# Account-linked safety events

- **Status:** proposed
- **Date:** 2026-11-26
- **Involved:** @FrancNjoutsa
- **Ref:** #155

## Decision

Safety events are linked to anonymous accounts using
`account_id`.

Each safety event stores only:

- Rule name
- Result
- Optional crisis category
- Timestamp
- Account reference

No chat messages, prompts, or generated responses are stored.

When an account is deleted, its safety events are
automatically deleted through `ON DELETE CASCADE`.

## Why

- Follows the existing account architecture (decision 0020).
- Supports the account data deletion requirement.
- Avoids storing the chat content that triggered a rule.
- Provides a consistent interface for safety modules.

## Rejected

Fully anonymous safety events without account references.

Although this would reduce linkability, account-linked
events provide a clear deletion lifecycle and allow
events to be associated with an account when necessary.

## Caution

Account IDs are pseudonymous identifiers, not fully
anonymous data.

Only approved metadata values may be stored.
Never pass chat content to the logging service.

Access to safety events must be restricted.
