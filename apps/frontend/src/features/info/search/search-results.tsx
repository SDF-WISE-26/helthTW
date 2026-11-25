import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactCard } from "../contacts/contact-card";
import { ContactGroupList } from "../contacts/contact-group-list";
import type { ContentItem } from "../content";
import { ItemCard } from "../items/item-card.tsx";
import { ofType, searchInfo, searchTypes, suggestedTags, typeLabel, typesIn } from "./search";
import type { SearchType } from "./search";
import { TypeFilter } from "./type-filter";

// Field focused, nothing typed yet: a few plain text suggestions, tapping one searches for it.
export function SearchSuggestions({ onPick }: { onPick: (query: string) => void }) {
  return (
    <ul
      aria-label="Vorschläge"
      // The tap must not take the focus from the field: that would end the search and
      // remove the suggestions before the tap lands.
      onMouseDown={(event) => event.preventDefault()}
      className="flex flex-col divide-y divide-border/60"
    >
      {suggestedTags.map((tag) => (
        <li key={tag.id}>
          <button
            type="button"
            onClick={() => onPick(tag.label)}
            className="flex min-h-tap-min w-full items-center gap-3 rounded-lg py-2 text-left text-body outline-none focus-visible:ring-3 focus-visible:ring-ring/50 transition-transform active:scale-[0.98]"
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
  // Also with nothing found at all, so a chosen type never filters unseen.
  const filter = (types.length > 1 || type) && (
    <TypeFilter types={types} value={type} onChange={onType} />
  );

  if (present.length === 0) {
    return (
      <>
        {filter}
        <section aria-labelledby="results-none" className="flex flex-col gap-3">
          <h2 id="results-none" className="text-heading">
            Nichts gefunden zu „{query.trim()}“
          </h2>
          <p className="text-muted-foreground">
            Versuch ein anderes Wort, oder wende dich direkt an eine dieser Stellen.
          </p>
          <ContactGroupList />
        </section>
      </>
    );
  }

  return (
    <>
      {filter}

      {items.length + contacts.length === 0 && type && (
        <section aria-labelledby="results-none" className="flex flex-col items-start gap-3">
          <h2 id="results-none" className="text-heading">
            Keine {typeLabel(type)} zu „{query.trim()}“
          </h2>
          <Button size="lg" variant="outline" onClick={() => onType(undefined)}>
            In allen suchen
          </Button>
        </section>
      )}

      {items.length > 0 && (
        <section aria-labelledby="results-items" className="flex flex-col gap-3">
          <h2 id="results-items" className="text-heading">
            {type ? typeLabel(type) : "Beiträge"}
          </h2>
          <ItemList items={items} />
        </section>
      )}

      {contacts.length > 0 && (
        <section aria-labelledby="results-contacts" className="flex flex-col gap-3">
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
