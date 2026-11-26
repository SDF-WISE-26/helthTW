import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vite-plus/test";

// Only execute against an explicitly configured test database.
// No database modules are imported during ordinary unit test runs.
const testDatabaseUrl = process.env.TEST_DATABASE_URL;

describe.skipIf(!testDatabaseUrl)("Safety Log Database Integration", () => {
  it("saves an event and deletes it with its account", async () => {
    const { db } = await import("../../db");
    const { accountsTable, safetyEventsTable } = await import("../../db/schema");
    const { logSafetyEvent } = await import("./safety-log.service");

    const accountId = randomUUID();
    let accountCreated = false;

    try {
      await db.insert(accountsTable).values({ id: accountId });
      accountCreated = true;

      const savedEvent = await logSafetyEvent({
        accountId,
        ruleName: "crisis_detection",
        result: "support_resources_shown",
        category: "self_harm",
      });

      expect(savedEvent.id).toBeGreaterThan(0);
      expect(savedEvent.createdAt).toBeInstanceOf(Date);

      const [storedEvent] = await db
        .select()
        .from(safetyEventsTable)
        .where(eq(safetyEventsTable.id, savedEvent.id));

      expect(storedEvent).toMatchObject({
        accountId,
        ruleName: "crisis_detection",
        result: "support_resources_shown",
        category: "self_harm",
      });

      await db.delete(accountsTable).where(eq(accountsTable.id, accountId));

      accountCreated = false;

      const remainingEvents = await db
        .select()
        .from(safetyEventsTable)
        .where(eq(safetyEventsTable.id, savedEvent.id));

      expect(remainingEvents).toHaveLength(0);
    } finally {
      if (accountCreated) {
        await db.delete(accountsTable).where(eq(accountsTable.id, accountId));
      }
    }
  });
});
