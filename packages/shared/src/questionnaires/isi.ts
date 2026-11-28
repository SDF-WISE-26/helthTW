import type { QuestionnaireTemplate } from "./index";

// Points are the position of the answer, as on the QxMD page.
const scale = (labels: string[]) =>
  labels.map((label, points) => ({ value: label.toLowerCase().replace(/ /g, "-"), label, points }));

const severity = scale(["None", "Mild", "Moderate", "Severe", "Very Severe"]);
const worry = scale(["Not at all Worried", "A Little", "Somewhat", "Much", "Very Much Worried"]);

export const isi: QuestionnaireTemplate = {
  id: "isi",
  title: "Insomnia Severity Index (ISI)",
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
      text: "Problem waking up too early?",
      options: severity,
    },
    {
      id: "satisfaction",
      type: "select-one",
      text: "How SATISFIED/DISSATISFIED are you with your CURRENT sleep pattern?",
      options: scale([
        "Very Satisfied",
        "Satisfied",
        "Moderately Satisfied",
        "Dissatisfied",
        "Very Dissatisfied",
      ]),
    },
    {
      id: "noticeable",
      type: "select-one",
      text: "How NOTICEABLE to others do you think your sleep problem is in terms of impairing the quality of your life?",
      // Same order as on the QxMD page.
      options: scale(["Not at all", "Noticeable", "A Little", "Somewhat", "Very Much Noticeable"]),
    },
    {
      id: "worry",
      type: "select-one",
      text: "How WORRIED/DISTRESSED are you about your current sleep problem?",
      options: worry,
    },
    {
      id: "interference",
      type: "select-one",
      text: "To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, mood, etc.) CURRENTLY?",
      options: scale([
        "Not at all Interfering",
        "A Little",
        "Somewhat",
        "Much",
        "Very Much Interfering",
      ]),
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
