import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactCard } from "./contact-card";
import { ContactList } from "./contact-list";
import type { ContentItem } from "./content";
import { ItemCard } from "./item-card";
import { ofType, searchInfo, searchTypes, suggestedTags, typeLabel, typesIn } from "./search";
import type { SearchType } from "./search";
import { TypeFilter } from "./type-filter";

// Field focused, nothing typed yet: a few plain text suggestions, tapping one searches for it.
export function SearchSuggestions({ onPick }: { onPick: (query: string) => void }) {
  return (
    <ul aria-label="Vorschläge" className="flex flex-col divide-y divide-border/60">
      {suggestedTags.map((tag) => (
        <li key={tag.id}>
          <button
            type="button"
            onClick={() => onPick(tag.label)}
            className="flex min-h-tap-min w-full items-center gap-3 rounded-lg py-2 text-left text-body outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Search aria-hidden="true" className="size-5 text-muted-foreground" />
            {tag.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

// While typing: the results, filters only once there is more than one type to tell apart.
export function SearchResults({
  query,
  type,
  onType,
}: {
  query: string;
  type?: SearchType;
  onType: (type?: SearchType) => void;
}) {
  const all = searchInfo(query);
  const { items, contacts } = ofType(all, type);
  const present = typesIn(all);
  // A chosen type stays, even when the new query has none of it, so it can be undone.
  const types = searchTypes.filter((t) => present.includes(t) || t === type);

  if (present.length === 0) {
    return (
      <section aria-labelledby="results-none" className="flex flex-col gap-3">
        <h2 id="results-none" className="text-heading">
          Nichts gefunden zu „{query.trim()}“
        </h2>
        <p className="text-muted-foreground">
          Versuch ein anderes Wort, oder wende dich direkt an eine dieser Stellen.
        </p>
        <ContactList />
      </section>
    );
  }

  return (
    <>
      {(types.length > 1 || type) && <TypeFilter types={types} value={type} onChange={onType} />}

      {items.length + contacts.length === 0 && type && (
        <section aria-labelledby="results-none" className="flex flex-col items-start gap-3">
          <h2 id="results-none" className="text-heading">
            Keine {typeLabel[type]} zu „{query.trim()}“
          </h2>
          <Button size="lg" variant="outline" onClick={() => onType(undefined)}>
            In allen suchen
          </Button>
        </section>
      )}

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
