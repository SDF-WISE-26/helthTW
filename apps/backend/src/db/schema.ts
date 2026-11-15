import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// The ID is generated on the device. Tables with account data reference it with onDelete: "cascade".
export const accountsTable = pgTable("accounts", {
  id: uuid().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
