import { tool } from "ai";
import { z } from "zod";
import { showMaterialInputSchema } from "@helthtw/shared/chat";
import type { ChatCatalog, ChatTools } from "@helthtw/shared/chat";

const MAX_PER_KIND = 3;

// the llm returns a list of items and contacts that it thinks might be suitable
// this function makes sure that no IDs that the LLM picked are hallucinated and max item amounts are enforced
const pick = (ids: string[], known: Set<string>) =>
  [...new Set(ids)].filter((id) => known.has(id)).slice(0, MAX_PER_KIND);

type Output<Name extends keyof ChatTools> = Promise<ChatTools[Name]["output"]>;

// The tools that the LLM uses to pick content and trigger the crisis screen - common AI sdk approach
export function createChatTools(catalog: ChatCatalog) {
  const itemIds = new Set(catalog.items.map((item) => item.id));
  const contactIds = new Set(catalog.contacts.map((contact) => contact.id));

  return {
    show_material: tool({
      description:
        "Zeigt der Person passendes Infomaterial und/oder Kontakte aus Abschnitt 7 an. Nur IDs aus Abschnitt 7 verwenden, insgesamt mindestens eine.",
      inputSchema: showMaterialInputSchema,
      execute: async ({ item_ids, contact_ids }): Output<"show_material"> => ({
        itemIds: pick(item_ids, itemIds),
        contactIds: pick(contact_ids, contactIds),
      }),
    }),
    show_crisis: tool({
      description:
        "Zeigt bei Anzeichen einer akuten Krise den festen, geprüften Krisenhinweis der App an.",
      inputSchema: z.object({}),
      execute: async (): Output<"show_crisis"> => ({ shown: true }),
    }),
  };
}
