# 0015: React Hook Form with Zod

- **Status:** accepted · **Date:** 2026-10-29 · **Involved:** @LilGravyyyy · **Ref:** #25, #31
- **Decision:** Forms use React Hook Form, validated with Zod schemas via `@hookform/resolvers`.
- **Why:** Most widely used, many examples with shadcn, same trade-off as for Radix in 0008. Our forms are small, more type safety brings little there.
- **Rejected:** TanStack Form (fits Query and Router, but younger and fewer examples). `useState` by hand (we would rebuild validation and error states).
- **Caution:** Radix fields are controlled and need `Controller`. Schemas come from the shared package from #31.
