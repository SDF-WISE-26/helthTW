import type { AppType } from "backend";
import { hc } from "hono/client";

// Typed client for the backend.
export const api = hc<AppType>("/");
