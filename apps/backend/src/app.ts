import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireAccount } from "./account";
import { db } from "./db";
import { accountsTable } from "./db/schema";
import { errorHandler, notFoundHandler } from "./lib/errors";
import { exampleRoutes } from "./modules/example/example.routes";

// Routes must be chained so their types accumulate into AppType for the RPC client.
const app = new Hono()
  .basePath("/api")
  .get("/", (c) => c.text("Hello Hono!"))
  // Not /api/ping: HTW's network drops requests to exactly that path when they come through the VPN.
  .get("/alive_ping", (c) => c.json({ message: "pong" }, 200))
  .get("/me", requireAccount, (c) => c.json({ id: c.get("accountId") }, 200))
  // Account data in other tables goes with it via onDelete: "cascade" (#93).
  .delete("/me", requireAccount, async (c) => {
    await db.delete(accountsTable).where(eq(accountsTable.id, c.get("accountId")));
    return c.body(null, 204);
  })
  .route("/v1/example", exampleRoutes);

app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;
export type AppType = typeof app;
