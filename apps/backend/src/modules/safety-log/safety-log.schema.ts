import { z } from "zod";

// Defines which safety events may be recorded.
// Only approved metadata is allowed, never chat content.
export const safetyEventSchema = z
  .strictObject({
    accountId: z.uuid(),

    ruleName: z.enum(["crisis_detection", "personal_medical_advice", "output_audit"]),

    result: z.enum([
      "support_resources_shown",
      "fixed_response_shown",
      "response_blocked",
      "response_replaced",
    ]),

    category: z.enum(["self_harm", "danger_to_others", "acute_distress"]).optional(),
  })
  .superRefine((event, ctx) => {
    if (event.ruleName === "crisis_detection" && !event.category) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Crisis events require a category",
      });
    }

    if (event.ruleName !== "crisis_detection" && event.category) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Only crisis events may have a category",
      });
    }
  });

export type SafetyEventInput = z.input<typeof safetyEventSchema>;
