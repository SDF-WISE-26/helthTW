import { z } from "zod";

// Schemas for the files in content/. Unknown fields are stripped instead of
// rejected and most fields are optional, so the format can grow additively.

export const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase letters, digits, hyphens");

const text = z.string().trim().min(1);
const date = z.iso.date();
const web = z.url({ protocol: /^https?$/ });

export const topicFile = z.array(z.object({ id: slug, title: text, description: text.optional() }));

export const categoryFile = z.array(z.object({ id: slug, label: text }));

export const tagFile = z.array(z.object({ id: slug, label: text }));

const itemBase = {
  title: text,
  summary: text,
  topic: slug,
  tags: z.array(slug).default([]),
  source: text.optional(),
  lastReviewed: date.optional(),
};

// `kind` is the only list code branches on, so it is an enum. Topics, categories and tags are content.
export const itemFrontmatter = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("article"), ...itemBase }),
  z.object({ kind: z.enum(["pdf", "link"]), url: web, ...itemBase }),
]);

const channelBase = {
  label: text.optional(),
  person: text.optional(),
  availability: text.optional(),
};

export const contactChannel = z.discriminatedUnion("type", [
  // E.164 without spaces, so it works as a tel: link.
  z.object({
    type: z.literal("phone"),
    value: z.string().regex(/^\+[1-9]\d{4,14}$/, "+49…"),
    ...channelBase,
  }),
  z.object({ type: z.literal("email"), value: z.email(), ...channelBase }),
]);

export const contactFile = z.object({
  name: text,
  category: slug,
  audience: text.optional(),
  description: text.optional(),
  tags: z.array(slug).default([]),
  channels: z.array(contactChannel).default([]),
  availability: text.optional(),
  website: web.optional(),
  source: text.optional(),
  lastReviewed: date.optional(),
});

export type Topic = z.infer<typeof topicFile>[number];
export type Category = z.infer<typeof categoryFile>[number];
export type Tag = z.infer<typeof tagFile>[number];
export type ContentKind = z.infer<typeof itemFrontmatter>["kind"];
export type ContactChannel = z.infer<typeof contactChannel>;
