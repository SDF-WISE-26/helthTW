import type { z } from "zod";
import {
  filesIn,
  knownTags,
  readYaml,
  splitFrontmatter,
  type ContentFiles,
  type ContentProblem,
} from "./read";
import { itemFrontmatter, type Tag, type Topic } from "./schemas";

type Frontmatter = z.infer<typeof itemFrontmatter>;

/** One piece of info material. An article carries its whole text as Markdown, pdf and link point to `url`. */
export type ContentItem = { id: string } & (
  | (Extract<Frontmatter, { kind: "article" }> & { body: string })
  | Exclude<Frontmatter, { kind: "article" }>
);

/** items/<id>.md: the frontmatter is checked against the schema, topic and tags against their lists. */
export const readItems = (
  files: ContentFiles,
  refs: { topics: Topic[]; tags: Tag[] },
  problems: ContentProblem[],
) => {
  const items: ContentItem[] = [];
  for (const [file, id] of filesIn(files, "items/", ".md", problems)) {
    const parts = splitFrontmatter(files[file]);
    if (!parts) {
      problems.push({ file, message: "missing frontmatter between --- lines" });
      continue;
    }
    const data = readYaml(file, parts.frontmatter, itemFrontmatter, problems);
    if (!data) continue;
    if (!refs.topics.some((topic) => topic.id === data.topic)) {
      problems.push({ file, message: `unknown topic: ${data.topic}` });
      continue;
    }
    const tags = knownTags(file, data.tags, refs.tags, problems);
    items.push(
      data.kind === "article" ? { id, ...data, tags, body: parts.body } : { id, ...data, tags },
    );
  }
  return items;
};
