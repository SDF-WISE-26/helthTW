import type { z } from "zod";
import { filesIn, knownTags, readYaml, type ContentFiles, type ContentProblem } from "./read";
import { contactFile, type Category, type Tag } from "./schemas";

/** One support service people can call or write to. */
export type Contact = z.infer<typeof contactFile> & { id: string };

/** contacts/<id>.yaml: checked against the schema, category and tags against their lists. Sorted in category order. */
export const readContacts = (
  files: ContentFiles,
  refs: { categories: Category[]; tags: Tag[] },
  problems: ContentProblem[],
) => {
  const order = new Map(refs.categories.map((category, i) => [category.id, i]));
  const contacts: Contact[] = [];
  for (const [file, id] of filesIn(files, "contacts/", ".yaml", problems)) {
    const data = readYaml(file, files[file], contactFile, problems);
    if (!data) continue;
    if (!order.has(data.category)) {
      problems.push({ file, message: `unknown category: ${data.category}` });
      continue;
    }
    contacts.push({ id, ...data, tags: knownTags(file, data.tags, refs.tags, problems) });
  }
  return contacts.sort((a, b) => order.get(a.category)! - order.get(b.category)!);
};
