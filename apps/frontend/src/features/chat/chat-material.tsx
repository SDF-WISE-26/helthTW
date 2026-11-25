import type { MaterialSelection } from "@helthtw/shared/chat";
import { ContactCard } from "@/features/info/contacts/contact-card";
import { content } from "@/features/info/content";
import { ItemCard } from "@/features/info/items/item-card.tsx";

const byId = <T extends { id: string }>(list: T[], ids: string[]) =>
  ids.flatMap((id) => list.find((entry) => entry.id === id) ?? []);

// The content and contacts that the model picked, ids that don't exist are skipped
export function ChatMaterial({ selection }: { selection: MaterialSelection }) {
  const items = byId(content.items, selection.itemIds);
  const contacts = byId(content.contacts, selection.contactIds);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <ItemCard item={item} />
      ))}
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} compact />
      ))}
    </div>
  );
}
