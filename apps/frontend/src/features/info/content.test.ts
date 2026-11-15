import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createBuilder } from "@content-collections/core";
import { expect, it } from "vite-plus/test";

// The strict check of content/: runs on commit (staged rule for content/**), on push and in CI.
// Content Collections only logs broken files and leaves them out, so this test fails on them.
const config = fileURLToPath(new URL("../../../content-collections.ts", import.meta.url));
// Only content files, so e.g. a .DS_Store does not count.
const filesIn = (dir: string, ext: string) =>
  readdirSync(fileURLToPath(new URL(`../../../../../content/${dir}`, import.meta.url))).filter(
    (name) => name.endsWith(ext),
  ).length;

it("content/ has no problems", async () => {
  const problems: string[] = [];
  const builder = await createBuilder(config);
  builder.on("collector:parse-error", (e) => problems.push(`${e.filePath}: ${e.error.message}`));
  builder.on("transformer:validation-error", (e) =>
    problems.push(`${e.file.path}: ${e.error.message}`),
  );
  builder.on("transformer:error", (e) => problems.push(e.error.message));
  await builder.build();
  expect(problems).toEqual([]);

  // A file with broken YAML disappears without any event, so every file must have become a document.
  const { allItems, allContacts } =
    await import("../../../.content-collections/generated/index.js");
  expect(allItems).toHaveLength(filesIn("items", ".md"));
  expect(allContacts).toHaveLength(filesIn("contacts", ".yaml"));
});
