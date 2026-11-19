import { Button } from "@/components/ui/button";
import { ContactCard } from "./contact-card";
import { ContactList } from "./contact-list";
import { content } from "./content";
import type { ContentItem } from "./content";
import { ItemCard } from "./item-card";
import { searchInfo, suggestedTags, typeLabel } from "./search";
import type { SearchType } from "./search";

// Before typing: tags as a first idea of what to look for, only those of the chosen type.
export function SearchSuggestions({
  type,
  onPick,
}: {
  type?: SearchType;
  onPick: (query: string) => void;
}) {
  return (
    <section aria-labelledby="search-suggestions" className="flex flex-col gap-2">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {suggestedTags(type).map((tag) => (
          <li key={tag.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onPick(tag.label)}
              className="min-h-10 rounded-full bg-secondary px-4 text-small font-medium text-secondary-foreground transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]"
            >
              {tag.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// A type chosen but nothing typed: everything of that type, contacts grouped as on /info.
export function TypeBrowse({ type }: { type: SearchType }) {
  if (type === "contact") return <ContactList />;
  return <ItemList items={content.items.filter((item) => item.kind === type)} />;
}

// While typing: the results in place of topics and contacts.
export function SearchResults({
  query,
  type,
  onSearchAll,
}: {
  query: string;
  type?: SearchType;
  onSearchAll: () => void;
}) {
  const { items, contacts } = searchInfo(query, type);
  const found = items.length + contacts.length > 0;

  return (
    <>
      {items.length > 0 && (
        <section aria-labelledby="results-items" className="flex flex-col gap-3">
          <h2 id="results-items" className="text-heading">
            {type ? typeLabel[type] : "Beiträge"}
          </h2>
          <ItemList items={items} />
        </section>
      )}

      {contacts.length > 0 && (
        <section aria-labelledby="results-contacts" className="mt-4 flex flex-col gap-3">
          <h2 id="results-contacts" className="text-heading">
            Kontakte
          </h2>
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </section>
      )}

      {!found && (
        <section aria-labelledby="results-none" className="flex flex-col gap-3">
          <h2 id="results-none" className="text-heading">
            {type ? `Keine ${typeLabel[type]}` : "Nichts gefunden"} zu „{query.trim()}“
          </h2>
          {/* The filter is the likelier reason, so lifting it comes first. */}
          {type && (
            <Button size="lg" variant="outline" className="self-start" onClick={onSearchAll}>
              In allen suchen
            </Button>
          )}
          <p className="text-muted-foreground">
            Versuch ein anderes Wort, oder wende dich direkt an eine dieser Stellen.
          </p>
          <ContactList />
        </section>
      )}
    </>
  );
}

function ItemList({ items }: { items: ContentItem[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
