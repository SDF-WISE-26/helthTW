# 0008: Tailwind and shadcn/ui

- **Status:** accepted · **Date:** 2026-10-20 · **Involved:** @justingebert, @LilGravyyyy
- **Decision:** Styling with Tailwind 4, components from shadcn/ui based on Radix (style `radix-nova`).
- **Why:** Tailwind runs as a Vite plugin without config. shadcn components are customizable, accessible and have a dark mode. Radix instead of Base UI because there are more examples and information for it.
- **Rejected:** Mantine, MUI (hard to move away from the default look). Base UI (shadcn default since July 2026, benefits are rather long-term).
- **Caution:** Always call `shadcn init` with `-b radix`, otherwise it switches to Base UI. Added with #30.
