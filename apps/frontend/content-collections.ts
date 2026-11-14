import {
  defineCollection,
  defineConfig,
  defineParser,
  defineSingleton,
} from "@content-collections/core";
import { parse } from "yaml";
import { z } from "zod";

// Schemas for the files in content/. Unknown fields are stripped instead of
// rejected and most fields are optional, so the format can grow additively.
// Types come from the generated "content-collections" module, not from these schemas.

const root = "../../content";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase letters, digits, hyphens");
const text = z.string().trim().min(1);
const date = z.iso.date();
const web = z.url({ protocol: /^https?$/ });

// Our lists are YAML arrays, Content Collections wants an object per file.
const list = defineParser((text) => ({ entries: parse(text) }));

// Other files reference list entries by id, so a duplicate would be ambiguous.
const idList = <T extends z.ZodType<{ id: string }>>(entry: T) =>
  z.array(entry).superRefine((entries, ctx) => {
    const ids = entries.map((e) => e.id);
    const duplicates = new Set(ids.filter((id, i) => ids.indexOf(id) !== i));
    if (duplicates.size) {
      ctx.addIssue({ code: "custom", message: `duplicate id ${[...duplicates].join(", ")}` });
    }
  });

const topics = defineSingleton({
  name: "topics",
  typeName: "TopicList",
  filePath: `${root}/topics.yaml`,
  parser: list,
  schema: z.object({
    entries: idList(z.object({ id: slug, title: text, description: text.optional() })),
  }),
});
const categories = defineSingleton({
  name: "categories",
  typeName: "CategoryList",
  filePath: `${root}/contact-categories.yaml`,
  parser: list,
  schema: z.object({ entries: idList(z.object({ id: slug, label: text })) }),
});
const tags = defineSingleton({
  name: "tags",
  typeName: "TagList",
  filePath: `${root}/tags.yaml`,
  parser: list,
  schema: z.object({ entries: idList(z.object({ id: slug, label: text })) }),
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

const itemBase = {
  title: text,
  summary: text,
  topic: slug,
  tags: z.array(slug).default([]),
  source: text.optional(),
  lastReviewed: date.optional(),
  // The Markdown below the frontmatter.
  content: z.string(),
};

const items = defineCollection({
  name: "items",
  typeName: "ContentItem",
  directory: `${root}/items`,
  include: "*.md",
  parser: "frontmatter",
  // `kind` is the only list code branches on, so it is an enum. Topics, categories and tags are content.
  schema: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("article"), ...itemBase }),
    z.object({ kind: z.enum(["pdf", "link"]), url: web, ...itemBase }),
  ]),
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

const channelBase = {
  label: text.optional(),
  person: text.optional(),
};

const contacts = defineCollection({
  name: "contacts",
  typeName: "Contact",
  directory: `${root}/contacts`,
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    name: text,
    category: slug,
    audience: text.optional(),
    description: text.optional(),
    tags: z.array(slug).default([]),
    channels: z
      .array(
        z.discriminatedUnion("type", [
          // E.164 without spaces, so it works as a tel: link.
          z.object({
            type: z.literal("phone"),
            value: z.string().regex(/^\+[1-9]\d{4,14}$/, "+49…"),
            ...channelBase,
          }),
          z.object({ type: z.literal("email"), value: z.email(), ...channelBase }),
        ]),
      )
      .default([]),
    availability: text.optional(),
    website: web.optional(),
    source: text.optional(),
    lastReviewed: date.optional(),
  }),
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
