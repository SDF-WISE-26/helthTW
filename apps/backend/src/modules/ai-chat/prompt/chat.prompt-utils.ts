import type { ChatCatalog } from "@helthtw/shared/chat";
import { SYSTEM_PROMPT } from "./chat.system-prompt";

// One line per entry: line breaks from the catalog must not start new sections in the prompt.
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

const line = (id: string, fields: [label: string, value: string | undefined][]) =>
  `- ${id} | ${fields
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${oneLine(value!)}`)
    .join(" | ")}`;

const listOrNone = (lines: string[]) => (lines.length ? lines.join("\n") : "(keine Einträge)");

export function renderItems(catalog: ChatCatalog) {
  return listOrNone(
    catalog.items.map((item) =>
      line(item.id, [
        ["Titel", item.title],
        ["Tags", item.tags.join(", ")],
        ["Summary", item.summary],
      ]),
    ),
  );
}

export function renderContacts(catalog: ChatCatalog) {
  return listOrNone(
    catalog.contacts.map((contact) =>
      line(contact.id, [
        ["Name", contact.name],
        ["Kategorie", contact.category],
        ["Zielgruppe", contact.audience],
        ["Tags", contact.tags.join(", ")],
        ["Beschreibung", contact.description],
      ]),
    ),
  );
}

// The system prompt with the content catalog that the model may pick from
export function buildSystemPrompt(catalog: ChatCatalog) {
  return SYSTEM_PROMPT.replace("{{INFO_ITEMS}}", () => renderItems(catalog)).replace(
    "{{CONTACTS}}",
    () => renderContacts(catalog),
  );
}
