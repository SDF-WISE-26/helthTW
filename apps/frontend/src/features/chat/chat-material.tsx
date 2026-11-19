import type { MaterialSelection } from "@helthtw/shared/chat";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ContactCard } from "@/features/info/contact-card";
import { content } from "@/features/info/content";
import type { ContentItem } from "@/features/info/content";
import { ItemCardBody, itemCardClass } from "@/features/info/item-card";
import { ItemDetails } from "@/features/info/item-sheet";

const byId = <T extends { id: string }>(list: T[], ids: string[]) =>
  ids.flatMap((id) => list.find((entry) => entry.id === id) ?? []);

// The content and contacts that the model picked, ids that don't exist are skipped
export function ChatMaterial({ selection }: { selection: MaterialSelection }) {
  const items = byId(content.items, selection.itemIds);
  const contacts = byId(content.contacts, selection.contactIds);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <ChatItemCard key={item.id} item={item} />
      ))}
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} compact />
      ))}
    </div>
  );
}

// Opens the item in a sheet over the chat
function ChatItemCard({ item }: { item: ContentItem }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button type="button" className={itemCardClass}>
          <ItemCardBody item={item} />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <ItemDetails item={item} />
      </DrawerContent>
    </Drawer>
  );
}
