# 0004: PostgreSQL as database

- **Status:** accepted · **Date:** 2026-10-19 · **Involved:** @justingebert
- **Decision:** PostgreSQL 17, locally via Docker Compose.
- **Why:** Relational data (users, roles, conversations, check-ins). JSONB for loose data, pgvector later for embeddings.
- **Rejected:** MongoDB (relations are cumbersome). MySQL (no pgvector). SQLite (weak with concurrent writes).
- **Caution:** The image does not include pgvector.
