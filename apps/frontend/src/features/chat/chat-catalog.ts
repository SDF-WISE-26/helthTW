import type { ChatCatalogInput } from "@helthtw/shared/chat";
import { content } from "@/features/info/content";

const categoryLabel = new Map(content.categories.map((c) => [c.id, c.label]));

// transforms the contect collection into the content catalog that the LLM will see
// only keeps the needed fields, actual content is dropped
export const chatCatalog: ChatCatalogInput = {
  items: content.items.map(({ id, title, summary, tags }) => ({
    id,
    title,
    summary,
    tags,
  })),
  contacts: content.contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    category: categoryLabel.get(contact.category) ?? contact.category,
    audience: contact.audience,
    description: contact.description,
    tags: contact.tags,
  })),
};
