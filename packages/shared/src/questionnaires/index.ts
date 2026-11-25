import { z } from "zod";

export const identifier = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, digits and single dashes");

// strictObject: a typo in a template fails instead of being ignored.
const option = z.strictObject({
  value: identifier,
  label: z.string().min(1).max(200),
  points: z.number().int().min(0).optional(),
});

const questionBase = { id: identifier, text: z.string().min(1).max(500) };

// No free text. A new answer type is one more entry here.
export const questionSchema = z.discriminatedUnion("type", [
  z.strictObject({
    ...questionBase,
    type: z.literal("select-one"),
    options: z.array(option).min(2).max(10),
  }),
  z.strictObject({
    ...questionBase,
    type: z.literal("select-multiple"),
    options: z.array(option).min(2).max(10),
  }),
  z.strictObject({
    ...questionBase,
    type: z.literal("number"),
    min: z.number().int(),
    max: z.number().int(),
  }),
  z.strictObject({
    ...questionBase,
    type: z.literal("yes-no"),
    // "yes" needs special handling, e.g. the crisis screen.
    safety: z.boolean().default(false),
  }),
]);

// The score is the sum of the points of the listed questions.
export const scoringSchema = z.strictObject({ sum: z.array(identifier).min(1) });

export const questionnaireTemplateSchema = z
  .strictObject({
    id: identifier,
    title: z.string().min(1).max(120),
    tags: z.array(identifier).min(1).max(10),
    questions: z.array(questionSchema).min(1).max(60),
    scoring: scoringSchema.optional(),
  })
  .superRefine((template, ctx) => {
    const problem = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message, path });

    const seen = new Set<string>();
    template.questions.forEach((question, i) => {
      if (seen.has(question.id))
        problem(`Duplicate question id "${question.id}"`, ["questions", i]);
      seen.add(question.id);
      if (question.type === "number" && question.min >= question.max) {
        problem("min must be lower than max", ["questions", i, "min"]);
      }
      if (question.type === "select-one" || question.type === "select-multiple") {
        const values = question.options.map((o) => o.value);
        if (new Set(values).size !== values.length) {
          problem("Option values must be unique", ["questions", i, "options"]);
        }
      }
    });

    const { scoring } = template;
    if (!scoring) return;

    const counted = new Set<string>();
    scoring.sum.forEach((id, i) => {
      const question = template.questions.find((q) => q.id === id);
      const path = ["scoring", "sum", i];
      if (counted.has(id)) return problem(`Question "${id}" is listed twice`, path);
      counted.add(id);
      if (!question) return problem(`Unknown question "${id}"`, path);
      if (question.type === "yes-no") return problem(`"${id}" has no points`, path);
      if (question.type === "number" && question.min < 0) {
        return problem(`"${id}" can be negative, scores start at 0`, path);
      }
      if (question.type !== "number" && question.options.some((o) => o.points === undefined)) {
        problem(`Every option of "${id}" needs points`, path);
      }
    });
  });

export const answersSchema = z.record(
  identifier,
  z.union([z.string(), z.array(z.string()), z.number(), z.boolean()]),
);

export type Question = z.infer<typeof questionSchema>;
export type QuestionnaireTemplate = z.infer<typeof questionnaireTemplateSchema>;
export type Answers = z.infer<typeof answersSchema>;
export { questionnaires } from "./list";
