import { Hono } from "hono";

// Routes must be chained so their types accumulate into AppType for the RPC client.
const app = new Hono()
  .basePath("/api")
  .get("/", (c) => c.text("Hello Hono!"))
  .get("/ping", (c) => c.json({ message: "pong" }, 200));

export default app;
export type AppType = typeof app;
