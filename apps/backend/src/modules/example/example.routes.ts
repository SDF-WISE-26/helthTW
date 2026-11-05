import { Hono } from "hono";
import { exampleSharedEnum } from "@helthtw/shared/example";
import { z } from "zod";
import { validate } from "../../lib/validate";

// Placeholder, see packages/shared/src/example. Validates with the shared enum and echoes it back.
export const exampleRoutes = new Hono().get(
  "/",
  validate("query", z.object({ status: exampleSharedEnum })),
  (c) => c.json({ status: c.req.valid("query").status }, 200),
);
