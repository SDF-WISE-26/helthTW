import { createMiddleware } from "hono/factory";
import { db } from "./db";
import { accountsTable } from "./db/schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// PoC (#92): the device ID is both identifier and secret. Hardening in #145.
// Creates the account on its first request, so the app's first open creates it.
export const requireAccount = createMiddleware<{ Variables: { accountId: string } }>(
  async (c, next) => {
    const id = c.req.header("X-Account-Id");
    if (!id || !UUID.test(id)) return c.json({ error: "account required" }, 401);
    await db.insert(accountsTable).values({ id }).onConflictDoNothing();
    c.set("accountId", id);
    await next();
  },
);
