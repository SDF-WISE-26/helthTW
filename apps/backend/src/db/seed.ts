import { sql } from "drizzle-orm";
import { db } from "./index";
import { accountsTable } from "./schema";

await db.execute(sql`truncate table ${accountsTable} cascade`);

await db
  .insert(accountsTable)
  .values([
    { id: "00000000-0000-4000-8000-000000000001" },
    { id: "00000000-0000-4000-8000-000000000002" },
  ]);

console.log("Seeded database");
await db.$client.end();
