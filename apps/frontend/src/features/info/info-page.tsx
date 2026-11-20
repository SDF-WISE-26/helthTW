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
  // The search shows while the field is focused or holds a query. Leaving an empty field
  // (tap outside, close the keyboard, the X) brings topics and contacts back.
  const [focused, setFocused] = useState(false);
  const searching = focused || q !== "";
  const typed = q.trim().length >= minQueryLength;

  // An emptied query takes its filter along, so the next search starts from all types.
  const setQuery = (value: string) =>
    onSearch(value ? { q: value } : { q: undefined, type: undefined });
  const pick = (value: string) => {
    onSearch({ q: value });
    // Close the keyboard, so the results can be seen.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <>
      <SearchField value={q} onChange={setQuery} onFocusChange={setFocused} />

      {!searching ? (
        <>
          <section aria-labelledby="info-topics" className="mt-2 flex flex-col gap-3">
            <TopicList />
          </section>
          <section aria-labelledby="info-contacts" className="flex flex-col gap-3">
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
