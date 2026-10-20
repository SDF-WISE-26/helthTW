import { Hono } from "hono";
import { db } from "./db";
import { usersTable } from "./db/schema";

// Routes must be chained so their types accumulate into AppType for the RPC client.
const app = new Hono()
  .basePath("/api")
  .get("/", (c) => c.text("Hello Hono!"))
  .get("/ping", (c) => c.json({ message: "pong" }, 200))
  .get("/users", async (c) => c.json(await db.select().from(usersTable), 200));

export default app;
export type AppType = typeof app;
