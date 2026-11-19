import { Hono } from "hono";
import { requireAccount } from "../../middleware/require-account";
import { deleteAccount, getAccount } from "./accounts.service";

export const accountsRoutes = new Hono()
  .get("/me", requireAccount, async (c) => c.json(await getAccount(c.get("accountId")), 200))
  .delete("/me", requireAccount, async (c) => {
    await deleteAccount(c.get("accountId"));
    return c.body(null, 204);
  });
