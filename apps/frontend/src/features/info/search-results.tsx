import { ContactCard } from "./contact-card";
import { ContactList } from "./contact-list";
import { ItemCard } from "./item-card";
import { searchInfo, suggestedTags } from "./search";

const caption = "text-caption font-semibold tracking-wide text-muted-foreground uppercase";

// Before typing: tags as a first idea of what to look for.
export function SearchSuggestions({ onPick }: { onPick: (query: string) => void }) {
  return (
    <section aria-labelledby="search-suggestions" className="flex flex-col gap-2">
      <h2 id="search-suggestions" className={caption}>
        Vorschläge
      </h2>
      {/* One scrolling row up to the screen edge instead of several lines of chips. */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {suggestedTags.map((tag) => (
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

// While typing: the results in place of topics and contacts.
export function SearchResults({ query }: { query: string }) {
  const { items, contacts } = searchInfo(query);
  const found = items.length + contacts.length > 0;

  return (
    <>
      {items.length > 0 && (
        <section aria-labelledby="results-items" className="flex flex-col gap-3">
          <h2 id="results-items" className="text-heading">
            Beiträge
          </h2>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            ))}
          </ul>
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
            Nichts gefunden zu „{query.trim()}“
          </h2>
          <p className="text-muted-foreground">
            Versuch ein anderes Wort, oder wende dich direkt an eine dieser Stellen.
          </p>
          <ContactList />
        </section>
      )}
    </>
  );
}
