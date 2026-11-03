import { Hono } from "hono";
import { errorHandler, notFoundHandler } from "./lib/errors";
import { usersRoutes } from "./modules/users/users.routes";

// Routes must be chained so their types accumulate into AppType for the RPC client.
const app = new Hono()
  .basePath("/api")
  .get("/", (c) => c.text("Hello Hono!"))
  // Not /api/ping: HTW's network drops requests to exactly that path when they come through the VPN.
  .get("/alive_ping", (c) => c.json({ message: "pong" }, 200))
  .route("/v1/users", usersRoutes);

app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;
export type AppType = typeof app;
