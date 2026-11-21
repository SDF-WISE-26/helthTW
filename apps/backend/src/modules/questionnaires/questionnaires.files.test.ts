import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, describe, expect, it } from "vite-plus/test";
import { loadQuestionnaireFiles } from "./questionnaires.files";

describe("the questionnaire files in the repo", () => {
  it("are all valid", async () => {
    expect((await loadQuestionnaireFiles()).length).toBeGreaterThan(0);
  });
});

const roots: string[] = [];
afterAll(() => Promise.all(roots.map((root) => rm(root, { recursive: true, force: true }))));

const contentWith = async (files: Record<string, string>) => {
  const root = await mkdtemp(join(tmpdir(), "questionnaires-"));
  roots.push(root);
  await mkdir(join(root, "questionnaires"));
  await writeFile(join(root, "tags.yaml"), "- id: schlaf\n  label: Schlaf\n");
  for (const [name, text] of Object.entries(files)) {
    await writeFile(join(root, "questionnaires", name), text);
  }
  return new URL(`${pathToFileURL(root).href}/`);
};

const file = ({ id = "test", version = 1, tags = "schlaf" } = {}) =>
  `id: ${id}\nversion: ${version}\ntitle: Test\ntags: [${tags}]\nquestions:\n  - { id: frage, type: yes-no, text: "Frage?" }\n`;

describe("loadQuestionnaireFiles", () => {
  it("accepts a file that is named like its id", async () => {
    const templates = await loadQuestionnaireFiles(await contentWith({ "test.yaml": file() }));
    expect(templates.map((t) => t.id)).toEqual(["test"]);
  });

  it("names the file when it does not pass the schema", async () => {
    const dir = await contentWith({ "test.yaml": file({ version: 0 }) });
    await expect(loadQuestionnaireFiles(dir)).rejects.toThrow(/^test\.yaml: version/);
  });

  it("names the file when the YAML is broken", async () => {
    const dir = await contentWith({ "test.yaml": "id: [test" });
    await expect(loadQuestionnaireFiles(dir)).rejects.toThrow(/^test\.yaml: /);
  });

  it("rejects an id that is not the file name", async () => {
    const dir = await contentWith({ "other.yaml": file({ id: "test" }) });
    await expect(loadQuestionnaireFiles(dir)).rejects.toThrow("must match the file name");
  });

  it("rejects a tag that is not in tags.yaml", async () => {
    const dir = await contentWith({ "test.yaml": file({ tags: "schalf" }) });
    await expect(loadQuestionnaireFiles(dir)).rejects.toThrow("tags not in tags.yaml: schalf");
  });

  it("ignores files that are not YAML", async () => {
    const dir = await contentWith({ "test.yaml": file(), "notes.md": "# notes" });
    expect(await loadQuestionnaireFiles(dir)).toHaveLength(1);
  });
});
