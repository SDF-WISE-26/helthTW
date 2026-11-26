import { db } from "../../db";
import { safetyEventsTable } from "../../db/schema";
import { safetyEventSchema, type SafetyEventInput } from "./safety-log.schema";

// Single entry point for recording safety rule activations.
export async function logSafetyEvent(input: SafetyEventInput) {
  const event = safetyEventSchema.parse(input);

  const [savedEvent] = await db.insert(safetyEventsTable).values(event).returning({
    id: safetyEventsTable.id,
    createdAt: safetyEventsTable.createdAt,
  });

  return savedEvent;
}
