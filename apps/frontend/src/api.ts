import type { AppType } from "backend";
import { hc } from "hono/client";
import { getAccountId } from "@/lib/account-id";

// Typed client for the backend.
export const api = hc<AppType>("/", { headers: () => ({ "X-Account-Id": getAccountId() }) });
