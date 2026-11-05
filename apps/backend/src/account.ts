import { createMiddleware } from "hono/factory";

// PoC (#92): the device ID is both identifier and secret. Hardening in #145.
// shortcut: mock without DB, replaced by the real lookup in the next step.
export const requireAccount = createMiddleware<{ Variables: { accountId: string } }>(
  async (c, next) => {
    const id = c.req.header("X-Account-Id");
    if (!id) return c.json({ error: "account required" }, 401);
    c.set("accountId", id);
    await next();
  },
);
