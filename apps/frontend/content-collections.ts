import {
  defineCollection,
  defineConfig,
  defineParser,
  defineSingleton,
} from "@content-collections/core";
import { parse } from "yaml";
import { z } from "zod";
// Bundled into the config via the path in tsconfig.json, Node cannot load our .ts on its own.
import {
  categoryFile,
  contactFile,
  itemFrontmatter,
  slug,
  tagFile,
  topicFile,
} from "@helthtw/shared/content";

const root = "../../content";

// Our lists are YAML arrays, Content Collections wants an object per file.
const list = defineParser((text) => ({ entries: parse(text) }));

const topics = defineSingleton({
  name: "topics",
  typeName: "TopicList",
  filePath: `${root}/topics.yaml`,
  parser: list,
  schema: z.object({ entries: topicFile }),
});
const categories = defineSingleton({
  name: "categories",
  typeName: "CategoryList",
  filePath: `${root}/contact-categories.yaml`,
  parser: list,
  schema: z.object({ entries: categoryFile }),
});
const tags = defineSingleton({
  name: "tags",
  typeName: "TagList",
  filePath: `${root}/tags.yaml`,
  parser: list,
  schema: z.object({ entries: tagFile }),
});

// The file name is the id, links to it must survive a new title.
const fileId = (meta: { path: string; fileName: string }) => {
  if (!slug.safeParse(meta.path).success) {
    throw new Error(`${meta.fileName}: name must be lowercase letters, digits, hyphens`);
  }
  return meta.path;
};

const checkTags = (file: string, ids: string[], known: { id: string }[]) => {
  const unknown = ids.filter((id) => !known.some((tag) => tag.id === id));
  if (unknown.length) throw new Error(`${file}: unknown tag ${unknown.join(", ")}`);
};

const items = defineCollection({
  name: "items",
  typeName: "ContentItem",
  directory: `${root}/items`,
  include: "*.md",
  parser: "frontmatter",
  schema: itemFrontmatter.and(z.object({ content: z.string() })),
  transform: (item, context) => {
    const { content, _meta, ...data } = item;
    const id = fileId(_meta);
    if (!context.documents(topics)[0].entries.some((topic) => topic.id === data.topic)) {
      throw new Error(`${_meta.fileName}: unknown topic ${data.topic}`);
    }
    checkTags(_meta.fileName, data.tags, context.documents(tags)[0].entries);
    // An article keeps its text as Markdown for the frontend to render, pdf and link have none.
    return data.kind === "article" ? { id, ...data, body: content } : { id, ...data };
  },
});

const contacts = defineCollection({
  name: "contacts",
  typeName: "Contact",
  directory: `${root}/contacts`,
  include: "*.yaml",
  parser: "yaml",
  schema: contactFile,
  transform: (contact, context) => {
    const { _meta, ...data } = contact;
    const id = fileId(_meta);
    if (
      !context.documents(categories)[0].entries.some((category) => category.id === data.category)
    ) {
      throw new Error(`${_meta.fileName}: unknown category ${data.category}`);
    }
    checkTags(_meta.fileName, data.tags, context.documents(tags)[0].entries);
    return { id, ...data };
  },
});

export default defineConfig({ content: [topics, categories, tags, items, contacts] });
