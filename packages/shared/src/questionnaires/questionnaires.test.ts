import { describe, expect, it } from "vite-plus/test";
import {
  answersSchema,
  questionnaires,
  questionnaireTemplateSchema,
  type QuestionnaireTemplate,
} from "./index";
import { isi } from "./isi";

const template: QuestionnaireTemplate = {
  id: "check-in-kurz",
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

  it("rejects a question that is listed twice in the scoring", () => {
    const bad = { ...template, scoring: { sum: ["schlaf", "schlaf"] } };
    expect(problems(bad)).toContain('Question "schlaf" is listed twice');
  });

  it("rejects scoring a number question that can be negative", () => {
    const question = { id: "n", type: "number", text: "?", min: -1, max: 5 };
    const bad = { ...template, questions: [question], scoring: { sum: ["n"] } };
    expect(problems(bad)).toContain('"n" can be negative, scores start at 0');
  });

  it.each(["select-one", "select-multiple"])("rejects duplicate option values in %s", (type) => {
    const question = {
      id: "q",
      type,
      text: "?",
      options: [
        { value: "a", label: "A" },
        { value: "a", label: "B" },
      ],
    };
    const bad = { ...template, questions: [question], scoring: undefined };
    expect(problems(bad)).toContain("Option values must be unique");
  });

  it.each(["select-one", "select-multiple"])(
    "rejects scoring a %s question without points",
    (type) => {
      const question = {
        id: "q",
        type,
        text: "?",
        options: [
          { value: "a", label: "A", points: 1 },
          { value: "b", label: "B" },
        ],
      };
      const bad = { ...template, questions: [question], scoring: { sum: ["q"] } };
      expect(problems(bad)).toContain('Every option of "q" needs points');
    },
  );

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

describe("the questionnaires of the app", () => {
  it("are all valid templates", () => {
    for (const questionnaire of questionnaires) {
      expect(problems(questionnaire)).toEqual([]);
    }
  });

  it("have unique ids", () => {
    const ids = questionnaires.map((questionnaire) => questionnaire.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("isi", () => {
  it("has 7 questions with 5 answers each, worth 0 to 4 points", () => {
    expect(isi.questions).toHaveLength(7);
    for (const question of isi.questions) {
      const points = question.type === "select-one" ? question.options.map((o) => o.points) : [];
      expect(points).toEqual([0, 1, 2, 3, 4]);
    }
  });

  it("scores all 7 questions, so the maximum is 28", () => {
    expect(isi.scoring?.sum).toHaveLength(7);
  });
});
