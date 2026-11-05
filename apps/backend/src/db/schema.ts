import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// The ID is generated on the device (#92). Tables with account data reference it with onDelete: "cascade" (#93).
export const accountsTable = pgTable("accounts", {
  id: uuid().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
