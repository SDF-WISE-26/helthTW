import { tool } from "ai";
import { type MaterialSelection, showMaterialInputSchema } from "@helthtw/shared/chat";
import type { ChatCatalog } from "@helthtw/shared/chat";

const MAX_PER_KIND = 3;

// the llm returns a list of items and contacts that it thinks might be suitable
// this function makes sure that no IDs that the LLM picked are hallucinated and max item amounts are enforced
const pick = (ids: string[], known: Set<string>) =>
  [...new Set(ids)].filter((id) => known.has(id)).slice(0, MAX_PER_KIND);

// The tools that the LLM uses to pick content - common AI sdk approach
export function createChatTools(catalog: ChatCatalog) {
  const itemIds = new Set(catalog.items.map((item) => item.id));
  const contactIds = new Set(catalog.contacts.map((contact) => contact.id));

  return {
    show_material: tool({
      description:
        "Zeigt der Person passendes Infomaterial und/oder Kontakte aus Abschnitt 7 an. Nur IDs aus Abschnitt 7 verwenden, insgesamt mindestens eine.",
      inputSchema: showMaterialInputSchema,
      execute: async ({ item_ids, contact_ids }): Promise<MaterialSelection> => ({
        itemIds: pick(item_ids, itemIds),
        contactIds: pick(contact_ids, contactIds),
      }),
    }),
  };
}
