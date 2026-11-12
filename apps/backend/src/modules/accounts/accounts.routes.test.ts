import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vite-plus/test";
import { accountsTable } from "../../db/schema";

const hasDb = !!process.env.DATABASE_URL;
process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { default: app } = await import("../../app");
const { db } = await import("../../db");

const me = (id?: string, method = "GET") =>
  app.request("/api/v1/accounts/me", { method, headers: id ? { "X-Account-Id": id } : {} });

describe("requireAccount", () => {
  it("rejects requests without an account ID", async () => {
    const res = await me();
    expect(res.status).toBe(401);
    expect((await res.json()).error.code).toBe("account_required");
  });

  it("rejects IDs that are not a UUID", async () => {
    expect((await me("1 or 1=1")).status).toBe(401);
  });

  it("answers unknown routes in the error format", async () => {
    const res = await app.request("/api/v1/nope");
    expect(res.status).toBe(404);
    expect((await res.json()).error.code).toBe("not_found");
  });
});

describe.skipIf(!hasDb)("account in the database", () => {
  const id = crypto.randomUUID();

  afterAll(() => db.$client.end());

  it("creates the account on the first request", async () => {
    const res = await me(id);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id });
    expect(await db.select().from(accountsTable).where(eq(accountsTable.id, id))).toHaveLength(1);
  });

  it("does not create a second account for the same ID", async () => {
    await me(id);
    expect(await db.select().from(accountsTable).where(eq(accountsTable.id, id))).toHaveLength(1);
  });

  it("deletes the account and leaves no rows for its ID in any table", async () => {
    expect((await me(id, "DELETE")).status).toBe(204);
    expect(await db.select().from(accountsTable).where(eq(accountsTable.id, id))).toHaveLength(0);

    // Also covers tables added later, as long as they name their column account_id.
    const { rows } = await db.execute<{ table_name: string }>(
      sql`select table_name from information_schema.columns where table_schema = 'public' and column_name = 'account_id'`,
    );
    for (const { table_name } of rows) {
      const left = await db.execute(
        sql`select 1 from ${sql.identifier(table_name)} where account_id = ${id}`,
      );
      expect(left.rows, table_name).toHaveLength(0);
    }
  });
});
