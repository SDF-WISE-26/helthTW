import { z } from "zod";

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const text = z.string().trim().min(1);
const tags = z.array(id).default([]);

export const chatCatalogSchema = z.object({
  items: z.array(
    z.object({
      id,
      title: text,
      summary: text,
      tags,
    }),
  ),
  contacts: z.array(
    z.object({
      id,
      name: text,
      category: text,
      audience: text.optional(),
      description: text.optional(),
      tags,
    }),
  ),
});

// Input is what the frontend sends, output what the backend gets after parsing (tags filled in).
export type ChatCatalogInput = z.input<typeof chatCatalogSchema>;
export type ChatCatalog = z.output<typeof chatCatalogSchema>;

// What the model sends when it calls show_material. The reply is shown in the chat as its message.
export const showMaterialInputSchema = z.object({
  reply: z
    .string()
    .describe(
      "Deine Antwort an die Person: erst einfühlsam auf ihre Nachricht eingehen, dann das Material ankündigen, ohne seinen Inhalt wiederzugeben.",
    ),
  item_ids: z.array(z.string()).default([]).describe("0–3 IDs aus 'Infomaterial'"),
  contact_ids: z.array(z.string()).default([]).describe("0–3 IDs aus 'Kontakte'"),
});

// The ids the backend kept: only known ones, see chat.tools.ts.
export type MaterialSelection = { itemIds: string[]; contactIds: string[] };

// Input and output of the chat tools, as tool parts of the messages carry them.
export type ChatTools = {
  show_material: { input: z.output<typeof showMaterialInputSchema>; output: MaterialSelection };
  show_crisis: { input: Record<string, never>; output: { shown: true } };
};
