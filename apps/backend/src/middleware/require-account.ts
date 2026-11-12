import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { db } from "../db";
import { accountsTable } from "../db/schema";
import { ApiError } from "../lib/errors";

const accountId = z.uuid();

// PoC: the device ID is both identifier and secret, test data only.
// Creates the account on its first request, so the app's first open creates it.
// shortcut: one insert per request on top of the route's own query, merge into one query once it costs.
export const requireAccount = createMiddleware<{ Variables: { accountId: string } }>(
  async (c, next) => {
    const parsed = accountId.safeParse(c.req.header("X-Account-Id"));
    if (!parsed.success) throw new ApiError(401, "account_required", "Account required");
    await db.insert(accountsTable).values({ id: parsed.data }).onConflictDoNothing();
    c.set("accountId", parsed.data);
    await next();
  },
);
