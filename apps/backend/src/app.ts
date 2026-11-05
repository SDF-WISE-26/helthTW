import { Hono } from "hono";
import { requireAccount } from "./account";
import { db } from "./db";
import { usersTable } from "./db/schema";

// Routes must be chained so their types accumulate into AppType for the RPC client.
const app = new Hono()
  .basePath("/api")
  .get("/", (c) => c.text("Hello Hono!"))
  // Not /api/ping: HTW's network drops requests to exactly that path when they come through the VPN.
  .get("/alive_ping", (c) => c.json({ message: "pong" }, 200))
  .get("/users", async (c) => c.json(await db.select().from(usersTable), 200))
  .get("/me", requireAccount, (c) => c.json({ id: c.get("accountId") }, 200))
  // shortcut: mock, deletes nothing yet.
  .delete("/me", requireAccount, (c) => c.body(null, 204));

export default app;
export type AppType = typeof app;
