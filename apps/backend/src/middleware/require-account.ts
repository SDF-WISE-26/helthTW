import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { db } from "../db";
import { accountsTable } from "../db/schema";
import { ApiError } from "../lib/errors";

const accountId = z.uuid();

// PoC (#92): the device ID is both identifier and secret. Hardening in #145.
// Creates the account on its first request, so the app's first open creates it.
export const requireAccount = createMiddleware<{ Variables: { accountId: string } }>(
  async (c, next) => {
    const parsed = accountId.safeParse(c.req.header("X-Account-Id"));
    if (!parsed.success) throw new ApiError(401, "account_required", "Account required");
    await db.insert(accountsTable).values({ id: parsed.data }).onConflictDoNothing();
    c.set("accountId", parsed.data);
    await next();
  },
);
