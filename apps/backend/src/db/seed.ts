import { sql } from "drizzle-orm";
import { db } from "./index";
import { usersTable } from "./schema";

await db.execute(sql`truncate table ${usersTable} restart identity cascade`);

await db.insert(usersTable).values([{ name: "User1" }, { name: "User2" }, { name: "User3" }]);

console.log("Seeded database");
await db.$client.end();
