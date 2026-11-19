import { useState } from "react";
import { ContactList } from "./contact-list";
import { minQueryLength } from "./search";
import type { SearchType } from "./search";
import { SearchField } from "./search-field";
import { SearchResults, SearchSuggestions } from "./search-results";
import { TopicList } from "./topic-list";

export type InfoSearch = { q?: string; type?: SearchType };

// /info in three steps, each showing only what helps then:
// at rest topics and contacts, with the field focused a few suggestions,
// while typing the results, with filters once there are different types.
export function InfoPage({
  search: { q = "", type },
  onSearch,
}: {
  search: InfoSearch;
  onSearch: (next: InfoSearch) => void;
}) {
  // Search mode starts on focus and ends only with "Abbrechen", not on blur: tapping a
  // suggestion blurs the field first, and the suggestion would be gone before the tap lands.
  const [active, setActive] = useState(q !== "");
  const searching = active || q !== "";
  const typed = q.trim().length >= minQueryLength;

  const setQuery = (value: string) => onSearch({ q: value || undefined });
  const pick = (value: string) => {
    onSearch({ q: value });
    // Close the keyboard, so the results can be seen.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };
  const cancel = () => {
    setActive(false);
    onSearch({ q: undefined, type: undefined });
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Infomaterial</h1>
      <div className="flex items-center gap-2">
        <SearchField value={q} onChange={setQuery} onFocus={() => setActive(true)} />
        {searching && (
          <button
            type="button"
            onClick={cancel}
            className="min-h-tap-min shrink-0 rounded-lg px-1 font-medium text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Abbrechen
          </button>
        )}
      </div>

      {!searching ? (
        <>
          <section aria-labelledby="info-topics" className="mt-2 flex flex-col gap-3">
            <h2 id="info-topics" className="text-heading">
              Themen
            </h2>
            <TopicList />
          </section>
          <section aria-labelledby="info-contacts" className="mt-8 flex flex-col gap-3">
            <h2 id="info-contacts" className="text-heading">
              Kontakte
            </h2>
            <ContactList />
          </section>
        </>
      ) : typed ? (
        <SearchResults query={q} type={type} onType={(next) => onSearch({ type: next })} />
      ) : (
        <SearchSuggestions onPick={pick} />
      )}
    </>
  );
}
