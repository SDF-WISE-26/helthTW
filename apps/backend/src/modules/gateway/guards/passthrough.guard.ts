import type { Guard } from "../gateway.types";

// Lets everything through. Placeholder until a real guard exists, so no real health data yet.
export const passthroughGuard: Guard = {
  name: "passthrough",
  checkInput: async () => ({ action: "allow" }),
  checkOutput: async () => ({ action: "allow" }),
};
