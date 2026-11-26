import { describe, expect, it } from "vite-plus/test";
import { safetyEventSchema } from "./safety-log.schema";

// These tests verify input validation.
// Database insertion will be tested separately.
describe("Safety Event Validation", () => {
  const validEvent = {
    accountId: "550e8400-e29b-41d4-a716-446655440000",
    ruleName: "crisis_detection",
    result: "support_resources_shown",
    category: "self_harm",
  };

  it("accepts a valid crisis event", () => {
    const result = safetyEventSchema.safeParse(validEvent);

    expect(result.success).toBe(true);
  });

  it("rejects crisis events without a category", () => {
    const result = safetyEventSchema.safeParse({
      ...validEvent,
      category: undefined,
    });

    expect(result.success).toBe(false);
  });

  it("rejects chat content", () => {
    const result = safetyEventSchema.safeParse({
      ...validEvent,
      chatContent: "Private conversation content",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown safety rules", () => {
    const result = safetyEventSchema.safeParse({
      ...validEvent,
      ruleName: "unknown_rule",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a crisis category on non-crisis events", () => {
    const result = safetyEventSchema.safeParse({
      ...validEvent,
      ruleName: "output_audit",
    });

    expect(result.success).toBe(false);
  });
});
