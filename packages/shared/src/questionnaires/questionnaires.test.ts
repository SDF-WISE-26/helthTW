import { describe, expect, it } from "vite-plus/test";
import { answersSchema, questionnaireTemplateSchema, type QuestionnaireTemplate } from "./index";

const template: QuestionnaireTemplate = {
  id: "check-in-kurz",
  version: 1,
  kind: "check-in",
  title: "Kurzer Check-in",
  tags: ["check-in"],
  questions: [
    {
      id: "schlaf",
      type: "select-one",
      text: "Wie hast du geschlafen?",
      options: [
        { value: "gut", label: "Gut", points: 0 },
        { value: "schlecht", label: "Schlecht", points: 2 },
      ],
    },
    { id: "belastung", type: "number", text: "Wie belastet?", min: 0, max: 10 },
    { id: "sicherheit", type: "yes-no", text: "In Gefahr?", safety: true },
  ],
  scoring: { sum: ["schlaf", "belastung"] },
};

// Messages of the problems, to check that the right rule failed.
const problems = (value: unknown) => {
  const result = questionnaireTemplateSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("questionnaireTemplateSchema", () => {
  it("accepts a template with all answer types and a scoring rule", () => {
    expect(problems(template)).toEqual([]);
  });

  it("accepts a template without a scoring rule", () => {
    const { scoring: _scoring, ...withoutScoring } = template;
    expect(problems(withoutScoring)).toEqual([]);
  });

  it("accepts every answer type", () => {
    const multiple = {
      id: "symptome",
      type: "select-multiple",
      text: "Welche?",
      options: [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
    };
    expect(problems({ ...template, questions: [multiple], scoring: undefined })).toEqual([]);
  });

  it("defaults safety to false", () => {
    const parsed = questionnaireTemplateSchema.parse({
      ...template,
      questions: [{ id: "a", type: "yes-no", text: "Ja?" }],
      scoring: undefined,
    });
    expect(parsed.questions[0]).toMatchObject({ safety: false });
  });

  it("rejects an unknown answer type", () => {
    const bad = { ...template, questions: [{ id: "a", type: "free-text", text: "Frei?" }] };
    expect(problems(bad)).not.toEqual([]);
  });

  it("rejects unknown fields, e.g. a typo", () => {
    expect(problems({ ...template, tag: ["x"] })).not.toEqual([]);
  });

  it("rejects a version of 0", () => {
    expect(problems({ ...template, version: 0 })).not.toEqual([]);
  });

  it("rejects duplicate question ids", () => {
    const [first] = template.questions;
    expect(problems({ ...template, questions: [first, first] })).toContain(
      'Duplicate question id "schlaf"',
    );
  });

  it("rejects a number question where min is not below max", () => {
    const bad = {
      ...template,
      questions: [{ id: "n", type: "number", text: "?", min: 5, max: 5 }],
    };
    expect(problems({ ...bad, scoring: undefined })).toContain("min must be lower than max");
  });

  it("rejects a scoring rule for an unknown question", () => {
    const bad = { ...template, scoring: { ...template.scoring!, sum: ["gibt-es-nicht"] } };
    expect(problems(bad)).toContain('Unknown question "gibt-es-nicht"');
  });

  it("rejects scoring a yes-no question", () => {
    const bad = { ...template, scoring: { ...template.scoring!, sum: ["sicherheit"] } };
    expect(problems(bad)).toContain('"sicherheit" has no points');
  });

  it("rejects scoring a question whose options have no points", () => {
    const question = {
      id: "schlaf",
      type: "select-one",
      text: "?",
      options: [
        { value: "gut", label: "Gut" },
        { value: "schlecht", label: "Schlecht" },
      ],
    };
    const bad = {
      ...template,
      questions: [question],
      scoring: { ...template.scoring!, sum: ["schlaf"] },
    };
    expect(problems(bad)).toContain('Every option of "schlaf" needs points');
  });
});

describe("answersSchema", () => {
  it("accepts the four kinds of answers", () => {
    const answers = { schlaf: "gut", symptome: ["a", "b"], belastung: 7, sicherheit: false };
    expect(answersSchema.safeParse(answers).success).toBe(true);
  });

  it("rejects an answer that is none of them", () => {
    expect(answersSchema.safeParse({ schlaf: { x: 1 } }).success).toBe(false);
  });
});

// Example only: the Insomnia Severity Index (7 questions, 0-4 points each, total 0-28), English
// wording, to show that a real instrument fits the format. The wording of the real instrument
// and its licence are not settled yet, so this is a test, not content for the app.
const scale = (labels: string[]) =>
  labels.map((label, i) => ({ value: `p${i}`, label, points: i }));
const severity = scale(["None", "Mild", "Moderate", "Severe", "Very severe"]);
const intensity = scale(["Not at all", "A little", "Somewhat", "Much", "Very much"]);

const isi: QuestionnaireTemplate = {
  id: "isi",
  version: 1,
  kind: "screening",
  title: "Insomnia Severity Index (example)",
  tags: ["schlaf"],
  questions: [
    {
      id: "falling-asleep",
      type: "select-one",
      text: "Difficulty falling asleep?",
      options: severity,
    },
    {
      id: "staying-asleep",
      type: "select-one",
      text: "Difficulty staying asleep?",
      options: severity,
    },
    {
      id: "waking-early",
      type: "select-one",
      text: "Problems waking up too early?",
      options: severity,
    },
    {
      id: "satisfaction",
      type: "select-one",
      text: "How satisfied are you with your current sleep pattern?",
      // The scale runs backwards: the less satisfied, the more points.
      options: scale([
        "Very satisfied",
        "Satisfied",
        "Moderately satisfied",
        "Dissatisfied",
        "Very dissatisfied",
      ]),
    },
    {
      id: "noticeable",
      type: "select-one",
      text: "How noticeable to others is your sleep problem?",
      options: intensity,
    },
    {
      id: "worry",
      type: "select-one",
      text: "How worried are you about your sleep problem?",
      options: intensity,
    },
    {
      id: "interference",
      type: "select-one",
      text: "How much does it interfere with your daily life?",
      options: intensity,
    },
  ],
  scoring: {
    sum: [
      "falling-asleep",
      "staying-asleep",
      "waking-early",
      "satisfaction",
      "noticeable",
      "worry",
      "interference",
    ],
  },
};

describe("an instrument with its own scoring (ISI)", () => {
  it("is a valid template", () => {
    expect(problems(isi)).toEqual([]);
  });

  it("can reuse one answer scale for several questions", () => {
    expect(isi.questions[0]).toMatchObject({ options: severity });
    expect(isi.questions[1]).toMatchObject({ options: severity });
  });

  it("has a maximum score of 28", () => {
    const max = isi.questions.reduce(
      (sum, q) =>
        sum + (q.type === "select-one" ? Math.max(...q.options.map((o) => o.points ?? 0)) : 0),
      0,
    );
    expect(max).toBe(28);
  });
});
