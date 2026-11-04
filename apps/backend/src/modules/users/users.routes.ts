import { Hono } from "hono";
import { z } from "zod";
import { validate } from "../../lib/validate";
import { getUser, listUsers } from "./users.service";

// The max is Postgres' integer limit, anything above would fail in the query as a 500.
const userParams = z.object({ id: z.coerce.number().int().positive().max(2_147_483_647) });

export const usersRoutes = new Hono()
  .get("/", async (c) => c.json({ items: await listUsers() }, 200))
  .get("/:id", validate("param", userParams), async (c) =>
    c.json(await getUser(c.req.valid("param").id), 200),
  );
