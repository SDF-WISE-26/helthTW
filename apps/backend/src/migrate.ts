import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

// Resolved from this file, so it works from src/ and from dist/.
await migrate(db, { migrationsFolder: fileURLToPath(new URL("../drizzle", import.meta.url)) });

console.log("Migrations applied");
await db.$client.end();
