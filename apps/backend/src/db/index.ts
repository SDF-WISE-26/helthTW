import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";

export const db = drizzle(process.env.DATABASE_URL!, { relations });

// The pool emits "error" when Postgres drops an idle connection, e.g. on a restart.
// Without a listener that crashes the backend; with one, the next query reconnects.
db.$client.on("error", (err) => console.error("Postgres connection lost:", err.message));
