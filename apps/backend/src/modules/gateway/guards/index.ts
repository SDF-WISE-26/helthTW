import { env } from "../../../lib/env";
import type { Guard } from "../gateway.types";
import { passthroughGuard } from "./passthrough.guard";

// Add a guard: implement Guard in its own file, register it here and in GUARD_PROVIDER in lib/env.ts.
const guards = {
  passthrough: passthroughGuard,
} satisfies Record<typeof env.GUARD_PROVIDER, Guard>;

export const activeGuard: Guard = guards[env.GUARD_PROVIDER];
