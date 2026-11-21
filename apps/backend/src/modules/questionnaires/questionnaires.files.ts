import { readdir, readFile } from "node:fs/promises";
import { parse } from "yaml";
import {
  questionnaireTemplateSchema,
  type QuestionnaireTemplate,
} from "@helthtw/shared/questionnaires";

const contentDir = new URL("../../../../../content/", import.meta.url);

const readYaml = async (url: URL, name: string) => {
  try {
    return parse(await readFile(url, "utf8"));
  } catch (error) {
    throw new Error(`${name}: ${(error as Error).message}`);
  }
};

// A file must pass the schema, be named like its id and only use tags from tags.yaml.
export const loadQuestionnaireFiles = async (dir = contentDir) => {
  const allowedTags = new Set<string>(
    (await readYaml(new URL("tags.yaml", dir), "tags.yaml")).map((tag: { id: string }) => tag.id),
  );
  const folder = new URL("questionnaires/", dir);
  const names = (await readdir(folder)).filter((name) => name.endsWith(".yaml")).sort();

  const templates: QuestionnaireTemplate[] = [];
  for (const name of names) {
    const result = questionnaireTemplateSchema.safeParse(
      await readYaml(new URL(name, folder), name),
    );
    if (!result.success) {
      const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
      throw new Error(`${name}: ${issues.join("; ")}`);
    }
    const template = result.data;
    if (`${template.id}.yaml` !== name) {
      throw new Error(`${name}: id "${template.id}" must match the file name`);
    }
    const unknown = template.tags.filter((tag) => !allowedTags.has(tag));
    if (unknown.length > 0) {
      throw new Error(`${name}: tags not in tags.yaml: ${unknown.join(", ")}`);
    }
    templates.push(template);
  }
  return templates;
};
